import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function RequisitionForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reason, setReason] = useState('');
  const [amountRequested, setAmountRequested] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (user?.role !== 'treasurer') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/requisitions', {
        reason,
        amount_requested: Number(amountRequested),
      });

      setSuccess('Requisition created successfully!');
      setTimeout(() => {
        navigate('/requisitions');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create requisition.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Create Requisition</h1>
      </div>

      <div className="form-card">
        <h2>Create Requisition</h2>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="4"
                placeholder="Describe the purpose of this requisition..."
                required
              />
            </div>

            <div className="form-group">
              <label>Amount Requested (KES)</label>
              <input
                type="number"
                value={amountRequested}
                onChange={(e) => setAmountRequested(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Requisition'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/requisitions')}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
