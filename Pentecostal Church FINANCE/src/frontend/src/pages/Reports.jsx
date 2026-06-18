import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const allowedRoles = ['admin', 'treasurer', 'auditor', 'chair_accounts', 'chairperson', 'patron'];

export default function Reports() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statement, setStatement] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const role = user?.role;

  const formatAmount = (amount) => {
    return `KES ${Number(amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatement(null);
    setCategories([]);

    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [statementRes, categoriesRes] = await Promise.all([
        api.get('/reports/statement', { params }),
        api.get('/reports/categories'),
      ]);

      setStatement(statementRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const maxCategoryTotal = categories.length > 0
    ? Math.max(...categories.map((c) => c.total))
    : 0;

  return (
    <div>
      <div className="page-header">
        <h2>Financial Reports</h2>
      </div>

      <form className="filter-bar" onSubmit={handleGenerate}>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary btn-sm">Generate</button>
        </div>
      </form>

      {error && <p className="auth-error">{error}</p>}

      {loading && <div className="loading">Generating report...</div>}

      {statement && (
        <>
          <div className="gradient-stats-grid">
            <div className="premium-stat-card income">
              <span className="stat-label">Total Income</span>
              <div className="stat-amount">{formatAmount(statement.summary?.total_income)}</div>
            </div>
            <div className="premium-stat-card expense">
              <span className="stat-label">Total Expenses</span>
              <div className="stat-amount">{formatAmount(statement.summary?.total_expenses)}</div>
            </div>
            <div className="premium-stat-card balance">
              <span className="stat-label">Net Balance</span>
              <div className="stat-amount">{formatAmount(statement.summary?.net_balance)}</div>
            </div>
          </div>

          <div className="report-section">
            <h3>Income / Expense Breakdown</h3>
            {statement.breakdown && statement.breakdown.length > 0 ? (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Total Amount</th>
                      <th>Transaction Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statement.breakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          {item._id?.type === 'cash_in' ? 'Cash In' : 'Cash Out'}
                        </td>
                        <td>
                          {item._id?.category
                            ? item._id.category.charAt(0).toUpperCase() + item._id.category.slice(1)
                            : '-'}
                        </td>
                        <td>{formatAmount(item.total_amount)}</td>
                        <td>{item.transaction_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No breakdown data available.</p>
              </div>
            )}
          </div>

          {categories.length > 0 && (
            <div className="report-section">
              <h3>Category Breakdown</h3>
              <div className="category-chart">
                {categories.map((cat, idx) => (
                  <div key={idx} className="category-row">
                    <span className="category-label">
                      {cat._id
                        ? cat._id.charAt(0).toUpperCase() + cat._id.slice(1)
                        : 'Unknown'}
                    </span>
                    <div className="category-bar-bg">
                      <div
                        className="category-bar-fill"
                        style={{
                          width: maxCategoryTotal > 0
                            ? `${(cat.total / maxCategoryTotal) * 100}%`
                            : '0%',
                        }}
                      />
                    </div>
                    <span className="category-amount">
                      {formatAmount(cat.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
