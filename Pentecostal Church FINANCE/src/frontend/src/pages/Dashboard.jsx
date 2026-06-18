import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PlusCircle, 
  List, 
  FileText, 
  Briefcase,
  BarChart3,
  Calendar,
  Layers,
  ShieldCheck,
  ChevronRight,
  RefreshCcw,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area
} from 'recharts';

const COLORS = ['#730051', '#4a0033', '#a855aa', '#d4af37', '#16a34a', '#2563eb', '#dc2626', '#10b981', '#6366f1', '#f59e0b', '#ec4899'];

const DOCKETS_CANONICAL = [
  'Chairperson', 'Vice Chairperson', 'Secretary', 'Publicity secretary', 
  'Treasurer', 'Worship Coordinator', 'Boards Coordinator', 'Missions Coordinator', 
  'Bible study Coordinator', 'Discipleship Coordinator', 'Other'
];

const quickActionsByRole = {
  admin: [
    { label: 'Register Users', path: '/admin/users', icon: PlusCircle, desc: 'Add new staff members' },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText, desc: 'View system activity' },
  ],
  treasurer: [
    { label: 'New Transaction', path: '/transactions/new', icon: PlusCircle, desc: 'Record income or expense' },
    { label: 'Manage Assets', path: '/assets', icon: Briefcase, desc: 'Update inventory' },
    { label: 'Requisitions', path: '/requisitions', icon: List, desc: 'Review pending requests' },
    { label: 'Financial Reports', path: '/reports', icon: BarChart3, desc: 'Generate statements' },
  ],
  chairperson: [
    { label: 'View Assets', path: '/assets', icon: Briefcase, desc: 'Monitor inventory' },
    { label: 'Approve Requisitions', path: '/requisitions', icon: ShieldCheck, desc: 'Verify expenditures' },
  ],
};

