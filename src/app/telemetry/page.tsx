import Link from 'next/link';

async function getTelemetry() {
 
  const res = await fetch('http://localhost:3000/api/telemetry', { cache: 'no-store' });
  return res.ok ? res.json() : [];
}

export default async function TelemetryPage() {
  const data = await getTelemetry();

  return (
    <div style={{ padding: '40px', backgroundColor: '#0b0d17', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#4cc9f0', borderBottom: '2px solid #4cc9f0', paddingBottom: '10px' }}>
        LIVE TELEMETRY STREAM
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
        {data.map((t: any) => (
          <div key={t.telemetry_id} style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1.5fr', 
            backgroundColor: '#1b1d29', 
            padding: '20px', 
            borderRadius: '8px', 
            borderLeft: '4px solid #4cc9f0',
            alignItems: 'center'
          }}>
            <span><strong style={{color: '#4cc9f0'}}>CRAFT ID:</strong> {t.spacecraft_id}</span>
            <span style={{ color: t.temperature > 95 ? '#ff4d4d' : '#fff' }}>
              {t.temperature > 95 ? '⚠️ ' : ''}TEMP: {t.temperature}°C
            </span>
            <span>FUEL: {t.fuel_level}%</span>
            <span style={{ fontSize: '0.85rem', color: '#888' }}>
              {new Date(t.recorded_at).toLocaleTimeString()}
            </span>

           
            <div style={{ textAlign: 'right' }}>
              <Link href={`/missions/${t.mission_id || 1}`} style={{ 
                backgroundColor: 'transparent',
                color: '#4cc9f0',
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #4cc9f0',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                TRACK MISSION →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}