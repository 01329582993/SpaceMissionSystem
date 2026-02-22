import Link from 'next/link';
import { pool } from '@/src/lib/db';
import AnalyticsDashboard from '@/src/components/AnalyticsDashboard';
import CosmoLayout from '@/src/components/CosmoLayout';

async function getMissions() {
  try {
    const result = await pool.query("SELECT * FROM mission_dashboard ORDER BY start_date DESC");
    return result.rows || [];
  } catch (error) {
    console.error("Database query error:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const missions = await getMissions();

  return (
    <CosmoLayout>
      <div style={{ padding: '60px', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '40px' }}>
          <div>
            <h1 style={{ color: '#4cc9f0', margin: 0, fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>
              COMMAND CENTER
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Operational Status: Optimal</p>
          </div>

          <Link href="/missions/new" style={{
            backgroundColor: '#4cc9f0',
            color: '#0b0d17',
            padding: '14px 28px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 0 20px rgba(76, 201, 240, 0.3)'
          }}>
            + Initialize Mission
          </Link>
        </div>

        {/* Dashboard Stats */}
        <AnalyticsDashboard />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '30px', marginTop: '40px' }}>
          {missions.map((m: any) => (
            <div key={m.mission_id} style={{
              backgroundColor: 'rgba(27, 29, 41, 0.7)',
              backdropFilter: 'blur(10px)',
              padding: '30px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h2 style={{ margin: '0', fontSize: '1.5rem', fontWeight: '700' }}>{m.mission_name}</h2>
                <span style={{
                  backgroundColor: m.mission_status.toLowerCase() === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(76, 201, 240, 0.1)',
                  color: m.mission_status.toLowerCase() === 'active' ? '#10b981' : '#4cc9f0',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  border: `1px solid ${m.mission_status.toLowerCase() === 'active' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(76, 201, 240, 0.5)'}`
                }}>
                  {m.mission_status}
                </span>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.6', height: '60px', overflow: 'hidden', marginBottom: '25px' }}>
                {m.objective || "No primary objective assigned."}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <strong style={{ color: '#4cc9f0' }}>{m.spacecraft_count}</strong> VESSELS
                </span>
                <span style={{ color: m.alert_count > 0 ? '#f72585' : 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>
                  {m.alert_count > 0 ? `⚠️ ${m.alert_count} ALERTS` : 'SYSTEMS STABLE'}
                </span>
              </div>

              <Link href={`/missions/${m.mission_id}`} style={{
                display: 'block',
                marginTop: '25px',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#4cc9f0',
                padding: '14px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: '1px solid rgba(76, 201, 240, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                ACCESS DATA LINK
              </Link>
            </div>
          ))}
        </div>
      </div>
    </CosmoLayout>
  );
}
