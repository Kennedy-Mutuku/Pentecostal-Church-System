import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import FlagModal from '../components/FlagModal';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from 'recharts';

const COLORS = ['#730051', '#4a0033', '#a855aa', '#d97706', '#16a34a', '#2563eb'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `KES ${Number(n || 0).toLocaleString('en-KE')}`;
const fmtDate = (d) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

// ─── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <p style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 800, color: color }}>{value}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{title}</h2>
      {subtitle && <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#6b7280' }}>{subtitle}</p>}
    </div>
  );
}

function FlagBtn({ onClick }) {
  return (
    <button onClick={onClick} title="Flag this record for review" style={{ background: '#fff3f3', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '0.3rem 0.7rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
      🚩 Flag
    </button>
  );
}

function ReadOnlyBadge({ status }) {
  const colors = { pending: ['#fef3c7','#d97706'], approved: ['#d1fae5','#059669'], rejected: ['#fee2e2','#dc2626'], completed: ['#dbeafe','#2563eb'] };
  const [bg, text] = colors[status] || ['#f3f4f6','#6b7280'];
  return <span style={{ background: bg, color: text, padding: '0.25rem 0.6rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>{status}</span>;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AuditorDashboard() {
  const { user } = useAuth();
  const role = user?.role;

  const [summary, setSummary] = useState({ total_income: 0, total_expenses: 0, net_balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [flagTarget, setFlagTarget] = useState(null); // { entity, entityId }
  const [flagSuccess, setFlagSuccess] = useState('');

  // Filters
  const [txFilter, setTxFilter] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [reportRes, txRes, assetRes, reqRes, catRes, flagRes] = await Promise.all([
        api.get('/reports/financial-statement'),
        api.get('/transactions'),
        api.get('/assets'),
        api.get('/requisitions'),
        api.get('/reports/category-breakdown'),
        api.get('/flags'),
      ]);

      const s = reportRes.data.summary || {};
      setSummary({
        total_income: s.total_income || 0,
        total_expenses: s.total_expenses || 0,
        net_balance: s.net_balance || 0,
      });

      setTransactions(txRes.data || []);
      setAssets(assetRes.data || []);
      setRequisitions(reqRes.data || []);
      setFlags(flagRes.data || []);

      // Category pie data
      const cats = (catRes.data || []).map(c => ({ name: c._id || 'Other', value: c.total }));
      setCategoryData(cats);

      // Monthly cash flow from transactions
      const txAll = txRes.data || [];
      const monthMap = {};
      txAll.forEach(t => {
        const month = new Date(t.createdAt).toLocaleDateString('en-KE', { month: 'short', year: '2-digit' });
        if (!monthMap[month]) monthMap[month] = { month, income: 0, expense: 0 };
        if (t.type === 'cash_in') monthMap[month].income += t.amount;
        else monthMap[month].expense += t.amount;
      });
      setMonthlyData(Object.values(monthMap).slice(-6));
    } catch (err) {
      console.error('Dashboard load error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (role !== 'auditor' && role !== 'admin') return <Navigate to="/dashboard" replace />;

  const openFlag = (entity, entityId) => setFlagTarget({ entity, entityId });
  const handleFlagSuccess = () => {
    setFlagSuccess('Record flagged successfully!');
    fetchAll();
    setTimeout(() => setFlagSuccess(''), 3000);
  };

  const filteredTx = transactions.filter(t =>
    (!txFilter || (t.description || '').toLowerCase().includes(txFilter.toLowerCase()) || (t.category || '').toLowerCase().includes(txFilter.toLowerCase())) &&
    (!txTypeFilter || t.type === txTypeFilter)
  );

  const tabs = ['overview', 'transactions', 'assets', 'requisitions', 'flags'];

  return (
    <div style={{ padding: '0', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #730051 0%, #4a0033 100%)', padding: '2rem 2rem 2.5rem', color: '#fff', borderRadius: '0 0 24px 24px', marginBottom: '2rem' }}>
        <p style={{ margin: '0 0 4px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7, fontWeight: 600 }}>🔍 Read-Only Access</p>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem', fontWeight: 800 }}>Transparency & Audit Dashboard</h1>
        <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Complete financial overview with flagging capability. All data is read-only.</p>
      </div>

      <div style={{ padding: '0 1.5rem 2rem' }}>
        {flagSuccess && (
          <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#065f46', fontWeight: 600, fontSize: '0.9rem' }}>
            ✅ {flagSuccess}
          </div>
        )}

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard label="Total Income" value={fmt(summary.total_income)} color="#059669" icon="💰" />
          <StatCard label="Total Expenses" value={fmt(summary.total_expenses)} color="#dc2626" icon="📤" />
          <StatCard label="Net Balance" value={fmt(summary.net_balance)} color={summary.net_balance >= 0 ? '#2563eb' : '#dc2626'} icon="⚖️" />
          <StatCard label="Total Assets" value={assets.length} color="#730051" icon="🏛️" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '0.5rem 1.1rem', borderRadius: '100px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', textTransform: 'capitalize', background: activeTab === t ? '#730051' : '#f3f4f6', color: activeTab === t ? '#fff' : '#374151', transition: 'all 0.2s' }}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Loading financial data…</div>
        ) : (
          <>
            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
                {/* Cash Flow Chart */}
                <div style={chartCard}>
                  <SectionHeader title="Cash Flow Trend" subtitle="Last 6 months — income vs expenses" />
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v) => fmt(v)} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} name="Income" />
                      <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4 }} name="Expense" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Pie */}
                <div style={chartCard}>
                  <SectionHeader title="Income by Category" subtitle="Distribution of all cash-in transactions" />
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Asset Bar Chart */}
                <div style={{ ...chartCard, gridColumn: 'span 2' }}>
                  <SectionHeader title="Asset Valuations" subtitle="Current estimated value of registered assets" />
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={assets.slice(0, 10).map(a => ({ name: a.name, value: a.valuation, condition: a.condition }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v) => fmt(v)} />
                      <Bar dataKey="value" name="Valuation (KES)" radius={[6, 6, 0, 0]}>
                        {assets.slice(0, 10).map((a, i) => (
                          <Cell key={i} fill={a.condition === 'good' ? '#059669' : a.condition === 'fair' ? '#d97706' : '#dc2626'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0.5rem 0 0' }}>🟢 Good &nbsp; 🟡 Fair &nbsp; 🔴 Poor condition</p>
                </div>
              </div>
            )}

            {/* ── TRANSACTIONS TAB ── */}
            {activeTab === 'transactions' && (
              <div>
                <SectionHeader title="All Transactions" subtitle="Read-only view — flag any suspicious record" />
                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <input placeholder="Search description or category…" value={txFilter} onChange={e => setTxFilter(e.target.value)} style={inputStyle} />
                  <select value={txTypeFilter} onChange={e => setTxTypeFilter(e.target.value)} style={inputStyle}>
                    <option value="">All Types</option>
                    <option value="cash_in">Cash In</option>
                    <option value="cash_out">Cash Out</option>
                  </select>
                </div>
                <div style={tableWrapper}>
                  <table style={tableStyle}>
                    <thead><tr style={theadRow}>
                      <th style={th}>Date</th><th style={th}>Type</th><th style={th}>Category</th>
                      <th style={th}>Amount</th><th style={th}>Source</th><th style={th}>Recorded By</th>
                      <th style={th}>Description</th><th style={th}>Action</th>
                    </tr></thead>
                    <tbody>
                      {filteredTx.length === 0 ? (
                        <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No transactions found.</td></tr>
                      ) : filteredTx.map(t => (
                        <tr key={t._id} style={trStyle}>
                          <td style={td}>{fmtDate(t.createdAt)}</td>
                          <td style={td}><span style={{ background: t.type === 'cash_in' ? '#d1fae5' : '#fee2e2', color: t.type === 'cash_in' ? '#059669' : '#dc2626', padding: '2px 8px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>{t.type}</span></td>
                          <td style={td}>{t.category || '–'}</td>
                          <td style={{ ...td, fontWeight: 700 }}>{fmt(t.amount)}</td>
                          <td style={td}>{t.source || '–'}</td>
                          <td style={td}>{t.recorded_by?.name || '–'}</td>
                          <td style={td}>{t.description || '–'}</td>
                          <td style={td}><FlagBtn onClick={() => openFlag('transactions', t._id)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── ASSETS TAB ── */}
            {activeTab === 'assets' && (
              <div>
                <SectionHeader title="All Assets" subtitle="Read-only asset registry — flag any discrepancy" />
                <div style={tableWrapper}>
                  <table style={tableStyle}>
                    <thead><tr style={theadRow}>
                      <th style={th}>Asset Name</th><th style={th}>Description</th>
                      <th style={th}>Valuation</th><th style={th}>Condition</th>
                      <th style={th}>Registered</th><th style={th}>Action</th>
                    </tr></thead>
                    <tbody>
                      {assets.length === 0 ? (
                        <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No assets found.</td></tr>
                      ) : assets.map(a => (
                        <tr key={a._id} style={trStyle}>
                          <td style={{ ...td, fontWeight: 700 }}>{a.name}</td>
                          <td style={td}>{a.description || '–'}</td>
                          <td style={{ ...td, fontWeight: 700 }}>{fmt(a.valuation)}</td>
                          <td style={td}>
                            <span style={{ background: a.condition === 'good' ? '#d1fae5' : a.condition === 'fair' ? '#fef3c7' : '#fee2e2', color: a.condition === 'good' ? '#059669' : a.condition === 'fair' ? '#d97706' : '#dc2626', padding: '2px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>
                              {a.condition === 'good' ? '↑ Good' : a.condition === 'fair' ? '→ Fair' : '↓ Poor'}
                            </span>
                          </td>
                          <td style={td}>{fmtDate(a.createdAt)}</td>
                          <td style={td}><FlagBtn onClick={() => openFlag('assets', a._id)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── REQUISITIONS TAB ── */}
            {activeTab === 'requisitions' && (
              <div>
                <SectionHeader title="All Requisitions" subtitle="Read-only view of all requisition requests" />
                <div style={tableWrapper}>
                  <table style={tableStyle}>
                    <thead><tr style={theadRow}>
                      <th style={th}>Date</th><th style={th}>Requested By</th><th style={th}>Reason</th>
                      <th style={th}>Amount Requested</th><th style={th}>Amount Spent</th>
                      <th style={th}>Status</th><th style={th}>Approved By</th><th style={th}>Action</th>
                    </tr></thead>
                    <tbody>
                      {requisitions.length === 0 ? (
                        <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No requisitions found.</td></tr>
                      ) : requisitions.map(r => (
                        <tr key={r._id} style={trStyle}>
                          <td style={td}>{fmtDate(r.createdAt)}</td>
                          <td style={td}>{r.requested_by?.name || '–'}</td>
                          <td style={td}>{r.reason}</td>
                          <td style={{ ...td, fontWeight: 700 }}>{fmt(r.amount_requested)}</td>
                          <td style={td}>{r.amount_spent != null ? fmt(r.amount_spent) : '–'}</td>
                          <td style={td}><ReadOnlyBadge status={r.status} /></td>
                          <td style={td}>{r.approved_by?.name || '–'}</td>
                          <td style={td}><FlagBtn onClick={() => openFlag('requisitions', r._id)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── FLAGS TAB ── */}
            {activeTab === 'flags' && (
              <div>
                <SectionHeader title="All Flagged Records" subtitle="Records you or other auditors have flagged for review" />
                <div style={tableWrapper}>
                  <table style={tableStyle}>
                    <thead><tr style={theadRow}>
                      <th style={th}>Date</th><th style={th}>Flagged By</th>
                      <th style={th}>Entity</th><th style={th}>Comment</th>
                    </tr></thead>
                    <tbody>
                      {flags.length === 0 ? (
                        <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No flags submitted yet.</td></tr>
                      ) : flags.map(f => (
                        <tr key={f._id} style={trStyle}>
                          <td style={td}>{fmtDate(f.createdAt)}</td>
                          <td style={td}>{f.flagged_by?.name || '–'}</td>
                          <td style={td}><span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{f.entity}</span></td>
                          <td style={td}>{f.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Flag Modal */}
      {flagTarget && (
        <FlagModal
          entity={flagTarget.entity}
          entityId={flagTarget.entityId}
          onClose={() => setFlagTarget(null)}
          onSuccess={handleFlagSuccess}
        />
      )}
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const chartCard = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' };
const tableWrapper = { overflowX: 'auto', borderRadius: '14px', border: '1px solid #e5e7eb' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' };
const theadRow = { background: '#f9fafb' };
const th = { padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' };
const td = { padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', color: '#111827', verticalAlign: 'middle' };
const trStyle = { transition: 'background 0.15s' };
const inputStyle = { padding: '0.55rem 0.9rem', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#111827', minWidth: '200px' };
