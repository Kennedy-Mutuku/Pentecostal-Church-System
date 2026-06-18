import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, DollarSign, ShieldCheck, Search, User, TrendingUp, TrendingDown } from 'lucide-react';
import TreasurerSidebar, { TreasurerSection } from '../components/TreasurerSidebar';
import FinancePanel from '../components/finance/FinancePanel';
import tStyles from '../styles/treasurerDashboard.module.css';

const TreasurerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<TreasurerSection>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);
    const [balance, setBalance] = useState({ total_in: 0, total_out: 0, balance: 0 });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('finance_token');
                if (!token) { navigate('/signIn'); return; }

                const { financeApi } = await import('../services/financeApi');
                const balRes = await financeApi.get('/transactions/balance');
                setBalance(balRes);
                setLoading(false);
                setTimeout(() => setShowWelcome(false), 2500);
            } catch (err) {
                console.error('Treasurer auth failed:', err);
                navigate('/signIn');
            }
        };
        checkAuth();

        const handleToggle = () => setSidebarOpen(prev => !prev);
        window.addEventListener('toggleTreasurerSidebar', handleToggle);
        return () => window.removeEventListener('toggleTreasurerSidebar', handleToggle);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('finance_token');
        navigate('/signIn');
    };

    if (loading) {
        return (
            <div className={tStyles.loadingScreen}>
                <div className={tStyles.loadingSpinner}></div>
                <p>Securing Financial Portal…</p>
            </div>
        );
    }

    const sectionLabel = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');

    const renderOverview = () => (
        <div className={tStyles.statsRow}>
            {/* Total Income */}
            <div className={`${tStyles.statCard} ${tStyles.incomeCard}`}>
                <div className={tStyles.statCardIcon}><TrendingUp size={22} /></div>
                <div className={tStyles.statCardBody}>
                    <span className={tStyles.statLabel}>Total Income</span>
                    <span className={tStyles.statValue}>KES {balance.total_in.toLocaleString()}</span>
                    <span className={tStyles.statMeta}><DollarSign size={11} /> All recorded inflows</span>
                </div>
            </div>

            {/* Total Expenses */}
            <div className={`${tStyles.statCard} ${tStyles.expenseCard}`}>
                <div className={tStyles.statCardIcon}><TrendingDown size={22} /></div>
                <div className={tStyles.statCardBody}>
                    <span className={tStyles.statLabel}>Total Expenses</span>
                    <span className={tStyles.statValue}>KES {balance.total_out.toLocaleString()}</span>
                    <span className={tStyles.statMeta}><Wallet size={11} /> All recorded outflows</span>
                </div>
            </div>

            {/* Net Balance */}
            <div className={`${tStyles.statCard} ${tStyles.balanceCard}`}>
                <div className={tStyles.statCardIcon}><ShieldCheck size={22} /></div>
                <div className={tStyles.statCardBody}>
                    <span className={tStyles.statLabel}>Net Balance</span>
                    <span className={tStyles.statValue}>KES {balance.balance.toLocaleString()}</span>
                    <span className={tStyles.statMeta}><ShieldCheck size={11} /> Audited &amp; Secured</span>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className={tStyles.fadeIn}>
                        {renderOverview()}
                        <div className={tStyles.panelWrapper}>
                            <FinancePanel initialTab="dashboard" />
                        </div>
                    </div>
                );
            case 'transactions':  return <FinancePanel initialTab="transactions" />;
            case 'requisitions':  return <FinancePanel initialTab="requisitions" />;
            case 'assets':        return <FinancePanel initialTab="assets" />;
            case 'reports':       return <FinancePanel initialTab="reports" />;
            case 'mpesa':         return <FinancePanel initialTab="mpesa" />;
            case 'audit':         return <FinancePanel initialTab="auditLogs" />;
            case 'settings':
                return (
                    <div className={tStyles.settingsCard}>
                        <h3>Account Settings</h3>
                        <p>Manage your Treasurer profile and notification preferences.</p>
                    </div>
                );
            default: return renderOverview();
        }
    };

    return (
        <div className={tStyles.dashboardWrapper}>

            {/* Welcome splash */}
            {showWelcome && (
                <div className={tStyles.welcomeSplash}>
                    <div className={tStyles.splashInner}>
                        <ShieldCheck size={44} color="#c9a227" />
                        <h2>Welcome, Treasurer</h2>
                        <p>RPC Nyamira · Financial Portal</p>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <TreasurerSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                onLogout={handleLogout}
            />

            {/* Main area */}
            <main className={tStyles.mainArea}>

                {/* Content sub-header */}
                <div className={tStyles.contentBar}>
                    <div className={tStyles.contentBarLeft}>
                        <h2 className={tStyles.pageTitle}>{sectionLabel(activeSection)}</h2>
                        <span className={tStyles.pageSubtitle}>RPC Nyamira · Finance &amp; Assets</span>
                    </div>
                    <div className={tStyles.contentBarRight}>
                        <div className={tStyles.searchWrap}>
                            <Search size={14} className={tStyles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search records…"
                                className={tStyles.searchInput}
                            />
                        </div>
                        <div className={tStyles.userPill}>
                            <div className={tStyles.userAvatar}><User size={14} /></div>
                            <span>Treasurer</span>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <div className={tStyles.contentBody}>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default TreasurerDashboard;
