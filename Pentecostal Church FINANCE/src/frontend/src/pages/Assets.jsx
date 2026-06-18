import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { PlusCircle } from 'lucide-react';

export default function Assets() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDocket, setFilterDocket] = useState('All');
  const [showOnboard, setShowOnboard] = useState(false);

  const dockets = [
    'All', 'Chairperson', 'Vice Chairperson', 'Secretary', 'Publicity secretary', 
    'Treasurer', 'Worship Coordinator', 'Boards Coordinator', 'Missions Coordinator', 
    'Bible study Coordinator', 'Discipleship Coordinator', 'Other'
  ];

  const role = (user?.financeRole || user?.role || 'treasurer').toLowerCase();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/assets');
      // Backend returns a plain array directly
      setAssets(Array.isArray(res.data) ? res.data : (res.data.assets || []));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assets.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateValue = async (id, currentValue) => {
    const newValue = window.prompt('Enter new valuation (KES):', currentValue);
    if (!newValue || isNaN(newValue)) return;

    try {
      // Backend uses PUT for updates
      await api.put(`/assets/${id}`, { valuation: Number(newValue) });
      fetchAssets();
    } catch (err) {
      alert('Failed to update asset value.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await api.delete(`/assets/${id}`);
      fetchAssets();
    } catch (err) {
      alert('Failed to delete asset.');
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (asset.description && asset.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDocket = filterDocket === 'All' || asset.docket === filterDocket;
    return matchesSearch && matchesDocket;
  });

  return (
    <div className="assets-container-institutional">
      <style>{`
        .executive-header-refined {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 24px !important;
          margin-bottom: 30px !important;
          background: #ffffff !important;
          border-radius: 16px !important;
          border-bottom: 2px solid rgba(115, 0, 81, 0.1) !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03) !important;
          visibility: visible !important;
          opacity: 1 !important;
          margin-top: 15px !important; 
        }
        .header-title-block h1 {
          font-size: 1.8rem !important;
          font-weight: 900 !important;
          color: #730051 !important;
          margin: 0 !important;
        }
        .header-meta-info {
          font-size: 0.9rem !important;
          color: #64748b !important;
          margin: 4px 0 0 !important;
        }
        .onboard-btn-fixed {
          background: #730051 !important;
          color: white !important;
          display: flex !important;
          align-items: center !important; gap: 10px !important;
          padding: 12px 24px !important; border-radius: 12px !important;
          font-weight: 800 !important; border: none !important;
          box-shadow: 0 4px 12px rgba(115, 0, 81, 0.2) !important;
          cursor: pointer !important;
        }
      `}</style>

      <div className="page-header executive-header-refined">
        <div className="header-title-block">
          <h1>Fixed Assets & Inventory</h1>
          <p className="header-meta-info">Institutional tracking of ministry capital items</p>
        </div>
        
        {(role === 'admin' || role === 'treasurer') && (
          <Link to="/assets/new" className="onboard-btn-fixed">
            <PlusCircle size={18} />
            <span>Onboard New Asset</span>
          </Link>
        )}
      </div>
      
      {error && (
        <div className="auth-error" style={{ margin: '0 24px 20px', padding: '15px', background: '#ffebee', color: '#c62828', borderRadius: '8px', border: '1px solid #ef5350' }}>
          <strong>Error loading data:</strong> {error}
        </div>
      )}

      <div className="filter-bar-executive">
        <input 
          type="text" 
          placeholder="Search by asset name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-premium"
        />
        <select 
          value={filterDocket}
          onChange={(e) => setFilterDocket(e.target.value)}
          className="docket-selector-premium"
        >
          {dockets.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div className="total-registered-summary">
          Total Registered: <strong>{filteredAssets.length} Items</strong>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading inventory...</div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Docket</th>
                <th>Name</th>
                <th>Purchase Date</th>
                <th>Purchase Price</th>
                <th>Current Value</th>
                <th>Trend</th>
                <th>Condition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => {
                const pPrice = asset.purchase_amount || 0;
                const cValue = asset.valuation || 0;
                const dep = pPrice - cValue;
                const depPercent = pPrice > 0 ? ((dep / pPrice) * 100).toFixed(1) : '0.0';
                
                return (
                  <tr key={asset._id}>
                    <td><span className="docket-tag-executive">{asset.docket}</span></td>
                    <td className="asset-name-cell">
                      <strong>{asset.name}</strong>
                      <br /><small>{asset.description}</small>
                    </td>
                    <td>{asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : '-'}</td>
                    <td>KES {pPrice.toLocaleString()}</td>
                    <td className="value-cell-highlight">KES {cValue.toLocaleString()}</td>
                    <td>
                      <span className={`trend-badge ${dep > 0 ? 'down' : 'stable'}`}>
                        {dep > 0 ? `▼ -${depPercent}%` : '▬ 0.0%'}
                      </span>
                    </td>
                    <td><span className={`condition-tag ${asset.condition?.toLowerCase()}`}>{asset.condition}</span></td>
                    <td>
                      <div className="action-cluster-executive">
                        <button className="btn-edit-value" onClick={() => handleUpdateValue(asset._id, cValue)}>Edit Value</button>
                        <button className="btn-delete-asset" onClick={() => handleDelete(asset._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
