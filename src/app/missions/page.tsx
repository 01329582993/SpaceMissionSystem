import Link from 'next/link';

async function getMissionsList() {
  const res = await fetch('http://localhost:3000/api/missions', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function MissionsCatalogPage() {
  const missions = await getMissionsList();

  return (
    <>
      {/* Custom Terminal Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050b18;
        }
        ::-webkit-scrollbar-thumb {
          background: #4cc9f0;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `}} />

      <div style={{ 
        padding: '40px', 
        backgroundColor: '#0b0d17', 
        height: '100vh', 
        color: 'white', 
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
        overflowY: 'scroll', // Ensures the custom scrollbar is active
        paddingBottom: '350px' // Lifts content high enough to clear your taskbar
      }}>
        
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px',
          position: 'sticky', // Keeps header visible while scrolling
          top: 0,
          backgroundColor: '#0b0d17',
          zIndex: 10,
          paddingBottom: '20px'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#fff' }}>
              MISSION DIRECTORY
            </h1>
            <p style={{ color: '#4cc9f0', margin: '5px 0 0 0', letterSpacing: '1px' }}>
              TOTAL OPERATIONS LOGGED: {missions.length}
            </p>
          </div>
          <Link href="/dashboard" style={{ 
            padding: '10px 20px', 
            border: '1px solid #4cc9f0', 
            color: '#4cc9f0', 
            textDecoration: 'none', 
            borderRadius: '4px', 
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            RETURN TO COMMAND
          </Link>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {missions.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', marginTop: '50px' }}>
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
                  backgroundColor: '#161925', 
                  padding: '25px 30px', 
                  borderRadius: '12px', 
                  display: 'grid', 
                  gridTemplateColumns: '1.5fr 2.5fr 1fr 1fr 50px', 
                  alignItems: 'center',
                  border: '1px solid #2a2d3e',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  {/* Mission ID and Name */}
                  <div>
                    <span style={{ color: '#4cc9f0', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      ID: {m.mission_id}
                    </span>
                    <h3 style={{ margin: '5px 0 0 0', fontSize: '1.2rem' }}>{m.mission_name}</h3>
                  </div>

                  {/* Clean Objective Column */}
                  <div style={{ color: '#aaa', fontSize: '0.9rem', paddingRight: '20px' }}>
                    {m.objectives ? m.objectives.substring(0, 100) + '...' : ''}
                  </div>

                  {/* Status Tag */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ 
                      color: m.mission_status === 'active' ? '#10b981' : '#f72585', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase',
                      border: `1px solid ${m.mission_status === 'active' ? '#10b981' : '#f72585'}`,
                      padding: '6px 16px',
                      borderRadius: '20px',
                      backgroundColor: 'rgba(0,0,0,0.2)'
                    }}>
                      {m.mission_status}
                    </span>
                  </div>

                  {/* Asset & Alert Stats */}
                  <div style={{ textAlign: 'right', fontSize: '0.95rem' }}>
                    <div style={{ color: '#4cc9f0' }}>{m.spacecraft_count || 0} Assets</div>
                    <div style={{ color: (m.alert_count || 0) > 0 ? '#ff4d4d' : '#666' }}>
                      {m.alert_count || 0} Alerts
                    </div>
                  </div>

                  {/* Detail Indicator */}
                  <div style={{ textAlign: 'right', color: '#4cc9f0', fontSize: '1.5rem' }}>
                    ›
                  </div>
                </div>
              </Link>
            ))
          )}
          {/* Spacer at the bottom to ensure the last mission card is lifted high */}
          <div style={{ height: '100px' }} />
        </div>
      </div>
    </>
  );
}