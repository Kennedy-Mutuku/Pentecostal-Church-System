import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/signup.module.css';
import cuLogo from '../assets/RPC logo updated document.png';
import { getApiUrl, getImageUrl } from '../config/environment';
import { Search, RefreshCw, Phone, Mail, User, X, Home, UserPlus, Link2 } from 'lucide-react';

interface UserData {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  gender?: string;
  ageGroup?: string;
  residence?: string;
  yearJoined?: string;
  profilePhoto?: string;
  family?: { _id: string; familyName: string; residence?: string } | null;
  familyId?: string; // For the edit form
  relationToHead?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [, setFamilies] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resettingUser, setResettingUser] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editFormData, setEditFormData] = useState<UserData | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [showFullSize, setShowFullSize] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'family' | 'list'>('family');

  // Link-existing-members modal state
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkPersonAId, setLinkPersonAId] = useState('');
  const [linkPersonBId, setLinkPersonBId] = useState('');
  const [linkRelation, setLinkRelation] = useState('');
  const [linkFamilyName, setLinkFamilyName] = useState('');
  const [linkSaving, setLinkSaving] = useState(false);
  const [linkError, setLinkError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchFamilies();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  // Group the (already-filtered) list into families + an "Individual Members" bucket.
  const { familyGroups, ungrouped } = useMemo(() => {
    const groups = new Map<string, { familyName: string; residence?: string; members: UserData[] }>();
    const solo: UserData[] = [];

    filteredUsers.forEach((user) => {
      if (user.family && user.family._id) {
        const existing = groups.get(user.family._id);
        if (existing) {
          existing.members.push(user);
        } else {
          groups.set(user.family._id, {
            familyName: user.family.familyName,
            residence: user.family.residence,
            members: [user],
          });
        }
      } else {
        solo.push(user);
      }
    });

    return { familyGroups: Array.from(groups.entries()), ungrouped: solo };
  }, [filteredUsers]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(getApiUrl('admissionAdminGetUsers'), {
        withCredentials: true,
      });
      
      setUsers(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Unauthorized. Please check your admin credentials.');
      } else {
        setError('Failed to fetch users. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilies = async () => {
    try {
      const response = await axios.get(getApiUrl('admissionAdminGetFamilies'), {
        withCredentials: true,
      });
      setFamilies(response.data);
    } catch (error) {
      console.error('Failed to fetch families', error);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.includes(searchTerm) ||
      user.residence?.toLowerCase().includes(term)
    );
    
    setFilteredUsers(filtered);
  };

  const resetUserPassword = async (userId: string, phone: string, username: string) => {
    if (!confirm(`Reset password for ${username} to their phone number (${phone})?`)) {
      return;
    }

    setResettingUser(userId);
    setError('');
    setSuccess('');

    try {
      await axios.post(getApiUrl('admissionAdminResetPassword'), {
        userId: userId,
        newPassword: phone
      }, {
        withCredentials: true,
      });

      setSuccess(`Password reset successfully for ${username}. New password is: ${phone}`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Unauthorized. Please check your admin credentials.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setResettingUser(null);
    }
  };

  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setEditFormData({ ...user, familyId: user.family?._id || '' });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editFormData) return;
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData || !editingUser) return;

    setSavingUser(true);
    setError('');
    setSuccess('');

    try {
      if (editFormData) {
        const updateUrl = getApiUrl('admissionAdminUpdateUser').replace(':userId', editingUser._id);
        
        // Pass familyId explicitly instead of the populated family object
        const dataToSend = { ...editFormData };
        delete (dataToSend as any).family; 
        
        const response = await axios.put(updateUrl, dataToSend, {
          withCredentials: true
        });

        setSuccess(`User ${editFormData.username} updated successfully!`);
        setUsers(users.map(u => u._id === editingUser._id ? response.data.user : u));
        setEditingUser(null);
        setEditFormData(null);
        
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to update user. Please try again.');
    } finally {
        setSavingUser(false);
    }
  };

  const openLinkModal = () => {
    setLinkPersonAId('');
    setLinkPersonBId('');
    setLinkRelation('');
    setLinkFamilyName('');
    setLinkError('');
    setLinkModalOpen(true);
  };

  const personA = users.find(u => u._id === linkPersonAId) || null;

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkPersonAId || !linkPersonBId || !linkRelation) {
      setLinkError('Please choose both members and a relationship.');
      return;
    }
    if (!personA?.family && !linkFamilyName.trim()) {
      setLinkError("Please give this family a name (the first person isn't in a family yet).");
      return;
    }

    setLinkSaving(true);
    setLinkError('');

    try {
      await axios.post(getApiUrl('admissionAdminLinkFamily'), {
        headUserId: linkPersonAId,
        memberUserId: linkPersonBId,
        relationToHead: linkRelation,
        familyName: linkFamilyName.trim() || undefined,
      }, { withCredentials: true });

      setSuccess('Members linked successfully!');
      setLinkModalOpen(false);
      fetchUsers();
      setTimeout(() => setSuccess(''), 5000);
    } catch (error: any) {
      setLinkError(error.response?.data?.message || 'Failed to link members. Please try again.');
    } finally {
      setLinkSaving(false);
    }
  };

  const renderUserCard = (user: UserData) => (
                <div
                  key={user._id}
                  style={{
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '20px',
                    backgroundColor: '#f8f9fa',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '15px',
                    alignItems: 'flex-start'
                  }}>
                    {/* Profile Photo - Whole Circle is Clickable */}
                    <div
                      onClick={() => user.profilePhoto && setShowFullSize(getImageUrl(user.profilePhoto))}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid #3b1a62',
                        flexShrink: 0,
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(115,0,81,0.2)',
                        transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                      className="photo-container"
                      title="Click to view full size"
                    >
                      {user.profilePhoto ? (
                        <img
                          src={getImageUrl(user.profilePhoto)}
                          alt={user.username}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=User';
                          }}
                        />
                      ) : (
                        <User size={40} color="#3b1a62" />
                      )}
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '10px',
                      flex: 1
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="#3b1a62" />
                        <div>
                          <strong>Name:</strong> {user.username}
                          {user.relationToHead && (
                            <span style={{ marginLeft: '6px', fontSize: '11px', color: '#3b1a62', background: '#f1d9ea', padding: '1px 6px', borderRadius: '4px' }}>
                              {user.relationToHead}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} color="#3b1a62" />
                        <div>
                          <strong>Email:</strong> {user.email || '—'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={16} color="#3b1a62" />
                        <div>
                          <strong>Phone:</strong> {user.phone || '—'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div>
                          <strong>ID Number:</strong> {user.idNumber || '—'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '15px'
                  }}>
                    <div><strong>Gender:</strong> {user.gender || '—'}</div>
                    <div><strong>Age Group:</strong> {user.ageGroup || '—'}</div>
                    <div><strong>Residence:</strong> {user.residence || '—'}</div>
                    <div><strong>Year Joined RPC:</strong> {user.yearJoined || '—'}</div>
                  </div>

                  <div style={{
                    borderTop: '1px solid #dee2e6',
                    paddingTop: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    {user.phone ? (
                      <div style={{
                        fontSize: '12px',
                        color: '#28a745',
                        background: '#d4edda',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        Default Password: {user.phone || <span style={{color:"#999", fontStyle:"italic"}}>N/A</span>}
                      </div>
                    ) : (
                      <div style={{
                        fontSize: '12px',
                        color: '#856404',
                        background: '#fff3cd',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        No login yet — add Email &amp; Phone to enable
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleEditClick(user)}
                          style={{
                            padding: '8px 15px',
                            border: '1px solid #3b1a62',
                            borderRadius: '5px',
                            background: 'white',
                            color: '#3b1a62',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          Edit Details
                        </button>

                        {user.phone && (
                          <button
                            onClick={() => resetUserPassword(user._id, user.phone!, user.username)}
                            disabled={resettingUser === user._id}
                            style={{
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '5px',
                              background: resettingUser === user._id ? '#6c757d' : '#dc3545',
                              color: 'white',
                              cursor: resettingUser === user._id ? 'not-allowed' : 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            {resettingUser === user._id ? 'Resetting...' : 'Reset Password'}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
  );

  return (
    <>
      {/* This page's shell uses position:fixed to fill the viewport, which would
          otherwise render underneath the app's permanent mobile sidebar (44px, see
          components/landing/Header.tsx). Reserve that strip on mobile so content
          is never hidden behind it. */}
      <style>{`
        .um-fixed-body { left: 44px; }
        @media (min-width: 768px) {
          .um-fixed-body { left: 0; }
        }
      `}</style>

      {/* Full Size Photo Viewer Modal - Moved to top for better stacking context */}
      {showFullSize && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(15px)',
            padding: '20px',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.3s ease-out',
            touchAction: 'none'
          }}
          onClick={() => setShowFullSize(null)}
        >
          <div 
            style={{
              position: 'relative',
              width: 'auto',
              maxWidth: '95vw',
              maxHeight: '90vh',
              animation: 'zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFullSize(null)}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                color: 'white',
                background: '#3b1a62',
                border: '2px solid white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                zIndex: 100001
              }}
              title="Close"
            >
              <X size={24} />
            </button>
            <img
              src={showFullSize}
              alt="Full view"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 0 60px rgba(0,0,0,0.9)',
                border: '4px solid white',
                backgroundColor: 'rgba(255,255,255,0.05)'
              }}
            />
          </div>
        </div>
      )}

      <div className={`${styles.body} um-fixed-body`} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, padding: '10px 0', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div className={styles.container} style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0 auto', maxWidth: '800px', width: '95%', boxSizing: 'border-box', overflow: 'hidden' }}>
        <Link to="/" className={styles.logo_div} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className={styles['logo_signUp']}>
            <img src={cuLogo} alt="RPC logo" />
          </div>
        </Link>

        <h2 className={styles.text}>User Management</h2>

        {error && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            background: '#d4edda', 
            color: '#155724', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        {/* Edit Modal */}
        {editingUser && editFormData && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '20px'
            }}>
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                    <h3 style={{ marginBottom: '20px', color: '#3b1a62', borderBottom: '2px solid #3b1a62', paddingBottom: '10px' }}>Edit User Details</h3>
                    <form onSubmit={handleUpdateSubmit}>
                        {!editFormData.email && !editFormData.phone && (
                            <div style={{ background: '#e8f4fd', border: '1px solid #bee5eb', borderRadius: '8px', padding: '10px 12px', marginBottom: '15px', fontSize: '12.5px', color: '#0c5460' }}>
                                ℹ️ This member has no login yet. Add an Email and Phone below to create one (default password = phone number).
                            </div>
                        )}
                        <div className={styles.editFormGrid}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Full Name</label>
                                <input type="text" name="username" value={editFormData.username} onChange={handleEditChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
                                <input type="email" name="email" value={editFormData.email || ''} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Phone</label>
                                <input type="text" name="phone" value={editFormData.phone || ''} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>ID Number</label>
                                <input type="text" name="idNumber" value={editFormData.idNumber || ''} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Gender</label>
                                <select name="gender" value={editFormData.gender || ''} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                    <option value="">choose...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Age Group</label>
                                <select name="ageGroup" value={editFormData.ageGroup || ''} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                    <option value="">choose...</option>
                                    <option value="Kid (12 and below)">Kid (≤12)</option>
                                    <option value="Youth (13-35)">Youth (13-35)</option>
                                    <option value="Adult (36-59)">Adult (36-59)</option>
                                    <option value="Elderly (60 and above)">Elderly (60+)</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Year Joined</label>
                                <input type="text" name="yearJoined" value={editFormData.yearJoined || ''} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            {editFormData.family && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Relationship to Head</label>
                                    <select name="relationToHead" value={editFormData.relationToHead || ''} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                        <option value="">choose...</option>
                                        <option value="Head">Head</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Child">Child</option>
                                        <option value="Dependent">Dependent</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            )}

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>RESIDENCE</label>
                                <input type="text" name="residence" value={editFormData.residence || ''} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={savingUser} style={{ flex: 1, padding: '10px', background: '#3b1a62', color: 'white', border: 'none', borderRadius: '6px', cursor: savingUser ? 'not-allowed' : 'pointer' }}>
                                {savingUser ? 'Saving...' : 'Update Details'}
                            </button>
                            <button type="button" onClick={() => setEditingUser(null)} style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Link Existing Members Modal */}
        {linkModalOpen && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
                alignItems: 'center', zIndex: 1000, padding: '20px'
            }}>
                <div style={{
                    background: 'white', padding: '25px', borderRadius: '12px', width: '100%',
                    maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                    <h3 style={{ marginBottom: '20px', color: '#3b1a62', borderBottom: '2px solid #3b1a62', paddingBottom: '10px' }}>Link Existing Members Into a Family</h3>
                    {linkError && (
                        <div style={{ background: '#f8d7da', color: '#721c24', padding: '8px 12px', borderRadius: '5px', marginBottom: '15px', fontSize: '13px' }}>
                            {linkError}
                        </div>
                    )}
                    <form onSubmit={handleLinkSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Person A (existing/head of family)</label>
                            <select value={linkPersonAId} onChange={(e) => setLinkPersonAId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                <option value="">choose...</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>{u.username}{u.family ? ` (${u.family.familyName})` : ''}</option>
                                ))}
                            </select>
                        </div>

                        {personA && !personA.family && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Family Name (Person A has no family yet)</label>
                                <input type="text" value={linkFamilyName} onChange={(e) => setLinkFamilyName(e.target.value)} placeholder="e.g. The Otieno Family" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                        )}

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Person B (to link in)</label>
                            <select value={linkPersonBId} onChange={(e) => setLinkPersonBId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                <option value="">choose...</option>
                                {users.filter(u => u._id !== linkPersonAId).map(u => (
                                    <option key={u._id} value={u._id}>{u.username}{u.family ? ` (${u.family.familyName})` : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Person B's Relationship to Head</label>
                            <select value={linkRelation} onChange={(e) => setLinkRelation(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                <option value="">choose...</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Child">Child</option>
                                <option value="Dependent">Dependent</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={linkSaving} style={{ flex: 1, padding: '10px', background: '#3b1a62', color: 'white', border: 'none', borderRadius: '6px', cursor: linkSaving ? 'not-allowed' : 'pointer' }}>
                                {linkSaving ? 'Linking...' : 'Link Members'}
                            </button>
                            <button type="button" onClick={() => setLinkModalOpen(false)} style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Search and Controls */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            alignItems: 'center', 
            marginBottom: '15px' 
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#666' 
                }} 
              />
              <input
                type="text"
                placeholder="Search by name, email, phone, or residence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 40px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                background: '#007bff',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={openLinkModal}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                background: '#3b1a62',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}
            >
              <Link2 size={16} />
              Link Members
            </button>
          </div>

          <div style={{ 
            fontSize: '14px', 
            color: '#666',
            padding: '10px',
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '5px'
          }}>
            📋 <strong>Total Users:</strong> {filteredUsers.length} {searchTerm && `(filtered from ${users.length})`}
          </div>
        </div>

        {/* User List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading users...</p>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingRight: '5px' }}>
            {filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
              </div>
            ) : (
              <>
                
            {viewMode === 'list' ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Phone</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Role</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{user.username}</td>
                        <td style={{ padding: '12px' }}>{user.email || 'N/A'}</td>
                        <td style={{ padding: '12px' }}>{user.phone || 'N/A'}</td>
                        <td style={{ padding: '12px' }}>{user.relationToHead || 'N/A'}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => { setEditingUser(user); setEditFormData({ ...user, familyId: user.family?._id }); }} style={{ background: 'transparent', border: '1px solid #3b1a62', color: '#3b1a62', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                {familyGroups.map(([familyId, group]) => (
                  <div key={familyId} style={{ marginBottom: '25px', border: '1px solid #e0c9da', borderRadius: '10px', padding: '12px', background: '#fdf6fa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b1a62', fontWeight: 700, fontSize: '15px' }}>
                        <Home size={18} />
                        {group.familyName}
                        {group.residence && <span style={{ fontSize: '12px', fontWeight: 500, color: '#888' }}>· {group.residence}</span>}
                      </div>
                      <Link to={`/admission?familyId=${familyId}&familyRole=joinFamily`} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
                        background: '#3b1a62', color: 'white', borderRadius: '5px', fontSize: '12px',
                        fontWeight: 'bold', textDecoration: 'none'
                      }}>
                        <UserPlus size={14} />
                        Add Member to this Family
                      </Link>
                    </div>
                    {group.members.map((user) => renderUserCard(user))}
                  </div>
                ))}

                {ungrouped.length > 0 && (
                  <div>
                    {familyGroups.length > 0 && (
                      <h4 style={{ color: '#666', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>Individual Members</h4>
                    )}
                    {ungrouped.map((user) => renderUserCard(user))}
                  </div>
                )}
              </>
            )}
            </>
          )}
        </div>
      )}

        {/* Professional Sticky Action Footer */}
        <div style={{ 
          marginTop: 'auto', 
          padding: '12px 10px 10px', 
          background: '#fff',
          borderTop: '1px solid #eaeaea',
          display: 'flex',
          gap: '10px',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.03)',
          zIndex: 10
        }}>
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px 0',
            background: '#f5f5f5',
            color: '#555',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '13px',
            transition: 'background 0.2s'
          }}>
            🏠 Home
          </Link>
          <Link to="/admission" style={{
            flex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px 0',
            background: '#3b1a62',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '13px',
            boxShadow: '0 4px 10px rgba(115,0,81,0.2)',
            transition: 'opacity 0.2s'
          }}>
            ➕ Admit New User
          </Link>
        </div>
      </div>
    </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .photo-container:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(115,0,81,0.3);
        }
        .photo-container:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};

export default UserManagement;