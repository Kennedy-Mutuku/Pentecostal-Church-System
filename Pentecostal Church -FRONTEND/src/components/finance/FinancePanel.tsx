import React, { useState, useEffect } from 'react';
import { financeApi } from '../../services/financeApi';
import styles from '../../styles/finance.module.css';
import loadingAnime from '../../assets/loading.gif';

type FinanceTab = 'dashboard' | 'transactions' | 'newTransaction' | 'requisitions' | 'newRequisition' | 'assets' | 'newAsset' | 'reports' | 'auditLogs' | 'mpesa' | 'users';

interface FinancePanelProps {
  isPatron?: boolean;
  initialTab?: FinanceTab | string;
}

interface Transaction {
  _id: string;
  type: string;
  category: string;
  amount: number;
  source: string;
  phone?: string;
  description?: string;
  payer_name?: string;
  recorded_by?: { username?: string; email?: string };
  createdAt: string;
}

interface Requisition {
  _id: string;
  requested_by?: { username?: string; email?: string };
  reason: string;
  amount_requested: number;
  amount_spent?: number;
  status: string;
  approved_by?: { username?: string; email?: string };
  createdAt: string;
}

interface ValuationHistoryEntry {
  value: number;
  method: string;
  reason?: string;
  valued_at: string;
}

interface Asset {
  _id: string;
  name: string;
  description?: string;
  valuation: number;
  purchase_amount: number;
  purchase_date: string;
  docket: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
  valuationHistory?: ValuationHistoryEntry[];
}

interface AuditLog {
  _id: string;
  user_id?: { username?: string; email?: string };
  action: string;
  entity: string;
  createdAt: string;
}

