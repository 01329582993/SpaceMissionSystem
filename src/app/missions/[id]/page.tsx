import pool from "@/src/lib/db";
import Link from 'next/link';
import CrewAssignmentForm from '@/src/components/CrewAssignmentForm';
import VesselAssignmentForm from '@/src/components/VesselAssignmentForm';
import MissionTelemetryChart from '@/src/components/MissionTelemetryChart';
import MissionPhaseTimeline from '@/src/components/MissionPhaseTimeline';
import LaunchButton from '@/src/components/LaunchButton';
import CosmoLayout from '@/src/components/CosmoLayout';

async function getMissionFullDetails(id: string) {
  try {
    const mId = parseInt(id);

    const mission = await pool.query("SELECT * FROM mission WHERE mission_id = $1", [mId]);

    const spacecrafts = await pool.query("SELECT * FROM spacecraft WHERE mission_id = $1", [mId]);

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
  const mId = parseInt(resolvedParams.id);

  if (!info) {
    return (
      <CosmoLayout>
        <div style={{ padding: '40px', color: 'white' }}>
          <Link href="/dashboard" style={{ color: '#4cc9f0' }}>← Return to Dashboard</Link>
          <p style={{ marginTop: '20px' }}>❌ Mission Not Found.</p>
        </div>
      </CosmoLayout>
    );
  }

  return (
    <CosmoLayout>
      <div style={{ padding: '60px', color: 'white', fontFamily: 'sans-serif' }}>

        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '3.5rem', margin: '0', fontWeight: '800', letterSpacing: '-1px' }}>{info.name}</h1>
          <p style={{ color: '#4cc9f0', margin: '10px 0', fontSize: '1.1rem', fontWeight: '500' }}>COMMANDER: {info.commander || "Not assigned"}</p>
        </header>

        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>

          <div>
            <MissionPhaseTimeline missionId={mId} />
            <section style={{ backgroundColor: 'rgba(27, 29, 41, 0.7)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '20px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ color: '#4cc9f0', marginTop: '0', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Primary Objective</h2>
              <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>{info.objective || "No objective data available."}</p>
            </section>

            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '20px' }}>Deployed Spacecraft</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {ships.map((ship: any) => (
                <div key={ship.spacecraft_id} style={{ backgroundColor: 'rgba(27, 29, 41, 0.7)', backdropFilter: 'blur(10px)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid #4cc9f0' }}>
                  <h3 style={{ margin: '0', fontSize: '1.2rem' }}>{ship.name}</h3>
                  <p style={{ margin: '10px 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Status: {ship.health_status}</p>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden', margin: '15px 0 5px 0' }}>
                    <div style={{ backgroundColor: '#4cc9f0', height: '100%', width: `${ship.fuel_level}%` }} />
                  </div>
                  <small style={{ color: '#4cc9f0', fontWeight: 'bold' }}>Fuel: {ship.fuel_level}%</small>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '40px' }}>
              <MissionTelemetryChart missionId={mId} />
            </div>
          </div>


          <aside style={{ backgroundColor: 'rgba(27, 29, 41, 0.7)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '20px', height: 'fit-content', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ color: '#4cc9f0', marginTop: '0', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Mission Crew</h2>
            <div style={{ marginTop: '20px', marginBottom: '30px' }}>
              {crew.length > 0 ? (
                crew.map((member: any, idx: number) => (
                  <div key={idx} style={{ padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ margin: '0', fontWeight: 'bold', fontSize: '1.1rem' }}>{member.name}</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#4cc9f0', opacity: 0.8 }}>{member.rank} - {member.position}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No crew assigned to this mission.</p>
              )}
            </div>

            <LaunchButton missionId={mId} status={info.status} />
            <CrewAssignmentForm missionId={mId} />
            <VesselAssignmentForm missionId={mId} />
          </aside>

        </div>
      </div>
    </CosmoLayout>
  );
}
