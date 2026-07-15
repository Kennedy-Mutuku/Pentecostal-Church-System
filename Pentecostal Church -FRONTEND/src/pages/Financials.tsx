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
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 16px 60px', fontFamily: 'inherit' }}>

      {/* Hero Section */}
      <div style={{
        textAlign: 'center', marginBottom: '24px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px', color: '#111827', letterSpacing: '-0.5px' }}>
          Partner With Us in Ministry
        </h1>
        <p style={{ fontSize: '14px', color: '#4b5563', maxWidth: '600px', margin: '0 auto 16px', lineHeight: 1.5 }}>
          Your generous giving empowers our church to continue spreading the Gospel, supporting our community, and expanding the Kingdom of God. Thank you for your faithful partnership.
        </p>
        <div style={{
          maxWidth: '500px', margin: '0 auto', padding: '12px 16px',
          background: '#fef2f2', borderLeft: '4px solid #E53935'
        }}>
          <p style={{ fontSize: '14px', lineHeight: 1.5, margin: '0 0 4px', fontStyle: 'italic', color: '#7f1d1d' }}>
            "{verse.text}"
          </p>
          <p style={{ fontSize: '12px', margin: 0, color: '#991b1b', fontWeight: 600 }}>
            - {verse.ref}
          </p>
        </div>
      </div>

      {/* M-PESA Till Card */}
      <div style={{
        maxWidth: '420px', margin: '0 auto 36px',
        background: '#D32F2F',
        borderRadius: '16px', padding: '16px',
        boxShadow: '0 10px 25px rgba(211, 47, 47, 0.25)',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px', padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: '#86efac', fontWeight: 800, fontSize: '18px', letterSpacing: '1px' }}>LIPA NA</span>
            <span style={{ color: '#ffffff', fontWeight: 900, fontStyle: 'italic', fontSize: '22px', letterSpacing: '0.5px' }}>M-PESA</span>
          </div>
          <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, letterSpacing: '2.5px', marginBottom: '8px' }}>
            TILL NUMBER:
          </div>
          <div style={{ color: '#fbbf24', fontSize: '48px', fontWeight: 800, letterSpacing: '3px', textShadow: '0 2px 10px rgba(0,0,0,0.15)', fontFamily: 'Georgia, serif' }}>
            5173289
          </div>
        </div>
      </div>

      {/* Flat Categories Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '24px' }}>
        {categoryCards.map(c => (
          <button
            key={c.id}
            onClick={() => setPayForm({ ...payForm, category: c.id })}
            style={{
              padding: '12px 8px',
              border: payForm.category === c.id ? '2px solid #E53935' : '1px solid #d1d5db',
              background: payForm.category === c.id ? '#fef2f2' : 'transparent',
              color: payForm.category === c.id ? '#b91c1c' : '#374151',
              cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              borderRadius: '8px'
            }}
          >
            <span style={{ fontSize: '20px' }}>{c.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* M-Pesa Payment Form - Flat & Compact */}
      <div style={{
        background: 'transparent', border: '1px solid #e5e7eb',
        padding: '24px', marginBottom: '32px'
      }}>
        <div style={{ padding: '8px 12px', background: '#fefce8', color: '#854d0e', marginBottom: '16px', fontSize: '11px', textAlign: 'center', fontWeight: 600, border: '1px solid #fef08a' }}>
          DOMINION SOFTWARES — FOR TESTING ONLY
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
          <div style={{
            width: '40px', height: '40px',
            background: '#E53935',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '16px'
          }}>M</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#111827', fontWeight: 600 }}>Lipa Na M-Pesa</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              Contributing as: <strong style={{ color: '#E53935', textTransform: 'capitalize' }}>{payForm.category}</strong>
            </p>
          </div>
        </div>

        {payStatus === 'waiting' && (
          <div style={{ padding: '12px', background: '#f8fafc', marginBottom: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ width: '24px', height: '24px', border: '2px solid #E53935', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
            <p style={{ margin: 0, fontWeight: 600, color: '#334155', fontSize: '13px' }}>Waiting for payment confirmation...</p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Check your phone and enter your M-Pesa PIN.</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        {payStatus === 'success' && payMsg && (
          <div style={{ padding: '12px', background: '#f0fdf4', marginBottom: '16px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#166534', fontSize: '13px' }}>✓ {payMsg}</p>
          </div>
        )}
        {payError && (
          <div style={{ padding: '12px', background: '#fef2f2', marginBottom: '16px', border: '1px solid #fecaca', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#991b1b', fontSize: '13px', fontWeight: 500 }}>✕ {payError}</p>
          </div>
        )}

        <form onSubmit={handlePay}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#374151', marginBottom: '4px', fontWeight: 600 }}>Phone Number</label>
            <input type="tel" value={payForm.phone} onChange={e => setPayForm({ ...payForm, phone: e.target.value })} placeholder="0712345678" required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: '#f9fafb' }}
              onFocus={e => e.target.style.borderColor = '#E53935'} onBlur={e => e.target.style.borderColor = '#d1d5db'} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#374151', marginBottom: '4px', fontWeight: 600 }}>Amount (KES)</label>
            <input type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} placeholder="0.00" min="1" max="150000" required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: '#f9fafb' }}
              onFocus={e => e.target.style.borderColor = '#E53935'} onBlur={e => e.target.style.borderColor = '#d1d5db'} />
          </div>
          <button type="submit" disabled={payLoading}
            style={{
              width: '100%', padding: '12px', border: 'none',
              background: payLoading ? '#d1d5db' : '#E53935',
              color: '#fff', fontSize: '14px', fontWeight: 600, cursor: payLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={e => { if (!payLoading) e.currentTarget.style.background = '#c62828' }}
            onMouseOut={e => { if (!payLoading) e.currentTarget.style.background = '#E53935' }}
          >
            {payLoading && payStatus === 'waiting' ? 'Waiting...' : payLoading ? 'Initiating...' : 'Give Now'}
          </button>
        </form>
      </div>

      {/* Contributions History - Flat & Minimal */}
      <div>
        <div style={{
          padding: '12px 0', borderBottom: '2px solid #E53935',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'
        }}>
          <h2 style={{ margin: 0, fontSize: '15px', color: '#111827', fontWeight: 700, textTransform: 'uppercase' }}>My Giving History</h2>
          {contributions.length > 0 && (
            <span style={{ fontSize: '13px', color: '#b91c1c', fontWeight: 700 }}>Total: {formatAmount(totalContributions)}</span>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '24px', color: '#6b7280', fontSize: '13px' }}>Loading records...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', padding: '24px', color: '#991b1b', fontSize: '13px' }}>{error}</p>
        ) : contributions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', background: '#f9fafb', border: '1px dashed #d1d5db' }}>
            <p style={{ color: '#4b5563', fontSize: '13px', margin: '0 0 4px', fontWeight: 500 }}>No giving records found.</p>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>Your contributions will appear here once confirmed.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #d1d5db' }}>Date</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #d1d5db' }}>Category</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #d1d5db' }}>Amount</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #d1d5db' }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c, i) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                    <td style={{ padding: '10px 12px', color: '#4b5563' }}>{formatDate(c.createdAt)}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ color: '#E53935', fontWeight: 600, textTransform: 'capitalize' }}>{c.category || '-'}</span>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>{formatAmount(c.amount)}</td>
                    <td style={{ padding: '10px 12px', color: '#6b7280', textTransform: 'uppercase', fontSize: '11px', fontWeight: 500 }}>{c.source}</td>
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
