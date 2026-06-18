import { useState } from 'react';
import api from '../services/api';

export default function FlagModal({ entity, entityId, onClose, onSuccess }) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a reason for flagging this record.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/flags', { entity, entity_id: entityId, comment });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit flag.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🚩</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.65)', marginBottom: '2px' }}>Auditor Action</p>
              <h2 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>Flag for Review</h2>
            </div>
          </div>
          <button onClick={onClose} style={closeBtn}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6 }}>
            Flagging this record will notify the Admin and Treasurer for review. Please provide a clear reason.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Reason / Comment</label>
              <textarea
                rows={4}
                placeholder="Describe why this record needs review..."
                value={comment}
                onChange={(e) => { setComment(e.target.value); setError(''); }}
                style={textareaStyle}
                required
              />
            </div>
            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0 0 1rem' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" disabled={loading} style={submitBtn}>
                {loading ? 'Submitting…' : '🚩 Submit Flag'}
              </button>
              <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed', inset: 0, zIndex: 1000,
  background: 'rgba(10,5,20,0.65)', backdropFilter: 'blur(6px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
};
const modal = {
  background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
  animation: 'fadeInUp 0.25s ease',
};
const header = {
  background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
  padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
};
const closeBtn = {
  background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
  width: '32px', height: '32px', cursor: 'pointer', color: '#fff',
  fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.5px', color: '#374151', marginBottom: '6px',
};
const textareaStyle = {
  width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e5e7eb',
  borderRadius: '10px', fontSize: '0.95rem', resize: 'vertical',
  fontFamily: 'Inter, sans-serif', color: '#111827', outline: 'none', boxSizing: 'border-box',
};
const submitBtn = {
  flex: 1, padding: '0.85rem', background: '#b91c1c', color: '#fff',
  border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
};
const cancelBtn = {
  flex: 1, padding: '0.85rem', background: 'transparent', color: '#6b7280',
  border: '1.5px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
};
