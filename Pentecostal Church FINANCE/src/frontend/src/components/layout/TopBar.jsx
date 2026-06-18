import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User, ShieldCheck, Bell, Search } from 'lucide-react';

const TopBar = ({ user, logout, onToggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayRole = user?.role
    ? user.role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Treasurer';

  const isTreasurer = user?.role === 'treasurer';

  return (
    <header className="premium-header">
      <div className="header-left-toggle">
        <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
      </div>

      <div className="header-center-identity">
        <div className="header-brand-main">
          <img src="/rpc-logo.png" alt="RPC Logo" className="brand-logo-img" />
          <h1 className="brand-title-institutional">
            <span className="full-title">Rikuruma Pentecostal Church</span>
            <span className="short-title">RPC Nyamira</span>
          </h1>
        </div>
        <div className="header-motto-institutional">
          <div className="motto-bar"></div>
          <span className="motto-script">Transforming Campus, Impacting nations</span>
          <div className="motto-bar"></div>
        </div>
      </div>

      <div className="header-right-action">
        <div className="portal-badge-executive">
          <div className="badge-gold-icon">
            <ShieldCheck size={18} />
          </div>
          <span className="badge-text">
            <span className="prefix-mobile-hide">RPC Nyamira - </span>
            TREASURER PORTAL
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

