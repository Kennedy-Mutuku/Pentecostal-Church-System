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
  const [payForm, setPayForm] = useState({ phone: '', amount: '', category: 'offering' });
  const [payLoading, setPayLoading] = useState(false);
  const [payMsg, setPayMsg] = useState('');
  const [payError, setPayError] = useState('');
  const [payStatus, setPayStatus] = useState<'idle' | 'waiting' | 'success' | 'cancelled' | 'timeout' | 'failed'>('idle');
  const [verseIndex] = useState(() => Math.floor(Math.random() * verses.length));
  const socketRef = useRef<Socket | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedRef = useRef(false);

  useEffect(() => { fetchContributions(); }, []);

  const fetchContributions = async () => {
    try {
      const res = await fetch('/api/finance/my-contributions', { credentials: 'include' });
      if (res.ok) setContributions(await res.json());
      else if (res.status === 401) setError('Please log in to view your contributions.');
      else setError('Unable to load contributions.');
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
        const res = await fetch(`/api/finance/mpesa/status/${checkoutRequestID}`, { credentials: 'include' });
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
      const res = await fetch('/api/finance/member-pay', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ phone: payForm.phone, amount: Number(payForm.amount), category: payForm.category }),
      });
      const data = await res.json();
      if (res.ok) {
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

  const categoryCards = [
    { id: 'offering', label: 'Offering', icon: '\u2764', desc: 'Give your offering to support the work of the Lord' },
    { id: 'tithe', label: 'Tithe', icon: '\u2726', desc: 'A tenth of your increase, honouring God with your firstfruits' },
    { id: 'thanksgiving', label: 'Thanksgiving', icon: '\u2606', desc: 'Express gratitude to God for His faithfulness' },
    { id: 'aob', label: 'AOB', icon: '\u2756', desc: 'Any other contributions to support the church' },
  ];

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
        .fin-till { max-width: 420px; margin: 0 auto 14px; background: #D32F2F; border-radius: 12px; padding: 10px; box-shadow: 0 6px 16px rgba(211, 47, 47, 0.22); }
        .fin-till-inner { background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); border-radius: 9px; padding: 10px 14px; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .fin-till-brand { text-align: left; }
        .fin-till-brand .lipa { color: #86efac; font-weight: 800; font-size: 12px; letter-spacing: 0.8px; display: block; }
        .fin-till-brand .mpesa { color: #fff; font-weight: 900; font-style: italic; font-size: 15px; }
        .fin-till-sub { color: #fff; font-size: 9.5px; font-weight: 700; letter-spacing: 1.5px; opacity: 0.85; display: block; margin-top: 2px; }
        .fin-till-number { color: #fbbf24; font-size: 28px; font-weight: 800; letter-spacing: 1.5px; text-shadow: 0 2px 8px rgba(0,0,0,0.15); font-family: Georgia, serif; line-height: 1; }

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
        .fin-field input { width: 100%; padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13.5px; box-sizing: border-box; outline: none; background: #f9fafb; }
        .fin-field input:focus { border-color: #E53935; }
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

      {/* Giving category selector */}
      <div className="fin-categories">
        {categoryCards.map(c => (
          <button
            key={c.id}
            onClick={() => setPayForm({ ...payForm, category: c.id })}
            className={`fin-cat-btn${payForm.category === c.id ? ' active' : ''}`}
          >
            <span className="icon">{c.icon}</span>
            <span className="label">{c.label}</span>
          </button>
        ))}
      </div>

      {/* M-Pesa Payment Form */}
      <div className="fin-form-card">
        <div className="fin-secure-badge">🔒 Secure payment powered by M-Pesa</div>

        <div className="fin-form-header">
          <div className="badge">M</div>
          <div>
            <h3>Lipa Na M-Pesa</h3>
            <p>Contributing as: <strong>{payForm.category}</strong></p>
          </div>
        </div>

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

        <form onSubmit={handlePay}>
          <div className="fin-field">
            <label>Phone Number</label>
            <input type="tel" value={payForm.phone} onChange={e => setPayForm({ ...payForm, phone: e.target.value })} placeholder="0712345678" required />
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
            <p>Your contributions will appear here once confirmed.</p>
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
