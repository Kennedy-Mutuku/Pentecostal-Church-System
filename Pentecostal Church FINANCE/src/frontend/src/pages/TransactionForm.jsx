import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function TransactionForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'cash_in',
    category: 'offering',
    source: 'cash',
    phone: '',
    amount: '',
    description: '',
  });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (user?.role !== 'treasurer') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0] || null);
  };

  const resetForm = () => {
    setFormData({
      type: 'cash_in',
      category: 'offering',
      source: 'cash',
      phone: '',
      amount: '',
      description: '',
    });
    setReceipt(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('type', formData.type);
      if (formData.type === 'cash_in') {
        data.append('category', formData.category);
      }
      data.append('source', formData.source);
      if (formData.source === 'mpesa') {
        data.append('phone', formData.phone);
      }
      data.append('amount', formData.amount);
      data.append('description', formData.description);
      if (receipt) {
        data.append('receipt', receipt);
      }

      await api.post('/transactions', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Transaction recorded successfully!');
      setTimeout(() => {
        navigate('/transactions');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Record Transaction</h1>
      </div>

      <div className="form-card">
        <h2>Record Transaction</h2>

        {error && <p className="auth-error">{error}</p>}
        {success && (
          <div>
            <p className="auth-success">{success}</p>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm}>Record Another</button>
              <button type="button" className="btn-primary" onClick={() => navigate('/transactions')}>Go Back</button>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="cash_in">Cash In</option>
                <option value="cash_out">Cash Out</option>
              </select>
            </div>

            {formData.type === 'cash_in' && (
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="offering">Offering</option>
                  <option value="tithe">Tithe</option>
                  <option value="thanksgiving">Thanksgiving</option>
                  <option value="aob">AOB</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Source</label>
              <select name="source" value={formData.source} onChange={handleChange} required>
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
              </select>
            </div>

            {formData.source === 'mpesa' && (
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0712345678"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Amount (KES)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Transaction details..."
              />
            </div>

            <div className="form-group">
              <label>Receipt</label>
              <input type="file" onChange={handleFileChange} accept="image/*,.pdf" />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Recording...' : 'Record Transaction'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/transactions')}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
