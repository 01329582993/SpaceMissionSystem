"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import CosmoLayout from "@/src/components/CosmoLayout";

export default function MissionUplinkPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [uplinkStatus, setUplinkStatus] = useState("STABLE");
  
  // USER INPUTS (Simulation of DB-based control parameters)
  const [shieldingFreq, setShieldingFreq] = useState(440); // Hz
  const [oxygenTarget, setOxygenTarget] = useState(21.0); // %
  const [powerPriority, setPowerPriority] = useState("THRUSTERS");
  const [missionNotes, setMissionNotes] = useState("");

  // Terminal Log
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "> INITIALIZING NASA_UPLINK_PROTOCOL...",
    "> DECODING SPACECRAFT_PACKETS...",
    "> READY FOR COMMAND INPUT."
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // CREATIVE FEATURE: NASA Safety Rating Engine
  // Calculates a "Mission Viability Score" based on user inputs
  const viabilityScore = useMemo(() => {
    let score = 85;
    if (shieldingFreq < 400) score -= 15;
    if (oxygenTarget < 19 || oxygenTarget > 23) score -= 20;
    if (powerPriority === "LIFE_SUPPORT") score += 5;
    return Math.min(score, 100);
  }, [shieldingFreq, oxygenTarget, powerPriority]);

  const handleUpdateMission = (e: React.FormEvent) => {
    e.preventDefault();
    setUplinkStatus("TRANSMITTING...");
    setTimeout(() => {
      setUplinkStatus("STABLE");
      setTerminalLogs(prev => [`> [${new Date().toLocaleTimeString()}] UPDATE_SUCCESS: PARAMETERS_PUSHED_TO_CORE`, ...prev]);
    }, 1500);
  };

  if (loading) return <div style={loaderStyle}>SYNCHRONIZING_COMMAND_ARRAY...</div>;

  return (
    <CosmoLayout>
      <div style={container}>
        {/* HEADER */}
        <header style={header}>
          <div>
            <h1 style={titleStyle}>MISSION_PARAMETER_UPLINK // ID_{id}</h1>
            <p style={subTitle}>NASA_AMES_RESEARCH_CENTER // HUB_TX_88</p>
          </div>
          <button onClick={() => router.back()} style={backBtn}>CLOSE_SESSION</button>
        </header>

        <div style={layoutGrid}>
          
          {/* LEFT: COMMAND INPUTS */}
          <section style={inputPanel}>
            <h2 style={sectionHeader}>// MISSION_CONTROL_INPUTS</h2>
            <form onSubmit={handleUpdateMission}>
              
              <div style={inputGroup}>
                <label style={label}>SHIELDING_FREQUENCY (Hz)</label>
                <input 
                  type="range" min="300" max="600" 
                  value={shieldingFreq} 
                  onChange={(e) => setShieldingFreq(parseInt(e.target.value))}
                  style={slider}
                />
                <div style={inputValue}>{shieldingFreq} Hz</div>
              </div>

              <div style={inputGroup}>
                <label style={label}>TARGET_O2_CONCENTRATION (%)</label>
                <input 
                  type="number" step="0.1"
                  value={oxygenTarget} 
                  onChange={(e) => setOxygenTarget(parseFloat(e.target.value))}
                  style={numInput}
                />
              </div>

              <div style={inputGroup}>
                <label style={label}>POWER_GRID_PRIORITY</label>
                <select 
                  style={numInput} 
                  value={powerPriority}
                  onChange={(e) => setPowerPriority(e.target.value)}
                >
                  <option value="THRUSTERS">THRUSTERS</option>
                  <option value="LIFE_SUPPORT">LIFE_SUPPORT</option>
                  <option value="SHIELDING">SHIELDING</option>
                  <option value="COMMS">COMMS</option>
                </select>
              </div>

              <div style={inputGroup}>
                <label style={label}>MISSION_LOG_ENTRY</label>
                <textarea 
                  style={{...numInput, height: '80px', resize: 'none'}}
                  placeholder="Enter mission observations..."
                  value={missionNotes}
                  onChange={(e) => setMissionNotes(e.target.value)}
                />
              </div>

              <button type="submit" style={submitBtn}>EXECUTE_UPLINK_TRANSMISSION</button>
            </form>
          </section>

          {/* RIGHT: LIVE FEEDBACK & NASA FEATURES */}
          <aside style={statusAside}>
            
            {/* NASA VIABILITY SCORE */}
            <div style={viabilityCard}>
              <div style={label}>MISSION_VIABILITY_INDEX</div>
              <div style={{...scoreValue, color: viabilityScore > 80 ? '#00ffd5' : '#ff0055'}}>
                {viabilityScore}%
              </div>
              <div style={scoreSub}>{viabilityScore > 80 ? "MISSION_OPTIMAL" : "SAFETY_THRESHOLD_WARNING"}</div>
            </div>

            {/* UPLINK TERMINAL */}
            <div style={terminalCard}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <span style={label}>COMMAND_TERMINAL</span>
                <span style={{color: '#00ffd5', fontSize: '0.6rem'}}>UPLINK: {uplinkStatus}</span>
              </div>
              <div style={terminalScroll}>
                {terminalLogs.map((log, i) => (
                  <div key={i} style={logLine}>{log}</div>
                ))}
              </div>
            </div>

            {/* SYSTEM HEALTH QUICK_VIEW (Derived from logic) */}
            <div style={quickStats}>
               <div style={statLine}><span>HULL_PRESSURE:</span> <span>101.3 kPa</span></div>
               <div style={statLine}><span>COMMS_LATENCY:</span> <span>420ms</span></div>
               <div style={statLine}><span>FUEL_RESERVES:</span> <span style={{color: '#fbbf24'}}>74.2%</span></div>
            </div>

          </aside>
        </div>
      </div>
    </CosmoLayout>
  );
}

