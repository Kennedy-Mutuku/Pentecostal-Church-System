const https = require('https');

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 150000; // Safaricom's per-transaction STK push ceiling

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    this.callbackSecret = process.env.MPESA_CALLBACK_SECRET;
    this.baseUrl = 'api.safaricom.co.ke';
  }

  _request(options, postData) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            reject(new Error(`Invalid JSON response: ${body}`));
          }
        });
      });
      req.on('error', reject);
      if (postData) req.write(postData);
      req.end();
    });
  }

  async getAccessToken() {
    if (!this.consumerKey || !this.consumerSecret) {
      throw new Error('M-Pesa is not configured: missing consumer key/secret.');
    }
    const credentials = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    const res = await this._request({
      hostname: this.baseUrl,
      path: '/oauth/v1/generate?grant_type=client_credentials',
      method: 'GET',
      headers: { Authorization: `Basic ${credentials}` },
    });
    if (!res.data.access_token) {
      throw new Error(`Failed to get M-Pesa access token: ${JSON.stringify(res.data)}`);
    }
    return res.data.access_token;
  }

  // This project talks to Safaricom's live production endpoint at all times
  // (there is no sandbox switch). Outside production, a real STK push would
  // charge a real phone, so it's blocked by default unless explicitly
  // overridden for a deliberate, supervised test.
  assertLiveCallAllowed() {
    const isProd = process.env.NODE_ENV === 'production';
    const overrideEnabled = process.env.MPESA_ALLOW_LIVE === 'true';
    if (!isProd && !overrideEnabled) {
      throw new Error(
        'Live M-Pesa calls are disabled outside production to prevent accidental real-money charges. ' +
        'Set MPESA_ALLOW_LIVE=true in this environment only for a deliberate, supervised test.'
      );
    }
  }

  async stkPush({ phone, amount, accountReference, transactionDesc }) {
    this.assertLiveCallAllowed();
    if (!this.shortcode || !this.passkey || !this.callbackUrl) {
      throw new Error('M-Pesa is not configured: missing shortcode/passkey/callback URL.');
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < MIN_AMOUNT || numericAmount > MAX_AMOUNT) {
      throw new Error(`Amount must be between KES ${MIN_AMOUNT} and KES ${MAX_AMOUNT.toLocaleString()}.`);
    }

    const formattedPhone = this.formatPhoneNumber(phone);
    const token = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    const payload = JSON.stringify({
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(numericAmount),
      PartyA: formattedPhone,
      PartyB: this.shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: this.signedCallbackUrl(),
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    });
    const res = await this._request({
      hostname: this.baseUrl,
      path: '/mpesa/stkpush/v1/processrequest',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }, payload);
    if (res.status !== 200 || res.data.errorCode) {
      throw new Error(`M-Pesa STK push failed: ${JSON.stringify(res.data)}`);
    }
    return res.data;
  }

  async stkQuery(checkoutRequestID) {
    this.assertLiveCallAllowed();
    const token = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    const payload = JSON.stringify({
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    });
    const res = await this._request({
      hostname: this.baseUrl,
      path: '/mpesa/stkpushquery/v1/query',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }, payload);
    return res.data;
  }

  // Embeds an unguessable token in the callback path so a stranger can't POST
  // a fake "successful payment" straight to our callback endpoint and have it
  // silently recorded as real income.
  signedCallbackUrl() {
    const base = this.callbackUrl.replace(/\/$/, '');
    return this.callbackSecret ? `${base}/${this.callbackSecret}` : base;
  }

  formatPhoneNumber(phone) {
    let formatted = String(phone).replace(/\s+/g, '');
    if (formatted.startsWith('0')) formatted = '254' + formatted.substring(1);
    else if (formatted.startsWith('+')) formatted = formatted.substring(1);
    else if (formatted.startsWith('7') || formatted.startsWith('1')) formatted = '254' + formatted;

    if (!/^254[71]\d{8}$/.test(formatted)) {
      throw new Error('Enter a valid Safaricom number, e.g. 0712345678.');
    }
    return formatted;
  }

  getTimestamp() {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  }
}

module.exports = new MpesaService();
