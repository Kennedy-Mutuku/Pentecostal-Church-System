// @ts-nocheck
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cuLogo from '../assets/RPC logo updated document.png';
import { Link, useSearchParams } from 'react-router-dom';
import styles from '../styles/signup.module.css';
import { getApiUrl } from '../config/environment';
import { User, Phone as PhoneIcon, Mail, CreditCard, Users as UsersIcon, Calendar, Clock, MapPin, Home } from 'lucide-react';

type FamilyRole = 'independent' | 'newFamily' | 'joinFamily';

type FormData = {
  username: string;
  phone: string;
  email: string;
  idNumber: string;
  gender: string;
  ageGroup: string;
  yearJoined: string;
  residence: string;
  familyRole: FamilyRole;
  familyName: string;
  familyId: string;
  relationToHead: string;
};

type FamilyOption = {
  _id: string;
  familyName: string;
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
  familyRole: 'independent',
  familyName: '',
  familyId: '',
  relationToHead: '',
};

const AdmissionAdmin: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<FormData>({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [admittedName, setAdmittedName] = useState('');
  const [admittedHasLogin, setAdmittedHasLogin] = useState(true);
  const [errorField, setErrorField] = useState('');
  const [families, setFamilies] = useState<FamilyOption[]>([]);
  const [familiesLoading, setFamiliesLoading] = useState(false);

  // Prefill from "+ Add Member to this Family" link in Manage Users
  useEffect(() => {
    const prefFamilyId = searchParams.get('familyId');
    const prefFamilyRole = searchParams.get('familyRole');
    if (prefFamilyId && prefFamilyRole === 'joinFamily') {
      setFormData(prev => ({ ...prev, familyRole: 'joinFamily', familyId: prefFamilyId }));
      loadFamilies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFamilies = async () => {
    if (families.length || familiesLoading) return;
    setFamiliesLoading(true);
    try {
      const response = await axios.get(getApiUrl('admissionAdminGetFamilies'), { withCredentials: true });
      setFamilies(response.data || []);
    } catch (err) {
      console.error('Error loading families:', err);
    } finally {
      setFamiliesLoading(false);
    }
  };

  const handleFamilyRoleChange = (role: FamilyRole) => {
    setFormData(prev => ({ ...prev, familyRole: role }));
    if (role === 'joinFamily') loadFamilies();
  };

  const trim = (v: string) => v.replace(/^\s+/, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (errorField === id) setErrorField('');
    if (error) setError('');
    setFormData(prev => ({ ...prev, [id]: trim(value) }));
  };

  const fieldBorder = (id: string) =>
    errorField === id ? '1.5px solid #E53935' : '1.5px solid transparent';

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
      familyRole: formData.familyRole,
      familyName: formData.familyName.trim(),
      familyId: formData.familyId,
      relationToHead: formData.relationToHead,
    };

    if (!data.username) return showError('Please fill in the Name field.', 'username');

    if (data.familyRole === 'joinFamily') {
      if (!data.ageGroup) return showError('Please select an Age Group.', 'ageGroup');
      if (!data.familyId) return showError('Please select a family to join.', 'familyId');
      if (!data.relationToHead) return showError('Please select their relationship to the head of family.', 'relationToHead');
      if (data.phone && !validatePhone(data.phone)) return showError('Phone must be 10 digits starting with 0 (e.g. 0712345678).', 'phone');
    } else {
      if (!data.phone) return showError('Please fill in the Phone field.', 'phone');
      if (!validatePhone(data.phone)) return showError('Phone must be 10 digits starting with 0 (e.g. 0712345678).', 'phone');
      if (!data.email) return showError('Please fill in the Email field.', 'email');
      if (!data.idNumber) return showError('Please fill in the ID Number field.', 'idNumber');
      if (!data.gender) return showError('Please select a Gender.', 'gender');
      if (!data.ageGroup) return showError('Please select an Age Group.', 'ageGroup');
      if (!data.yearJoined) return showError('Please select the Year Joined RPC.', 'yearJoined');
      if (!data.residence) return showError('Please fill in the Residence field.', 'residence');
      if (data.familyRole === 'newFamily' && !data.familyName) return showError('Please give this family a name.', 'familyName');
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(getApiUrl('admissionAdminAdmitUser'), data, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        setAdmittedName(data.username);
        setAdmittedHasLogin(Boolean(data.email && data.phone));
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
        } else if (field === 'familyId' || field === 'familyName') {
          showError(msg, field);
        } else if (msg === 'All fields are required') {
          showError('Please fill in all required fields before submitting.');
        } else {
          showError(msg || 'A duplicate entry was detected. Please review the form fields.');
        }
      } else if (err.response?.status === 401) {
        showError('Unauthorized. Please check your admin credentials.');
      } else if (err.response?.status === 404) {
        showError(err.response?.data?.message || 'The selected family could not be found.', 'familyId');
      } else {
        showError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (id: string): React.CSSProperties => ({
    border: fieldBorder(id),
    background: errorField === id ? '#fff5f5' : '#F7F4EF',
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
            {admittedHasLogin ? (
              <>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px', lineHeight: 1.6 }}>
                  🔐 Default password: <strong style={{ color: '#333' }}>their phone number</strong>
                </p>
                <p style={{ color: '#999', fontSize: '11.5px', margin: 0 }}>
                  They can update it from profile settings after logging in.
                </p>
              </>
            ) : (
              <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px', lineHeight: 1.6 }}>
                🏠 Added to the family — no login created yet. Add their email &amp; phone later in <strong>Manage Users</strong> to enable login.
              </p>
            )}
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
        .af-row { margin-bottom: 6px; }
        .af-row label {
          display: block; font-size: 12.5px; font-weight: 700;
          color: #333; margin-bottom: 2px;
        }
        .af-row label .req { color: #E53935; margin-left: 2px; }
        .af-row label.err-label { color: #E53935; }
        .af-hint { font-size: 10px; color: #E53935; margin-top: 2px; display: block; }
        .af-field { position: relative; }
        .af-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #9a9690; pointer-events: none; }
        .af-input, .af-select {
          width: 100%; padding: 9px 10px 9px 33px; border-radius: 12px;
          font-size: 13.5px; outline: none; color: #333;
          background-color: #F7F4EF;
          transition: border 0.2s, background 0.2s; box-sizing: border-box;
        }
        .af-select {
          padding-right: 26px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23777'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 10px 6px;
          appearance: none; -webkit-appearance: none;
        }
        .af-select.err-bg { background-color: #fff5f5; }

        .af-header { padding: 20px 0 6px; }
        .af-logo { width: 56px; height: 56px; margin: 0 auto 10px; }
        .af-title { margin: 0; font-size: 20px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.2px; }
        .af-subtitle { margin: 4px 0 0; font-size: 12.5px; color: #888; }
        .af-note { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #e8f4fd; border: 1px solid #bee5eb; border-radius: 14px; margin-bottom: 14px; }
        .af-note p { margin: 0; color: #0c5460; font-size: 11.5px; }
        .af-btns-row { flex-wrap: nowrap; }
        .af-btn { flex: 1 1 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Fit comfortably on one mobile screen: hide icons (they clash with native select text),
           and tighten every vertical gap. */
        @media (max-width: 480px) {
          .af-page-body { padding: 10px 0 !important; }
          .af-page-container { padding: 6px 0 !important; }
          .af-header { padding: 6px 0 3px; }
          .af-logo { width: 36px; height: 36px; margin: 0 auto 4px; }
          .af-title { font-size: 15.5px; }
          .af-subtitle { font-size: 10.5px; margin-top: 1px; }
          .af-icon { display: none; }
          .af-input, .af-select { padding-left: 10px !important; padding-top: 6px !important; padding-bottom: 6px !important; font-size: 12.5px !important; border-radius: 10px !important; }
          .af-row { margin-bottom: 3px; }
          .af-row label { font-size: 10.5px; margin-bottom: 1px; }
          .af-hint { font-size: 9px; margin-top: 1px; }
          .af-note { padding: 6px 10px; margin-bottom: 6px; gap: 6px; }
          .af-note p { font-size: 10px; }
          .af-btns-row { gap: 8px !important; }
          .af-btn { padding: 10px 6px !important; font-size: 0.82em !important; min-height: 38px !important; }
        }
      `}</style>

      <div className={`${styles.body} af-page-body`}>
        <div className={`${styles['container']} af-page-container`}>

          {/* Header — logo centered above bold title + subtitle */}
          <div className="af-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Link to="/" style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={cuLogo} alt="RPC logo" className="af-logo" style={{ objectFit: 'contain', display: 'block' }} />
            </Link>
            <h2 className="af-title">
              Admit New User
            </h2>
            <p className="af-subtitle">
              Register a new member into the RPC system
            </p>
          </div>

          <div className={styles['form']} style={{ maxWidth: '360px', margin: '10px auto 0' }}>

            {/* FAMILY ROLE */}
            <div className="af-row">
              <label>How are they joining?</label>
              <div className="af-role-toggle">
                <button type="button"
                  className={formData.familyRole === 'independent' ? 'af-role-btn active' : 'af-role-btn'}
                  onClick={() => handleFamilyRoleChange('independent')}>
                  Individual Member
                </button>
                <button type="button"
                  className={formData.familyRole === 'newFamily' ? 'af-role-btn active' : 'af-role-btn'}
                  onClick={() => handleFamilyRoleChange('newFamily')}>
                  Head of New Family
                </button>
                <button type="button"
                  className={formData.familyRole === 'joinFamily' ? 'af-role-btn active' : 'af-role-btn'}
                  onClick={() => handleFamilyRoleChange('joinFamily')}>
                  Join Existing Family
                </button>
              </div>
            </div>

            {formData.familyRole === 'newFamily' && (
              <div className="af-row">
                <label className={errorField === 'familyName' ? 'err-label' : ''}>Family Name<span className="req">*</span></label>
                <div className="af-field">
                  <Home size={16} className="af-icon" />
                  <input id="familyName" type="text" className="af-input" style={inputStyle('familyName')}
                    value={formData.familyName} onChange={handleChange} placeholder="e.g. The Otieno Family" />
                </div>
                {errorField === 'familyName' && <span className="af-hint">↑ Required</span>}
              </div>
            )}

            {formData.familyRole === 'joinFamily' && (
              <>
                <div className="af-row">
                  <label className={errorField === 'familyId' ? 'err-label' : ''}>Family<span className="req">*</span></label>
                  <div className="af-field">
                    <Home size={16} className="af-icon" />
                    <select id="familyId" className="af-select"
                      style={{ border: fieldBorder('familyId'), backgroundColor: errorField === 'familyId' ? '#fff5f5' : '#F7F4EF' }}
                      value={formData.familyId} onChange={handleChange}>
                      <option value="">{familiesLoading ? 'Loading families...' : 'choose...'}</option>
                      {families.map(f => (
                        <option key={f._id} value={f._id}>{f.familyName}</option>
                      ))}
                    </select>
                  </div>
                  {errorField === 'familyId' && <span className="af-hint">↑ Required</span>}
                </div>

                <div className="af-row">
                  <label className={errorField === 'relationToHead' ? 'err-label' : ''}>Relationship to Head<span className="req">*</span></label>
                  <div className="af-field">
                    <UsersIcon size={16} className="af-icon" />
                    <select id="relationToHead" className="af-select"
                      style={{ border: fieldBorder('relationToHead'), backgroundColor: errorField === 'relationToHead' ? '#fff5f5' : '#F7F4EF' }}
                      value={formData.relationToHead} onChange={handleChange}>
                      <option value="">choose...</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Dependent">Dependent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {errorField === 'relationToHead' && <span className="af-hint">↑ Required</span>}
                </div>

                <div className="af-note">
                  <span style={{ fontSize: '14px' }}>ℹ️</span>
                  <p>
                    Email, Phone, ID and Residence below are optional for family members with no contact details of their own (e.g. children).
                  </p>
                </div>
              </>
            )}

            {/* NAME */}
            <div className="af-row">
              <label className={errorField === 'username' ? 'err-label' : ''}>Full Name<span className="req">*</span></label>
              <div className="af-field">
                <User size={16} className="af-icon" />
                <input id="username" type="text" className="af-input" style={inputStyle('username')}
                  value={formData.username} onChange={handleChange}
                  placeholder="Full name..." />
              </div>
              {errorField === 'username' && <span className="af-hint">↑ Required</span>}
            </div>

            {/* PHONE */}
            <div className="af-row">
              <label className={errorField === 'phone' ? 'err-label' : ''}>Phone<span className="req">*</span></label>
              <div className="af-field">
                <PhoneIcon size={16} className="af-icon" />
                <input id="phone" type="tel" inputMode="numeric" maxLength={10} className="af-input" style={inputStyle('phone')}
                  value={formData.phone}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    if (error && errorField === 'phone') { setError(''); setErrorField(''); }
                    setFormData(prev => ({ ...prev, phone: v }));
                  }}
                  placeholder="0712345678" />
              </div>
              {errorField === 'phone' && <span className="af-hint">↑ 10 digits, starts 0</span>}
            </div>

            {/* EMAIL */}
            <div className="af-row">
              <label className={errorField === 'email' ? 'err-label' : ''}>Email<span className="req">*</span></label>
              <div className="af-field">
                <Mail size={16} className="af-icon" />
                <input id="email" type="email" className="af-input" style={inputStyle('email')}
                  value={formData.email} onChange={handleChange} placeholder="email@example.com" />
              </div>
              {errorField === 'email' && <span className="af-hint">↑ Required / already used</span>}
            </div>

            {/* ID NUMBER */}
            <div className="af-row">
              <label className={errorField === 'idNumber' ? 'err-label' : ''}>ID Number<span className="req">*</span></label>
              <div className="af-field">
                <CreditCard size={16} className="af-icon" />
                <input id="idNumber" type="text" inputMode="numeric" className="af-input" style={inputStyle('idNumber')}
                  value={formData.idNumber} onChange={handleChange} placeholder="National ID" />
              </div>
              {errorField === 'idNumber' && <span className="af-hint">↑ Required / already used</span>}
            </div>

            {/* GENDER */}
            <div className="af-row">
              <label className={errorField === 'gender' ? 'err-label' : ''}>Gender<span className="req">*</span></label>
              <div className="af-field">
                <UsersIcon size={16} className="af-icon" />
                <select id="gender" className="af-select"
                  style={{ border: fieldBorder('gender'), backgroundColor: errorField === 'gender' ? '#fff5f5' : '#F7F4EF' }}
                  value={formData.gender} onChange={handleChange}>
                  <option value="">choose...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errorField === 'gender' && <span className="af-hint">↑ Required</span>}
            </div>

            {/* AGE GROUP */}
            <div className="af-row">
              <label className={errorField === 'ageGroup' ? 'err-label' : ''}>Age Group<span className="req">*</span></label>
              <div className="af-field">
                <Calendar size={16} className="af-icon" />
                <select id="ageGroup" className="af-select"
                  style={{ border: fieldBorder('ageGroup'), backgroundColor: errorField === 'ageGroup' ? '#fff5f5' : '#F7F4EF' }}
                  value={formData.ageGroup} onChange={handleChange}>
                  <option value="">choose...</option>
                  <option value="Kid (12 and below)">Kid (≤12)</option>
                  <option value="Youth (13-35)">Youth (13-35)</option>
                  <option value="Adult (36-59)">Adult (36-59)</option>
                  <option value="Elderly (60 and above)">Elderly (60+)</option>
                </select>
              </div>
              {errorField === 'ageGroup' && <span className="af-hint">↑ Required</span>}
            </div>

            {/* YEAR JOINED */}
            <div className="af-row">
              <label className={errorField === 'yearJoined' ? 'err-label' : ''}>Year Joined<span className="req">*</span></label>
              <div className="af-field">
                <Clock size={16} className="af-icon" />
                <select id="yearJoined" className="af-select"
                  style={{ border: fieldBorder('yearJoined'), backgroundColor: errorField === 'yearJoined' ? '#fff5f5' : '#F7F4EF' }}
                  value={formData.yearJoined} onChange={handleChange}>
                  <option value="">choose...</option>
                  {Array.from(
                    { length: (new Date().getFullYear() + 1) - 1989 },
                    (_, i) => (new Date().getFullYear() + 1) - i
                  ).map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
              {errorField === 'yearJoined' && <span className="af-hint">↑ Required</span>}
            </div>

            {/* RESIDENCE */}
            <div className="af-row">
              <label className={errorField === 'residence' ? 'err-label' : ''}>Residence<span className="req">*</span></label>
              <div className="af-field">
                <MapPin size={16} className="af-icon" />
                <input id="residence" type="text" className="af-input" style={inputStyle('residence')}
                  value={formData.residence} onChange={handleChange} placeholder="e.g. Kisii, Nairobi..." />
              </div>
              {errorField === 'residence' && <span className="af-hint">↑ Required</span>}
            </div>

            {/* Inline note */}
            <div className="af-note">
              <span style={{ fontSize: '14px' }}>📱</span>
              <p>
                <strong>Default password</strong> = phone number. Member can change it after login.
              </p>
            </div>

            {/* Action buttons */}
            <div className={`${styles['submisions']} af-btns-row`} style={{ paddingTop: '0', paddingBottom: '10px' }}>
              <div className={`${styles['clearForm']} af-btn`} onClick={clearForm} style={{ borderRadius: '999px' }}>Clear</div>
              {loading
                ? <div className={`${styles['submitData']} af-btn`} style={{ opacity: 0.7, cursor: 'not-allowed', borderRadius: '999px' }}>Processing...</div>
                : <div className={`${styles['submitData']} af-btn`} onClick={handleSubmit} style={{ borderRadius: '999px' }}>Admit User</div>
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