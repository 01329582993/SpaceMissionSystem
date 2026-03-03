"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import CosmoLayout from "@/src/components/CosmoLayout";

export default function ProPlusHealthPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(true);

  // Sync heartbeat animation - Moderate 800ms rhythm
  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`/api/health/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [id]);

  // --- LOGIC ENGINES ---
  const calculateReadiness = (member: any) => {
    const hrDev = Math.abs(member.heart_rate - 72); 
    const bpDev = Math.abs(member.blood_pressure_sys - 120) + Math.abs(member.blood_pressure_dia - 80);
    let penalty = (member.stress_level * 0.4) + (hrDev * 0.5) + (bpDev * 0.2);
    return Math.max(Math.min(Math.round(100 - penalty), 100), 0);
  };

  const envStatus = useMemo(() => {
    if (!data?.environment) return { label: "OFFLINE", color: "#666" };
    const { o2_level, co2_level, temperature } = data.environment;
    if (o2_level < 18 || co2_level > 0.5 || temperature > 35) return { label: "CRITICAL", color: "#FF4D4D" };
    if (o2_level < 20 || temperature > 28) return { label: "STABILITY_LOW", color: "#FBBF24" };
    return { label: "NOMINAL", color: "#00FF41" };
  }, [data]);

  if (loading) return (
    <div style={loaderStyle}>
      <div style={scanLine} />
      SYNCHRONIZING_BIO_LINK...
    </div>
  );

  const avgReadiness = data.crew.length 
    ? Math.round(data.crew.reduce((acc: number, m: any) => acc + calculateReadiness(m), 0) / data.crew.length)
    : 0;

  return (
    <CosmoLayout>
      <div style={containerStyle}>
        
        {/* HEADER SECTION */}
        <header style={headerWrapper}>
          <div>
            <h1 style={mainTitle}>HEALTH_DIAGNOSTICS_V4</h1>
            <p style={subTitle}>LOG_ID: {id} // STATUS: {envStatus.label}</p>
          </div>
          
          <div style={readinessOrb(avgReadiness)}>
            <div style={orbText}>
              <span style={labelSmall}>FLEET_READY</span>
              <div style={orbValue}>{avgReadiness}%</div>
            </div>
          </div>
        </header>

        <div style={dashboardGrid}>
          
          {/* LIFE SUPPORT (ENVIRONMENT) */}
          <section>
            <h2 style={sectionHeader}>// ENVIRONMENTAL_SYSTEMS</h2>
            <div style={cardStyle}>
              <div style={envStatusRow}>
                <span style={{ color: envStatus.color, fontWeight: 'bold', fontSize: '1rem' }}>{envStatus.label}</span>
                <span style={pulseStyle(pulse)}>● FEED_ACTIVE</span>
              </div>

              <div style={metricGroup}>
                <div style={metricHeader}>
                  <label style={labelSmall}>O2_RESERVES</label>
                  <span style={statMain}>{data.environment?.o2_level}%</span>
                </div>
                <div style={gaugeTrack}>
                  <div style={gaugeFill(data.environment?.o2_level, '#3B82F6')} />
                </div>
              </div>

              <div style={dataRow}>
                <span style={labelMedium}>ATMOSPHERIC_CO2</span>
                <span style={{...statSub, color: data.environment?.co2_level > 0.1 ? '#FF4D4D' : '#FFF'}}>
                  {data.environment?.co2_level}%
                </span>
              </div>

              <div style={dataRow}>
                <span style={labelMedium}>CABIN_TEMP</span>
                <span style={statSub}>{data.environment?.temperature}°C</span>
              </div>

              <div style={radPanel}>
                <label style={labelSmall}>RAD_EXPOSURE</label>
                <div style={radValue}>
                  {data.environment?.radiation_level} <small style={{fontSize: '0.9rem'}}>mSv</small>
                </div>
              </div>
            </div>
          </section>

          {/* CREW BIOMETRICS */}
          <section>
            <h2 style={sectionHeader}>// CREW_BIOMETRIC_TELEMETRY</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {data.crew.map((member: any) => {
                const readiness = calculateReadiness(member);
                const critical = readiness < 65;

                return (
                  <div key={member.vital_id} style={crewCard(critical)}>
                    <div style={crewHeader}>
                      <div>
                        <div style={crewName}>{member.name.toUpperCase()}</div>
                        <div style={crewRole}>{member.role}</div>
                      </div>
                      <div style={hrDisplay(member.heart_rate)}>
                        <span style={heartIcon(pulse)}>♥</span> {member.heart_rate} <small style={{fontSize: '0.8rem'}}>BPM</small>
                      </div>
                    </div>

                    <div style={vitalGrid}>
                      <div style={vitalBox}>
                        <label style={labelSmall}>STRESS</label>
                        <div style={vitalVal}>{member.stress_level}%</div>
                      </div>
                      <div style={vitalBox}>
                        <label style={labelSmall}>BP_INDEX</label>
                        <div style={vitalVal}>{member.blood_pressure_sys}/{member.blood_pressure_dia}</div>
                      </div>
                      <div style={vitalBox}>
                        <label style={labelSmall}>READY_INDEX</label>
                        <div style={{...vitalVal, color: critical ? '#FF4D4D' : '#00FF41'}}>{readiness}%</div>
                      </div>
                    </div>

                    <div style={ecgContainer}>
                      <div style={ecgLine(critical)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </CosmoLayout>
  );
}

/* --- ENHANCED PRO STYLES --- */

const containerStyle: React.CSSProperties = { padding: "40px", backgroundColor: "#000", minHeight: "100vh", color: "#FFF", fontFamily: "monospace" };
const headerWrapper = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' };
const mainTitle = { fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 };
const subTitle = { fontSize: '0.85rem', color: '#666', marginTop: '8px', letterSpacing: '1.2px' };

const readinessOrb = (val: number) => ({
  width: '120px', height: '120px', borderRadius: '50%',
  border: `3px solid ${val > 80 ? '#00FF41' : '#FBBF24'}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: `radial-gradient(circle, ${val > 80 ? '#00FF4111' : '#FBBF2411'} 0%, transparent 80%)`,
});

