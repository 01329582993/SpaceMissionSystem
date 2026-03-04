import React from 'react';
import Link from 'next/link';
import { pool } from '@/src/lib/db';
import CosmoLayout from '@/src/components/CosmoLayout';

async function getMissionDetails(id: string) {
  try {
    // 1. Fetch Mission and Spacecraft ID
    const missionRes = await pool.query(
      `SELECT 
        m.*, 
        u.username as commander_name,
        s.name as spacecraft_name,
        s.spacecraft_id
       FROM mission m 
       LEFT JOIN users u ON m.commander_id = u.user_id 
       LEFT JOIN spacecraft s ON s.mission_id = m.mission_id
       WHERE m.mission_id = $1
       LIMIT 1`, 
      [id]
    );

    if (missionRes.rows.length === 0) return null;
    const mission = missionRes.rows[0];

    // 2. Fetch fuel from the table where it actually exists (telemetry or spacecraft)
    // Based on your Fuel Route, we pull from spacecraft but if that failed, 
    // we check telemetry which is where the simulation stores it.
    let currentFuel = 0;
    if (mission.spacecraft_id) {
      const fuelRes = await pool.query(
        `SELECT fuel_level FROM telemetry 
         WHERE spacecraft_id = $1 
         ORDER BY telemetry_id DESC LIMIT 1`,
        [mission.spacecraft_id]
      );
      
      if (fuelRes.rows.length > 0) {
        currentFuel = fuelRes.rows[0].fuel_level;
      }
    }

    return {
      ...mission,
      spacecraft_name: mission.spacecraft_name || "UNASSIGNED",
      fuel_level: currentFuel
    };
  } catch (err) {
    console.error("DB_FETCH_ERROR:", err);
    return null;
  }
}

export default async function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mission = await getMissionDetails(id);

  if (!mission) {
    return (
      <CosmoLayout>
        <div style={{ color: '#ff4d4d', padding: '100px', fontSize: '1.2rem', fontFamily: 'monospace' }}>
          FATAL_ERROR: MISSION_ID_0{id}_NOT_FOUND_IN_ARCHIVES
        </div>
      </CosmoLayout>
    );
  }

  const status = (mission.status || "PLANNED").toUpperCase();

  return (
    <CosmoLayout>
      <div style={containerStyle}>
        
        {/* HEADER SECTION */}
        <header style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={techLabel}>MISSION_DEBRIEF // SERIAL_ID_{mission.mission_id.toString().padStart(3, '0')}</span>
              <h1 style={titleStyle}>{mission.name}</h1>
            </div>
            <div style={statusBadge(status)}>{status}</div>
          </div>
        </header>

        <div style={mainGrid}>
          
          {/* LEFT: MISSION INTEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={statBox}>
              <span style={techLabel}>COMMANDER_IN_CHARGE</span>
              <div style={statVal}>{mission.commander_name || 'cmd_unassigned'}</div>
            </div>

            <div style={{ ...statBox, borderLeft: '4px solid #3b82f6' }}>
                <span style={{ ...techLabel, color: '#3b82f6' }}>ASSIGNED_SPACECRAFT</span>
                <div style={{ ...statVal, fontSize: '1.8rem', textTransform: 'uppercase' }}>
                  {mission.spacecraft_name}
                </div>
            </div>
            
            <div style={statBox}>
              <span style={techLabel}>MISSION_OBJECTIVE</span>
              <p style={objectiveText}>{mission.objective || 'N/A'}</p>
            </div>

            <Link href={`/missions/${id}/health`} style={healthLinkBtn}>
              ACCESS_BIOMETRIC_&_LIFE_SUPPORT_MODULE →
            </Link>
          </div>

          {/* RIGHT: PROPULSION TELEMETRY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Link href="/fuel" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ ...statBox, border: '1px solid #1a1a1a', cursor: 'pointer' }}>
                <span style={techLabel}>PROPULSION_TELEMETRY [OPEN_SIMULATOR]</span>
                <div style={{ marginTop: '20px' }}>
                  <div style={telemetryRow}>
                    <span style={{ color: '#888' }}>FUEL_RESERVES</span>
                    <span style={{ 
                      fontSize: '1.2rem', 
                      color: mission.fuel_level < 15 ? '#ff4d4d' : '#4ade80' 
                    }}>
                      {Number(mission.fuel_level).toFixed(1)}%
                    </span>
                  </div>
                  <div style={gaugeBg}>
                    <div style={{ 
                      ...gaugeFill, 
                      width: `${mission.fuel_level}%`,
                      backgroundColor: mission.fuel_level < 15 ? '#ff4d4d' : '#3b82f6' 
                    }} />
                  </div>
                </div>
              </div>
            </Link>

            <div style={statBox}>
                <span style={techLabel}>START_DATE</span>
                <div style={{ fontSize: '1.2rem', marginTop: '10px', color: '#FFFFFF', fontWeight: 'bold' }}>
                    {mission.start_date ? new Date(mission.start_date).toDateString().toUpperCase() : 'TBD'}
                </div>
            </div>
          </div>
        </div>
      </div>
    </CosmoLayout>
  );
}

/* --- STYLES --- */
const containerStyle: React.CSSProperties = { backgroundColor: '#000', minHeight: '100vh', color: '#FFFFFF', padding: '40px', fontFamily: 'monospace' };
const headerStyle: React.CSSProperties = { borderBottom: '1px solid #1a1a1a', paddingBottom: '20px', marginBottom: '30px' };
const titleStyle: React.CSSProperties = { fontSize: '3rem', fontWeight: '900', margin: '5px 0', color: '#FFFFFF', letterSpacing: '-2px', textTransform: 'uppercase' };
const mainGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' };
const techLabel = { fontSize: '0.65rem', color: '#444', letterSpacing: '2px', fontWeight: 'bold' as const };
const statVal = { fontSize: '1.6rem', fontWeight: 'bold' as const, marginTop: '8px', color: '#EEE' };
const statBox = { background: '#080808', padding: '30px', border: '1px solid #111' };
const objectiveText = { color: '#888', lineHeight: '1.6', fontSize: '1rem', marginTop: '15px' };
const telemetryRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginBottom: '10px', fontWeight: 'bold' as const };
const gaugeBg = { width: '100%', height: '6px', background: '#111', borderRadius: '1px', overflow: 'hidden' };
const gaugeFill = { height: '100%', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' };
const healthLinkBtn: React.CSSProperties = { display: 'block', marginTop: '10px', padding: '15px', textAlign: 'center', border: '1px solid #4ade80', color: '#4ade80', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: 'rgba(74, 222, 128, 0.03)' };

const statusBadge = (s: string) => ({
  padding: '6px 15px', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 'bold' as const,
  backgroundColor: s === 'ACTIVE' ? '#4ade8022' : '#FFFFFF',
  color: s === 'ACTIVE' ? '#4ade80' : '#000',
  border: s === 'ACTIVE' ? '1px solid #4ade80' : 'none'
});