interface FinanceUser {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

const FinancePanel: React.FC<FinancePanelProps> = ({ isPatron = false, initialTab }) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>((initialTab as FinanceTab) || 'dashboard');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as FinanceTab);
    }
  }, [initialTab]);

  const [balance, setBalance] = useState<{ total_in: number; total_out: number; balance: number } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<FinanceUser[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [txForm, setTxForm] = useState({ type: 'cash_in', category: 'offering', source: 'cash', phone: '', amount: '', description: '' });
  const [reqForm, setReqForm] = useState({ reason: '', amount_requested: '' });
  const [assetForm, setAssetForm] = useState({ name: '', description: '', valuation: '', purchase_amount: '', purchase_date: '', docket: '', condition: 'good' });
  const [revalueModal, setRevalueModal] = useState<Asset | null>(null);
  const [revalueForm, setRevalueForm] = useState({ new_value: '', method: '', reason: '' });
  const [historyModal, setHistoryModal] = useState<Asset | null>(null);
  const [mpesaForm, setMpesaForm] = useState({ phone: '', amount: '', category: 'offering' });
  const [mpesaStatus, setMpesaStatus] = useState<'idle' | 'sending' | 'waiting' | 'success' | 'failed'>('idle');
  const [mpesaMsg, setMpesaMsg] = useState('');
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'treasurer', phone: '' });
  const [resetModal, setResetModal] = useState<{ id: string; email: string } | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  const tabs: { id: FinanceTab; label: string; hidden?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'requisitions', label: 'Requisitions' },
    { id: 'assets', label: 'Assets', hidden: isPatron },
    { id: 'reports', label: 'Reports' },
    { id: 'auditLogs', label: 'Audit Logs', hidden: isPatron },
    { id: 'mpesa', label: 'M-Pesa', hidden: isPatron },
    { id: 'users', label: 'Finance Users', hidden: isPatron },
  ];

  useEffect(() => { loadTabData(); }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    setError('');
    try {
      switch (activeTab) {
        case 'dashboard':
          const bal = await financeApi.get('/transactions/balance');
          setBalance(bal);
          break;
        case 'transactions':
          setTransactions(await financeApi.get('/transactions'));
          break;
        case 'requisitions':
          setRequisitions(await financeApi.get('/requisitions'));
          break;
        case 'assets':
          setAssets(await financeApi.get('/assets'));
          break;
        case 'reports':
          setReport(await financeApi.get('/reports/statement'));
          break;
        case 'auditLogs':
          setAuditLogs(await financeApi.get('/audit-logs'));
          break;
        case 'users':
          setUsers(await financeApi.get('/users'));
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    }
    setLoading(false);
  };

  const formatAmount = (amount: number) => `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await financeApi.post('/transactions', { ...txForm, amount: Number(txForm.amount) });
      setSuccess('Transaction recorded.');
      setTxForm({ type: 'cash_in', category: 'offering', source: 'cash', phone: '', amount: '', description: '' });
      setActiveTab('transactions');
    } catch (err: any) { setError(err.message); }
  };

  const handleCreateRequisition = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await financeApi.post('/requisitions', { ...reqForm, amount_requested: Number(reqForm.amount_requested) });
      setSuccess('Requisition submitted.');
      setReqForm({ reason: '', amount_requested: '' });
      setActiveTab('requisitions');
    } catch (err: any) { setError(err.message); }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await financeApi.post('/assets', { ...assetForm, valuation: Number(assetForm.valuation), purchase_amount: Number(assetForm.purchase_amount) });
      setSuccess('Asset recorded.');
      setAssetForm({ name: '', description: '', valuation: '', purchase_amount: '', purchase_date: '', docket: '', condition: 'good' });
      setActiveTab('assets');
    } catch (err: any) { setError(err.message); }
  };

  const handleRevalueAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revalueModal) return;
    setError(''); setSuccess('');
    try {
      await financeApi.put(`/assets/${revalueModal._id}/revalue`, {
        new_value: Number(revalueForm.new_value),
        method: revalueForm.method || undefined,
        reason: revalueForm.reason,
      });
      setSuccess(`${revalueModal.name} revalued to ${formatAmount(Number(revalueForm.new_value))}.`);
      setRevalueModal(null);
      setRevalueForm({ new_value: '', method: '', reason: '' });
      loadTabData();
    } catch (err: any) { setError(err.message); }
  };

  const handleApproveReq = async (id: string) => {
    try {
      await financeApi.put(`/requisitions/${id}/approve`);
      loadTabData();
    } catch (err: any) { setError(err.message); }
  };

  const handleRejectReq = async (id: string) => {
    try {
      await financeApi.put(`/requisitions/${id}/reject`);
      loadTabData();
    } catch (err: any) { setError(err.message); }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!confirm('Delete this asset?')) return;
    try {
      await financeApi.delete(`/assets/${id}`);
      loadTabData();
    } catch (err: any) { setError(err.message); }
  };

  const pollMpesaStatus = async (checkoutRequestID: string) => {
    setMpesaStatus('waiting');
    setMpesaMsg('Check the phone and enter M-Pesa PIN...');
    let attempts = 0;
    let resolved = false;
    const poll = async () => {
      if (resolved) return;
      attempts++;
      try {
        const res = await fetch(`/api/finance/mpesa/status/${checkoutRequestID}`, { credentials: 'include' });
        const data = await res.json();
        if (data.status === 'success') {
          resolved = true;
          setMpesaStatus('success'); setMpesaMsg('Payment completed successfully!');
          setSuccess('Payment completed!'); setError(''); loadTabData(); return;
        } else if (data.status === 'cancelled' || data.status === 'timeout' || data.status === 'failed') {
          resolved = true;
          setMpesaStatus('failed'); setMpesaMsg(data.message); setError(data.message); return;
        }
      } catch { /* keep polling */ }
      if (!resolved && attempts < 15) setTimeout(poll, 5000);
      else if (!resolved) { setMpesaStatus('idle'); setMpesaMsg(''); setError('Could not confirm payment. It may still process.'); }
    };
    setTimeout(poll, 7000);
  };

  const handleMpesa = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setMpesaStatus('sending'); setMpesaMsg('');
    try {
      const res = await fetch('/api/finance/mpesa/stkpush', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...mpesaForm, amount: Number(mpesaForm.amount) }),
      });
      const result = await res.json();
      if (!res.ok) { setMpesaStatus('idle'); setError(result.message || 'STK push failed.'); return; }
      const checkoutID = result?.data?.CheckoutRequestID;
      if (checkoutID) {
        pollMpesaStatus(checkoutID);
      } else {
        setMpesaStatus('idle'); setSuccess('STK push sent. Check the phone.');
      }
      setMpesaForm({ phone: '', amount: '', category: 'offering' });
    } catch (err: any) { setMpesaStatus('idle'); setError(err.message || 'Request failed.'); }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(userForm.password)) { setError('Password does not meet all requirements.'); return; }
    setError(''); setSuccess('');
    try {
      await financeApi.post('/users', userForm);
      setSuccess('Finance user created.');
      setUserForm({ name: '', email: '', password: '', role: 'treasurer', phone: '' });
      loadTabData();
    } catch (err: any) { setError(err.message); }
  };

  const passwordChecks = (pw: string) => ({
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw),
  });

  const isPasswordValid = (pw: string) => {
    const c = passwordChecks(pw);
    return c.length && c.upper && c.lower && c.number && c.special;
  };

  const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
    const c = passwordChecks(password);
    if (!password) return null;
    const items = [
      { ok: c.length, label: '8+ characters' },
      { ok: c.upper, label: 'Uppercase letter' },
      { ok: c.lower, label: 'Lowercase letter' },
      { ok: c.number, label: 'Number' },
      { ok: c.special, label: 'Special character (!@#$...)' },
    ];
    return (
      <div style={{ fontSize: '12px', marginTop: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px' }}>
        {items.map(i => (
          <span key={i.label} style={{ color: i.ok ? '#16a34a' : '#999' }}>
            {i.ok ? '\u2713' : '\u2022'} {i.label}
          </span>
        ))}
      </div>
    );
  };

  const handleResetPassword = async () => {
    if (!resetModal) return;
    if (!isPasswordValid(resetPassword)) { setError('Password does not meet requirements.'); return; }
    setError(''); setSuccess('');
    try {
      await financeApi.put(`/users/${resetModal.id}/reset-password`, { password: resetPassword });
      setSuccess(`Password reset for ${resetModal.email}.`);
      setResetModal(null);
      setResetPassword('');
    } catch (err: any) { setError(err.message); }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setSuccess(`Copied: ${email}`);
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Delete finance user ${email}?`)) return;
    try {
      await financeApi.delete(`/users/${id}`);
      setSuccess('Finance user deleted.');
      loadTabData();
    } catch (err: any) { setError(err.message); }
  };

  const renderDashboard = () => (
    <div>
      <h3 className={styles.tabTitle}>Financial Overview</h3>
      {balance && (
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.income}`}>
            <h4>Total Income</h4>
            <p>{formatAmount(balance.total_in)}</p>
          </div>
          <div className={`${styles.statCard} ${styles.expense}`}>
            <h4>Total Expenses</h4>
            <p>{formatAmount(balance.total_out)}</p>
          </div>
          <div className={`${styles.statCard} ${styles.net}`}>
            <h4>Net Balance</h4>
            <p>{formatAmount(balance.balance)}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderTransactions = () => (
    <div>
      <div className={styles.tabHeader}>
        <h3 className={styles.tabTitle}>Transactions</h3>
        {!isPatron && <button className={styles.actionBtn} onClick={() => setActiveTab('newTransaction')}>Record Transaction</button>}
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Source</th><th>Paid By</th></tr></thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx._id}>
                <td>{formatDate(tx.createdAt)}</td>
                <td>{tx.type === 'cash_in' ? 'Cash In' : 'Cash Out'}</td>
                <td>{tx.category || '-'}</td>
                <td>{formatAmount(tx.amount)}</td>
                <td>{tx.source?.toUpperCase()}</td>
                <td>{tx.payer_name || tx.recorded_by?.username || tx.recorded_by?.email || tx.phone || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNewTransaction = () => (
    <div>
      <div className={styles.tabHeader}>
        <h3 className={styles.tabTitle}>Record Transaction</h3>
        <button className={styles.backBtn} onClick={() => setActiveTab('transactions')}>Back</button>
      </div>
      <form onSubmit={handleCreateTransaction} className={styles.form}>
        <div className={styles.formRow}>
          <label>Type<select value={txForm.type} onChange={e => setTxForm({ ...txForm, type: e.target.value })}><option value="cash_in">Cash In</option><option value="cash_out">Cash Out</option></select></label>
          {txForm.type === 'cash_in' && <label>Category<select value={txForm.category} onChange={e => setTxForm({ ...txForm, category: e.target.value })}><option value="offering">Offering</option><option value="tithe">Tithe</option><option value="thanksgiving">Thanksgiving</option><option value="aob">AOB</option></select></label>}
        </div>
        <div className={styles.formRow}>
          <label>Source<select value={txForm.source} onChange={e => setTxForm({ ...txForm, source: e.target.value })}><option value="cash">Cash</option><option value="mpesa">M-Pesa</option></select></label>
          {txForm.source === 'mpesa' && <label>Phone<input type="text" value={txForm.phone} onChange={e => setTxForm({ ...txForm, phone: e.target.value })} placeholder="0712345678" /></label>}
        </div>
        <label>Amount (KES)<input type="number" value={txForm.amount} onChange={e => setTxForm({ ...txForm, amount: e.target.value })} required min="1" /></label>
        <label>Description<textarea value={txForm.description} onChange={e => setTxForm({ ...txForm, description: e.target.value })} rows={2} /></label>
        <button type="submit" className={styles.actionBtn}>Record</button>
      </form>
    </div>
  );

  const renderRequisitions = () => (
    <div>
      <div className={styles.tabHeader}>
        <h3 className={styles.tabTitle}>Requisitions</h3>
        {!isPatron && <button className={styles.actionBtn} onClick={() => setActiveTab('newRequisition')}>New Requisition</button>}
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Date</th><th>Reason</th><th>Requested</th><th>Spent</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {requisitions.map(r => (
              <tr key={r._id}>
                <td>{formatDate(r.createdAt)}</td>
                <td>{r.reason}</td>
                <td>{formatAmount(r.amount_requested)}</td>
                <td>{r.amount_spent ? formatAmount(r.amount_spent) : '-'}</td>
                <td><span className={`${styles.badge} ${styles[r.status]}`}>{r.status}</span></td>
                <td>
                  {r.status === 'pending' && (
                    <>
                      <button className={styles.approveBtn} onClick={() => handleApproveReq(r._id)}>Approve</button>
                      <button className={styles.rejectBtn} onClick={() => handleRejectReq(r._id)}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNewRequisition = () => (
    <div>
      <div className={styles.tabHeader}>
        <h3 className={styles.tabTitle}>New Requisition</h3>
        <button className={styles.backBtn} onClick={() => setActiveTab('requisitions')}>Back</button>
      </div>
      <form onSubmit={handleCreateRequisition} className={styles.form}>
        <label>Reason<textarea value={reqForm.reason} onChange={e => setReqForm({ ...reqForm, reason: e.target.value })} required rows={3} /></label>
        <label>Amount (KES)<input type="number" value={reqForm.amount_requested} onChange={e => setReqForm({ ...reqForm, amount_requested: e.target.value })} required min="1" /></label>
        <button type="submit" className={styles.actionBtn}>Submit Requisition</button>
      </form>
    </div>
  );

  const renderAssets = () => (
    <div>
      <div className={styles.tabHeader}>
        <h3 className={styles.tabTitle}>Assets</h3>
        <button className={styles.actionBtn} onClick={() => setActiveTab('newAsset')}>Add Asset</button>
      </div>
      <div style={{ padding: '10px 14px', background: '#f8fdfa', border: '1px solid #d1e7dd', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', color: '#333' }}>
        <strong>Total Current Assets Value:</strong> {formatAmount(assets.reduce((sum, a) => sum + (a.valuation || 0), 0))}
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Docket</th><th>Name</th><th>Description</th><th>Purchase Price</th><th>Current Valuation</th><th>Last Valued</th><th>Condition</th><th>Actions</th></tr></thead>
          <tbody>
            {assets.map(a => (
              <tr key={a._id}>
                <td>{a.docket || '-'}</td>
                <td>{a.name}</td>
                <td>{a.description || '-'}</td>
                <td>{formatAmount(a.purchase_amount)}</td>
                <td>{formatAmount(a.valuation)}</td>
                <td>{formatDate(a.updatedAt)}</td>
                <td><span className={`${styles.badge} ${styles[a.condition]}`}>{a.condition}</span></td>
                <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button className={styles.approveBtn} onClick={() => { setRevalueModal(a); setRevalueForm({ new_value: String(a.valuation), method: '', reason: '' }); }}>Revalue</button>
                  <button className={styles.actionBtn} style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => setHistoryModal(a)}>History</button>
                  <button className={styles.rejectBtn} onClick={() => handleDeleteAsset(a._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNewAsset = () => (
    <div>
      <div className={styles.tabHeader}>
        <h3 className={styles.tabTitle}>Add Asset</h3>
        <button className={styles.backBtn} onClick={() => setActiveTab('assets')}>Back</button>
      </div>
      <form onSubmit={handleCreateAsset} className={styles.form}>
        <label>Name<input type="text" value={assetForm.name} onChange={e => setAssetForm({ ...assetForm, name: e.target.value })} required /></label>
        <label>Description<textarea value={assetForm.description} onChange={e => setAssetForm({ ...assetForm, description: e.target.value })} rows={2} /></label>
        <div className={styles.formRow}>
          <label>Docket<select value={assetForm.docket} onChange={e => setAssetForm({ ...assetForm, docket: e.target.value })} required>
            <option value="">Select Docket</option>
            <option value="Chairperson">Chairperson</option>
            <option value="Vice Chairperson">Vice Chairperson</option>
            <option value="Secretary">Secretary</option>
            <option value="Publicity secretary">Publicity secretary</option>
            <option value="Treasurer">Treasurer</option>
            <option value="Worship Coordinator">Worship Coordinator</option>
            <option value="Boards Coordinator">Boards Coordinator</option>
            <option value="Missions Coordinator">Missions Coordinator</option>
            <option value="Bible study Coordinator">Bible study Coordinator</option>
            <option value="Discipleship Coordinator">Discipleship Coordinator</option>
            <option value="Other">Other</option>
          </select></label>
          <label>Condition<select value={assetForm.condition} onChange={e => setAssetForm({ ...assetForm, condition: e.target.value })}><option value="new">New</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option></select></label>
        </div>
        <div className={styles.formRow}>
          <label>Purchase Amount (KES)<input type="number" value={assetForm.purchase_amount} onChange={e => setAssetForm({ ...assetForm, purchase_amount: e.target.value })} required min="0" /></label>
          <label>Purchase Date<input type="date" value={assetForm.purchase_date} onChange={e => setAssetForm({ ...assetForm, purchase_date: e.target.value })} required /></label>
        </div>
        <label>Current Valuation (KES)<input type="number" value={assetForm.valuation} onChange={e => setAssetForm({ ...assetForm, valuation: e.target.value })} required min="0" /></label>
        <button type="submit" className={styles.actionBtn}>Save Asset</button>
      </form>
    </div>
  );

  const renderReports = () => (
    <div>
      <h3 className={styles.tabTitle}>Financial Reports</h3>
      {report && (
        <>
          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.income}`}><h4>Total Income</h4><p>{formatAmount(report.summary.total_income)}</p></div>
            <div className={`${styles.statCard} ${styles.expense}`}><h4>Total Expenses</h4><p>{formatAmount(report.summary.total_expenses)}</p></div>
            <div className={`${styles.statCard} ${styles.net}`}><h4>Net Balance</h4><p>{formatAmount(report.summary.net_balance)}</p></div>
          </div>
          <h4 style={{ marginTop: '20px' }}>Breakdown</h4>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Type</th><th>Category</th><th>Total</th><th>Count</th></tr></thead>
              <tbody>
                {report.breakdown.map((b: any, i: number) => (
                  <tr key={i}>
                    <td>{b._id.type === 'cash_in' ? 'Income' : 'Expense'}</td>
                    <td>{b._id.category || '-'}</td>
                    <td>{formatAmount(b.total_amount)}</td>
                    <td>{b.transaction_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  const renderAuditLogs = () => (
    <div>
      <h3 className={styles.tabTitle}>Audit Logs</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Date</th><th>User</th><th>Action</th><th>Entity</th></tr></thead>
          <tbody>
            {auditLogs.map(l => (
              <tr key={l._id}>
                <td>{formatDate(l.createdAt)}</td>
                <td>{l.user_id?.username || l.user_id?.email || '-'}</td>
                <td>{l.action}</td>
                <td>{l.entity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMpesa = () => (
    <div>
      <h3 className={styles.tabTitle}>M-Pesa STK Push</h3>
      <div style={{ padding: '10px 14px', background: '#fef3c7', color: '#92400e', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', textAlign: 'center', fontWeight: 600, border: '1px solid #fde68a' }}>DOMINION SOFTWARES — FOR TESTING ONLY</div>

      {mpesaStatus === 'waiting' && (
        <div style={{ padding: '16px', background: '#fffbeb', borderRadius: '10px', marginBottom: '16px', border: '1px solid #fde68a', textAlign: 'center' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
          <p style={{ margin: 0, fontWeight: 600, color: '#92400e', fontSize: '13px' }}>Waiting for payment...</p>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#b45309' }}>{mpesaMsg}</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {mpesaStatus === 'success' && (
        <div style={{ padding: '14px', background: '#dcfce7', borderRadius: '10px', marginBottom: '16px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#166534', fontSize: '13px' }}>{mpesaMsg}</p>
        </div>
      )}

      <form onSubmit={handleMpesa} className={styles.form}>
        <label>Phone Number<input type="text" value={mpesaForm.phone} onChange={e => setMpesaForm({ ...mpesaForm, phone: e.target.value })} placeholder="0712345678" required /></label>
        <label>Amount (KES)<input type="number" value={mpesaForm.amount} onChange={e => setMpesaForm({ ...mpesaForm, amount: e.target.value })} required min="1" /></label>
        <label>Category<select value={mpesaForm.category} onChange={e => setMpesaForm({ ...mpesaForm, category: e.target.value })}><option value="offering">Offering</option><option value="tithe">Tithe</option><option value="thanksgiving">Thanksgiving</option><option value="aob">AOB</option></select></label>
        <button type="submit" className={styles.actionBtn} disabled={mpesaStatus === 'sending' || mpesaStatus === 'waiting'}>
          {mpesaStatus === 'sending' ? 'Sending...' : mpesaStatus === 'waiting' ? 'Waiting for payment...' : 'Send STK Push'}
        </button>
      </form>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h3 className={styles.tabTitle}>Finance Users</h3>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>
        Manage Treasurer accounts for the finance subdomain.
      </p>

      <form onSubmit={handleCreateUser} className={styles.form} style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#333' }}>Create Treasurer Account</h4>
        <div className={styles.formRow}>
          <label>Name<input type="text" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} placeholder="Full name" /></label>
          <label>Email<input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required placeholder="user@example.com" /></label>
        </div>
        <div className={styles.formRow}>
          <label>Password
            <div style={{ position: 'relative' }}>
              <input type={showCreatePassword ? 'text' : 'password'} value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required placeholder="Strong password" style={{ paddingRight: '50px' }} />
              <button type="button" onClick={() => setShowCreatePassword(!showCreatePassword)} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3b1a62' }}>{showCreatePassword ? 'Hide' : 'Show'}</button>
            </div>
            <PasswordStrength password={userForm.password} />
          </label>
          <label>Phone (optional)<input type="text" value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} placeholder="0712345678" /></label>
        </div>
        <button type="submit" className={styles.actionBtn}>Create User</button>
      </form>

      <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#333' }}>Existing Finance Users ({users.length})</h4>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No finance users yet. Create one above.</td></tr>
            ) : users.map(u => (
              <tr key={u._id}>
                <td>{u.name || '-'}</td>
                <td style={{ cursor: 'pointer' }} onClick={() => handleCopyEmail(u.email)} title="Click to copy">{u.email}</td>
                <td><span className={`${styles.badge} ${styles.approved}`}>{u.role.replace('_', ' ')}</span></td>
                <td>{u.phone || '-'}</td>
                <td>{formatDate(u.createdAt)}</td>
                <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button className={styles.approveBtn} onClick={() => handleCopyEmail(u.email)}>Copy Email</button>
                  <button className={styles.actionBtn} style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => { setResetModal({ id: u._id, email: u.email }); setResetPassword(''); setShowPassword(false); }}>Reset Password</button>
                  <button className={styles.rejectBtn} onClick={() => handleDeleteUser(u._id, u.email)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return <div className="loading-container" style={{textAlign:"center", padding:"2rem"}}><img src={loadingAnime} alt="Loading..." style={{width:"80px"}} /></div>;
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'transactions': return renderTransactions();
      case 'newTransaction': return renderNewTransaction();
      case 'requisitions': return renderRequisitions();
      case 'newRequisition': return renderNewRequisition();
      case 'assets': return renderAssets();
      case 'newAsset': return renderNewAsset();
      case 'reports': return renderReports();
      case 'auditLogs': return renderAuditLogs();
      case 'mpesa': return renderMpesa();
      case 'users': return renderUsers();
      default: return renderDashboard();
    }
  };

  return (
    <div className={styles.financePanel}>
      <div className={styles.tabBar}>
        {tabs.filter(t => !t.hidden).map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      <div className={styles.tabContent}>
        {renderContent()}
      </div>

      {/* Reset Password Modal */}
      {resetModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', padding: '28px', width: '420px', maxWidth: '90vw',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a1a' }}>Reset Password</h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#666' }}>
              Set a new password for <strong>{resetModal.email}</strong>
            </p>
            <div style={{ position: 'relative', marginBottom: '4px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={resetPassword}
                onChange={e => setResetPassword(e.target.value)}
                placeholder="Enter new password"
                autoFocus
                style={{
                  width: '100%', padding: '10px 40px 10px 12px', fontSize: '14px',
                  border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box',
                  outline: 'none'
                }}
                onKeyDown={e => { if (e.key === 'Enter' && isPasswordValid(resetPassword)) handleResetPassword(); }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#3b1a62'
                }}
              >{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            <PasswordStrength password={resetPassword} />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => { setResetModal(null); setResetPassword(''); }}
                style={{
                  padding: '8px 20px', borderRadius: '8px', border: '1px solid #ddd',
                  background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#333'
                }}
              >Cancel</button>
              <button
                onClick={handleResetPassword}
                disabled={!isPasswordValid(resetPassword)}
                style={{
                  padding: '8px 20px', borderRadius: '8px', border: 'none',
                  background: isPasswordValid(resetPassword) ? '#3b1a62' : '#ccc',
                  color: '#fff', cursor: isPasswordValid(resetPassword) ? 'pointer' : 'not-allowed',
                  fontSize: '13px', fontWeight: 600
                }}
              >Reset Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Revalue Asset Modal */}
      {revalueModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <form onSubmit={handleRevalueAsset} style={{
            background: '#fff', borderRadius: '12px', padding: '28px', width: '420px', maxWidth: '90vw',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a1a' }}>Revalue Asset</h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#666' }}>
              <strong>{revalueModal.name}</strong> — current value {formatAmount(revalueModal.valuation)}
            </p>
            <label>New Valuation (KES)
              <input type="number" min="0" required value={revalueForm.new_value}
                onChange={e => setRevalueForm({ ...revalueForm, new_value: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', marginBottom: '12px' }} />
            </label>
            <label>Method
              <select value={revalueForm.method} onChange={e => setRevalueForm({ ...revalueForm, method: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', marginBottom: '12px' }}>
                <option value="">Auto-detect (from value change)</option>
                <option value="appreciation">Appreciation</option>
                <option value="depreciation">Depreciation</option>
                <option value="market_appraisal">Market Appraisal</option>
              </select>
            </label>
            <label>Reason / Note
              <textarea value={revalueForm.reason} onChange={e => setRevalueForm({ ...revalueForm, reason: e.target.value })} rows={2}
                placeholder="e.g. Annual depreciation, market re-appraisal..."
                style={{ width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', marginBottom: '4px', resize: 'vertical' }} />
            </label>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="button" onClick={() => { setRevalueModal(null); setRevalueForm({ new_value: '', method: '', reason: '' }); }}
                style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#333' }}>Cancel</button>
              <button type="submit"
                style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#3b1a62', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Save Valuation</button>
            </div>
          </form>
        </div>
      )}

      {/* Valuation History Modal */}
      {historyModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', padding: '28px', width: '480px', maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a1a' }}>Valuation History</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#666' }}>{historyModal.name}</p>
            {(!historyModal.valuationHistory || historyModal.valuationHistory.length === 0) ? (
              <p style={{ color: '#999', fontSize: '13px' }}>No valuation history recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...historyModal.valuationHistory].reverse().map((h, i) => (
                  <div key={i} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px', color: '#1a1a1a' }}>{formatAmount(h.value)}</strong>
                      <span style={{ fontSize: '11px', color: '#888' }}>{formatDate(h.valued_at)}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px', textTransform: 'capitalize' }}>{h.method.replace('_', ' ')}</div>
                    {h.reason && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{h.reason}</div>}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setHistoryModal(null)}
                style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#333' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePanel;
