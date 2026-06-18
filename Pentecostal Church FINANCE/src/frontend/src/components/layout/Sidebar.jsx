import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ArrowRightLeft, 
  FileEdit, 
  Briefcase, 
  FileBarChart, 
  History, 
  ShieldCheck, 
  Smartphone,
  LogOut,
  Crown
} from 'lucide-react';

const Sidebar = ({ user, isOpen, onClose, logout }) => {
  const role = user?.role || 'treasurer';

  const menuGroups = [
    {
      label: 'Core',
      items: [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'treasurer', 'auditor', 'chair_accounts', 'chairperson', 'patron', 'member'] },
      ]
    },
    {
      label: 'Management',
      items: [
        { path: '/transactions', label: 'Transactions', icon: ArrowRightLeft, roles: ['admin', 'treasurer', 'auditor', 'chair_accounts', 'chairperson', 'patron'] },
        { path: '/requisitions', label: 'Requisitions', icon: FileEdit, roles: ['admin', 'treasurer', 'auditor', 'chair_accounts', 'chairperson', 'patron'] },
        { path: '/assets', label: 'Asset Book', icon: Briefcase, roles: ['admin', 'treasurer', 'auditor', 'chair_accounts', 'chairperson'] },
        { path: '/reports', label: 'Financial Reports', icon: FileBarChart, roles: ['admin', 'treasurer', 'auditor', 'chair_accounts', 'chairperson', 'patron'] },
        { path: '/mpesa', label: 'M-Pesa / STK', icon: Smartphone, roles: ['admin', 'treasurer'] },
      ]
    },
    {
      label: 'System',
      items: [
        { path: '/auditor', label: 'Auditor Panel', icon: ShieldCheck, roles: ['admin', 'auditor'] },
        { path: '/admin/audit-logs', label: 'System Logs', icon: History, roles: ['admin', 'auditor'] },
        { path: '/admin/users', label: 'User Access', icon: Users, roles: ['admin'] },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`premium-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header-executive">
        <div className="logo-circle-container">
          <img src="/rpc-logo.png" alt="RPC Nyamira" />
        </div>
        <div className="sidebar-identity-block">
          <span className="identity-brand-name">RPC Nyamira</span>
          <span className="identity-role-label">
            <Crown size={10} color="#d4af37" /> TREASURER
          </span>
        </div>
      </div>

      <nav className="sidebar-nav-scroller">
        {menuGroups.map((group, gIdx) => {
          const visibleItems = group.items.filter(item => item.roles.includes(role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="nav-group-wrapper">
              <div className="nav-section-label">{group.label}</div>
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `executive-nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={onClose}
                >
                  <div className="sidebar-nav-icon">
                    <item.icon size={18} />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer-institutional">
        <button className="logout-btn" onClick={handleLogout}>
          <div className="sidebar-nav-icon">
            <LogOut size={18} />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

