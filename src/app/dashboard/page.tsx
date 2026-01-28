import Link from 'next/link';

async function getMissions() {
  const res = await fetch('http://localhost:3000/api/missions', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function DashboardPage() {
  const missions = await getMissions();

  return (
    <div style={{ padding: '40px', backgroundColor: '#0b0d17', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#4cc9f0', borderBottom: '2px solid #4cc9f0', paddingBottom: '10px', letterSpacing: '2px' }}>
        COSMOTRACK COMMAND CENTER
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px', marginTop: '30px' }}>
        {missions.map((m: any) => (
          <div key={m.mission_id} style={{ backgroundColor: '#1b1d29', padding: '25px', borderRadius: '12px', border: '1px solid #2a2d3e' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>{m.mission_name}</h2>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ 
                backgroundColor: m.mission_status === 'active' ? '#10b981' : '#3f37c9', 
                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' 
              }}>
                {m.mission_status.toUpperCase()}
              </span>
            </div>
            <p style={{ color: '#aaa', fontSize: '0.9rem', height: '60px', overflow: 'hidden' }}>
              {m.objective || "No primary objective assigned."}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', color: '#4cc9f0', fontSize: '0.85rem' }}>
              <span> {m.spacecraft_count} Craft</span>
              <span style={{ color: m.alert_count > 0 ? '#ff4d4d' : '#4cc9f0' }}>⚠️ {m.alert_count} Alerts</span>
            </div>

            <Link href={`/missions/${m.mission_id}`} style={{ 
              display: 'block', marginTop: '15px', textAlign: 'center', backgroundColor: '#4cc9f0', 
              color: '#0b0d17', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'
            }}>
              INITIALIZE DATA LINK
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}