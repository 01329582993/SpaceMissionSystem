"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

function MissionLink({ missionId }: { missionId: number }) {
  return (
    <Link
      href={`/missions/${missionId}`}
      style={{
        color: '#4cc9f0',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        border: '2px solid #4cc9f0',
        padding: '8px 16px',
        borderRadius: '6px',
        display: 'inline-block',
        transition: 'all 0.2s ease',
        backgroundColor: 'rgba(76, 201, 240, 0.1)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#4cc9f0';
        e.currentTarget.style.color = '#0b0d17';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(76, 201, 240, 0.1)';
        e.currentTarget.style.color = '#4cc9f0';
      }}
    >
      GO TO MISSION {missionId} →
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
      case 'critical': return { color: '#ff4d4d', border: '1px solid #ff4d4d', bg: '#2d1616' };
      case 'high': return { color: '#f72585', border: '1px solid #f72585', bg: '#251221' };
      case 'medium': return { color: '#fee440', border: '1px solid #fee440', bg: '#2a2814' };
      default: return { color: '#4cc9f0', border: '1px solid #4cc9f0', bg: '#16222d' };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', backgroundColor: '#0b0d17', height: '100vh', color: 'white', textAlign: 'center' }}>
        <p>📡 ACCESSING ENCRYPTED ALERT LOGS...</p>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #050b18; }
        ::-webkit-scrollbar-thumb { background: #f72585; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #ff4d4d; }
      `}} />

      <div style={{
        padding: '40px',
        backgroundColor: '#0b0d17',
        height: '100vh',
        color: 'white',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
        overflowY: 'scroll',
        paddingBottom: '300px'
      }}>

        <header style={{
          position: 'sticky', top: 0, backgroundColor: '#0b0d17', zIndex: 10,
          paddingBottom: '20px', borderBottom: '2px solid #f72585'
        }}>
          <Link href="/dashboard" style={{ color: '#4cc9f0', textDecoration: 'none', fontSize: '0.8rem', marginBottom: '10px', display: 'block' }}>← BACK TO COMMAND CENTER</Link>
          <h1 style={{ color: '#f72585', letterSpacing: '2px', margin: 0, fontSize: '2rem', fontWeight: '800' }}>
            SYSTEM ALERTS & NOTIFICATIONS
          </h1>
          <p style={{ color: '#888', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
            ACTIVE SYSTEM LOGS: {alerts.length}
          </p>
        </header>

        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <p style={{ color: '#888', fontSize: '1.2rem' }}>📡 No active alerts in the system.</p>
            </div>
          ) : (
            alerts.map((alert: any) => {
              const style = getSeverityStyle(alert.severity);
              return (
                <div key={alert.alert_id} style={{
                  backgroundColor: style.bg,
                  borderLeft: `5px solid ${style.color}`,
                  padding: '25px', borderRadius: '8px', maxWidth: '1200px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ flex: '1', minWidth: '280px' }}>
                      <span style={{
                        color: style.color, fontWeight: 'bold', fontSize: '0.75rem',
                        textTransform: 'uppercase', padding: '3px 10px', border: `1px solid ${style.color}`,
                        borderRadius: '4px', display: 'inline-block', marginBottom: '12px', backgroundColor: 'rgba(0,0,0,0.3)'
                      }}>
                        {alert.severity}
                      </span>
                      <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: '500', lineHeight: '1.4' }}>
                        {alert.message}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '15px' }}>
                        {new Date(alert.created_at).toLocaleString()}
                      </div>

                      <MissionLink missionId={alert.mission_id} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div style={{ height: '150px' }} />
        </div>
      </div>
    </>
  );
}
