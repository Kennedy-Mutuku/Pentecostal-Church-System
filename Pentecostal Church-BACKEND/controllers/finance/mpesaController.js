const mpesaService = require('../../services/mpesaService');
const Transaction = require('../../models/financeTransaction');
const PendingPayment = require('../../models/financePendingPayment');
const User = require('../../models/user');
const { logFinanceAction } = require('../../middlewares/financeAudit');

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 150000;
const COOLDOWN_MS = 60 * 1000; // don't let the same phone be pushed twice within a minute

const validateAmount = (amount) => {
  const n = Number(amount);
  return Number.isFinite(n) && n >= MIN_AMOUNT && n <= MAX_AMOUNT;
};

async function recentPushExists(phone) {
  const cutoff = new Date(Date.now() - COOLDOWN_MS);
  return PendingPayment.exists({ phone, status: 'pending', createdAt: { $gte: cutoff } });
}

// Treasurer-triggered STK push (from the Finance portal's M-Pesa tab)
exports.initiatePayment = async (req, res) => {
  try {
    const { phone, amount, category } = req.body;
    if (!phone || !amount) {
      return res.status(400).json({ message: 'Phone and amount are required.' });
    }
    if (!validateAmount(amount)) {
      return res.status(400).json({ message: `Amount must be between KES ${MIN_AMOUNT} and KES ${MAX_AMOUNT.toLocaleString()}.` });
    }
    if (await recentPushExists(phone)) {
      return res.status(429).json({ message: 'A payment request was just sent to this number. Please wait a minute before retrying.' });
    }

    const cat = category || 'offering';
    const result = await mpesaService.stkPush({
      phone,
      amount: Math.round(amount),
      accountReference: cat.charAt(0).toUpperCase() + cat.slice(1),
      transactionDesc: `CU ${cat} payment`,
    });

    if (result.CheckoutRequestID) {
      await PendingPayment.create({
        checkout_request_id: result.CheckoutRequestID,
        merchant_request_id: result.MerchantRequestID,
        user_id: req.user?.id || null,
        category: cat,
        phone,
        amount: Math.round(amount),
      });
    }
    res.json({ message: 'STK push sent. Check your phone.', data: result });
  } catch (err) {
    res.status(500).json({ message: 'M-Pesa request failed.', error: err.message });
  }
};

// Member-facing STK push (authenticated via user_s cookie)
exports.memberPayment = async (req, res) => {
  try {
    const { phone, amount, category, name, email } = req.body;
    if (!phone || !amount) {
      return res.status(400).json({ message: 'Phone number and amount are required.' });
    }
    if (!validateAmount(amount)) {
      return res.status(400).json({ message: `Amount must be between KES ${MIN_AMOUNT} and KES ${MAX_AMOUNT.toLocaleString()}.` });
    }
    if (await recentPushExists(phone)) {
      return res.status(429).json({ message: 'A payment request was just sent to this number. Please wait a minute before retrying.' });
    }

    const validCategories = ['offering', 'tithe', 'thanksgiving'];
    const cat = validCategories.includes(category) ? category : 'offering';
    const result = await mpesaService.stkPush({
      phone,
      amount: Math.round(amount),
      accountReference: cat.charAt(0).toUpperCase() + cat.slice(1),
      transactionDesc: `RPC ${cat} contribution`,
    });

    if (result.CheckoutRequestID) {
      await PendingPayment.create({
        checkout_request_id: result.CheckoutRequestID,
        merchant_request_id: result.MerchantRequestID,
        user_id: req.user?.id || null,
        category: cat,
        phone,
        payer_name: name || null,
        email: email || null,
        amount: Math.round(amount),
      });
    }
    res.json({ message: 'STK push sent. Check your phone to complete payment.', data: result });
  } catch (err) {
    res.status(500).json({ message: 'M-Pesa request failed. Please try again.', error: err.message });
  }
};

