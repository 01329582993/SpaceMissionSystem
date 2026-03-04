"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import CosmoLayout from "@/src/components/CosmoLayout";

export default function ProPlusHealthPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(true);

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
        <header style={headerWrapper}>
          <div>
            <h1 style={mainTitle}>HEALTH_DIAGNOSTICS_V4</h1>
            <p style={subTitle}>LOG_ID: {id} // STATUS: {envStatus.label}</p>
            <button onClick={() => router.push('/spacecraft')} style={backLink}>« RETURN_TO_HANGAR</button>
          </div>
          
          <div style={readinessOrb(avgReadiness)}>
            <div style={orbText}>
              <span style={labelSmall}>FLEET_READY</span>
              <div style={orbValue}>{avgReadiness}%</div>
            </div>
          </div>
        </header>

        <div style={dashboardGrid}>
          <section>
            <h2 style={sectionHeader}>// ENVIRONMENTAL_SYSTEMS</h2>
            <div style={cardStyle}>
              <div style={envStatusRow}>
                <span style={{ color: envStatus.color, fontWeight: 'bold' }}>{envStatus.label}</span>
                <span style={pulseStyle(pulse)}>● FEED_ACTIVE</span>
              </div>
              <div style={metricGroup}>
                <div style={metricHeader}>
                  <label style={labelSmall}>O2_RESERVES</label>
                  <span style={statMain}>{data.environment?.o2_level}%</span>
                </div>
                <div style={gaugeTrack}><div style={gaugeFill(data.environment?.o2_level, '#3B82F6')} /></div>
              </div>
              <div style={dataRow}>
                <span style={labelMedium}>ATMOSPHERIC_CO2</span>
                <span style={{...statSub, color: data.environment?.co2_level > 0.1 ? '#FF4D4D' : '#FFF'}}>{data.environment?.co2_level}%</span>
              </div>
              <div style={dataRow}>
                <span style={labelMedium}>CABIN_TEMP</span>
                <span style={statSub}>{data.environment?.temperature}°C</span>
              </div>
            </div>
          </section>

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
                        <span style={heartIcon(pulse)}>♥</span> {member.heart_rate} <small>BPM</small>
                      </div>
                    </div>
                    <div style={vitalGrid}>
                      <div style={vitalBox}><label style={labelSmall}>STRESS</label><div style={vitalVal}>{member.stress_level}%</div></div>
                      <div style={vitalBox}><label style={labelSmall}>BP_INDEX</label><div style={vitalVal}>{member.blood_pressure_sys}/{member.blood_pressure_dia}</div></div>
                      <div style={vitalBox}><label style={labelSmall}>READY_INDEX</label><div style={{...vitalVal, color: critical ? '#FF4D4D' : '#00FF41'}}>{readiness}%</div></div>
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

/* Styles consolidated for brevity - Use your existing constants from previous message */
const containerStyle: any = { padding: "40px", backgroundColor: "#000", minHeight: "100vh", color: "#FFF", fontFamily: "monospace" };
const headerWrapper = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' };
const mainTitle = { fontSize: '2.2rem', fontWeight: 900, margin: 0 };
const subTitle = { fontSize: '0.85rem', color: '#666', marginTop: '8px' };
const backLink = { background: 'none', border: 'none', color: '#00FF41', cursor: 'pointer', fontSize: '0.7rem', marginTop: '10px', padding: 0 };
const readinessOrb = (val: number) => ({ width: '120px', height: '120px', borderRadius: '50%', border: `3px solid ${val > 80 ? '#00FF41' : '#FBBF24'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' });
const orbText = { textAlign: 'center' as const };
const orbValue = { fontSize: '2.2rem', fontWeight: 900 };
const dashboardGrid = { display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "40px" };
const sectionHeader = { fontSize: '0.8rem', color: '#555', marginBottom: '20px', letterSpacing: '2.5px' };
const cardStyle = { background: '#080808', border: '1px solid #151515', padding: '30px' };
const envStatusRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' };
const metricGroup = { marginBottom: '30px' };
const metricHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' };
const statMain = { fontSize: '2.5rem', fontWeight: 900 };
const gaugeTrack = { width: '100%', height: '8px', background: '#111' };
const gaugeFill = (w: number, c: string) => ({ width: `${w}%`, height: '100%', background: c });
const dataRow = { display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '1px solid #151515' };
const labelSmall = { fontSize: '0.7rem', color: '#666' };
const labelMedium = { fontSize: '0.8rem', color: '#777' };
const statSub = { fontSize: '1.4rem', fontWeight: 900 };
const crewCard = (crit: boolean) => ({ background: crit ? '#180000' : '#080808', border: `1px solid ${crit ? '#FF4D4D' : '#151515'}`, padding: '25px' });
const crewHeader = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const crewName = { fontSize: '1.4rem', fontWeight: 900 };
const crewRole = { fontSize: '0.8rem', color: '#666' };
const hrDisplay = (hr: number) => ({ fontSize: '1.3rem', fontWeight: 900 });
const vitalGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' };
const vitalBox = { background: '#000', padding: '15px', border: '1px solid #151515' };
const vitalVal = { fontSize: '1.3rem', fontWeight: 900 };
const pulseStyle = (p: boolean) => ({ color: p ? '#00FF41' : '#222' });
const heartIcon = (p: boolean) => ({ display: 'inline-block', transform: p ? 'scale(1.2)' : 'scale(1)', color: '#FF4D4D' });
const loaderStyle: any = { display: 'flex', height: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#00FF41' };
const scanLine = { width: '250px', height: '2px', background: '#00FF41', marginBottom: '20px' };