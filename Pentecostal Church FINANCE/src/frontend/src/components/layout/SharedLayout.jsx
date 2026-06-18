import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const SharedLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <TopBar user={user} logout={logout} onToggleSidebar={toggleSidebar} />
      <div className="layout-container">
        <Sidebar user={user} logout={logout} isOpen={sidebarOpen} onClose={closeSidebar} />
        <div className="main-wrapper">
          <main className="content-area">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SharedLayout;
