import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint, CheckCircle, AlertCircle, Home } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/RPC logo updated document.png';
import loadingAnime from '../assets/loading.gif';
import { getApiUrl } from '../config/environment';

interface UserData {
    username: string;
    email: string;
    yos: number;
    phone: string;
    residence: string;
    yearJoined: string;
    course?: string;
    reg?: string;
    role?: string;
    graduationYear?: number;
}

const UserProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Fingerprint Registration State
    const [isRegistering, setIsRegistering] = useState(false);
    const [regSuccess, setRegSuccess] = useState(false);
    const [regError, setRegError] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const apiUrl = getApiUrl('users');
            const response = await fetch(apiUrl, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                navigate('/signIn');
            }
        } catch (error) {
            setError('Failed to load profile data');
            navigate('/signIn');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterFingerprint = async () => {
        setIsRegistering(true);
        setRegError('');
        setRegSuccess(false);

        try {
            // 1. Get options from server
            const generateResponse = await fetch(getApiUrl('webauthnGenerateRegister'), {
                method: 'GET',
                credentials: 'include',
            });
            
            if (!generateResponse.ok) {
                throw new Error('Failed to generate registration options');
            }
            
            const options = await generateResponse.json();

            // 2. Pass options to browser to create credentials
            let attResp;
            try {
                attResp = await startRegistration(options);
            } catch (error: any) {
                if (error.name === 'NotAllowedError') {
                    throw new Error('Registration cancelled or not allowed');
                }
                throw error;
            }

            // 3. Send response back to server
            const verifyResponse = await fetch(getApiUrl('webauthnVerifyRegister'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(attResp),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.verified) {
                setRegSuccess(true);
            } else {
                throw new Error(verifyResult.message || 'Verification failed');
            }
            
        } catch (error: any) {
            console.error('Registration error:', error);
            setRegError(error.message || 'Failed to register fingerprint');
        } finally {
            setIsRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <img src={loadingAnime} alt="Loading..." style={{ width: '80px', margin: '0 auto' }} />
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Failed to load profile. <Link to="/signIn">Please login again</Link></p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.body} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className={styles.container} style={{ width: '100%', maxWidth: '450px', padding: '30px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <img src={cuLogo} alt="RPC logo" style={{ height: '80px', objectFit: 'contain' }} />
                </div>

                <h2 style={{ fontSize: '1.5rem', color: '#3b1a62', textAlign: 'center', marginBottom: '8px' }}>
                    Welcome back, {userData.username}!
                </h2>
                <p style={{ color: '#666', textAlign: 'center', fontSize: '0.9rem', marginBottom: '30px' }}>
                    Manage your profile and security settings below.
                </p>

                {/* Fingerprint Registration Section */}
                <div style={{ background: '#f8f9fa', border: '1px solid #eee', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3b1a62', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Fingerprint size={20} color="white" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>Biometric Login</h3>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Use your device's fingerprint or Face ID for quick attendance signing.</p>
                        </div>
                    </div>

                    {regError && (
                        <div style={{ display: 'flex', alignItems: 'start', gap: '8px', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '15px' }}>
                            <AlertCircle size={16} color="#dc2626" style={{ marginTop: '2px' }} />
                            <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem' }}>{regError}</p>
                        </div>
                    )}

                    {regSuccess ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#059669', fontWeight: 'bold' }}>
                            <CheckCircle size={18} />
                            <span>Fingerprint registered successfully!</span>
                        </div>
                    ) : (
                        <button 
                            onClick={handleRegisterFingerprint}
                            disabled={isRegistering}
                            style={{ 
                                width: '100%', padding: '12px', background: '#3b1a62', color: 'white', 
                                border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem',
                                cursor: isRegistering ? 'not-allowed' : 'pointer', opacity: isRegistering ? 0.7 : 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isRegistering ? (
                                <>
                                    <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <Fingerprint size={18} />
                                    Register Fingerprint
                                </>
                            )}
                        </button>
                    )}
                </div>

                <button 
                    onClick={() => navigate('/')}
                    style={{ width: '100%', padding: '12px', background: 'transparent', color: '#3b1a62', border: '2px solid #3b1a62', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <Home size={18} />
                    Go to Homepage
                </button>

                <style>
                    {`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}
                </style>
            </div>
        </div>
    );
};

export default UserProfilePage;