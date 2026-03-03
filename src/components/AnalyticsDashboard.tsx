"use client";

import { Rocket, Users, Zap, ShieldAlert } from "lucide-react";

interface StatsProps {
  stats?: {
    operational_vessels: number;
    total_spacecraft: number;
    utilization_pct: number;
    deployed_personnel: number;
    avg_fuel_level: number;
    active_missions: number;
  };
}

export default function AnalyticsDashboard({ stats }: StatsProps) {
  // Defensive check: If stats are missing, show loading state instead of crashing
  if (!stats) {
    return (
      <div style={{ padding: '20px', color: '#444', letterSpacing: '2px', fontSize: '0.8rem' }}>
        // INITIALIZING_ANALYTICS_DATA...
      </div>
    );
  }

  const cards = [
    { 
      title: 'FLEET_READINESS', 
      value: `${stats.operational_vessels}/${stats.total_spacecraft}`, 
      sub: 'OPERATIONAL_VESSELS', 
      icon: <Rocket size={20} color="#4cc9f0" /> 
    },
    { 
      title: 'CREW_DEPLOYMENT', 
      value: `${stats.utilization_pct}%`, 
      sub: `${stats.deployed_personnel} PERSONNEL_OFF_WORLD`, 
      icon: <Users size={20} color="#10b981" /> 
    },
    { 
      title: 'ENERGY_RESERVES', 
      value: `${stats.avg_fuel_level}%`, 
      sub: 'AVG_FLEET_FUEL_CAPACITY', 
      icon: <Zap size={20} color="#f72585" /> 
    },
    { 
      title: 'ACTIVE_OPERATIONS', 
      value: stats.active_missions, 
      sub: 'MISSION_CRITICAL_TASKS', 
      icon: <ShieldAlert size={20} color="#ff9f1c" /> 
    },
  ];

  return (
    <div style={gridStyle}>
      {cards.map((card, i) => (
        <div key={i} style={cardStyle}>
          <div style={cardTop}>
            <span style={labelStyle}>{card.title}</span>
            {card.icon}
          </div>
          <div style={valueStyle}>{card.value}</div>
          <div style={subStyle}>// {card.sub}</div>
        </div>
      ))}
    </div>
  );
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' };
const cardStyle = { background: '#080808', border: '1px solid #151515', padding: '25px', borderRadius: '4px' };
const cardTop = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' };
const labelStyle = { fontSize: '0.7rem', color: '#555', fontWeight: 900, letterSpacing: '1.5px' };
const valueStyle = { fontSize: '2rem', fontWeight: 900, margin: '5px 0', letterSpacing: '-1px' };
const subStyle = { fontSize: '0.6rem', color: '#333', fontWeight: 900, letterSpacing: '1px' };