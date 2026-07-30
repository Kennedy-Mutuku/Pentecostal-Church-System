import React, { useState, useEffect } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';

interface AnalyticsChartsProps {
  users: any[];
  byAgeGroup?: { [key: string]: number };
  transactions: any[];
  assets: any[];
}




const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ users, transactions, assets }) => {
  const P = '#3b1a62';
  const G = '#22c55e';
  const R = '#ef4444';
  const AMBER = '#f59e0b';

  // Detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const chartH = isMobile ? 180 : 180;

  // 1. Member Distribution by Year Joined
  const getMemberYearJoinedData = () => {
    const yearMap: { [key: string]: number } = {};

    users.forEach(u => {
      const raw = u.yearJoined ? String(u.yearJoined).trim() : '';
      if (!raw || isNaN(Number(raw))) return;
      const yr = Number(raw);
      if (yr >= 1990 && yr <= new Date().getFullYear()) {
        yearMap[raw] = (yearMap[raw] || 0) + 1;
      }
    });

    // Sort chronologically and return
    return Object.entries(yearMap)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([name, count]) => ({ name, Members: count }));
  };

  // 2. Finance Categories (Tithe, Offering, Thanksgiving)
  const getFinanceDetailData = () => {
    const trend: { [key: string]: any } = {};
    transactions.filter(t => t.type === 'cash_in' || t.type === 'income').forEach(t => {
      const date = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!trend[date]) trend[date] = { name: date, Tithe: 0, Offering: 0, Thanksgiving: 0 };
      if (t.category === 'tithe') trend[date].Tithe += t.amount;
      if (t.category === 'offering') trend[date].Offering += t.amount;
      if (t.category === 'thanksgiving') trend[date].Thanksgiving += t.amount;
    });
    return Object.values(trend).slice(-10);
  };

  // 3. Cash Flow (In vs Out)
  const getCashFlowData = () => {
    const flow: { [key: string]: any } = {};
    transactions.forEach(t => {
      const day = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!flow[day]) flow[day] = { name: day, In: 0, Out: 0 };
      if (t.type === 'cash_in' || t.type === 'income') flow[day].In += t.amount;
      else flow[day].Out += t.amount;
    });
    return Object.values(flow).slice(-7);
  };

  // 4. Members per Age Group
  const getAgeGroupData = () => {
    const groups: { [key: string]: number } = {
      'Kid (12 and below)': 0,
      'Youth (13-35)': 0,
      'Adult (36-59)': 0,
      'Elderly (60 and above)': 0,
    };
    users.forEach(u => {
      const ag = u.ageGroup ? String(u.ageGroup).trim() : '';
      if (ag in groups) groups[ag]++;
    });
    // Short labels for chart display, full name for tooltip
    return [
      { name: 'Kids', fullName: 'Kid (12 and below)',    Members: groups['Kid (12 and below)'] },
      { name: 'Youth', fullName: 'Youth (13-35)',        Members: groups['Youth (13-35)'] },
      { name: 'Adults', fullName: 'Adult (36-59)',       Members: groups['Adult (36-59)'] },
      { name: 'Elderly', fullName: 'Elderly (60+)',      Members: groups['Elderly (60 and above)'] },
    ];
  };

  // 5. Gender Distribution
  const getGenderData = () => {
    const counts: { [key: string]: number } = { Male: 0, Female: 0, Other: 0 };
    users.forEach(u => {
      const g = u.gender ? String(u.gender).trim() : '';
      if (g === 'Male') counts.Male++;
      else if (g === 'Female') counts.Female++;
      else if (g === 'Other') counts.Other++;
    });
    const total = counts.Male + counts.Female + counts.Other || 1;
    return [
      { name: 'Male',   Members: counts.Male,   pct: ((counts.Male   / total) * 100).toFixed(1) },
      { name: 'Female', Members: counts.Female, pct: ((counts.Female / total) * 100).toFixed(1) },
      { name: 'Other',  Members: counts.Other,  pct: ((counts.Other  / total) * 100).toFixed(1) },
    ];
  };

  const MIN_COLORS = ['#3b1a62','#8a0062','#5a2d8a','#b5007a','#c90086','#de0092','#f2009e'];

  const memberData = getMemberYearJoinedData();
  const financeData = getFinanceDetailData();
  const cashData = getCashFlowData();
  const ageGroupData = getAgeGroupData();
  const genderData = getGenderData();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '14px' : '16px',
      marginTop: '16px',
    }}>

      {/* 1. Member Distribution by Year Joined */}
      <div style={card}>
        <h4 style={title}>Member Distribution</h4>
        <div style={{ height: chartH, position: 'relative' }}>
          {users.length === 0 && <div style={emptyOverlay}>No data yet</div>}
          {memberData.length === 0 && users.length > 0 && <div style={emptyOverlay}>No year joined data</div>}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={memberData.length > 0 ? memberData : [{name: '', Members: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 28 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                fontSize={7}
                tickLine={{ stroke: '#ccc' }}
                axisLine={{ stroke: '#ccc' }}
                angle={-35}
                textAnchor="end"
                interval={0}
                label={{ value: 'Year Joined RPC', position: 'insideBottom', offset: -15, fontSize: 9, fontWeight: 600 }}
              />
              <YAxis
                fontSize={8}
                tickLine={{ stroke: '#ccc' }}
                axisLine={{ stroke: '#ccc' }}
                allowDecimals={false}
                label={{ value: 'No. of Members', angle: -90, position: 'insideLeft', offset: 25, fontSize: 9, fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(115,0,81,0.05)' }}
                contentStyle={tip}
                formatter={(v: any) => [`${v} member${v !== 1 ? 's' : ''}`, 'Members Joined']}
              />
              <Bar dataKey="Members" radius={[4, 4, 0, 0]} barSize={14}>
                {memberData.map((_, i) => <Cell key={i} fill={MIN_COLORS[i % MIN_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Income Categories */}
      <div style={card}>
        <h4 style={title}>Income Categories</h4>
        <div style={{ height: chartH, position: 'relative' }}>
          {financeData.length === 0 && <div style={emptyOverlay}>No data yet</div>}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financeData.length > 0 ? financeData : [{name:'', Tithe:0, Offering:0, Thanksgiving:0}]} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={8} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} label={{ value: 'Timeline', position: 'insideBottom', offset: -12, fontSize: 9, fontWeight: 600 }} />
              <YAxis fontSize={8} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} label={{ value: 'Amount (KES)', angle: -90, position: 'insideLeft', offset: 12, fontSize: 9, fontWeight: 600 }} />
              <Tooltip contentStyle={tip} formatter={(v: any) => `KES ${Number(v).toLocaleString()}`} />
              <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '8px', paddingTop: '10px' }} />
              <Bar dataKey="Tithe" fill={P} radius={[2, 2, 0, 0]} barSize={8} />
              <Bar dataKey="Offering" fill={G} radius={[2, 2, 0, 0]} barSize={8} />
              <Bar dataKey="Thanksgiving" fill={AMBER} radius={[2, 2, 0, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Financial Flow */}
      <div style={card}>
        <h4 style={title}>Financial Flow</h4>
        <div style={{ height: chartH, position: 'relative' }}>
          {cashData.length === 0 && <div style={emptyOverlay}>No data yet</div>}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashData.length > 0 ? cashData : [{name:'', In:0, Out:0}]} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={8} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} label={{ value: 'Timeline', position: 'insideBottom', offset: -12, fontSize: 9, fontWeight: 600 }} />
              <YAxis fontSize={8} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} label={{ value: 'Value (KES)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 9, fontWeight: 600 }} />
              <Tooltip contentStyle={tip} formatter={(v: any) => `KES ${Number(v).toLocaleString()}`} />
              <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '8px', paddingTop: '10px' }} />
              <Bar dataKey="In" name="Total Income" fill={G} radius={[2, 2, 0, 0]} barSize={10} />
              <Bar dataKey="Out" name="Total Expenses" fill={R} radius={[2, 2, 0, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Age Group Distribution */}
      <div style={card}>
        <h4 style={title}>Members per Age Group</h4>
        <div style={{ height: chartH, position: 'relative' }}>
          {users.length === 0 && <div style={emptyOverlay}>No data yet</div>}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageGroupData} margin={{ top: 10, right: 10, left: -20, bottom: 28 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                fontSize={9}
                tickLine={{ stroke: '#ccc' }}
                axisLine={{ stroke: '#ccc' }}
                interval={0}
                label={{ value: 'Age Groups', position: 'insideBottom', offset: -15, fontSize: 9, fontWeight: 600 }}
              />
              <YAxis
                fontSize={8}
                tickLine={{ stroke: '#ccc' }}
                axisLine={{ stroke: '#ccc' }}
                allowDecimals={false}
                label={{ value: 'No. of Members', angle: -90, position: 'insideLeft', offset: 25, fontSize: 9, fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(115,0,81,0.05)' }}
                contentStyle={tip}
                formatter={(v: any, _key: any, props: any) => [
                  `${v} member${v !== 1 ? 's' : ''}`,
                  props.payload?.fullName || props.payload?.name
                ]}
              />
              <Bar dataKey="Members" radius={[5, 5, 0, 0]} barSize={28}>
                <Cell fill="#3b1a62" />
                <Cell fill="#5a2d8a" />
                <Cell fill="#c9006e" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Gender Distribution */}
      <div style={card}>
        <h4 style={title}>Gender Distribution</h4>
        <div style={{ height: chartH, position: 'relative' }}>
          {users.length === 0 && <div style={emptyOverlay}>No data yet</div>}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={genderData} margin={{ top: 10, right: 10, left: -20, bottom: 28 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                fontSize={10}
                fontWeight={600}
                tickLine={{ stroke: '#ccc' }}
                axisLine={{ stroke: '#ccc' }}
                interval={0}
                label={{ value: 'Gender', position: 'insideBottom', offset: -15, fontSize: 9, fontWeight: 600 }}
              />
              <YAxis
                fontSize={8}
                tickLine={{ stroke: '#ccc' }}
                axisLine={{ stroke: '#ccc' }}
                allowDecimals={false}
                label={{ value: 'No. of People', angle: -90, position: 'insideLeft', offset: 25, fontSize: 9, fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(115,0,81,0.05)' }}
                contentStyle={tip}
                formatter={(v: any, _key: any, props: any) => [
                  `${v} member${v !== 1 ? 's' : ''} (${props.payload?.pct}%)`,
                  props.payload?.name
                ]}
              />
              <Bar dataKey="Members" radius={[6, 6, 0, 0]} barSize={36}>
                <Cell fill="#3b82f6" />  {/* Male — blue */}
                <Cell fill="#ec4899" />  {/* Female — pink */}
                <Cell fill="#8b5cf6" />  {/* Other — violet */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

const emptyOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.7)',
  color: '#999',
  fontSize: '11px',
  fontStyle: 'italic',
};

const card: React.CSSProperties = {
  background: '#fff',
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid #f0f0f0',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
};

const title: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '800',
  color: '#444',
  marginBottom: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
};

const tip: React.CSSProperties = {
  borderRadius: '8px',
  border: 'none',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  fontSize: '11px',
};

export default AnalyticsCharts;
