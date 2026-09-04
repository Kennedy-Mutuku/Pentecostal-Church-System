import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getBaseUrl } from '../config/environment';
import Cookies from 'js-cookie';

interface Contribution {
  _id: string;
  type: string;
  category: string;
  amount: number;
  source: string;
  description?: string;
  createdAt: string;
}

const verses = [
  { text: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.', ref: '2 Corinthians 9:7' },
  { text: 'Honour the LORD with your wealth, with the firstfruits of all your crops.', ref: 'Proverbs 3:9' },
  { text: 'Give, and it will be given to you. A good measure, pressed down, shaken together and running over.', ref: 'Luke 6:38' },
  { text: 'Bring the whole tithe into the storehouse, that there may be food in my house.', ref: 'Malachi 3:10' },
];

const FinancialsPage: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [payForm, setPayForm] = useState({ phone: '', amount: '', category: '', name: '', email: '' });
  const [payLoading, setPayLoading] = useState(false);
  const [payMsg, setPayMsg] = useState('');
  const [payError, setPayError] = useState('');
  const [payStatus, setPayStatus] = useState<'idle' | 'waiting' | 'success' | 'cancelled' | 'timeout' | 'failed'>('idle');
  const [verseIndex] = useState(() => Math.floor(Math.random() * verses.length));
  const socketRef = useRef<Socket | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedRef = useRef(false);

  useEffect(() => {
    document.title = "Online Giving & Tithes | Rikuruma Pentecostal Church Nyamira";

    // Check if user is logged in
    fetch(`${getBaseUrl()}/api/users/me`, { credentials: 'include' })
      .then(r => { if (r.ok) setIsLoggedIn(true); })
      .catch(() => {});

    // Load saved phone from localStorage for anon history
    const savedPhone = localStorage.getItem('rpc_donor_phone');
    fetchContributions(savedPhone || undefined);
  }, []);

  const fetchContributions = async (phone?: string) => {
    try {
      let url = `${getBaseUrl()}/api/finance/my-contributions`;
      if (phone) url += `?phone=${encodeURIComponent(phone)}`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        setContributions(await res.json());
        setError('');
      } else if (res.status === 401) {
        setError(''); // No error shown — anonymous view just shows empty
      } else {
        setError('Unable to load contributions.');
      }
    } catch { setError('Unable to connect to server.'); }
    setLoading(false);
  };

  const formatAmount = (amount: number) => `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });

  const handlePaymentResult = (status: string, message: string) => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    // Clean up socket listener
    if (socketRef.current) {
      socketRef.current.off('mpesa-payment-result');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);

    if (status === 'success') {
      setPayStatus('success');
      setPayMsg('Payment completed successfully! Thank you for your generous giving.');
      setPayError('');
      fetchContributions();
    } else {
      setPayStatus(status as any);
      setPayMsg('');
      setPayError(message);
    }
    setPayLoading(false);
  };

  const pollStatus = async (checkoutRequestID: string) => {
    setPayStatus('waiting');
    setPayMsg('');
    resolvedRef.current = false;

    // 1. Connect WebSocket for instant callback notification
    try {
      const token = Cookies.get('user_s') || '';
      const socket = io(getBaseUrl(), { auth: { token }, transports: ['websocket', 'polling'] });
      socketRef.current = socket;
      socket.on('mpesa-payment-result', (data: { checkoutRequestID: string; status: string; message: string }) => {
        if (data.checkoutRequestID === checkoutRequestID) {
          handlePaymentResult(data.status, data.message);
        }
      });
    } catch { /* WebSocket optional — polling is the fallback */ }

    // 2. Poll as fallback (in case WebSocket misses it)
    let attempts = 0;
    const maxAttempts = 15;
    const poll = async () => {
      if (resolvedRef.current) return;
      attempts++;
      try {
        const res = await fetch(`${getBaseUrl()}/api/finance/mpesa/status/${checkoutRequestID}`, { credentials: 'include' });
        const data = await res.json();
        if (data.status === 'success' || data.status === 'cancelled' || data.status === 'timeout' || data.status === 'failed') {
          handlePaymentResult(data.status, data.message);
          return;
        }
        // Any other status (pending, unknown) — keep polling
      } catch { /* continue polling */ }
      if (!resolvedRef.current && attempts < maxAttempts) {
        pollTimerRef.current = setTimeout(poll, 5000);
      } else if (!resolvedRef.current) {
        handlePaymentResult('idle', 'Could not confirm payment status. If you completed the payment, it will reflect shortly in your contributions.');
      }
    };
    pollTimerRef.current = setTimeout(poll, 7000);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayLoading(true); setPayMsg(''); setPayError(''); setPayStatus('idle');
    try {
      const res = await fetch(`${getBaseUrl()}/api/finance/member-pay`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({
          phone: payForm.phone,
          amount: Number(payForm.amount),
          category: payForm.category,
          name: payForm.name || undefined,
          email: payForm.email || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Save phone to localStorage so they can see history next time
        if (payForm.phone) localStorage.setItem('rpc_donor_phone', payForm.phone);
        const checkoutID = data.data?.CheckoutRequestID;
        if (checkoutID) {
          pollStatus(checkoutID);
        } else {
          setPayMsg('STK push sent. Check your phone to complete payment.');
          setPayLoading(false);
        }
      } else {
        setPayError(data.message || 'Payment failed.');
        setPayLoading(false);
      }
    } catch {
      setPayError('Unable to connect to server.');
      setPayLoading(false);
    }
  };

  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  const verse = verses[verseIndex];

  return (
    <main className="fin-page">
      <style>{`
        .fin-page { max-width: 800px; margin: 0 auto; padding: 14px 16px 32px; font-family: inherit; }

        /* Hero */
        .fin-hero { text-align: center; margin-bottom: 14px; }
        .fin-hero h1 { font-size: 21px; font-weight: 700; margin: 0 0 6px; color: #111827; letter-spacing: -0.4px; }
        .fin-hero p { font-size: 13px; color: #4b5563; max-width: 560px; margin: 0 auto 10px; line-height: 1.45; }
        .fin-verse { max-width: 500px; margin: 0 auto; padding: 8px 12px; background: #fef2f2; border-left: 3px solid #E53935; }
        .fin-verse p { font-size: 12.5px; line-height: 1.4; margin: 0 0 2px; font-style: italic; color: #7f1d1d; }
        .fin-verse span { font-size: 11px; color: #991b1b; font-weight: 600; }

        /* Till card — compact banner */
        .fin-till { max-width: 420px; margin: 0 auto 14px; background: #ffffff; border-radius: 12px; padding: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; }
        .fin-till-inner { background: #f8fafc; border-radius: 9px; padding: 12px 16px; border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .fin-till-brand { text-align: left; }
        .fin-till-brand .lipa { color: #16a34a; font-weight: 700; font-size: 11px; letter-spacing: 0.5px; display: block; }
        .fin-till-brand .mpesa { color: #111827; font-weight: 800; font-style: italic; font-size: 16px; }
        .fin-till-sub { color: #6b7280; font-size: 10px; font-weight: 600; letter-spacing: 1px; display: block; margin-top: 2px; }
        .fin-till-number { color: #111827; font-size: 26px; font-weight: 800; letter-spacing: 1px; font-family: 'Inter', sans-serif; line-height: 1; }

        /* Category selector */
        .fin-categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(105px, 1fr)); gap: 6px; margin-bottom: 12px; }
        .fin-cat-btn { padding: 8px 6px; cursor: pointer; text-align: center; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 8px; background: transparent; border: 1px solid #d1d5db; color: #374151; }
        .fin-cat-btn.active { border: 2px solid #E53935; background: #fef2f2; color: #b91c1c; }
        .fin-cat-btn .icon { font-size: 16px; }
        .fin-cat-btn .label { font-size: 12px; font-weight: 600; }

        /* Payment form */
        .fin-form-card { background: transparent; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; }
        .fin-secure-badge { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 5px 10px; background: #f0fdf4; color: #166534; margin-bottom: 10px; font-size: 10.5px; text-align: center; font-weight: 600; border: 1px solid #bbf7d0; border-radius: 6px; }
        .fin-form-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }
        .fin-form-header .badge { width: 34px; height: 34px; background: #E53935; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; border-radius: 6px; flex-shrink: 0; }
        .fin-form-header h3 { margin: 0; font-size: 14px; color: #111827; font-weight: 600; }
        .fin-form-header p { margin: 0; font-size: 11.5px; color: #6b7280; }
        .fin-form-header strong { color: #E53935; text-transform: capitalize; }

        .fin-status { padding: 8px 10px; margin-bottom: 10px; border-radius: 6px; text-align: center; }
        .fin-status.waiting { background: #f8fafc; border: 1px solid #e2e8f0; }
        .fin-status.success { background: #f0fdf4; border: 1px solid #bbf7d0; }
        .fin-status.error { background: #fef2f2; border: 1px solid #fecaca; }
        .fin-status p { margin: 0; font-size: 12.5px; }
        .fin-spinner { width: 20px; height: 20px; border: 2px solid #E53935; border-top-color: transparent; border-radius: 50%; animation: fin-spin 1s linear infinite; margin: 0 auto 6px; }
        @keyframes fin-spin { to { transform: rotate(360deg); } }

        .fin-field { margin-bottom: 10px; }
        .fin-field label { display: block; font-size: 11.5px; color: #374151; margin-bottom: 3px; font-weight: 600; }
        .fin-field input, .fin-field select { width: 100%; padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; outline: none; background: #f9fafb; appearance: none; -webkit-appearance: none; cursor: pointer; }
        .fin-field input:focus, .fin-field select:focus { border-color: #E53935; box-shadow: 0 0 0 2px rgba(229,57,53,0.1); }
        .fin-field select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 11px center; padding-right: 32px; }
        .fin-field select:required:has(option[value=""]:checked) { color: #9ca3af; }
        .fin-field select option { color: #111827; }
        .fin-submit { width: 100%; padding: 11px; border: none; border-radius: 6px; background: #E53935; color: #fff; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: background 0.2s ease; margin-top: 2px; }
        .fin-submit:disabled { background: #d1d5db; cursor: not-allowed; }
        .fin-submit:not(:disabled):hover { background: #c62828; }

        /* History */
        .fin-history-header { padding: 8px 0; border-bottom: 2px solid #E53935; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .fin-history-header h2 { margin: 0; font-size: 13.5px; color: #111827; font-weight: 700; text-transform: uppercase; }
        .fin-history-header .total { font-size: 12.5px; color: #b91c1c; font-weight: 700; }
        .fin-history-empty { text-align: center; padding: 20px 16px; background: #f9fafb; border: 1px dashed #d1d5db; border-radius: 8px; }
        .fin-history-empty p:first-child { color: #4b5563; font-size: 12.5px; margin: 0 0 3px; font-weight: 500; }
        .fin-history-empty p:last-child { color: #9ca3af; font-size: 11.5px; margin: 0; }
        .fin-table-wrap { overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 8px; }
        .fin-table { width: 100%; border-collapse: collapse; font-size: 12.5px; text-align: left; }
        .fin-table th { padding: 8px 10px; font-weight: 600; color: #374151; border-bottom: 1px solid #d1d5db; background: #f3f4f6; }
        .fin-table td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }

        @media (max-width: 480px) {
          .fin-page { padding: 10px 12px 24px; }
          .fin-hero { margin-bottom: 10px; }
          .fin-hero h1 { font-size: 18px; }
          .fin-till-number { font-size: 24px; }
          .fin-form-card { padding: 12px; }
        }
      `}</style>

      {/* Hero Section */}
      <div className="fin-hero">
        <h1>Partner With Us in Ministry</h1>
        <p>Your generous giving empowers our church to continue spreading the Gospel, supporting our community, and expanding the Kingdom of God. Thank you for your faithful partnership.</p>
        <div className="fin-verse">
          <p>"{verse.text}"</p>
          <span>- {verse.ref}</span>
        </div>
      </div>

      {/* M-PESA Till Card — compact banner */}
      <div className="fin-till">
        <div className="fin-till-inner">
          <div className="fin-till-brand">
            <span className="lipa">LIPA NA</span>
            <span className="mpesa">M-PESA</span>
            <span className="fin-till-sub">TILL NUMBER</span>
          </div>
          <div className="fin-till-number">5173289</div>
        </div>
      </div>

      {/* M-Pesa Payment Form */}
      <div className="fin-form-card">
        <div className="fin-secure-badge">🔒 Secure payment powered by M-Pesa</div>

        {/* Status banners FIRST */}
        {payStatus === 'waiting' && (
          <div className="fin-status waiting">
            <div className="fin-spinner" />
            <p style={{ fontWeight: 600, color: '#334155' }}>Waiting for payment confirmation...</p>
            <p style={{ marginTop: '2px', color: '#64748b' }}>Check your phone and enter your M-Pesa PIN.</p>
          </div>
        )}
        {payStatus === 'success' && payMsg && (
          <div className="fin-status success">
            <p style={{ fontWeight: 600, color: '#166534' }}>✓ {payMsg}</p>
          </div>
        )}
        {payError && (
          <div className="fin-status error">
            <p style={{ color: '#991b1b', fontWeight: 500 }}>✕ {payError}</p>
          </div>
        )}

        <div className="fin-form-header">
          <div className="badge">M</div>
          <div>
            <h3>Lipa Na M-Pesa</h3>
            <p>Contributing as: <strong>{payForm.category ? payForm.category.charAt(0).toUpperCase() + payForm.category.slice(1) : '—'}</strong></p>
          </div>
        </div>

        <form onSubmit={handlePay}>
          {/* Name & Email — only for non-logged-in users */}
          {!isLoggedIn && (
            <>
              <div className="fin-field">
                <label>Your Name <span style={{ color: '#E53935' }}>*</span></label>
                <input type="text" value={payForm.name} onChange={e => setPayForm({ ...payForm, name: e.target.value })} placeholder="e.g. John Kamau" required />
              </div>
              <div className="fin-field">
                <label>Email Address <span style={{ color: '#6b7280', fontWeight: 400 }}>(optional — to receive a giving summary)</span></label>
                <input type="email" value={payForm.email} onChange={e => setPayForm({ ...payForm, email: e.target.value })} placeholder="john@example.com" />
              </div>
            </>
          )}
          <div className="fin-field">
            <label>Contribution Type <span style={{ color: '#E53935' }}>*</span></label>
            <select
              value={payForm.category}
              onChange={e => setPayForm({ ...payForm, category: e.target.value })}
              required
            >
              <option value="" disabled>— Select category —</option>
              <option value="offering">❤ Offering</option>
              <option value="tithe">✦ Tithe</option>
              <option value="thanksgiving">☆ Thanksgiving</option>
              <option value="aob">❖ AOB (Any Other Business)</option>
            </select>
          </div>
          <div className="fin-field">
            <label>Phone Number <span style={{ color: '#E53935' }}>*</span></label>
            <input type="tel" pattern="^(?:254|\+254|0)?(7[0-9]{8}|1[0-9]{8})$" title="Please enter a valid Kenyan Safaricom/M-Pesa phone number e.g. 0712345678 or 254712345678" maxLength={13} value={payForm.phone} onChange={e => setPayForm({ ...payForm, phone: e.target.value.replace(/[^0-9+]/g, '') })} placeholder="0712345678" required />
          </div>
          <div className="fin-field">
            <label>Amount (KES)</label>
            <input type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} placeholder="0.00" min="1" max="150000" required />
          </div>
          <button type="submit" className="fin-submit" disabled={payLoading}>
            {payLoading && payStatus === 'waiting' ? 'Waiting...' : payLoading ? 'Initiating...' : 'Give Now'}
          </button>
        </form>
      </div>

      {/* Contributions History */}
      <div>
        <div className="fin-history-header">
          <h2>My Giving History</h2>
          {contributions.length > 0 && (
            <span className="total">Total: {formatAmount(totalContributions)}</span>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '12.5px' }}>Loading records...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#991b1b', fontSize: '12.5px' }}>{error}</p>
        ) : contributions.length === 0 ? (
          <div className="fin-history-empty">
            <p>No giving records found.</p>
            <p>{isLoggedIn ? 'Your contributions will appear here once confirmed.' : 'Give above using your phone number — your history will automatically appear here next time you visit.'}</p>
          </div>
        ) : (
          <div className="fin-table-wrap">
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c, i) => (
                  <tr key={c._id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                    <td style={{ color: '#4b5563' }}>{formatDate(c.createdAt)}</td>
                    <td>
                      <span style={{ color: '#E53935', fontWeight: 600, textTransform: 'capitalize' }}>{c.category || '-'}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{formatAmount(c.amount)}</td>
                    <td style={{ color: '#6b7280', textTransform: 'uppercase', fontSize: '11px', fontWeight: 500 }}>{c.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </main>
  );
};

export default FinancialsPage;
