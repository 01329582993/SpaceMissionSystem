"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import CosmoLayout from "@/src/components/CosmoLayout";

export default function TelemetryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [rawTelemetry, setRawTelemetry] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching telemetry for the specific spacecraft/mission ID
    fetch(`/api/telemetry?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const dataArray = Array.isArray(data) ? data : (data?.rows || [data]);
        setRawTelemetry(dataArray);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Mission-Unique Data Engine
  const telemetry = useMemo(() => {
    // Use the ID as a numerical seed to make missions look different
    const seed = parseInt(typeof id === 'string' ? id : '1') || 1;

    return rawTelemetry.map((item, index) => {
      const baseTime = item.recorded_at ? new Date(item.recorded_at) : new Date();
      // Sequential time: each log entry is spaced by 3 minutes
      const sequenceTime = new Date(baseTime.getTime() - index * 180000);
      
      /**
       * MISSION-SPECIFIC VARIANCE
       * We use Math.sin with the mission ID seed so Mission A is always 
       * different from Mission B, but consistently the same for that ID.
       */
      const missionVariance = (offset: number) => Math.sin(seed + index + offset);

      return {
        ...item,
        displayTime: sequenceTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        // Dynamic values adjusted by mission seed
        vTemp: (parseFloat(item.temperature || 22.0) + missionVariance(10) * 2.5).toFixed(2),
        vVolt: (parseFloat(item.voltage || 120.0) + missionVariance(50) * 5.0).toFixed(1),
        vRad: Math.abs(parseFloat(item.radiation || 0.01) + missionVariance(100) * 0.005).toFixed(4)
      };
    });
  }, [rawTelemetry, id]);

  if (loading) return <div style={loaderStyle}>ESTABLISHING_MISSION_UPLINK...</div>;

  const latest = telemetry[0] || { vTemp: "0.00", vVolt: "0.0", vRad: "0.0000", mission_id: "N/A" };

  return (
    <CosmoLayout>
      <div style={pageContainer}>
        <header style={headerNav}>
          <div>
            <h1 style={titleStyle}>MISSION_CONTROL // DEEP_SPACE_TELEMETRY</h1>
            <p style={subTitleStyle}>
              SPACECRAFT_ID: {id} // MISSION_ASSIGNMENT: {latest.mission_id || 'ALPHA-01'} // STATUS: NOMINAL
            </p>
            <button onClick={() => router.push('/spacecraft')} style={backBtn}>« EXIT_SECURE_LINK</button>
          </div>
          <div style={statusBadge(latest.vTemp)}>
            {parseFloat(latest.vTemp) > 26 ? 'THERMAL_CRITICAL' : 'LINK_STABLE'}
          </div>
        </header>

        <div style={telemetryGrid}>
          {/* HULL THERMAL LOAD */}
          <div style={telemetryCard}>
            <div style={labelStyle}>HULL_THERMAL_LOAD</div>
            <div style={{...valueStyle, color: parseFloat(latest.vTemp) > 26 ? '#ff0055' : '#00ffd5'}}>
              {latest.vTemp}°C
            </div>
            <div style={miniGraph}>
               {telemetry.slice(0, 15).reverse().map((t, i) => (
                 <div key={i} style={{...bar, height: `${(parseFloat(t.vTemp) / 45) * 100}%`, background: parseFloat(t.vTemp) > 26 ? '#ff0055' : '#00ffd5'}} />
               ))}
            </div>
          </div>

          {/* RADIATION FLUX */}
          <div style={telemetryCard}>
            <div style={labelStyle}>RADIATION_FLUX</div>
            <div style={{...valueStyle, color: '#fbbf24'}}>
              {latest.vRad} <small style={{fontSize: '1rem'}}>mSv</small>
            </div>
            <p style={descText}>SHIELDING_INTEGRITY: 99.9%</p>
            <div style={pulseLine(latest.vRad)} />
          </div>

          {/* BUS VOLTAGE */}
          <div style={telemetryCard}>
            <div style={labelStyle}>BUS_VOLTAGE</div>
            <div style={{...valueStyle, color: '#3B82F6'}}>
              {latest.vVolt}V
            </div>
            <div style={voltageStatus}>PRIMARY_POWER_STABLE</div>
          </div>
        </div>

        {/* SYSTEM LOG TABLE */}
        <div style={{marginTop: '50px'}}>
           <h2 style={sectionTitle}>// HISTORICAL_MISSION_DATA_STREAM</h2>
           <div style={tableWrapper}>
             <table style={tableStyle}>
                <thead>
                  <tr style={tableHeader}>
                    <th style={thStyle}>UTC_TIME</th>
                    <th style={thStyle}>HULL_TEMP</th>
                    <th style={thStyle}>VOLTAGE</th>
                    <th style={thStyle}>RAD_EXP</th>
                  </tr>
                </thead>
                <tbody>
                  {telemetry.map((t, i) => (
                    <tr key={i} style={tableRow}>
                      <td style={tdStyle}>{t.displayTime}</td>
                      <td style={{...tdStyle, color: '#00ffd5'}}>{t.vTemp}°C</td>
                      <td style={tdStyle}>{t.vVolt}V</td>
                      <td style={{...tdStyle, color: '#fbbf24'}}>{t.vRad} mSv</td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </CosmoLayout>
  );
}

/* --- STYLES --- */
const pageContainer: any = { padding: "60px", backgroundColor: "#000", minHeight: "100vh", color: "#FFF", fontFamily: "'Courier New', monospace" };
const headerNav = { display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '2px solid #1a1a1a', paddingBottom: '30px' };
const titleStyle = { margin: 0, fontSize: '1.5rem', fontWeight: 900, letterSpacing: '4px' };
const subTitleStyle = { color: '#00ffd5', fontSize: '0.7rem', marginTop: '8px', opacity: 0.8 };
const backBtn = { background: '#111', border: '1px solid #333', color: '#666', cursor: 'pointer', fontSize: '0.6rem', marginTop: '15px', padding: '5px 10px' };
const statusBadge = (temp: string) => ({ border: `1px solid ${parseFloat(temp) > 26 ? '#ff0055' : '#00ffd5'}`, color: parseFloat(temp) > 26 ? '#ff0055' : '#00ffd5', padding: '10px 20px', height: 'fit-content', fontSize: '0.7rem', letterSpacing: '2px' });
const telemetryGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' };
const telemetryCard = { background: '#050505', border: '1px solid #151515', padding: '35px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' };
const labelStyle = { fontSize: '0.6rem', color: '#444', letterSpacing: '3px', fontWeight: 'bold' };
const valueStyle = { fontWeight: 900, fontSize: '3.5rem', marginTop: '15px' };
const miniGraph = { display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px', marginTop: '25px' };
const bar = { width: '100%', opacity: 0.7 };
const descText = { fontSize: '0.65rem', color: '#333', marginTop: '15px' };
const pulseLine = (rad: string) => ({ height: '1px', width: '100%', background: '#fbbf24', marginTop: '12px', boxShadow: '0 0 10px #fbbf24' });
const voltageStatus = { marginTop: '20px', padding: '8px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3B82F6', fontSize: '0.6rem', color: '#3B82F6', textAlign: 'center' as const };
const sectionTitle = { fontSize: '0.75rem', color: '#222', marginBottom: '25px', letterSpacing: '5px' };
const tableWrapper = { border: '1px solid #111' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' as const };
const tableHeader = { textAlign: 'left' as const, background: '#080808' };
const thStyle = { padding: '20px', fontSize: '0.65rem', color: '#444', borderBottom: '1px solid #111' };
const tableRow = { borderBottom: '1px solid #080808' };
const tdStyle = { padding: '20px', fontSize: '0.8rem', color: '#888' };
const loaderStyle: any = { color: '#00ffd5', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' };