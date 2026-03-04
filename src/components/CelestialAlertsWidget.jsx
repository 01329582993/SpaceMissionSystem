// src/components/CelestialAlertsWidget.jsx
"use client";

import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function CelestialAlertsWidget() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAlerts() {
            try {
                const res = await fetch("/api/celestial/events");
                const data = await res.json();
                const critical = data.filter(e => e.priority_level === 'high' || e.priority_level === 'critical');
                setAlerts(critical);
            } catch (e) {
                console.error("Failed to fetch alerts", e);
            } finally {
                setLoading(false);
            }
        }
        fetchAlerts();
    }, []);

    if (loading || alerts.length === 0) return null;

    return (
        <div style={{ position: "fixed", bottom: "40px", right: "40px", zIndex: 50, width: "350px", display: "flex", flexDirection: "column", gap: "15px" }}>
            {alerts.map((alert, idx) => (
                <Link href={`/celestial/${alert.event_id}`} key={alert.event_id || idx} style={{ textDecoration: 'none' }}>
                    <div className="alert-card" style={{ background: '#080808', border: '1px solid #ff4d4d', padding: '25px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(255, 77, 77, 0.15)', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: '#ff4d4d', fontWeight: 900, letterSpacing: '1.5px' }}>CRITICAL_ALERT</span>
                            <ShieldAlert size={20} color="#ff4d4d" />
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, margin: '5px 0', letterSpacing: '-1px', color: '#fff', textTransform: 'uppercase' }}>
                            {alert.name}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: '#aaa', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                            // EVENT_T_MINUS // {new Date(alert.start_time).toLocaleString()}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className="ack-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setAlerts(prev => prev.filter(a => a.event_id !== alert.event_id));
                                }}
                                style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                onMouseLeave={e => e.currentTarget.style.color = '#666'}
                            >
                                ACKNOWLEDGE_ALERT
                            </button>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
