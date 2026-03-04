"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CosmoLayout from "@/src/components/CosmoLayout";

export default function StationTerminalPage() {
  // Use generic types to avoid 'Property id does not exist' errors
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [station, setStation] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [liveSignal, setLiveSignal] = useState<number>(0);
  const [latency, setLatency] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== "undefined" && id) {
      const saved = localStorage.getItem("COSMO_STATIONS");
      if (saved) {
        const allStations = JSON.parse(saved);
        const found = allStations.find((s: any) => String(s.station_id) === String(id));
        
        if (found) {
          setStation(found);
          
          // Generate unique starting values based on node ID
          const idNum = parseInt(id) || 100;
          const baseSignal = found.signal_integrity || (90 + (idNum % 10)); 
          const baseLatency = 10 + (idNum % 25);
          
          setLiveSignal(parseFloat(String(baseSignal)));
          setLatency(baseLatency);
        }
      }
    }
  }, [id]);

  // Handle live data fluctuations for realism
  useEffect(() => {
    if (station && station.status?.toLowerCase() === 'active') {
      const interval = setInterval(() => {
        setLiveSignal(prev => {
          const drift = (Math.random() * 0.4 - 0.2); 
          return parseFloat(Math.min(100, Math.max(85, prev + drift)).toFixed(1));
        });
        setLatency(prev => {
          const drift = Math.floor(Math.random() * 3 - 1);
          return Math.max(5, Math.min(80, prev + drift));
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [station]);

  if (!mounted) return <div style={{ background: "#000", minHeight: "100vh" }} />;

  if (!station) {
    return (
      <div style={errorContainer}>
        <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
        <p style={{ color: '#ff4d4d', letterSpacing: '2px' }}>NODE_{id || 'NULL'}_OFFLINE</p>
        <Link href="/ground_station" style={buttonStyle}>RETURN TO NETWORK</Link>
      </div>
    );
  }

  return (
    <CosmoLayout>
      <div style={pageWrapper}>
        <header style={header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={statusDot(station.status)} />
            <h2 style={title}>{station.name} // UPLINK_{id}</h2>
          </div>
          <Link href="/ground_station" style={closeBtn}>DISCONNECT [X]</Link>
        </header>

        <div style={contentGrid}>
          {/* STATS PANEL */}
          <div style={panel}>
            <span style={label}>SYSTEM_DIAGNOSTICS</span>
            
            <div style={statRow}>
              <span>SIGNAL_INTEGRITY</span>
              <span style={{ color: '#00ffd5', fontWeight: 'bold' }}>
                {station.status?.toLowerCase() === 'active' ? `${liveSignal}%` : '0.0%'}
              </span>
            </div>

            <div style={statRow}>
              <span>LATENCY</span>
              <span>{station.status?.toLowerCase() === 'active' ? `${latency}MS` : '---'}</span>
            </div>

            <div style={statRow}>
              <span>LOCATION</span>
              <span>{station.location?.toUpperCase() || 'CLASSIFIED'}</span>
            </div>

            <div style={statRow}>
              <span>STATUS</span>
              <span style={{ color: station.status?.toLowerCase() === 'active' ? '#00ffd5' : '#ff4d4d' }}>
                {station.status?.toUpperCase()}
              </span>
            </div>
            
            <div style={{marginTop: '40px'}}>
               <span style={label}>ENCRYPTION_KEY</span>
               <div style={keyBox}>RSA_4096_V2 // AES_GCM</div>
            </div>
          </div>

          {/* LIVE DATA STREAM */}
          <div style={terminalBody}>
            <div style={terminalHeader}>SECURE_DATA_FEED // NODE_{id}</div>
            <div style={terminalText}>
               <p className="typewriter">{'>>'} INITIALIZING HANDSHAKE...</p>
               <p className="typewriter" style={{animationDelay: '1s'}}>{'>>'} NODE_{id} AUTHENTICATED.</p>
               <p className="typewriter" style={{animationDelay: '2.5s'}}>{'>>'} STABLE DOWNLINK AT {liveSignal}%</p>
               <p className="typewriter" style={{animationDelay: '4s', color: '#00ffd5'}}>{'>>'} RECIEVING TELEMETRY STREAM...</p>
               <div style={scanline} />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes typing { from { width: 0 } to { width: 100% } }
        @keyframes scan { from { top: 0 } to { top: 100% } }
        .typewriter { 
          overflow: hidden; 
          white-space: nowrap; 
          width: 0; 
          animation: typing 1.5s steps(40, end) forwards; 
          margin: 10px 0; 
          font-family: 'JetBrains Mono', monospace; 
          font-size: 0.9rem; 
        }
      `}} />
    </CosmoLayout>
  );
}

/* --- STYLES --- */
const pageWrapper: React.CSSProperties = { padding: '40px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '20px', marginBottom: '30px' };
const title = { margin: 0, fontSize: '1.2rem', fontWeight: 900, letterSpacing: '2px' };
const contentGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' };
const panel: React.CSSProperties = { backgroundColor: '#080808', padding: '30px', border: '1px solid #1a1a1a' };
const label = { fontSize: '0.65rem', color: '#444', letterSpacing: '2px', fontWeight: 'bold' };
const statRow = { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '20px', borderBottom: '1px solid #111', paddingBottom: '8px' };

// Fixed textAlign type error
const keyBox: React.CSSProperties = { 
  marginTop: '15px', 
  padding: '12px', 
  border: '1px dashed #333', 
  fontSize: '0.7rem', 
  color: '#666', 
  textAlign: 'center' as const, 
  background: '#050505' 
};

const terminalBody: React.CSSProperties = { backgroundColor: '#050505', border: '1px solid #00ffd533', height: '550px', display: 'flex', flexDirection: 'column' };
const terminalHeader = { backgroundColor: '#00ffd511', padding: '12px 20px', fontSize: '0.65rem', color: '#00ffd5', letterSpacing: '2px' };
const terminalText: React.CSSProperties = { padding: '35px', flex: 1, position: 'relative', overflow: 'hidden' };
const scanline: React.CSSProperties = { position: 'absolute', width: '100%', height: '2px', background: 'rgba(0,255,213,0.08)', animation: 'scan 4s linear infinite' };
const statusDot = (s: string) => ({ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s?.toLowerCase() === 'active' ? '#00ffd5' : '#ff4d4d', boxShadow: s?.toLowerCase() === 'active' ? '0 0 10px #00ffd5' : 'none' });
const closeBtn = { color: '#ff4d4d', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #ff4d4d', padding: '10px 20px' };
const errorContainer: React.CSSProperties = { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' };
const buttonStyle = { marginTop: '20px', color: '#fff', border: '1px solid #fff', padding: '10px 25px', textDecoration: 'none', fontSize: '0.8rem' };