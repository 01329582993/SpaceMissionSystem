"use client";



import React, { useState, useEffect } from "react";

import Link from 'next/link';

import CosmoLayout from '@/src/components/CosmoLayout';

import OrbitalTracker from '@/src/components/OrbitalTracker';



// Note: In Next.js, we usually separate DB calls into a separate Server Action

// or an API route, but for this specific page structure:

async function getSpacecraftData() {

    try {

        // I've changed m.fuel_level to s.fuel_level assuming it's in the spacecraft table

        // If it's not there, you'll need to add it to your DB schema

        const response = await fetch('/api/spacecraft');

        if (!response.ok) return [];

        return await response.json();

    } catch (err) {

        console.error("Fetch Error:", err);

        return [];

    }

}



export default function SpacecraftPage() {

    const [ships, setShips] = useState<any[]>([]);

    const [mounted, setMounted] = useState(false);

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        setMounted(true);

        const fetchData = async () => {

            // Hardcoded fallback data in case your API/DB is still being fixed

            try {

                const data = await getSpacecraftData();

                setShips(data.length > 0 ? data : [

                    { spacecraft_id: 1, name: "ODYSSEY_V", model: "TITAN_CLASS", fuel_level: 85, health_status: "Operational", mission_name: "EUROPA_DRILL" },

                    { spacecraft_id: 2, name: "ICARUS_X", model: "SCOUT_CLASS", fuel_level: 12, health_status: "Critical", mission_name: "SOLAR_PROBE" }

                ]);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, []);



    if (!mounted) return <div className="bg-black min-h-screen" />;



    return (

        <CosmoLayout>

            <div style={pageContainer}>

                {/* --- 3D VISUALIZER SECTION --- */}

                <div style={visualizerWrapper}>

                    <OrbitalTracker ships={ships} />

                </div>



                <header style={headerNav}>

                    <div>

                        <h1 style={titleStyle}>FLEET_DIRECTORY</h1>

                        <p style={subTitleStyle}>ACTIVE_ASSETS // {ships.length} UNITS_IN_SERVICE</p>

                    </div>



                    <Link href="/spacecraft/new" className="tactical-btn" style={primaryBtn}>

                        REGISTER_VESSEL +

                    </Link>

                </header>



                <div style={gridContainer}>

                    {ships.map((s: any) => (

                        <div key={s.spacecraft_id} className="tactical-card" style={cardStyle}>

                            <div style={cardGlow}></div>

                            <div style={cardTop}>

                                <h3 style={shipNameStyle}>{s.name}</h3>

                                <span style={idBadge}>ID_{String(s.spacecraft_id).padStart(3, '0')}</span>

                            </div>



                            <p style={modelStyle}>{s.model || 'CLASSIFIED_CLASS'}</p>



                            <div style={fuelContainer}>

                                <div style={fuelLabelRow}>

                                    <span style={labelStyle}>FUEL_RESERVES</span>

                                    <span style={{ ...valueStyle, color: s.fuel_level < 20 ? '#ff0055' : '#00ffd5' }}>

                                        {s.fuel_level}%

                                    </span>

                                </div>

                                <div style={progressBarBg}>

                                    <div style={{

                                        width: `${s.fuel_level}%`,

                                        height: '100%',

                                        backgroundColor: s.fuel_level < 20 ? '#ff0055' : '#00ffd5',

                                        boxShadow: `0 0 10px ${s.fuel_level < 20 ? '#ff0055' : '#00ffd5'}`,

                                        transition: 'width 1s ease-in-out'

                                    }} />

                                </div>

                            </div>



                            <div style={missionInfo}>

                                <span style={labelStyle}>ASSIGNMENT</span>

                                <p style={missionText}>{s.mission_name || 'STANDBY_HANGAR'}</p>

                            </div>



                            <div style={cardFooter}>

                                <Link href={`/health/${s.spacecraft_id}`} style={{ textDecoration: 'none' }}>

                                    <div style={statusWrapper}>

                                        <div style={statusDot(s.health_status)} />

                                        <span style={statusText(s.health_status)}>BIO_LINK</span>

                                    </div>

                                </Link>



                                <Link href={`/telemetry/${s.spacecraft_id}`} className="telemetry-hover" style={telemetryLink}>

                                    SYSTEM_UPLINK →

                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            </div>



            <style dangerouslySetInnerHTML={{

                __html: `

                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&family=Orbitron:wght@700;900&display=swap');

                .tactical-btn:hover { background: #00ffd5 !important; color: #000 !important; box-shadow: 0 0 20px #00ffd5; }

                .tactical-card { transition: all 0.3s ease; }

                .tactical-card:hover { border-color: #00ffd5 !important; background: rgba(0,255,213,0.03) !important; transform: translateY(-5px); }

                .telemetry-hover:hover { color: #00ffd5 !important; text-shadow: 0 0 10px #00ffd5; }

            `}} />

        </CosmoLayout>

    );

}



/* --- STYLES --- */

const pageContainer: React.CSSProperties = { padding: "40px 60px", backgroundColor: "#000", minHeight: "100vh", color: "#FFF", fontFamily: "'JetBrains Mono', monospace" };

const visualizerWrapper: React.CSSProperties = { width: '100%', height: '300px', marginBottom: '40px', border: '1px solid #1a1a1a', background: '#050505', overflow: 'hidden' };

const headerNav: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', borderBottom: '1px solid #222', paddingBottom: '30px' };

const titleStyle = { margin: 0, fontSize: '2rem', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px' };

const subTitleStyle = { color: '#00ffd5', margin: '5px 0 0 0', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px' };

const primaryBtn: React.CSSProperties = { padding: '12px 24px', backgroundColor: '#FFF', color: '#000', textDecoration: 'none', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' };

const gridContainer: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };

const cardStyle: React.CSSProperties = { background: '#080808', border: '1px solid #222', padding: '30px', position: 'relative', overflow: 'hidden' };

const cardGlow: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #00ffd5, transparent)' };

const cardTop = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' };

const shipNameStyle = { margin: 0, fontSize: '1.1rem', fontWeight: 800, fontFamily: "'Orbitron', sans-serif", color: '#FFF' };

const idBadge = { fontSize: '0.65rem', color: '#444', fontWeight: 800, border: '1px solid #222', padding: '2px 6px' };

const modelStyle = { fontSize: '0.7rem', color: '#666', marginBottom: '30px', letterSpacing: '1px', fontWeight: 800 };

const fuelContainer = { marginBottom: '25px' };

const fuelLabelRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' };

const labelStyle = { fontSize: '0.6rem', color: '#444', fontWeight: 800, letterSpacing: '2px' };

const valueStyle = { fontSize: '0.8rem', fontWeight: 800 };

const progressBarBg = { width: '100%', height: '2px', backgroundColor: '#111' };

const missionInfo = { marginBottom: '30px' };

const missionText = { margin: '5px 0 0 0', fontSize: '0.85rem', color: '#FFF', fontWeight: 400 };

const cardFooter: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1a1a1a', paddingTop: '20px', alignItems: 'center' };

const statusWrapper = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };

const statusDot = (s: string) => ({ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s === 'Operational' ? '#00ffd5' : '#ff0055', boxShadow: `0 0 8px ${s === 'Operational' ? '#00ffd5' : '#ff0055'}` });

const statusText = (s: string) => ({ fontSize: '0.7rem', fontWeight: 800, color: s === 'Operational' ? '#00ffd5' : '#ff0055', letterSpacing: '1px' });

const telemetryLink: React.CSSProperties = { color: '#FFF', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', transition: '0.2s' };