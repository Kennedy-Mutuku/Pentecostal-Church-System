import React, { useState, useEffect } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

interface FamilyAnalyticsChartsProps {
  families: any[];
}

const FamilyAnalyticsCharts: React.FC<FamilyAnalyticsChartsProps> = ({ families }) => {
  const P = '#730051';
  const PL = '#a0006e';
  const BLUE = '#1d4ed8';
  const PINK = '#be185d';
  const AMBER = '#f59e0b';
  const GREEN = '#10b981';
  const PURPLE = '#8b5cf6';

  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const chartH = 200;

  // 1. Family Size Distribution Data
  const getSizeDistributionData = () => {
    const sizeMap: { [key: string]: number } = {
      '1 Member': 0,
      '2 Members': 0,
      '3-4 Members': 0,
      '5+ Members': 0
    };

    families.forEach(f => {
      const count = f.members ? f.members.length : 0;
      if (count === 1) sizeMap['1 Member']++;
      else if (count === 2) sizeMap['2 Members']++;
      else if (count >= 3 && count <= 4) sizeMap['3-4 Members']++;
      else if (count >= 5) sizeMap['5+ Members']++;
    });

    return Object.entries(sizeMap).map(([name, val]) => ({ name, Families: val }));
  };

  // 2. Gender Distribution within Families
  const getGenderData = () => {
    let male = 0;
    let female = 0;
    let other = 0;

    families.forEach(f => {
      if (Array.isArray(f.members)) {
        f.members.forEach((m: any) => {
          const g = m.gender ? String(m.gender).trim() : '';
          if (g === 'Male') male++;
          else if (g === 'Female') female++;
          else if (g) other++;
        });
      }
    });

    return [
      { name: 'Gents (Male)', count: male, color: BLUE },
      { name: 'Females', count: female, color: PINK },
      { name: 'Other', count: other, color: AMBER }
    ].filter(d => d.count > 0 || d.name !== 'Other');
  };

  // 3. Age Group Breakdown within Families
  const getAgeGroupData = () => {
    const ageMap: { [key: string]: number } = {
      'Kid (≤12)': 0,
      'Youth (13-35)': 0,
      'Adult (36-59)': 0,
      'Elderly (60+)': 0
    };

    families.forEach(f => {
      if (Array.isArray(f.members)) {
        f.members.forEach((m: any) => {
          const ag = m.ageGroup ? String(m.ageGroup).trim() : '';
          if (ag.includes('Kid') || ag.includes('12')) ageMap['Kid (≤12)']++;
          else if (ag.includes('Youth') || ag.includes('13-35')) ageMap['Youth (13-35)']++;
          else if (ag.includes('Adult') || ag.includes('36-59')) ageMap['Adult (36-59)']++;
          else if (ag.includes('Elderly') || ag.includes('60')) ageMap['Elderly (60+)']++;
        });
      }
    });

    return Object.entries(ageMap).map(([name, count]) => ({ name, Members: count }));
  };

  const sizeData = getSizeDistributionData();
  const genderData = getGenderData();
  const ageData = getAgeGroupData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(20, 20, 30, 0.9)',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>{label || payload[0].name}</p>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#ffb703' }}>
            {payload[0].value} {payload[0].name ? 'Members' : 'Count'}
          </p>
        </div>
      );
    }
    return null;
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '16px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
    border: '1px solid #f0f0f0'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    margin: '0 0 14px',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
      {/* 1. Family Size Distribution */}
      <div style={cardStyle}>
        <div style={titleStyle}>
          <span>Family Size Breakdown</span>
          <span style={{ fontSize: '10px', color: P, background: '#fcf2f8', padding: '2px 8px', borderRadius: '12px' }}>Families</span>
        </div>
        <div style={{ width: '100%', height: chartH }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sizeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Families" fill={P} radius={[6, 6, 0, 0]}>
                {sizeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={[P, PL, PURPLE, AMBER][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Family Members Gender Split */}
      <div style={cardStyle}>
        <div style={titleStyle}>
          <span>Gender in Families</span>
          <span style={{ fontSize: '10px', color: BLUE, background: '#eff6ff', padding: '2px 8px', borderRadius: '12px' }}>Members</span>
        </div>
        <div style={{ width: '100%', height: chartH }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={genderData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Age Group Breakdown */}
      <div style={cardStyle}>
        <div style={titleStyle}>
          <span>Age Groups in Families</span>
          <span style={{ fontSize: '10px', color: GREEN, background: '#ecfdf5', padding: '2px 8px', borderRadius: '12px' }}>Demographics</span>
        </div>
        <div style={{ width: '100%', height: chartH }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Members" fill={GREEN} radius={[6, 6, 0, 0]}>
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={[AMBER, GREEN, BLUE, P][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FamilyAnalyticsCharts;
