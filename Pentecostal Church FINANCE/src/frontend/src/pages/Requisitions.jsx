import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Requisitions() {
  const { user } = useAuth();
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [amountSpent, setAmountSpent] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const role = user?.role;

  useEffect(() => {
    fetchRequisitions();
  }, []);

  const fetchRequisitions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/requisitions');
      setRequisitions(res.data.requisitions || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requisitions.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    if (amount == null) return '-';
    return `KES ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'badge badge-pending',
      approved: 'badge badge-approved',
      rejected: 'badge badge-rejected',
      completed: 'badge badge-completed',
    };
    return map[status] || 'badge';
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/requisitions/${id}/approve`);
      fetchRequisitions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve requisition.');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/requisitions/${id}/reject`);
      fetchRequisitions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject requisition.');
    }
  };

  const openCompleteModal = (req) => {
    setSelectedReq(req);
    setAmountSpent('');
    setVoucher(null);
    setModalError('');
    setShowModal(true);
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');

    try {
      const data = new FormData();
      data.append('amount_spent', amountSpent);
      if (voucher) {
        data.append('voucher', voucher);
      }

      await api.put(`/requisitions/${selectedReq._id || selectedReq.id}/complete`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowModal(false);
      fetchRequisitions();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to complete requisition.');
    } finally {
      setModalLoading(false);
    }
  };

  if (!role) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Requisitions</h1>
        {role === 'treasurer' && (
          <Link to="/requisitions/new" className="btn-primary">New Requisition</Link>
        )}
      </div>

      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <div className="loading">Loading requisitions...</div>
      ) : requisitions.length === 0 ? (
        <div className="empty-state">
          <p>No requisitions found.</p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Requested By</th>
                <th>Reason</th>
                <th>Amount Requested</th>
                <th>Amount Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requisitions.map((req) => (
                <tr key={req._id || req.id}>
                  <td>{formatDate(req.date || req.createdAt)}</td>
                  <td>{req.requestedBy?.name || req.requestedBy || '-'}</td>
                  <td>{req.reason || '-'}</td>
                  <td>{formatAmount(req.amount_requested || req.amountRequested)}</td>
                  <td>{formatAmount(req.amount_spent || req.amountSpent)}</td>
                  <td>
                    <span className={getStatusBadge(req.status)}>
                      {req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : '-'}
                    </span>
                  </td>
                  <td>
                    <div className="action-row">
                      {(role === 'chairperson' || role === 'patron') && req.status === 'pending' && (
                        <>
                          <button className="btn-primary btn-sm" onClick={() => handleApprove(req._id || req.id)}>Approve</button>
                          <button className="btn-danger btn-sm" onClick={() => handleReject(req._id || req.id)}>Reject</button>
                        </>
                      )}
                      {role === 'treasurer' && req.status === 'approved' && (
                        <button className="btn-primary btn-sm" onClick={() => openCompleteModal(req)}>Complete</button>
                      )}
                      {role?.toLowerCase()?.trim() === 'auditor' && (
                        <button className="btn-secondary btn-sm" style={{borderColor: '#E53E3E', color: '#E53E3E'}} onClick={() => {
                          window.alert(`Flagged Requisition ID: ${req._id || req.id} for review.\n\n(Note: The backend endpoint for this flag feature is not yet implemented.)`);
                        }}>Flag for Review</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <h2>Complete Requisition</h2>

            {modalError && <p className="auth-error">{modalError}</p>}

            <form onSubmit={handleComplete}>
              <div className="form-group">
                <label>Amount Spent (KES)</label>
                <input
                  type="number"
                  value={amountSpent}
                  onChange={(e) => setAmountSpent(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Voucher</label>
                <input type="file" onChange={(e) => setVoucher(e.target.files[0] || null)} accept="image/*,.pdf" />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={modalLoading}>
                  {modalLoading ? 'Submitting...' : 'Complete'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
