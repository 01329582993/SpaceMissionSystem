import pool from "@/src/lib/db";
import Link from 'next/link';

async function getMissionFullDetails(id: string) {
  try {
    const mId = parseInt(id);

    const mission = await pool.query("SELECT * FROM Mission WHERE mission_id = $1", [mId]);
    

    const spacecrafts = await pool.query("SELECT * FROM Spacecraft WHERE mission_id = $1", [mId]);
    
  
    const crew = await pool.query(`
      SELECT a.name, mc.position, a.rank 
      FROM astronaut a 
      JOIN mission_crew mc ON a.astronaut_id = mc.astronaut_id 
      WHERE mc.mission_id = $1`, [mId]);

    return { 
      info: mission.rows[0] || null, 
      ships: spacecrafts.rows || [],
      crew: crew.rows || []
    };
  } catch (error) {
    console.error("Database query error:", error);
    return { info: null, ships: [], crew: [] };
  }
}

export default async function MissionDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { info, ships, crew } = await getMissionFullDetails(resolvedParams.id);

  if (!info) {
    return (
      <div style={{ padding: '40px', color: 'white', backgroundColor: '#0b0d17', minHeight: '100vh' }}>
        <Link href="/dashboard" style={{ color: '#4cc9f0' }}>← Return to Dashboard</Link>
        <p style={{ marginTop: '20px' }}>❌ Mission Not Found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', color: 'white', backgroundColor: '#0b0d17', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Link href="/dashboard" style={{ color: '#4cc9f0', textDecoration: 'none' }}>← BACK TO COMMAND</Link>
      
      <header style={{ marginTop: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '3rem', margin: '0' }}>{info.name}</h1>
        <p style={{ color: '#4cc9f0', margin: '5px 0' }}>COMMANDER: {info.commander || "Not assigned"}</p>
      </header>

      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
 
        <div>
          <section style={{ backgroundColor: '#1b1d29', padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
            <h2 style={{ color: '#4cc9f0', marginTop: '0' }}>Primary Objective</h2>
            <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>{info.objective || "No objective data available."}</p>
          </section>

          <h2 style={{ color: '#fff' }}>Deployed Spacecraft</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {ships.map((ship: any) => (
              <div key={ship.spacecraft_id} style={{ backgroundColor: '#1b1d29', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #4cc9f0' }}>
                <h3 style={{ margin: '0' }}>{ship.name}</h3>
                <p style={{ margin: '10px 0', color: '#ccc' }}>Status: {ship.health_status}</p>
                <progress value={ship.fuel_level} max="100" style={{ width: '100%' }}></progress>
                <small>Fuel: {ship.fuel_level}%</small>
              </div>
            ))}
          </div>
        </div>


        <aside style={{ backgroundColor: '#1b1d29', padding: '25px', borderRadius: '15px', height: 'fit-content' }}>
          <h2 style={{ color: '#4cc9f0', marginTop: '0' }}>Mission Crew</h2>
          {crew.length > 0 ? (
            crew.map((member: any, idx: number) => (
              <div key={idx} style={{ padding: '10px 0', borderBottom: '1px solid #333' }}>
                <p style={{ margin: '0', fontWeight: 'bold' }}>{member.name}</p>
                <p style={{ margin: '0', fontSize: '0.8rem', color: '#aaa' }}>{member.rank} - {member.position}</p>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No crew assigned to this mission.</p>
          )}
        </aside>

      </div>
    </div>
  );
}