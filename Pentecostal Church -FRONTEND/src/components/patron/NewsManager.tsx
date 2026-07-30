import React, { useState, useEffect, useCallback } from 'react';
import { getBaseUrl } from '../../config/environment';

interface ChurchEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  isActive: boolean;
}

const CATEGORIES = ['Service', 'Revival', 'Concert', 'Conference', 'Outreach', 'Other'];

const EMPTY_FORM = { title: '', description: '', date: '', location: 'RPC Nyamira', category: 'Service' };

const categoryColor: Record<string, string> = {
  Service: '#6d28d9', Revival: '#dc2626', Concert: '#0891b2',
  Conference: '#d97706', Outreach: '#059669', Other: '#6b7280',
};

export default function NewsManager() {
  const [events, setEvents]       = useState<ChurchEvent[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [form, setForm]           = useState({ ...EMPTY_FORM });
  const [msg, setMsg]             = useState('');
  const [err, setErr]             = useState('');
  const [deleting, setDeleting]   = useState<string | null>(null);

  const base = getBaseUrl();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/events`, { credentials: 'include' });
      if (res.ok) setEvents(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [base]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const flash = (m: string, isErr = false) => {
    if (isErr) setErr(m); else setMsg(m);
    setTimeout(() => { setMsg(''); setErr(''); }, 3500);
  };

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setEditId(null); setShowForm(true); };
  const openEdit   = (ev: ChurchEvent) => {
    setForm({
      title:       ev.title,
      description: ev.description,
      date:        ev.date.slice(0, 16),   // datetime-local value
      location:    ev.location,
      category:    ev.category,
    });
    setEditId(ev._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const url    = editId ? `${base}/api/events/${editId}` : `${base}/api/events`;
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Error');
      flash(editId ? 'Event updated.' : 'Event created.');
      setShowForm(false);
      fetchEvents();
    } catch (e: any) {
      flash(e.message || 'Something went wrong', true);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    setDeleting(id);
    try {
      await fetch(`${base}/api/events/${id}`, { method: 'DELETE', credentials: 'include' });
      flash('Event deleted.');
      fetchEvents();
    } catch { flash('Could not delete event', true); }
    finally { setDeleting(null); }
  };

  const toggleActive = async (ev: ChurchEvent) => {
    try {
      await fetch(`${base}/api/events/${ev._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !ev.isActive }),
      });
      fetchEvents();
    } catch { /* silent */ }
  };

  // ── Inline styles (self-contained, no extra CSS file needed) ──

  const s: Record<string, React.CSSProperties> = {
    wrap:      { padding: '24px', maxWidth: 860, margin: '0 auto' },
    header:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    h2:        { margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' },
    addBtn:    { background: '#482078', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
    msg:       { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 },
    errBox:    { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 },
    card:      { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 18px', marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 14 },
    cardAccent:{ width: 4, borderRadius: 4, alignSelf: 'stretch', flexShrink: 0 },
    cardBody:  { flex: 1, minWidth: 0 },
    cardTitle: { margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#111827' },
    cardMeta:  { fontSize: 12, color: '#6b7280', marginBottom: 6, display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px' },
    cardDesc:  { fontSize: 13, color: '#4b5563', lineHeight: 1.6, margin: '6px 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' },
    cardBtns:  { display: 'flex', gap: 8 },
    editBtn:   { fontSize: 12, fontWeight: 600, color: '#482078', background: '#f5f0ff', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' },
    delBtn:    { fontSize: 12, fontWeight: 600, color: '#dc2626', background: '#fef2f2', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' },
    toggleBtn: { fontSize: 12, fontWeight: 600, color: '#374151', background: '#f3f4f6', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' },
    catBadge:  { fontSize: 10.5, fontWeight: 700, color: '#fff', borderRadius: 20, padding: '2px 9px', letterSpacing: 0.5 },
    empty:     { textAlign: 'center' as const, color: '#6b7280', padding: '40px 20px', border: '1px dashed #d1d5db', borderRadius: 12, fontSize: 14 },
    // Form overlay
    overlay:   { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
    modal:     { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' as const, padding: '28px 28px 32px' },
    modalH:    { margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#111827' },
    field:     { marginBottom: 14 },
    label:     { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 },
    input:     { width: '100%', boxSizing: 'border-box' as const, padding: '9px 11px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13.5, outline: 'none', background: '#f9fafb' },
    textarea:  { width: '100%', boxSizing: 'border-box' as const, padding: '9px 11px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13.5, outline: 'none', background: '#f9fafb', resize: 'vertical' as const, minHeight: 90 },
    formBtns:  { display: 'flex', gap: 10, marginTop: 6 },
    saveBtn:   { flex: 1, background: '#482078', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' },
    cancelBtn: { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' },
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h2 style={s.h2}>News &amp; Events</h2>
        <button style={s.addBtn} onClick={openCreate}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Event
        </button>
      </div>

      {msg && <div style={s.msg}>{msg}</div>}
      {err && <div style={s.errBox}>{err}</div>}

      {loading ? (
        <p style={{ color: '#6b7280', fontSize: 14 }}>Loading events…</p>
      ) : events.length === 0 ? (
        <div style={s.empty}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>No events yet</p>
          <p style={{ margin: '6px 0 0', fontSize: 13 }}>Click "Create Event" to add one. It will appear on the homepage automatically.</p>
        </div>
      ) : (
        events.map(ev => (
          <div key={ev._id} style={{ ...s.card, opacity: ev.isActive ? 1 : 0.55 }}>
            <div style={{ ...s.cardAccent, background: categoryColor[ev.category] || '#6b7280' }} />
            <div style={s.cardBody}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ ...s.catBadge, background: categoryColor[ev.category] || '#6b7280' }}>{ev.category}</span>
                {!ev.isActive && <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>Hidden</span>}
              </div>
              <p style={s.cardTitle}>{ev.title}</p>
              <div style={s.cardMeta}>
                <span>📅 {new Date(ev.date).toLocaleDateString('en-KE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <span>📍 {ev.location}</span>
              </div>
              <p style={s.cardDesc}>{ev.description}</p>
              <div style={s.cardBtns}>
                <button style={s.editBtn} onClick={() => openEdit(ev)}>Edit</button>
                <button style={s.toggleBtn} onClick={() => toggleActive(ev)}>{ev.isActive ? 'Hide' : 'Show'}</button>
                <button style={s.delBtn} onClick={() => handleDelete(ev._id)} disabled={deleting === ev._id}>
                  {deleting === ev._id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <div style={s.overlay} onClick={() => setShowForm(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalH}>{editId ? 'Edit Event' : 'New Event'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={s.field}>
                <label style={s.label}>Title *</label>
                <input style={s.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Event title" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Description *</label>
                <textarea style={s.textarea} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required placeholder="Describe the event…" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Date &amp; Time *</label>
                <input style={s.input} type="datetime-local" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Location</label>
                <input style={s.input} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="RPC Nyamira" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Category</label>
                <select style={s.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={s.formBtns}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" style={s.saveBtn} disabled={saving}>{saving ? 'Saving…' : editId ? 'Update Event' : 'Create Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
