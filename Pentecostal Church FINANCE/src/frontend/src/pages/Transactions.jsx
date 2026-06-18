import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { PlusCircle } from 'lucide-react';

const allowedRoles = ['admin', 'treasurer', 'auditor', 'chair_accounts', 'chairperson', 'patron'];

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtered, setFiltered] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  // Standardize role detection for subdomain absolute visibility
  const role = (user?.financeRole || user?.role || 'treasurer').toLowerCase();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (appliedFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (appliedFilters.type) params.type = appliedFilters.type;
      if (appliedFilters.category) params.category = appliedFilters.category;
      if (appliedFilters.startDate) params.startDate = appliedFilters.startDate;
      if (appliedFilters.endDate) params.endDate = appliedFilters.endDate;

      const res = await api.get('/transactions', { params });
      setTransactions(res.data.transactions || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setFiltered(true);
    fetchTransactions(filters);
  };

  const formatAmount = (amount) => {
    return `KES ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
  };

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="transactions-container-institutional">
      <style>{`
        .INSTITUTIONAL-COMMAND-HEADER {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 24px !important;
          margin-bottom: 25px !important;
          background: #ffffff !important;
          border-radius: 12px !important;
          border: 1px solid rgba(115, 0, 81, 0.1) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 100% !important;
          margin-top: 10px !important;
        }
        .INSTITUTIONAL-TITLE-TEXT {
          color: #730051 !important;
          margin: 0 !important;
          font-weight: 900 !important;
          font-size: 1.8rem !important;
        }
        .INSTITUTIONAL-ACTION-BTN {
          background: #730051 !important;
          color: #ffffff !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 12px 24px !important;
          border-radius: 10px !important;
          font-weight: 800 !important;
          text-decoration: none !important;
          border: none !important;
          cursor: pointer !important;
          box-shadow: 0 4px 12px rgba(115, 0, 81, 0.2) !important;
        }
      `}</style>

      <div className="INSTITUTIONAL-COMMAND-HEADER">
        <div>
          <h1 className="INSTITUTIONAL-TITLE-TEXT">Financial Ledger</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontWeight: '600' }}>Comprehensive transaction history</p>
        </div>
        <Link to="/transactions/new" className="INSTITUTIONAL-ACTION-BTN">
          <PlusCircle size={20} />
          <span>Record New Transaction</span>
        </Link>
      </div>

      <form className="filter-bar" onSubmit={handleApplyFilters}>
        <div className="form-group">
          <label>Type</label>
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="cash_in">Cash In</option>
            <option value="cash_out">Cash Out</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="offering">Offering</option>
            <option value="tithe">Tithe</option>
            <option value="thanksgiving">Thanksgiving</option>
            <option value="aob">AOB</option>
          </select>
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary btn-sm">Filter</button>
        </div>
      </form>

      {/* Table goes here... truncated for brevity but keeping logic */}
      {loading ? (
        <div className="loading">Loading ledger...</div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Source</th>
                <th>Recorded By</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{new Date(tx.date || tx.createdAt).toLocaleDateString()}</td>
                  <td>{tx.type === 'cash_in' ? 'Cash In' : 'Cash Out'}</td>
                  <td>{tx.category ? tx.category.charAt(0).toUpperCase() + tx.category.slice(1) : '-'}</td>
                  <td>{formatAmount(tx.amount)}</td>
                  <td>{tx.source ? tx.source.toUpperCase() : '-'}</td>
                  <td>{tx.recordedBy?.name || tx.recordedBy || '-'}</td>
                  <td>
                    {tx.receipt ? <a href={tx.receipt} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">View</a> : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
