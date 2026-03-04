"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import CosmoLayout from '@/src/components/CosmoLayout';

export default function GroundStationPage() {
    const [stations, setStations] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('COSMO_STATIONS');
        if (saved) {
            setStations(JSON.parse(saved));
        } else {
            const defaults = [
                { station_id: 101, name: "CANBERRA_DSN", location: "AUSTRALIA", status: "Active", signal_strength: 98 },
                { station_id: 102, name: "MADRID_DSN", location: "SPAIN", status: "Active", signal_strength: 82 },
                { station_id: 103, name: "GOLDSTONE_DSN", location: "USA", status: "Maintenance", signal_strength: 0 },
                { station_id: 104, name: "SECTOR_7_CORE", location: "CLASSIFIED", status: "Active", signal_strength: 100 }
            ];
            setStations(defaults);
            localStorage.setItem('COSMO_STATIONS', JSON.stringify(defaults));
        }
    }, []);

    if (!mounted) return <div className="bg-black min-h-screen" />;

    return (
        <CosmoLayout>
            <div style={pageContainer}>
                <header style={headerNav}>
                    <div>
                        <h1 style={titleStyle}>GROUND_STATION_NETWORK</h1>
                        <p style={subTitleStyle}>UPLINK_NODES // {stations.length} STATIONS_ONLINE</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link href="/ground_station/map" className="tactical-btn-alt" style={secondaryBtn}>VIEW_GLOBAL_MAP</Link>
                        <Link href="/ground_station/register" className="tactical-btn" style={primaryBtn}>ADD_STATION +</Link>
                    </div>
                </header>

                <div style={gridContainer}>
                    {stations.map((gs: any) => (
                        <div key={gs.station_id} className="tactical-card" style={cardStyle}>
                            <div style={cardGlow}></div>
                            <div style={cardTop}>
                                <h3 style={stationNameStyle}>{gs.name}</h3>
                                <span style={idBadge}>NODE_{String(gs.station_id).padStart(3, '0')}</span>
                            </div>
                            <p style={locationStyle}>{gs.location}</p>
                            <div style={signalContainer}>
                                <div style={labelRow}>
                                    <span style={labelStyle}>SIGNAL_INTEGRITY</span>
                                    <span style={{ ...valueStyle, color: gs.signal_strength < 30 ? '#ff0055' : '#00ffd5' }}>{gs.signal_strength}%</span>
                                </div>
                                <div style={progressBarBg}>
                                    <div style={{
                                        width: `${gs.signal_strength}%`,
                                        height: '100%',
                                        backgroundColor: gs.signal_strength < 30 ? '#ff0055' : '#00ffd5',
                                        boxShadow: `0 0 10px ${gs.signal_strength < 30 ? '#ff0055' : '#00ffd5'}`,
                                        transition: 'width 1.5s ease'
                                    }} />
                                </div>
                            </div>
                            <div style={dataSection}>
                                <span style={labelStyle}>CURRENT_TASK</span>
                                <p style={taskText}>{gs.status === 'Active' ? 'ENCRYPTED_UPLINK_STREAM' : 'SYSTEM_DIAGNOSTICS'}</p>
                            </div>
                            <div style={cardFooter}>
                                <div style={statusWrapper}>
                                    <div style={statusDot(gs.status)} />
                                    <span style={statusText(gs.status)}>{gs.status.toUpperCase()}</span>
                                </div>
                                <Link href={`/comms/${gs.station_id}`} className="telemetry-hover" style={linkStyle}>VIEW_WINDOWS →</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .tactical-btn:hover { background: #00ffd5 !important; color: #000 !important; box-shadow: 0 0 20px #00ffd5; }
                .tactical-btn-alt:hover { background: #FFF !important; color: #000 !important; }
                .tactical-card:hover { border-color: #00ffd5 !important; background: rgba(0,255,213,0.03) !important; transform: translateY(-5px); }
            `}} />
        </CosmoLayout>
    );
}

/* --- STYLES (Keep existing styles from your provided code) --- */
const pageContainer: React.CSSProperties = { padding: "40px 60px", backgroundColor: "#000", minHeight: "100vh", color: "#FFF", fontFamily: "'JetBrains Mono', monospace" };
const headerNav: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', borderBottom: '1px solid #222', paddingBottom: '30px' };
const titleStyle = { margin: 0, fontSize: '2rem', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px' };
const subTitleStyle = { color: '#00ffd5', margin: '5px 0 0 0', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px' };
const primaryBtn: React.CSSProperties = { padding: '12px 24px', backgroundColor: '#FFF', color: '#000', textDecoration: 'none', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' };
const secondaryBtn: React.CSSProperties = { padding: '12px 24px', border: '1px solid #FFF', color: '#FFF', textDecoration: 'none', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' };
const gridContainer: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };
const cardStyle: React.CSSProperties = { background: '#080808', border: '1px solid #222', padding: '30px', position: 'relative', overflow: 'hidden' };
const cardGlow: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #00ffd5, transparent)' };
const cardTop = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' };
const stationNameStyle = { margin: 0, fontSize: '1.1rem', fontWeight: 800, fontFamily: "'Orbitron', sans-serif", color: '#FFF' };
const idBadge = { fontSize: '0.65rem', color: '#444', fontWeight: 800, border: '1px solid #222', padding: '2px 6px' };
const locationStyle = { fontSize: '0.7rem', color: '#666', marginBottom: '30px', letterSpacing: '1px', fontWeight: 800 };
const signalContainer = { marginBottom: '25px' };
const labelRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' };
const labelStyle = { fontSize: '0.6rem', color: '#444', fontWeight: 800, letterSpacing: '2px' };
const valueStyle = { fontSize: '0.8rem', fontWeight: 800 };
const progressBarBg = { width: '100%', height: '2px', backgroundColor: '#111' };
const dataSection = { marginBottom: '30px' };
const taskText = { margin: '5px 0 0 0', fontSize: '0.85rem', color: '#FFF', fontWeight: 400 };
const cardFooter: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1a1a1a', paddingTop: '20px', alignItems: 'center' };
const statusWrapper = { display: 'flex', alignItems: 'center', gap: '8px' };
const statusDot = (s: string) => ({ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s === 'Active' ? '#00ffd5' : '#ff0055', boxShadow: `0 0 8px ${s === 'Active' ? '#00ffd5' : '#ff0055'}` });
const statusText = (s: string) => ({ fontSize: '0.7rem', fontWeight: 800, color: s === 'Active' ? '#00ffd5' : '#ff0055', letterSpacing: '1px' });
const linkStyle: React.CSSProperties = { color: '#FFF', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px' };