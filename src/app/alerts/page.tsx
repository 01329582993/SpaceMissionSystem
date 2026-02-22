"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CosmoLayout from '@/src/components/CosmoLayout';

function MissionLink({ missionId }: { missionId: number }) {
  return (
    <Link
      href={`/missions/${missionId}`}
      style={{
        color: '#4cc9f0',
        textDecoration: 'none',
        fontSize: '0.8rem',
        fontWeight: '800',
        border: '1px solid rgba(76, 201, 240, 0.4)',
        padding: '10px 20px',
        borderRadius: '8px',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(76, 201, 240, 0.05)',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}
    >
      DATA LINK {missionId} →
    </Link>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/alerts', { cache: 'no-store' });
        const data = await res.json();
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  const getSeverityStyle = (sev: string) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return { color: '#f72585', border: 'rgba(247, 37, 133, 0.5)', bg: 'rgba(247, 37, 133, 0.1)' };
      case 'high': return { color: '#ff4d4d', border: 'rgba(255, 77, 77, 0.5)', bg: 'rgba(255, 77, 77, 0.1)' };
      case 'medium': return { color: '#f9c74f', border: 'rgba(249, 199, 79, 0.5)', bg: 'rgba(249, 199, 79, 0.1)' };
      default: return { color: '#4cc9f0', border: 'rgba(76, 201, 240, 0.5)', bg: 'rgba(76, 201, 240, 0.1)' };
    }
  };

  if (loading) {
    return (
      <CosmoLayout>
        <div style={{ padding: '100px', color: 'white', textAlign: 'center' }}>
          <p style={{ color: '#4cc9f0', letterSpacing: '2px', fontWeight: 'bold' }}>📡 ACCESSING ENCRYPTED ALERT LOGS...</p>
        </div>
      </CosmoLayout>
    );
  }

  return (
    <CosmoLayout>
      <div style={{ padding: '60px', color: 'white', fontFamily: 'sans-serif' }}>

        <header style={{ marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <h1 style={{ color: '#f72585', letterSpacing: '-1px', margin: 0, fontSize: '2.5rem', fontWeight: '800' }}>
            SYSTEM ALERTS
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
            ACTIVE OPERATIONAL ANOMALIES: {alerts.length}
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem' }}>📡 No active alerts in the system.</p>
            </div>
          ) : (
            alerts.map((alert: any) => {
              const theme = getSeverityStyle(alert.severity);
              return (
                <div key={alert.alert_id} style={{
                  backgroundColor: 'rgba(27, 29, 41, 0.7)',
                  backdropFilter: 'blur(10px)',
                  borderLeft: `6px solid ${theme.color}`,
                  padding: '30px',
                  borderRadius: '15px',
                  border: '1px solid rgba(255,255,255,0.03)',
                  borderLeftColor: theme.color,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                      <span style={{
                        color: theme.color,
                        fontWeight: '800',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        padding: '5px 12px',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '20px',
                        display: 'inline-block',
                        marginBottom: '15px',
                        backgroundColor: theme.bg,
                        letterSpacing: '1px'
                      }}>
                        {alert.severity}
                      </span>
                      <p style={{ margin: '0', fontSize: '1.3rem', fontWeight: '600', lineHeight: '1.5', color: 'rgba(255,255,255,0.9)' }}>
                        {alert.message}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '20px', fontWeight: 'bold' }}>
                        {new Date(alert.created_at).toLocaleString()}
                      </div>

                      <MissionLink missionId={alert.mission_id} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </CosmoLayout>
  );
}

