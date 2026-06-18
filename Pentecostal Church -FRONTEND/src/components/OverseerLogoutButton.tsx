import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useOverseerAuth } from '../hooks/useOverseerAuth';

const logoutBtnStyle: React.CSSProperties = {
    background: 'white',
    border: '1px solid #ccc',
    color: '#333',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
};

const backBtnStyle: React.CSSProperties = {
    background: 'transparent',
    border: '2px solid #b71c1c',
    color: '#b71c1c',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
};

const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #eee'
};

const OverseerLogoutButton: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useOverseerAuth();

    const isAdminHome = location.pathname === '/worship-docket-admin';

    const handleLogout = async () => {
        await logout();
        navigate('/worship-docket-admin');
    };

    return (
        <div style={wrapperStyle}>
            {!isAdminHome ? (
                <button
                    onClick={() => navigate('/worship-docket-admin')}
                    title="Back to Admin Dashboard"
                    style={backBtnStyle}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Admin Home
                </button>
            ) : (
                <div />
            )}
            <button
                onClick={handleLogout}
                title="Sign out of admin session"
                style={logoutBtnStyle}
            >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Log Out
            </button>
        </div>
    );
};

export default OverseerLogoutButton;
