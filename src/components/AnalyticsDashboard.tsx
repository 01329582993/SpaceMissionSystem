"use client";

import React, { useState, useEffect } from 'react';
import { Rocket, Users, ShieldAlert, Zap } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/analytics')
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error("Analytics error:", err));
    }, []);

    if (!data) return <div style={{ color: '#444', padding: '20px' }}>INITIALIZING ANALYTICS...</div>;

    const { stats } = data;

    const cards = [
        { title: 'Fleet Readiness', value: `${stats.operational_vessels}/${stats.total_spacecraft}`, sub: 'OPERATIONAL VESSELS', icon: <Rocket color="#4cc9f0" /> },
        { title: 'Crew Deployment', value: `${stats.utilization_pct}%`, sub: `${stats.deployed_personnel} OFFICERS ON MISSION`, icon: <Users color="#10b981" /> },
        { title: 'Energy Reserves', value: `${stats.avg_fuel_level}%`, sub: 'AVG FLEET FUEL', icon: <Zap color="#f72585" /> },
        { title: 'Active Missions', value: stats.active_missions, sub: 'CURRENT OPERATIONS', icon: <ShieldAlert color="#ff9f1c" /> },
    ];

    return (
        <div style={{ padding: '30px', backgroundColor: '#161925', borderRadius: '15px', border: '1px solid #2a2d3e', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 25px 0', fontSize: '1rem', color: '#4cc9f0', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Operational Command Analytics
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {cards.map((card, i) => (
                    <div key={i} style={{ backgroundColor: '#0b0d17', padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>{card.title}</span>
                            {card.icon}
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>{card.value}</div>
                        <div style={{ fontSize: '0.6rem', color: '#4cc9f0', fontWeight: 'bold' }}>{card.sub}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
