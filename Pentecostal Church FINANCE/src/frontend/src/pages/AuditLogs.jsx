import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ACTION_COLORS = {
  create: ['#d1fae5', '#059669'], update: ['#dbeafe', '#2563eb'], delete: ['#fee2e2', '#dc2626'],
  approve: ['#d1fae5', '#059669'], reject: ['#fee2e2', '#dc2626'],
  reset_password: ['#fef3c7', '#d97706'], login: ['#ede9fe', '#7c3aed'],
};

export default function AuditLogs() {
  const { user } = useAuth();
  const role = user?.role;

  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  if (role !== 'admin' && role !== 'auditor') return <Navigate to="/dashboard" replace />;

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (filterAction) params.append('action', filterAction);
      if (filterEntity) params.append('entity', filterEntity);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await api.get(`/audit-logs?${params}`);
      setLogs(res.data.logs || []);
      setPagination(res.data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const truncateDetails = (details) => {
    if (!details) return '-';
    const str = typeof details === 'string' ? details : JSON.stringify(details);
    return str.length > 80 ? str.substring(0, 80) + '...' : str;
  };

  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredLogs = logs.filter((log) => {
    const matchAction = !filterAction ||
      (log.action || '').toLowerCase().includes(filterAction.toLowerCase());
    const matchEntity = !filterEntity ||
      (log.entity || '').toLowerCase().includes(filterEntity.toLowerCase());
    return matchAction && matchEntity;
  });

  return (
    <div>
      <div className="page-header">
        <h2>Audit Trail</h2>
        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6b7280' }}>{pagination.total} total log entries</p>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Action</label>
          <select value={filterAction} onChange={e => { setFilterAction(e.target.value); setPage(1); }}>
            <option value="">All Actions</option>
            {['create','update','delete','approve','reject','login','reset_password'].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Entity</label>
          <select value={filterEntity} onChange={e => { setFilterEntity(e.target.value); setPage(1); }}>
            <option value="">All Entities</option>
            {['users','transactions','requisitions','assets','system'].map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>From Date</label>
          <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} />
        </div>
        <div className="form-group">
          <label>To Date</label>
          <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} />
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <div className="loading">Loading audit logs…</div>
      ) : logs.length === 0 ? (
        <div className="empty-state"><p>No audit logs found.</p></div>
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date / Time</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Before</th>
                  <th>After</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <>
                    <tr key={log._id || idx} onClick={() => setExpandedRow(expandedRow === log._id ? null : log._id)} style={{ cursor: 'pointer' }}>
                      <td>{fmtDate(log.createdAt)}</td>
                      <td>{log.user_id?.name || '–'}</td>
                      <td><span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{log.role || log.user_id?.role || '–'}</span></td>
                      <td><ActionBadge action={log.action} /></td>
                      <td style={{ textTransform: 'capitalize' }}>{log.entity}</td>
                      <td style={{ color: '#6b7280', fontSize: '0.8rem' }}>{log.previousValue ? truncate(log.previousValue) : '–'}</td>
                      <td style={{ color: '#6b7280', fontSize: '0.8rem' }}>{log.newValue ? truncate(log.newValue) : '–'}</td>
                      <td style={{ color: '#6b7280', fontSize: '0.8rem' }}>{truncate(log.details)}</td>
                    </tr>
                    {expandedRow === log._id && (
                      <tr key={`exp-${log._id}`} style={{ background: '#f9fafb' }}>
                        <td colSpan={8} style={{ padding: '1rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '0.8rem', color: '#374151' }}>BEFORE</p>
                              <pre style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem', overflowX: 'auto', margin: 0 }}>
                                {log.previousValue ? JSON.stringify(log.previousValue, null, 2) : 'null'}
                              </pre>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '0.8rem', color: '#374151' }}>AFTER</p>
                              <pre style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem', overflowX: 'auto', margin: 0 }}>
                                {log.newValue ? JSON.stringify(log.newValue, null, 2) : 'null'}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem', alignItems: 'center' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-outline" style={{ padding: '0.4rem 0.9rem' }}>← Prev</button>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Page {pagination.page} of {pagination.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="btn btn-outline" style={{ padding: '0.4rem 0.9rem' }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