function AnalyticalCard({ label, value, trend, icon: Icon, colorClass }) {
  return (
    <div className={`premium-stat-card ${colorClass}`}>
      <Icon className="stat-icon-bg" />
      <span className="stat-label">{label}</span>
      <h2 className="stat-amount">{value}</h2>
      <div className="stat-trend">
        <span>{trend}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: { total_in: 0, total_out: 0, balance: 0, netWorth: 0, assetVal: 0, assetCount: 0 },
    monthlyFlow: [],
    assetDockets: []
  });
  const [error, setError] = useState('');

  const displayRole = user?.financeRole || user?.role || 'treasurer';
  const actions = quickActionsByRole[displayRole] || quickActionsByRole.treasurer;

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [balanceRes, txRes, assetRes] = await Promise.all([
        api.get('/transactions/balance'),
        api.get('/transactions'),
        api.get('/assets')
      ]);

      const balanceData = balanceRes.data;
      const allTransactions = txRes.data || [];
      const allAssets = assetRes.data.assets || assetRes.data || [];

      // 1. Calculate Total Asset Valuation
      const totalAssetVal = allAssets.reduce((sum, a) => sum + (a.valuation || 0), 0);
      
      // 2. Aggregate Monthly Flow (Last 6 Months)
      const monthMap = {};
      allTransactions.forEach(t => {
        const date = new Date(t.createdAt);
        const monthKey = date.toLocaleDateString('en-KE', { month: 'short', year: '2-digit' });
        if (!monthMap[monthKey]) monthMap[monthKey] = { month: monthKey, income: 0, expense: 0, timestamp: date.getTime() };
        if (t.type === 'cash_in') monthMap[monthKey].income += t.amount;
        else monthMap[monthKey].expense += t.amount;
      });
      const monthlyFlow = Object.values(monthMap)
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-6);

      // 3. Aggregate Assets by Docket (Case-Insensitive matching)
      const docketMap = {};
      DOCKETS_CANONICAL.forEach(d => docketMap[d.toLowerCase()] = { name: d, value: 0 });
      
      allAssets.forEach(a => {
        const docketKey = (a.docket || 'Other').toLowerCase();
        if (docketMap[docketKey]) {
          docketMap[docketKey].value += (a.valuation || 0);
        } else {
          if (!docketMap['other']) docketMap['other'] = { name: 'Other', value: 0 };
          docketMap['other'].value += (a.valuation || 0);
        }
      });
      
      const assetDockets = Object.values(docketMap)
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);

      setData({
        summary: {
          total_in: balanceData.total_in,
          total_out: balanceData.total_out,
          balance: balanceData.balance,
          assetVal: totalAssetVal,
          assetCount: allAssets.length,
          netWorth: balanceData.balance + totalAssetVal
        },
        monthlyFlow,
        assetDockets
      });
    } catch (err) {
      console.error('Dashboard Error:', err);
      setError('Unable to synchronize live analytical data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  if (error) return <div className="error-state-full">{error}</div>;

  return (
    <div className="dashboard-page analytic-dashboard">
      <style>{`
        .analytic-dashboard {
          padding-bottom: 50px !important;
        }
        .welcome-section-executive {
          margin-bottom: 25px !important;
        }
        .executive-stats {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
          gap: 20px !important;
          margin-bottom: 30px !important;
        }
        .analytics-visual-grid {
          display: grid !important;
          grid-template-columns: 1.6fr 1fr !important;
          gap: 24px !important;
          margin-bottom: 24px !important;
        }
        @media (max-width: 1024px) {
          .analytics-visual-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .analysis-chart-card {
          background: white !important;
          border-radius: 20px !important;
          padding: 24px !important;
          border: 1px solid rgba(115, 0, 81, 0.08) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important;
        }
        .chart-header h3 {
          font-size: 1.1rem !important;
          font-weight: 800 !important;
          color: #1e293b !important;
          margin: 0 !important;
        }
        .refresh-mini-btn {
          background: #f1f5f9 !important;
          border: none !important;
          padding: 6px !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          color: #64748b !important;
          transition: all 0.2s !important;
        }
        .refresh-mini-btn:hover {
          background: #e2e8f0 !important;
          color: #730051 !important;
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <div className="welcome-section-executive">
        <div className="welcome-header">
           <h1 className="welcome-title">Overview & Analytics</h1>
           <div className="welcome-subtitle">
             <Calendar size={14} />
             <span>{today}</span>
             <span className="subtitle-divider">•</span>
             <Activity size={14} />
             <span>Real-time Financial Pulse</span>
             <button className="refresh-mini-btn" onClick={fetchDashboardData}>
               <RefreshCcw size={12} className={loading ? 'spinning' : ''} />
             </button>
           </div>
        </div>
      </div>

      <div className="gradient-stats-grid executive-stats">
        <AnalyticalCard 
          label="Total Revenue" 
          value={loading ? '...' : formatCurrency(data.summary.total_in)} 
          trend="↑ Inflow"
          icon={TrendingUp}
          colorClass="income"
        />
        <AnalyticalCard 
          label="Total Expenditure" 
          value={loading ? '...' : formatCurrency(data.summary.total_out)} 
          trend="↓ Outflow"
          icon={TrendingDown}
          colorClass="expense"
        />
        <AnalyticalCard 
          label="In Account" 
          value={loading ? '...' : formatCurrency(data.summary.balance)} 
          trend="⚖️ Balanced"
          icon={Wallet}
          colorClass="account-blue"
        />
        <AnalyticalCard 
          label="Asset Count" 
          value={loading ? '...' : data.summary.assetCount} 
          trend="📦 Items Registered"
          icon={Layers}
          colorClass="asset-teal"
        />
        <AnalyticalCard 
          label="Total Assets" 
          value={loading ? '...' : formatCurrency(data.summary.assetVal)} 
          trend="💎 Valuated"
          icon={Briefcase}
          colorClass="asset-orange"
        />
        <AnalyticalCard 
          label="Net Worth" 
          value={loading ? '...' : formatCurrency(data.summary.netWorth)} 
          trend="👑 Total Wealth"
          icon={ShieldCheck}
          colorClass="networth-purple"
        />
      </div>

      <div className="analytics-visual-grid">
        <div className="analysis-chart-card">
          <div className="chart-header">
            <h3>Financial Flow</h3>
            <span className="chart-tag">Last 6 Months</span>
          </div>
          <div className="chart-container-inner">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.monthlyFlow} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} tickFormatter={v => `${v/1000}K`} />
                <Tooltip 
                  cursor={{fill: 'rgba(241, 245, 249, 0.5)'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  formatter={(v) => formatCurrency(v)}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '11px', fontWeight: 700}} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analysis-chart-card">
          <div className="chart-header">
            <h3>Asset Valuation by Docket</h3>
            <span className="chart-tag">Current Inventory</span>
          </div>
          <div className="chart-container-inner">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.assetDockets} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} width={80} />
                <Tooltip 
                   cursor={{fill: 'rgba(241, 245, 249, 0.5)'}}
                   formatter={(v) => formatCurrency(v)}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                  {data.assetDockets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="section-card actions-compact">
          <h2 className="section-title">
             <Activity size={20} color="#730051" />
             <span>Operational Shortcuts</span>
          </h2>
          <div className="premium-actions-grid compact">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} to={action.path} className="premium-action-card mini">
                  <div className="action-icon-circle-mini">
                    <Icon size={18} />
                  </div>
                  <div className="action-text-block">
                    <span className="action-label">{action.label}</span>
                    <p className="action-desc">{action.desc}</p>
                  </div>
                  <ChevronRight size={16} className="action-arrow" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

