import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ─── Bottom-Sheet Modal ──────────────────────────────────────────────────────
function TaskModal({ task, onClose }) {
  useEffect(() => {
    if (task) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [task]);

  if (!task) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(10,5,20,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 -8px 40px rgba(0,0,0,0.3)', animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#e5e7eb' }} />
        </div>
        <div style={{ background: 'linear-gradient(135deg,#730051 0%,#4a0033 100%)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '8px 12px 0', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ color: '#ffffff', flexShrink: 0 }}>{task.icon}</div>
            <div>
              <p style={{ margin: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.65)', marginBottom: '3px' }}>Treasurer Task</p>
              <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontFamily: '"Merriweather",Georgia,serif', lineHeight: 1.3 }}>{task.title}</h2>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '0.5rem' }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>{task.description}</p>
          {task.fields && (
            <form onSubmit={e => { e.preventDefault(); alert('Submitted! (Connect to backend)'); onClose(); }}>
              {task.fields.map((f, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#374151', marginBottom: '5px' }}>{f.label}</label>
                  {f.type === 'select' ? (
                    <select style={inputStyle}>{f.options.map(o => <option key={o}>{o}</option>)}</select>
                  ) : f.type === 'textarea' ? (
                    <textarea rows={3} placeholder={f.placeholder} style={{ ...inputStyle, resize: 'vertical' }} />
                  ) : f.type === 'file' ? (
                    <input type="file" accept="image/*,.pdf" style={{ ...inputStyle, padding: '0.4rem' }} />
                  ) : (
                    <input type={f.type || 'text'} placeholder={f.placeholder} style={inputStyle} />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" style={primaryBtn}>Submit</button>
                <button type="button" onClick={onClose} style={outlineBtn}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Style tokens ─────────────────────────────────────────────────────────────
const inputStyle = { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', fontFamily: 'Inter,sans-serif', color: '#111827', background: '#f9fafb', WebkitAppearance: 'none' };
const primaryBtn = { flex: 1, padding: '0.9rem', background: '#730051', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' };
const outlineBtn = { flex: 1, padding: '0.9rem', background: 'transparent', color: '#730051', border: '2px solid #730051', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' };

// ─── Task definitions ─────────────────────────────────────────────────────────
const TASKS = [
  { id: 'transactions', title: 'Manage Transactions', description: 'Create and update cash-in or cash-out transactions not fetched by the API paybill — e.g. cash handovers and assets leasing entries.', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, gridIcon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, fields: [{ label: 'Transaction Type', type: 'select', options: ['Cash In', 'Cash Out', 'Asset Leasing'] }, { label: 'Amount (KES)', type: 'number', placeholder: 'e.g. 5000' }, { label: 'Description', type: 'textarea', placeholder: 'Describe the transaction...' }, { label: 'Date', type: 'date' }] },
  { id: 'expenditures', title: 'Expenditures & Receipts', description: 'Record all money going out of the union with supporting receipts or proof of payment where available.', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>, gridIcon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>, fields: [{ label: 'Category', type: 'select', options: ['Utilities', 'Events', 'Stationery', 'Travel', 'Other'] }, { label: 'Amount (KES)', type: 'number', placeholder: 'e.g. 2000' }, { label: 'Paid To', type: 'text', placeholder: 'Vendor or person name' }, { label: 'Description', type: 'textarea', placeholder: 'Purpose...' }, { label: 'Upload Receipt', type: 'file' }] },
  { id: 'disbursements', title: 'Disbursements & STK', description: 'Send money to individuals via STK Push or initiate direct mobile money transfers with clear descriptions attached.', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, gridIcon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, fields: [{ label: 'Recipient Name', type: 'text', placeholder: 'Full name' }, { label: 'Phone Number', type: 'tel', placeholder: '07XXXXXXXX' }, { label: 'Amount (KES)', type: 'number', placeholder: 'e.g. 1500' }, { label: 'Reason / Description', type: 'textarea', placeholder: 'Purpose...' }] },
  { id: 'reports', title: 'Financial Reports', description: "Generate and download comprehensive income and expense statements to review the union's financial health.", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, gridIcon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, fields: [{ label: 'Report Type', type: 'select', options: ['Income Statement', 'Expense Report', 'Balance Sheet', 'Full Summary'] }, { label: 'From Date', type: 'date' }, { label: 'To Date', type: 'date' }, { label: 'Format', type: 'select', options: ['PDF', 'Excel', 'CSV'] }] },
  { id: 'assets', title: 'Asset Management', description: "Register, monitor, and formally manage the union's physical assets including equipment, furniture, and more.", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>, gridIcon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>, fields: [{ label: 'Asset Name', type: 'text', placeholder: 'e.g. Projector' }, { label: 'Category', type: 'select', options: ['Electronics', 'Furniture', 'Vehicle', 'Musical Equipment', 'Other'] }, { label: 'Acquisition Date', type: 'date' }, { label: 'Estimated Value (KES)', type: 'number', placeholder: 'e.g. 45000' }, { label: 'Condition', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'] }, { label: 'Notes', type: 'textarea', placeholder: 'Additional details...' }] },
  { id: 'audit', title: 'Audit & Transparency', description: 'Review all system activity logs, track financial operations, and ensure complete accountability.', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, gridIcon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, fields: [{ label: 'Log Type', type: 'select', options: ['All', 'Transactions', 'Logins', 'Modifications', 'Deletions'] }, { label: 'From Date', type: 'date' }, { label: 'To Date', type: 'date' }] },
];

// Feature list for public landing
const FEATURES = [
  { icon: '🔐', title: 'Role-Based Access', desc: 'Only authorised treasurers can access financial records and operations.' },
  { icon: '📊', title: 'Real-Time Reporting', desc: 'Generate income statements, expense summaries, and balance sheets instantly.' },
  { icon: '📱', title: 'M-Pesa Integration', desc: 'Send funds via STK Push directly from the dashboard with full audit trail.' },
  { icon: '🧾', title: 'Receipt Management', desc: 'Upload and store digital receipts for every expenditure on record.' },
  { icon: '📦', title: 'Asset Tracking', desc: 'Maintain an up-to-date register of all physical assets owned by the union.' },
  { icon: '🔍', title: 'Audit Logs', desc: 'Every action is logged for complete transparency and accountability.' },
];

// ─── Shared Footer ────────────────────────────────────────────────────────────
function RPCFooter() {
  return (
    <footer style={{ background: '#730051', color: '#fff', paddingTop: '3.5rem', paddingBottom: '1rem' }}>
      <div className="footer-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2.5rem', padding: '0 1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
            <img src="/rpc-logo.png" alt="Logo" style={{ width: '46px', background: 'white', padding: '2px', borderRadius: '4px' }} />
            <div><h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>RPC Nyamira</h3><p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.85 }}>Main Campus</p></div>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.9, textAlign: 'justify' }}>Producing relevant and effective Christians to the church and society through equipping, empowering and offering a conducive environment for effective living.</p>
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', opacity: 0.9 }}>
            {['Home', 'About Us', 'Ministries', 'Bible Study', 'Library', 'Constitution'].map(l => <li key={l}><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>Contact Us</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.1rem', fontSize: '0.88rem', opacity: 0.9 }}>
            <li style={{ display: 'flex', gap: '0.7rem' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>P.O BOX 408-40200<br />Kisii, Kenya</span></li>
            <li style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>+254 748 290 170</span></li>
            <li style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span style={{ wordBreak: 'break-word' }}>ksuchristianunion@gmail.com</span></li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>Connect With Us</h3>
          <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
              <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></>,
              <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></>,
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />,
            ].map((path, i) => (
              <div key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{path}</svg>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', opacity: 0.9 }}>Affiliated to <strong>FOCUS Kenya</strong></p>
          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', opacity: 0.7 }}>Fellowship of Christian Unions</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', padding: '1.2rem 1.5rem 0.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', opacity: 0.75, flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Rikuruma Pentecostal Church &copy; {new Date().getFullYear()} | Treasurer Portal</span>
          <span>Established 2002</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Public Landing (shown when NOT authenticated) ────────────────────────────
function PublicLanding() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0.9rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/rpc-logo.png" alt="RPC Logo" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
          <div>
            <h1 className="nav-title" style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1a202c', lineHeight: 1.2 }}>Rikuruma Pentecostal Church</h1>
            <p className="nav-motto" style={{ margin: 0, fontSize: '0.72rem', color: '#730051', fontStyle: 'italic' }}>Transforming Campus, Impacting Nations</p>
          </div>
        </div>
        <Link to="/login" style={{ background: '#730051', color: '#fff', textDecoration: 'none', padding: '0.55rem 1.2rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
          Login
        </Link>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(to bottom right, #730051 0%, #4a0033 60%, #1a0020 100%)',
        color: '#fff', padding: '6rem 1.5rem 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', borderRadius: '100px', padding: '0.35rem 1rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            🔒 Treasurer Finance Portal
          </span>
          <h1 className="hero-title" style={{ fontSize: '3.2rem', fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, lineHeight: 1.2, margin: '0 0 1.5rem', letterSpacing: '-1px' }}>
            Secure Financial Management for RPC
          </h1>
          <p className="hero-sub-pub" style={{ fontSize: '1.15rem', opacity: 0.85, lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '580px', margin: '0 auto 2.5rem' }}>
            Streamline your treasury tasks, manage collections, and maintain accurate financial records in one centralized dashboard.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ background: '#ffffff', color: '#1a0020', textDecoration: 'none', padding: '0.9rem 2.2rem', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.3px', transition: 'opacity 0.2s' }}>
              Get Started →
            </Link>
            <a href="#features" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', padding: '0.9rem 2.2rem', borderRadius: '10px', fontWeight: 600, fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '5rem 1.5rem', background: '#fff', flex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: '"Merriweather", Georgia, serif', color: '#111827', margin: '0 0 0.75rem' }}>Everything the Treasurer Needs</h2>
          <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '3.5rem', maxWidth: '520px', margin: '0 auto 3.5rem', lineHeight: 1.7 }}>Built specifically for the RPC Treasurer role — secure, simple, and powerful.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: '#fdf4f9', border: '1px solid #f5e6f0', borderRadius: '14px', padding: '2rem', textAlign: 'left', transition: 'box-shadow 0.2s' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — Finance Background Image */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(to right, rgba(115, 0, 81, 0.92), rgba(74, 0, 51, 0.82)), url("https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1600&q=80") center/cover no-repeat',
        padding: '6rem 1.5rem',
        textAlign: 'center',
        color: '#fff',
        overflow: 'hidden',
      }}>
        {/* Decorative circle overlays */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.75 }}>
            🔐 Authorised Access Only
          </p>
          <h2 style={{ fontSize: '2.4rem', fontFamily: '"Merriweather", Georgia, serif', margin: '0 0 1rem', lineHeight: 1.25 }}>
            Ready to Manage Finances?
          </h2>
          <p style={{ opacity: 0.88, fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Log in with your authorised Treasurer account to access the full dashboard and all financial tools.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ background: '#fff', color: '#730051', textDecoration: 'none', padding: '0.9rem 2.3rem', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', border: '2px solid transparent', transition: 'all 0.2s' }}>
              Get Started →
            </Link>
            <a href="#features" style={{ background: 'transparent', color: '#fff', textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '10px', fontWeight: 600, fontSize: '1rem', border: '2px solid rgba(255,255,255,0.4)' }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      <RPCFooter />
    </div>
  );
}

// ─── Authenticated Portal (shown when logged in as treasurer) ─────────────────
function AuthenticatedPortal({ onLogout }) {
  const [activeTask, setActiveTask] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* Sticky Header */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff', borderBottom: '1px solid #e2e8f0', backdropFilter: scrolled ? 'blur(10px)' : 'none', transition: 'all 0.3s ease', boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none', padding: '0.8rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <img src="/rpc-logo.png" alt="RPC Logo" style={{ width: '42px', height: '42px', objectFit: 'contain', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <h1 className="nav-title" style={{ fontSize: '1rem', fontWeight: 800, color: '#1a202c', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Rikuruma Pentecostal Church</h1>
            <p className="nav-motto" style={{ fontSize: '0.72rem', color: '#730051', fontStyle: 'italic', margin: 0 }}>Transforming Campus, Impacting Nations</p>
          </div>
        </div>
        <button onClick={onLogout} style={{ background: '#730051', color: '#fff', border: 'none', padding: '0.55rem 1.2rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Logout
        </button>
      </nav>

      {/* Hero */}
      <section className="hero-section" style={{ position: 'relative', background: 'linear-gradient(to bottom, rgba(10,5,20,0.75) 0%, rgba(74,144,164,0.55) 55%, rgba(255,255,255,0.85) 85%, rgba(255,255,255,1) 100%), url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80") center/cover no-repeat', padding: '8rem 2rem 10rem', textAlign: 'center', color: '#fff' }}>
        <h4 className="hero-sub" style={{ fontSize: '0.85rem', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
          The RPC Finance! Where Every Shilling Matters
        </h4>
        <h1 className="hero-title" style={{ fontSize: '3.8rem', fontFamily: '"Merriweather",Georgia,serif', fontWeight: 700, margin: 0, letterSpacing: '-1px', lineHeight: 1.2 }}>
          Treasurer Financial<br />Operations
        </h1>
      </section>

      {/* Tasks */}
      <section className="tasks-section" style={{ padding: '4rem 1.5rem 6rem', background: '#fff', textAlign: 'center', flex: 1 }}>
        <h2 className="welcome-heading" style={{ fontSize: '2.2rem', fontFamily: '"Merriweather",Georgia,serif', margin: '0 0 14px', color: '#111827', letterSpacing: '-0.5px' }}>
          Welcome, Dear Treasurer.
        </h2>
        <p className="welcome-sub" style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 3rem', fontWeight: 400 }}>
          Make your work easier, your communication clearer, and your impact stronger. Everything you need to serve, connect, and grow is right here.
        </p>
        <div className="tasks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, borderTop: '1px solid #f3f4f6', maxWidth: '1100px', margin: '0 auto' }}>
          {TASKS.map((task, i) => (
            <div key={task.id} className="task-card" onClick={() => setActiveTask(task)} style={{ padding: '2.8rem 1.8rem', borderRight: (i + 1) % 3 !== 0 ? '1px solid #f3f4f6' : 'none', borderBottom: '1px solid #f3f4f6', textAlign: 'center', background: '#fff', cursor: 'pointer' }}>
              <div style={{ marginBottom: '1.2rem', color: '#730051', display: 'flex', justifyContent: 'center' }}>{task.gridIcon}</div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', margin: '0 0 0.75rem', letterSpacing: '0.5px' }}>{task.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6, margin: '0 0 1.2rem' }}>{task.description}</p>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#730051', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '2px solid #730051', paddingBottom: '2px' }}>Open Task →</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#9ca3af' }}>Tap any card to open its form</p>
      </section>

      <RPCFooter />
      <TaskModal task={activeTask} onClose={() => setActiveTask(null)} />
    </div>
  );
}

// ─── Root: decides which view to render ──────────────────────────────────────
export default function TreasurerPortal() {
  const { user, token, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Show nothing while auth initialises (avoids flash)
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#730051', fontSize: '1rem', fontWeight: 600 }}>
        Loading…
      </div>
    );
  }

  /* 
  // 🔐 PROTECTIONS (Currently Bypassed)
  // If authenticated as treasurer or admin → full portal
  if (token && (user?.role === 'treasurer' || user?.role === 'admin')) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:wght@400;700&display=swap');
          * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
          @keyframes slideUp { from { opacity:0; transform:translateY(60px); } to { opacity:1; transform:translateY(0); } }
          .task-card { transition: all 0.22s ease !important; }
          .task-card:active { transform: scale(0.97); background: #fdf4f9 !important; }
          @media (hover:hover) { .task-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(74,144,164,0.15) !important; } }
          @media (max-width:640px) {
            .hero-title { font-size:2.2rem !important; }
            .hero-sub   { font-size:0.75rem !important; }
            .hero-section { padding:5.5rem 1.2rem 7rem !important; }
            .welcome-heading { font-size:1.8rem !important; }
            .tasks-section { padding:2.5rem 1rem 4rem !important; }
            .tasks-grid { grid-template-columns:1fr !important; gap:0.75rem !important; border:none !important; }
            .footer-grid { grid-template-columns:1fr !important; gap:2rem !important; }
            .nav-title { font-size:0.9rem !important; }
            .nav-motto { display:none !important; }
          }
          @media (min-width:641px) and (max-width:1024px) {
            .tasks-grid { grid-template-columns:repeat(2,1fr) !important; }
            .footer-grid { grid-template-columns:repeat(2,1fr) !important; }
          }
        `}</style>
        <AuthenticatedPortal onLogout={handleLogout} />
      </>
    );
  }

  // Otherwise → public landing
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:wght@400;700&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @media (max-width:640px) {
          .hero-title { font-size:2rem !important; }
          .hero-sub-pub { font-size:1rem !important; }
          .nav-title { font-size:0.88rem !important; }
          .nav-motto { display:none !important; }
          .footer-grid { grid-template-columns:1fr !important; gap:2rem !important; }
        }
        @media (min-width:641px) and (max-width:1024px) {
          .footer-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
      `}</style>
      <PublicLanding />
    </>
  );
  */

  // 🔓 BYPASS: Always show the Authenticated Portal
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:wght@400;700&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes slideUp { from { opacity:0; transform:translateY(60px); } to { opacity:1; transform:translateY(0); } }
        .task-card { transition: all 0.22s ease !important; }
        .task-card:active { transform: scale(0.97); background: #fdf4f9 !important; }
        @media (hover:hover) { .task-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(74,144,164,0.15) !important; } }
        @media (max-width:640px) {
          .hero-title { font-size:2.2rem !important; }
          .hero-sub   { font-size:0.75rem !important; }
          .hero-section { padding:5.5rem 1.2rem 7rem !important; }
          .welcome-heading { font-size:1.8rem !important; }
          .tasks-section { padding:2.5rem 1rem 4rem !important; }
          .tasks-grid { grid-template-columns:1fr !important; gap:0.75rem !important; border:none !important; }
          .footer-grid { grid-template-columns:1fr !important; gap:2rem !important; }
          .nav-title { font-size:0.9rem !important; }
          .nav-motto { display:none !important; }
        }
        @media (min-width:641px) and (max-width:1024px) {
          .tasks-grid { grid-template-columns:repeat(2,1fr) !important; }
          .footer-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
      `}</style>
      <AuthenticatedPortal onLogout={handleLogout} />
    </>
  );
}





