// @ts-nocheck
import React, { useState } from 'react';
import axios from 'axios';
import cuLogo from '../assets/RPC logo updated document.png';
import { Link } from 'react-router-dom';
import styles from '../styles/signup.module.css';
import { getApiUrl } from '../config/environment';

type FormData = {
  username: string;
  phone: string;
  email: string;
  idNumber: string;
  gender: string;
  ageGroup: string;
  yearJoined: string;
  residence: string;
};

const EMPTY: FormData = {
  username: '',
  phone: '',
  email: '',
  idNumber: '',
  gender: '',
  ageGroup: '',
  yearJoined: '',
  residence: '',
};

const AdmissionAdmin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [admittedName, setAdmittedName] = useState('');
  const [errorField, setErrorField] = useState('');

  const trim = (v: string) => v.replace(/^\s+/, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (errorField === id) setErrorField('');
    if (error) setError('');
    setFormData(prev => ({ ...prev, [id]: trim(value) }));
  };

  const fieldBorder = (id: string) =>
    errorField === id ? '2px solid #E53935' : '1.5px solid #ddd';

  function validatePhone(input: string) {
    return /^0\d{9}$/.test(input);
  }

  const clearForm = () => {
    setFormData({ ...EMPTY });
    setError('');
    setErrorField('');
  };

  const showError = (msg: string, field = '') => {
    setError(msg);
    setErrorField(field);
  };

  const handleSubmit = async () => {
    const data: FormData = {
      username: formData.username.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      idNumber: formData.idNumber.trim(),
      gender: formData.gender.trim(),
      ageGroup: formData.ageGroup.trim(),
      yearJoined: formData.yearJoined.trim(),
      residence: formData.residence.trim(),
    };

    if (!data.username) return showError('Please fill in the Name field.', 'username');
    if (!data.phone) return showError('Please fill in the Phone field.', 'phone');
    if (!validatePhone(data.phone)) return showError('Phone must be 10 digits starting with 0 (e.g. 0712345678).', 'phone');
    if (!data.email) return showError('Please fill in the Email field.', 'email');
    if (!data.idNumber) return showError('Please fill in the ID Number field.', 'idNumber');
    if (!data.gender) return showError('Please select a Gender.', 'gender');
    if (!data.ageGroup) return showError('Please select an Age Group.', 'ageGroup');
    if (!data.yearJoined) return showError('Please select the Year Joined RPC.', 'yearJoined');
    if (!data.residence) return showError('Please fill in the Residence field.', 'residence');

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(getApiUrl('admissionAdminAdmitUser'), data, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        setAdmittedName(data.username);
        setSuccess('User admitted successfully!');
        setError('');
        clearForm();
        setTimeout(() => { setSuccess(''); setAdmittedName(''); }, 5000);
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response?.status === 400) {
        const msg = err.response?.data?.message || '';
        const field = err.response?.data?.field || '';
        if (field === 'email') {
          showError('This email address is already registered in the system. Please use a different email.', 'email');
        } else if (field === 'phone') {
          showError('This phone number is already registered in the system. Please use a different phone.', 'phone');
        } else if (field === 'idNumber') {
          showError('This ID Number is already registered in the system. Please check the ID and try again.', 'idNumber');
        } else if (msg === 'All fields are required') {
          showError('Please fill in all required fields before submitting.');
        } else {
          showError(msg || 'A duplicate entry was detected. Please review the form fields.');
        }
      } else if (err.response?.status === 401) {
        showError('Unauthorized. Please check your admin credentials.');
      } else {
        showError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (id: string): React.CSSProperties => ({
    width: '100%',
    padding: '7px 9px',
    border: fieldBorder(id),
    borderRadius: '5px',
    fontSize: '13px',
    outline: 'none',
    background: errorField === id ? '#fff5f5' : '#f8f8f8',
    transition: 'border 0.2s, background 0.2s',
    boxSizing: 'border-box',
  });

  return (
    <>
      {/* Premium Success overlay */}
      {success && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(10,10,20,0.72)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.3s ease',
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #ffffff, #f8fff9)',
            borderRadius: '24px',
            padding: '44px 40px 36px',
            textAlign: 'center',
            boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1.5px rgba(26,138,46,0.12)',
            maxWidth: '400px', width: '92%',
            animation: 'popIn 0.45s cubic-bezier(0.175,0.885,0.32,1.275)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
              background: 'linear-gradient(90deg, #1a8a2e, #4CAF50, #81C784)',
              borderRadius: '24px 24px 0 0',
            }} />
            <div style={{ position: 'absolute', top: '-18px', right: '-18px', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(76,175,80,0.08)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-24px', left: '-24px', width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(26,138,46,0.06)', pointerEvents: 'none' }} />
            <div style={{
              width: '88px', height: '88px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 0 0 10px rgba(76,175,80,0.1), 0 8px 24px rgba(26,138,46,0.2)',
              animation: 'pulse 2s infinite',
            }}>
              <span style={{ fontSize: '42px', lineHeight: 1 }}>✅</span>
            </div>
            <h2 style={{ color: '#1a5e20', margin: '0 0 10px', fontSize: '23px', fontWeight: 800, letterSpacing: '-0.3px' }}>
              Successfully Admitted! 🎉
            </h2>
            <div style={{
              background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
              border: '1px solid #a5d6a7', borderRadius: '12px',
              padding: '12px 18px', margin: '12px 0 16px',
            }}>
              <p style={{ margin: '0 0 3px', color: '#2e7d32', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px' }}>New Member Added</p>
              <p style={{ margin: 0, color: '#1b5e20', fontSize: '18px', fontWeight: 800 }}>{admittedName}</p>
            </div>
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px', lineHeight: 1.6 }}>
              🔐 Default password: <strong style={{ color: '#333' }}>their phone number</strong>
            </p>
            <p style={{ color: '#999', fontSize: '11.5px', margin: 0 }}>
              They can update it from profile settings after logging in.
            </p>
            <button
              onClick={() => { setSuccess(''); setAdmittedName(''); }}
              style={{
                marginTop: '22px',
                background: 'linear-gradient(135deg, #2e7d32, #388e3c)',
                color: '#fff', border: 'none', borderRadius: '12px',
                padding: '13px 40px', fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 6px 18px rgba(46,125,50,0.35)',
                letterSpacing: '0.3px',
              }}
            >
              ✓ Done
            </button>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
          display: 'flex', justifyContent: 'center', padding: '14px 16px 0',
          pointerEvents: 'none',
        }}>
          <div style={{
            background: '#fff', border: '2px solid #E53935',
            borderRadius: '10px', padding: '10px 16px',
            boxShadow: '0 8px 32px rgba(229,57,53,0.18)',
            maxWidth: '420px', width: '100%',
            display: 'flex', alignItems: 'center', gap: '8px',
            pointerEvents: 'auto', animation: 'slideDown 0.3s ease',
          }}>
            <span style={{ fontSize: '17px' }}>⚠️</span>
            <p style={{ margin: 0, color: '#c62828', fontWeight: 600, fontSize: '12.5px', flex: 1 }}>
              {error}
            </p>
            <button onClick={() => { setError(''); setErrorField(''); }}
              style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#c62828', lineHeight: 1 }}>
              ×
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideDown { from { transform: translateY(-20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes popIn { 0% { transform: scale(0.6); opacity: 0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity: 1 } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 10px rgba(76,175,80,0.1), 0 8px 24px rgba(26,138,46,0.2) } 50% { box-shadow: 0 0 0 16px rgba(76,175,80,0.06), 0 8px 24px rgba(26,138,46,0.25) } }
        .af-row { margin-bottom: 7px; }
        .af-row label {
          display: block; font-size: 10px; font-weight: 700;
          color: #555; margin-bottom: 2px; letter-spacing: 0.6px; text-transform: uppercase;
        }
        .af-row label.err-label { color: #E53935; }
        .af-hint { font-size: 10px; color: #E53935; margin-top: 1px; display: block; }
        .af-select {
          width: 100%; padding: 7px 28px 7px 9px; border-radius: 5px;
          font-size: 13px; outline: none; color: #333;
          background-color: #f8f8f8;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23777'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 9px center;
          background-size: 8px 5px;
          transition: border 0.2s; box-sizing: border-box;
          appearance: none; -webkit-appearance: none;
        }
        .af-select.err-bg { background-color: #fff5f5; }
        .af-grid-2 { display: grid; grid-template-columns: 1fr; gap: 7px; }
      `}</style>

      <div className={styles.body}>
        <div className={styles['container']}>

          {/* Compact header — logo + title inline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', padding: '10px 0 6px' }}>
            <Link to="/">
              <img src={cuLogo} alt="RPC logo" style={{ width: '36px', height: '36px', objectFit: 'contain', display: 'block' }} />
            </Link>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.2px' }}>
              Admit New User
            </h2>
          </div>

          <div className={styles['form']} style={{ marginTop: '4px' }}>

            {/* NAME — full width */}
            <div className="af-row">
              <label className={errorField === 'username' ? 'err-label' : ''}>NAME</label>
              <input id="username" type="text" style={inputStyle('username')}
                value={formData.username} onChange={handleChange}
                placeholder="Full name..." />
              {errorField === 'username' && <span className="af-hint">↑ Required</span>}
            </div>

            {/* PHONE + EMAIL */}
            <div className="af-grid-2">
              <div className="af-row">
                <label className={errorField === 'phone' ? 'err-label' : ''}>PHONE</label>
                <input id="phone" type="tel" inputMode="numeric" maxLength={10} style={inputStyle('phone')}
                  value={formData.phone}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    if (error && errorField === 'phone') { setError(''); setErrorField(''); }
                    setFormData(prev => ({ ...prev, phone: v }));
                  }}
                  placeholder="0712345678" />
                {errorField === 'phone' && <span className="af-hint">↑ 10 digits, starts 0</span>}
              </div>
              <div className="af-row">
                <label className={errorField === 'email' ? 'err-label' : ''}>E-MAIL</label>
                <input id="email" type="email" style={inputStyle('email')}
                  value={formData.email} onChange={handleChange} placeholder="email@example.com" />
                {errorField === 'email' && <span className="af-hint">↑ Required / already used</span>}
              </div>
            </div>

            {/* ID NUMBER + GENDER */}
            <div className="af-grid-2">
              <div className="af-row">
                <label className={errorField === 'idNumber' ? 'err-label' : ''}>ID NUMBER</label>
                <input id="idNumber" type="text" inputMode="numeric" style={inputStyle('idNumber')}
                  value={formData.idNumber} onChange={handleChange} placeholder="National ID" />
                {errorField === 'idNumber' && <span className="af-hint">↑ Required / already used</span>}
              </div>
              <div className="af-row">
                <label className={errorField === 'gender' ? 'err-label' : ''}>GENDER</label>
                <select id="gender" className="af-select"
                  style={{ border: fieldBorder('gender'), backgroundColor: errorField === 'gender' ? '#fff5f5' : '#f8f8f8' }}
                  value={formData.gender} onChange={handleChange}>
                  <option value="">choose...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errorField === 'gender' && <span className="af-hint">↑ Required</span>}
              </div>
            </div>

            {/* AGE GROUP + YEAR JOINED */}
            <div className="af-grid-2">
              <div className="af-row">
                <label className={errorField === 'ageGroup' ? 'err-label' : ''}>AGE GROUP</label>
                <select id="ageGroup" className="af-select"
                  style={{ border: fieldBorder('ageGroup'), backgroundColor: errorField === 'ageGroup' ? '#fff5f5' : '#f8f8f8' }}
                  value={formData.ageGroup} onChange={handleChange}>
                  <option value="">choose...</option>
                  <option value="Kid (12 and below)">Kid (≤12)</option>
                  <option value="Youth (13-35)">Youth (13-35)</option>
                  <option value="Adult (36-59)">Adult (36-59)</option>
                  <option value="Elderly (60 and above)">Elderly (60+)</option>
                </select>
                {errorField === 'ageGroup' && <span className="af-hint">↑ Required</span>}
              </div>
              <div className="af-row">
                <label className={errorField === 'yearJoined' ? 'err-label' : ''}>YEAR JOINED RPC</label>
                <select id="yearJoined" className="af-select"
                  style={{ border: fieldBorder('yearJoined'), backgroundColor: errorField === 'yearJoined' ? '#fff5f5' : '#f8f8f8' }}
                  value={formData.yearJoined} onChange={handleChange}>
                  <option value="">choose...</option>
                  {Array.from(
                    { length: (new Date().getFullYear() + 1) - 1989 },
                    (_, i) => (new Date().getFullYear() + 1) - i
                  ).map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
                {errorField === 'yearJoined' && <span className="af-hint">↑ Required</span>}
              </div>
            </div>

            {/* RESIDENCE — full width */}
            <div className="af-row">
              <label className={errorField === 'residence' ? 'err-label' : ''}>RESIDENCE</label>
              <input id="residence" type="text" style={inputStyle('residence')}
                value={formData.residence} onChange={handleChange} placeholder="e.g. Kisii, Nairobi..." />
              {errorField === 'residence' && <span className="af-hint">↑ Required</span>}
            </div>

            {/* Compact inline note */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 10px', background: '#e8f4fd',
              border: '1px solid #bee5eb', borderRadius: '6px',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '13px' }}>📱</span>
              <p style={{ margin: 0, color: '#0c5460', fontSize: '11px' }}>
                <strong>Default password</strong> = phone number. Member can change it after login.
              </p>
            </div>

            {/* Action buttons */}
            <div className={styles['submisions']} style={{ paddingTop: '0', paddingBottom: '6px' }}>
              <div className={styles['clearForm']} onClick={clearForm}>Clear</div>
              {loading
                ? <div className={styles['submitData']} style={{ opacity: 0.7, cursor: 'not-allowed' }}>Processing...</div>
                : <div className={styles['submitData']} onClick={handleSubmit}>Admit User</div>
              }
            </div>

          </div>

          <div className={styles['form-footer']} style={{ marginTop: '2px', paddingBottom: '8px' }}>
            <p style={{ fontSize: '12px' }}><Link to={"/"}>Home</Link> | <Link to={"/user-management"}>Manage Users</Link></p>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdmissionAdmin;