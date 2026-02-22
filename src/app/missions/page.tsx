import Link from 'next/link';
import { pool } from '@/src/lib/db';
import CosmoLayout from '@/src/components/CosmoLayout';

async function getMissionsList() {
  try {
    const result = await pool.query("SELECT * FROM mission_dashboard ORDER BY mission_id DESC");
    return result.rows;
  } catch (err) {
    console.error("Missions Directory DB Error:", err);
    return [];
  }
}

export default async function MissionsCatalogPage() {
  const missions = await getMissionsList();

  return (
    <CosmoLayout>
      <div style={{ padding: '60px', color: 'white', fontFamily: 'sans-serif' }}>

        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '20px'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#4cc9f0', letterSpacing: '-1px' }}>
              MISSION DIRECTORY
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
              TOTAL OPERATIONS LOGGED: {missions.length}
            </p>
          </div>

          <Link href="/missions/new" style={{
            padding: '14px 28px',
            backgroundColor: '#4cc9f0',
            color: '#0b0d17',
            textDecoration: 'none',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 0 20px rgba(76, 201, 240, 0.3)'
          }}>
            + New Mission
          </Link>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {missions.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '100px', fontSize: '1.2rem' }}>
              📡 No missions found in the database.
            </div>
          ) : (
            missions.map((m: any) => (
              <Link
                key={m.mission_id}
                href={`/missions/${m.mission_id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  backgroundColor: 'rgba(27, 29, 41, 0.7)',
                  backdropFilter: 'blur(10px)',
                  padding: '30px',
                  borderRadius: '20px',
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 3fr 1fr 1fr 40px',
                  alignItems: 'center',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  {/* Mission ID and Name */}
                  <div>
                    <span style={{ color: '#4cc9f0', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      ASSET ID: {m.mission_id}
                    </span>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '1.3rem', fontWeight: '700' }}>{m.mission_name}</h3>
                  </div>

                  {/* Clean Objective Column */}
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', paddingRight: '40px', lineHeight: '1.6' }}>
                    {m.objective ? (m.objective.length > 120 ? m.objective.substring(0, 120) + '...' : m.objective) : 'NO PRIMARY OBJECTIVE ASSIGNED'}
                  </div>

                  {/* Status Tag */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      color: m.mission_status.toLowerCase() === 'active' ? '#10b981' : '#4cc9f0',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      border: `1px solid ${m.mission_status.toLowerCase() === 'active' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(76, 201, 240, 0.5)'}`,
                      padding: '8px 18px',
                      borderRadius: '20px',
                      backgroundColor: m.mission_status.toLowerCase() === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(76, 201, 240, 0.1)',
                      letterSpacing: '1px'
                    }}>
                      {m.mission_status}
                    </span>
                  </div>

                  {/* Asset & Alert Stats */}
                  <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                    <div style={{ color: '#4cc9f0', fontWeight: 'bold' }}>{m.spacecraft_count || 0} CRAFT</div>
                    <div style={{ color: (m.alert_count || 0) > 0 ? '#f72585' : 'rgba(255,255,255,0.3)', fontWeight: '800', marginTop: '5px' }}>
                      {m.alert_count || 0} ALERTS
                    </div>
                  </div>

                  {/* Detail Indicator */}
                  <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.2)', fontSize: '1.8rem', fontWeight: '100' }}>
                    ›
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </CosmoLayout>
  );
}