const orbText = { textAlign: 'center' as const };
const orbValue = { fontSize: '2.2rem', fontWeight: 900 };

const dashboardGrid = { display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "40px" };
const sectionHeader = { fontSize: '0.8rem', color: '#555', marginBottom: '20px', letterSpacing: '2.5px', fontWeight: 900 };
const cardStyle = { background: '#080808', border: '1px solid #151515', padding: '30px', borderRadius: '4px' };
const envStatusRow = { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '30px' };

const metricGroup = { marginBottom: '30px' };
const metricHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' };
const statMain = { fontSize: '2.5rem', fontWeight: 900 };
const gaugeTrack = { width: '100%', height: '8px', background: '#111', borderRadius: '2px' };
const gaugeFill = (w: number, c: string) => ({ width: `${w}%`, height: '100%', background: c, boxShadow: `0 0 12px ${c}66`, transition: 'width 1s ease-in-out' });

const dataRow = { display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '1px solid #151515' };
const labelSmall = { fontSize: '0.75rem', color: '#666', fontWeight: 900, letterSpacing: '1px' };
const labelMedium = { fontSize: '0.8rem', color: '#777', fontWeight: 900, letterSpacing: '1px' };
const statSub = { fontSize: '1.4rem', fontWeight: 900 };

const radPanel = { marginTop: '20px', padding: '20px', background: '#000', borderLeft: '4px solid #FBBF24', borderRadius: '0 4px 4px 0' };
const radValue = { fontSize: '1.8rem', fontWeight: 900, marginTop: '5px' };

const crewCard = (crit: boolean) => ({
  background: crit ? 'linear-gradient(90deg, #180000, #080808)' : '#080808',
  border: `1px solid ${crit ? '#FF4D4D66' : '#151515'}`,
  padding: '25px', position: 'relative' as const, overflow: 'hidden', borderRadius: '4px'
});

const crewHeader = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const crewName = { fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' };
const crewRole = { fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' as const, marginTop: '2px' };
const hrDisplay = (hr: number) => ({ fontSize: '1.3rem', fontWeight: 900, color: hr > 100 || hr < 55 ? '#FF4D4D' : '#FFF' });

const vitalGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' };
const vitalBox = { background: '#000', padding: '15px', border: '1px solid #151515', borderRadius: '2px' };
const vitalVal = { fontSize: '1.3rem', fontWeight: 900, marginTop: '6px' };

const ecgContainer = { height: '3px', width: '100%', marginTop: '20px', opacity: 0.4 };
const ecgLine = (crit: boolean) => ({ width: '100%', height: '100%', background: crit ? '#FF4D4D' : '#00FF41', boxShadow: `0 0 10px ${crit ? '#FF4D4D' : '#00FF41'}` });

const pulseStyle = (p: boolean) => ({ color: p ? '#00FF41' : '#222', transition: '0.2s', fontSize: '0.8rem', fontWeight: 'bold' });
const heartIcon = (p: boolean) => ({ display: 'inline-block', transform: p ? 'scale(1.2)' : 'scale(1)', transition: '0.1s', color: '#FF4D4D' });
const loaderStyle: React.CSSProperties = { display: 'flex', height: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#00FF41', fontSize: '1.1rem', letterSpacing: '4px' };
const scanLine = { width: '250px', height: '2px', background: '#00FF41', marginBottom: '20px', boxShadow: '0 0 15px #00FF41' };