/* --- STYLES --- */
const container: any = { padding: "40px", backgroundColor: "#000", minHeight: "100vh", color: "#FFF", fontFamily: "monospace" };
const header = { display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid #1a1a1a', paddingBottom: '20px' };
const titleStyle = { margin: 0, fontSize: '1.4rem', letterSpacing: '2px' };
const subTitle = { color: '#666', fontSize: '0.7rem', marginTop: '5px' };
const backBtn = { background: '#111', border: '1px solid #333', color: '#FFF', padding: '8px 15px', cursor: 'pointer', fontSize: '0.7rem' };

const layoutGrid = { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' };
const inputPanel = { background: '#050505', border: '1px solid #111', padding: '30px' };
const sectionHeader = { fontSize: '0.8rem', color: '#444', marginBottom: '25px', letterSpacing: '2px' };

const inputGroup = { marginBottom: '25px' };
const label = { display: 'block', fontSize: '0.65rem', color: '#555', marginBottom: '10px', letterSpacing: '1px' };
const numInput = { width: '100%', background: '#000', border: '1px solid #222', padding: '12px', color: '#00ffd5', fontSize: '0.8rem', outline: 'none' };
const slider = { width: '100%', cursor: 'pointer' };
const inputValue = { fontSize: '0.7rem', color: '#00ffd5', marginTop: '5px', textAlign: 'right' as const };

const submitBtn = { width: '100%', background: '#00ffd5', border: 'none', padding: '15px', color: '#000', fontWeight: 'bold' as const, cursor: 'pointer', marginTop: '10px' };

const statusAside = { display: 'flex', flexDirection: 'column' as const, gap: '20px' };
const viabilityCard = { background: '#050505', border: '1px solid #111', padding: '25px', textAlign: 'center' as const };
const scoreValue = { fontSize: '4rem', fontWeight: 'bold' as const, margin: '10px 0' };
const scoreSub = { fontSize: '0.6rem', letterSpacing: '2px' };

const terminalCard = { background: '#080808', border: '1px solid #111', padding: '20px', flexGrow: 1 };
const terminalScroll = { height: '200px', overflowY: 'auto' as const, fontSize: '0.65rem', color: '#444' };
const logLine = { marginBottom: '8px', borderLeft: '2px solid #222', paddingLeft: '8px' };

const quickStats = { background: '#0a0a0a', padding: '20px', fontSize: '0.7rem', color: '#555' };
const statLine = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' };
const loaderStyle: any = { color: '#00ffd5', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' };