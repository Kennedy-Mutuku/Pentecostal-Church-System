import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/worshipDocketAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faCheckCircle,
    faArrowRight,
    faSignOutAlt,
    faImages
} from '@fortawesome/free-solid-svg-icons';
import { useOverseerAuth } from '../hooks/useOverseerAuth';

const WorshipDocketAdmin: React.FC = () => {
    const navigate = useNavigate();
    const { authenticated, loading: authLoading, logout } = useOverseerAuth();
    const [message, setMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    React.useEffect(() => {
        if (!authLoading && !authenticated) {
            navigate('/signIn');
        }
    }, [authLoading, authenticated, navigate]);

    const handleLogout = async () => {
        await logout();
        setMessage('Logged out successfully');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleRoleSelection = () => {
        const role = 'Executive Admin';
        setSelectedRole(role);
        setMessage(`Redirecting to attendance management...`);
        setTimeout(() => {
            sessionStorage.setItem('leadershipRole', role);
            navigate(`/attendance-session-management?role=${encodeURIComponent(role)}`);
        }, 800);
    };

    if (authLoading) {
        return (
            <div className={styles.container}>
                <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>Verifying session...</p>
            </div>
        );
    }

    if (!authLoading && !authenticated) {
        return null;
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.adminHeader}>
                    <div className={styles.headerText}>
                        <h1>Attendance & Gallery</h1>
                        <p>Manage your modules and church operations</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className={styles.logoutBtn}
                        title="Sign out"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Log Out
                    </button>
                </div>

                {message && (
                    <div className={styles.message}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {message}
                    </div>
                )}

                {/* Colorful Professional Cards */}
                <div className={styles.premiumCardsContainer}>
                    {/* Attendance Card */}
                    <div className={styles.premiumCard} onClick={handleRoleSelection}>
                        <div className={styles.iconWrapper}>
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div className={styles.cardContent}>
                            <h2>Attendance Manager</h2>
                            <p>Multi-session real-time attendance tracking and leadership controls.</p>
                        </div>
                        <button className={styles.cardActionButton}>
                            Open Module
                            <FontAwesomeIcon icon={faArrowRight} className={styles.btnIcon} />
                        </button>
                    </div>

                    {/* Media Gallery Card */}
                    <div className={styles.premiumCard} onClick={() => navigate('/media-admin')}>
                        <div className={styles.iconWrapper}>
                            <FontAwesomeIcon icon={faImages} />
                        </div>
                        <div className={styles.cardContent}>
                            <h2>Media Gallery</h2>
                            <p>Upload, organize, and manage church event photos and albums.</p>
                        </div>
                        <button className={styles.cardActionButton}>
                            Open Module
                            <FontAwesomeIcon icon={faArrowRight} className={styles.btnIcon} />
                        </button>
                    </div>
                </div>

                {selectedRole && (
                    <div className={styles.loadingSection}>
                        <div className={styles.loadingMessage}>
                            <FontAwesomeIcon icon={faUsers} className={styles.loadingIcon} />
                            <h3>Loading attendance management for {selectedRole}...</h3>
                            <p>Preparing session controls and attendance records...</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default WorshipDocketAdmin;
