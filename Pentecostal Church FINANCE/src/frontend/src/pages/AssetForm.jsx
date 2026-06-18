import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function AssetForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get('id');
  const isEdit = Boolean(assetId);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    purchase_amount: '',
    purchase_date: new Date().toISOString().split('T')[0],
    valuation: '',
    docket: '',
    condition: 'good',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dockets = [
    'Chairperson', 'Vice Chairperson', 'Secretary', 'Publicity secretary', 
    'Treasurer', 'Worship Coordinator', 'Boards Coordinator', 'Missions Coordinator', 
    'Bible study Coordinator', 'Discipleship Coordinator', 'Other'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchAsset();
    }
  }, [assetId]);

  const fetchAsset = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get(`/assets/${assetId}`);
      const asset = res.data.asset || res.data;
      setFormData({
        name: asset.name || '',
        description: asset.description || '',
        purchase_amount: asset.purchase_amount || '',
        purchase_date: asset.purchase_date ? new Date(asset.purchase_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        valuation: asset.valuation || '',
        docket: asset.docket || '',
        condition: asset.condition || 'good',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load asset.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        purchase_amount: Number(formData.purchase_amount),
        purchase_date: formData.purchase_date,
        valuation: Number(formData.valuation),
        docket: formData.docket,
        condition: formData.condition,
      };

      if (!payload.docket) {
        throw new Error('Please select a Docket.');
      }

      if (isEdit) {
        await api.put(`/assets/${assetId}`, payload);
        setSuccess('Asset updated successfully!');
      } else {
        // When adding new, valuation starts equal to purchase_amount unless specified
        if (!payload.valuation) payload.valuation = payload.purchase_amount;
        await api.post('/assets', payload);
        setSuccess('Asset added successfully!');
      }

      setTimeout(() => {
        navigate('/assets');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save asset.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="loading">Loading asset...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Re-Value Asset' : 'Onboard New Asset'}</h1>
      </div>

      <div className="form-card">
        <h2>{isEdit ? 'Current Valuation Update' : 'Asset Onboarding Details'}</h2>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Docket / Department</label>
              <select 
                name="docket" 
                value={formData.docket} 
                onChange={handleChange} 
                className="form-control"
                required
              >
                <option value="">-- Choose Docket --</option>
                {dockets.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Asset Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Projector, Sound Mixer"
                required
                disabled={isEdit}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Purchase Amount (KES)</label>
                <input
                  type="number"
                  name="purchase_amount"
                  value={formData.purchase_amount}
                  onChange={handleChange}
                  placeholder="Price when bought"
                  required
                  disabled={isEdit}
                />
              </div>

              <div className="form-group">
                <label>Purchase Date</label>
                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  required
                  disabled={isEdit}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Current Valuation (KES)</label>
              <input
                type="number"
                name="valuation"
                value={formData.valuation}
                onChange={handleChange}
                placeholder="Current market value"
                min="0"
                step="0.01"
                required
              />
              {isEdit && <small className="form-info">Update this field to record appreciation or depreciation.</small>}
            </div>

            <div className="form-group">
              <label>Current Condition</label>
              <select name="condition" value={formData.condition} onChange={handleChange} required>
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Notes / Specification</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Model numbers, serials, or current status..."
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (isEdit ? 'Update Valuation' : 'Confirm Onboarding')}
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/assets')}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
