"use client";

import { useState, useEffect } from "react";
import CosmoLayout from "@/src/components/CosmoLayout";

export default function FuelLabPage() {
  const [spacecraftList, setSpacecraftList] = useState([]);
  const [selectedSpacecraft, setSelectedSpacecraft] = useState("");
  const [hours, setHours] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    
    // Load asset list from database
    fetch("/api/fuel/spacecrafts")
      .then(res => res.json())
      .then(setSpacecraftList)
      .catch(err => console.error("MISSION_CONTROL_OFFLINE", err));

    return () => clearInterval(timer);
  }, []);

  const handleAction = async (isReset = false) => {
    if (!selectedSpacecraft) return alert("MISSION_ERROR: SELECT TARGET ASSET");
    setLoading(true);
    try {
      const res = await fetch("/api/fuel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spacecraft_name: selectedSpacecraft,
          hours: isReset ? 0 : Number(hours),
          reset: isReset
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData(result);
    } catch (e: any) {
      alert(`SYSTEM_ERROR: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <CosmoLayout>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <div style={headerTextWrapper}>
            <h1 style={mainTitleStyle}>FUEL & PROPULSION ANALYTICS</h1>
            <p style={statusTextStyle}>
              <span style={blinkDot}></span> SYSTEM STATUS: <span style={{ color: "#4ade80" }}>ONLINE</span>
            </p>
          </div>
          <div style={timestampBox}>
            <small style={tinyLabel}>STATION_TIME</small>
            <div style={clockStyle}>{time}</div>
          </div>
        </header>

        <div style={mainGrid}>
          {/* LEFT COLUMN: SIMULATION PARAMETERS */}
          <section style={panelStyle}>
            <h2 style={labelStyle}>SIMULATION_PARAMETERS</h2>
            <div style={inputGroup}>
              <label style={tinyLabel}>TARGET_ASSET</label>
              <select 
                value={selectedSpacecraft} 
                onChange={e => setSelectedSpacecraft(e.target.value)} 
                style={inputStyle}
              >
                <option value="">-- SELECT SPACECRAFT --</option>
                {spacecraftList.map((s: any) => (
                  <option key={s.spacecraft_id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div style={inputGroup}>
              <label style={tinyLabel}>BURN_DURATION (HRS)</label>
              <input 
                type="number" 
                placeholder="0.0" 
                value={hours} 
                onChange={e => setHours(e.target.value)} 
                style={inputStyle} 
              />
            </div>

            <button onClick={() => handleAction(false)} style={primaryBtn} disabled={loading}>
              {loading ? "CALCULATING..." : "EXECUTE_PROPULSION_TEST"}
            </button>
            <button onClick={() => handleAction(true)} style={secondaryBtn}>
              REPLENISH_RESERVES (100%)
            </button>
          </section>

          {/* RIGHT COLUMN: TELEMETRY & LOGIC */}
          <section style={panelStyle}>
            {!data ? (
              <div style={emptyStyle}>AWAITING TELEMETRY LINK...</div>
            ) : (
              <div>
                <h2 style={labelStyle}>MISSION_TELEMETRY_OUTPUT</h2>
                <div style={metricGrid}>
                  <div style={cardStyle}>
                    <span style={tinyLabel}>EST_BURN_MASS</span>
                    <span style={{...valStyle, color: '#ff4d4d'}}>
                      {data.fuel_burn} <small style={{fontSize: '0.8rem'}}>KG</small>
                    </span>
                  </div>
                  <div style={cardStyle}>
                    <span style={tinyLabel}>THERMAL_AMBIENT</span>
                    <span style={{...valStyle, color: '#60a5fa'}}>{data.temperature}°C</span>
                  </div>
                </div>

                <div style={{marginTop: '30px'}}>
                  <div style={gaugeHeader}>
                    <span style={tinyLabel}>RESIDUAL_FUEL_CAPACITY</span>
                    <span style={{color: data.remaining_fuel < 20 ? '#ff4d4d' : '#4ade80', fontWeight: 'bold'}}>
                      {data.remaining_fuel}%
                    </span>
                  </div>
                  <div style={gaugeBg}>
                    <div style={{...gaugeFill, width: `${data.remaining_fuel}%` }} />
                  </div>
                  {data.remaining_fuel < 20 && (
                    <div style={warningBox}>⚠️ WARNING: CRITICAL_FUEL_RESERVE_LEVEL</div>
                  )}
                </div>

                {/* CALCULATION LOGIC SECTION */}
                <div style={formulaContainer}>
                  <h3 style={formulaHeader}>CALCULATION_LOGIC_DERIVATION</h3>
                  <div style={formulaBody}>
                    <p style={formulaLine}>[CONSTANT] BASE_BURN_RATE: 8.5 kg/h</p>
                    <p style={formulaLine}>[VARIABLE] TEMP_COEFF: x{data.temp_multiplier || 1.0}</p>
                    <p style={formulaLine}>[VARIABLE] BURN_TIME: {hours || 0}h</p>
                    <p style={formulaLine}>[VARIABLE] MECH_LOSS: 0.00%</p>
                    <div style={divider} />
                    <p style={finalResult}>
                      NET_CONSUMPTION = (8.5 * {data.temp_multiplier || 1.0} * {hours || 0}) + Loss
                    </p>
                    <p style={{...finalResult, color: '#4ade80', marginTop: '5px'}}>
                      TOTAL_MASS_LOST: {data.fuel_burn} KG
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </CosmoLayout>
  );
}

/* --- STYLES --- */
const containerStyle: React.CSSProperties = { background: '#000', minHeight: '100vh', padding: '40px', color: '#fff', fontFamily: 'monospace' };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '20px', marginBottom: '40px' };
const headerTextWrapper = { display: "flex", flexDirection: "column" as const };
const mainTitleStyle = { fontSize: '1.8rem', fontWeight: 900, margin: 0, letterSpacing: '-1px' };
const statusTextStyle = { fontSize: '0.7rem', color: '#555', marginTop: '8px', display: 'flex', alignItems: 'center', fontWeight: 'bold' };
const blinkDot = { width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', marginRight: '8px' };
const timestampBox = { textAlign: 'right' as const };
const clockStyle = { fontSize: '1.2rem', color: '#666' };
const mainGrid = { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '30px' };
const panelStyle = { background: '#0a0a0a', border: '1px solid #222', padding: '30px', borderRadius: '4px' };
const labelStyle = { fontSize: '0.75rem', color: '#444', marginBottom: '25px', fontWeight: 'bold', textTransform: 'uppercase' as const };
const inputGroup = { marginBottom: '20px' };
const inputStyle = { width: '100%', background: '#111', border: '1px solid #333', padding: '12px', color: '#fff', borderRadius: '4px', outline: 'none' };
const primaryBtn = { width: '100%', padding: '15px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' };
const secondaryBtn = { ...primaryBtn, background: 'transparent', color: '#4ade80', border: '1px solid #4ade80', marginTop: '10px' };
const emptyStyle = { height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', fontWeight: 'bold' };
const metricGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const cardStyle = { background: '#000', border: '1px solid #1a1a1a', padding: '20px' };
const tinyLabel = { display: 'block', fontSize: '0.6rem', color: '#444', marginBottom: '5px', textTransform: 'uppercase' as const };
const valStyle = { fontSize: '2.2rem', fontWeight: 900 };
const gaugeBg = { width: '100%', height: '8px', background: '#111', borderRadius: '4px', overflow: 'hidden', marginTop: '10px' };
const gaugeFill = { height: '100%', background: '#3b82f6', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' };
const gaugeHeader = { display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' };
const warningBox = { marginTop: '15px', padding: '10px', border: '1px solid #ff4d4d', color: '#ff4d4d', fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center' as const };

/* --- FORMULA BOX STYLES --- */
const formulaContainer = { marginTop: '30px', background: '#000', border: '1px solid #1a1a1a', borderRadius: '4px' };
const formulaHeader = { background: '#111', padding: '10px', fontSize: '0.65rem', color: '#4ade80', borderBottom: '1px solid #1a1a1a', margin: 0, fontWeight: 'bold' };
const formulaBody = { padding: '15px', fontSize: '0.75rem' };
const formulaLine = { color: '#666', margin: '2px 0' };
const divider = { height: '1px', background: '#1a1a1a', margin: '10px 0' };
const finalResult = { fontWeight: 'bold' as const, color: '#fff', margin: 0 };