// Check STK push payment status
exports.checkStatus = async (req, res) => {
  try {
    const { checkoutRequestID } = req.params;
    if (!checkoutRequestID) {
      return res.status(400).json({ message: 'CheckoutRequestID is required.' });
    }

    // If our own callback already resolved it, trust that over re-querying Safaricom.
    const pending = await PendingPayment.findOne({ checkout_request_id: checkoutRequestID });
    if (pending && pending.status !== 'pending') {
      return res.json({
        status: pending.status,
        message: pending.status === 'completed' ? 'Payment completed successfully!' : 'Payment was not completed.',
      });
    }

    const result = await mpesaService.stkQuery(checkoutRequestID);

    // Still processing — Safaricom returns errorCode/errorMessage when not yet resolved
    if (result.errorCode || result.errorMessage) {
      return res.json({ status: 'pending', message: 'Payment is being processed...' });
    }

    // No ResultCode means still processing
    if (result.ResultCode === undefined || result.ResultCode === null) {
      return res.json({ status: 'pending', message: 'Payment is being processed...' });
    }

    // If ResultDesc mentions processing, it's still pending
    const desc = (result.ResultDesc || '').toLowerCase();
    if (desc.includes('processing') || desc.includes('being processed')) {
      return res.json({ status: 'pending', message: 'Payment is being processed...' });
    }

    const code = Number(result.ResultCode);
    if (isNaN(code) || code === 4999) {
      return res.json({ status: 'pending', message: 'Payment is being processed...' });
    }

    let status, message;
    if (code === 0) {
      status = 'success';
      message = 'Payment completed successfully!';
    } else if (code === 1032) {
      status = 'cancelled';
      message = 'You cancelled the payment. You can try again when ready.';
    } else if (code === 1037) {
      status = 'timeout';
      message = 'The payment request timed out. Please try again.';
    } else if (code === 1) {
      status = 'failed';
      message = 'Insufficient funds in your M-Pesa account.';
    } else if (code === 2001) {
      status = 'failed';
      message = 'Wrong M-Pesa PIN entered.';
    } else {
      status = 'failed';
      message = result.ResultDesc || 'Payment failed. Please try again.';
    }
    res.json({ status, message, resultCode: code });
  } catch (err) {
    // Any error during query means still processing
    res.json({ status: 'pending', message: 'Payment is being processed...' });
  }
};

exports.callback = async (req, res) => {
  try {
    // Reject anything that doesn't present our secret — prevents a stranger
    // from POSTing a fake "successful payment" straight into the books.
    const expectedSecret = process.env.MPESA_CALLBACK_SECRET;
    if (expectedSecret && req.params.secret !== expectedSecret) {
      console.warn('M-Pesa callback rejected: bad secret token.');
      return res.status(404).json({ message: 'Not found.' });
    }

    const { Body } = req.body;
    if (!Body || !Body.stkCallback) {
      return res.status(400).json({ message: 'Invalid callback.' });
    }
    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;
    const io = req.app.get('io');

    const pending = await PendingPayment.findOne({ checkout_request_id: CheckoutRequestID });

    if (ResultCode === 0 && CallbackMetadata) {
      const items = CallbackMetadata.Item;
      const getValue = (name) => items.find(i => i.Name === name)?.Value;
      const amount = getValue('Amount');
      const mpesaCode = getValue('MpesaReceiptNumber');
      const phone = getValue('PhoneNumber');
      const phoneStr = String(phone);

      // Idempotency: Safaricom can redeliver a callback. If we've already
      // booked this receipt, don't double-count the income.
      const existing = mpesaCode && await Transaction.findOne({ mpesa_receipt: mpesaCode });
      if (existing) {
        console.log(`M-Pesa callback for ${mpesaCode} already recorded — skipping duplicate.`);
        if (pending && pending.status === 'pending') {
          pending.status = 'completed';
          await pending.save();
        }
        if (io) io.emit('mpesa-payment-result', { checkoutRequestID: CheckoutRequestID, status: 'success', message: 'Payment completed successfully!' });
        return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
      }

      // Look up payer name: first from the pending record, then by phone in users collection
      let payerName = null;
      if (pending?.user_id) {
        try {
          const user = await User.findById(pending.user_id).select('username');
          if (user) payerName = user.username;
        } catch {}
      }
      if (!payerName) {
        try {
          const phone0 = phoneStr.startsWith('254') ? '0' + phoneStr.substring(3) : phoneStr;
          const user = await User.findOne({ $or: [{ phone: phoneStr }, { phone: phone0 }] }).select('username');
          if (user) payerName = user.username;
        } catch {}
      }

      const txData = {
        type: 'cash_in',
        category: pending?.category || 'offering',
        amount,
        source: 'mpesa',
        phone: phoneStr,
        payer_name: pending?.payer_name || payerName || phoneStr,
        email: pending?.email || null,
        description: `M-Pesa payment ${mpesaCode}`,
        mpesa_receipt: mpesaCode,
        checkout_request_id: CheckoutRequestID,
      };
      if (pending?.user_id) txData.recorded_by = pending.user_id;
      await Transaction.create(txData);

      if (pending) {
        pending.status = 'completed';
        await pending.save();
      }
      console.log(`M-Pesa payment received: ${mpesaCode}, KES ${amount}`);
      if (io) io.emit('mpesa-payment-result', { checkoutRequestID: CheckoutRequestID, status: 'success', message: 'Payment completed successfully!' });
    } else {
      console.log(`M-Pesa payment failed: ${ResultDesc}`);
      if (pending && pending.status === 'pending') {
        pending.status = 'failed';
        await pending.save();
      }
      const status = ResultCode === 1032 ? 'cancelled' : ResultCode === 1037 ? 'timeout' : 'failed';
      const message = ResultCode === 1032 ? 'You cancelled the payment.' : ResultCode === 1037 ? 'Payment request timed out.' : ResultDesc || 'Payment failed.';
      if (io) io.emit('mpesa-payment-result', { checkoutRequestID: CheckoutRequestID, status, message });
    }
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    console.error('M-Pesa callback error:', err);
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
};
