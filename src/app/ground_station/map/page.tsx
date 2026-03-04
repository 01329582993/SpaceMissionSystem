"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';

// Helper to get random map coordinates for newly registered stations
const getRandomCoord = () => ({
    top: `${20 + Math.random() * 60}%`,
    left: `${10 + Math.random() * 80}%`
});

// Coordinate Registry for default stations
const getCoords = (name: string) => {
    const registry: { [key: string]: { top: string, left: string } } = {
        "CANBERRA_DSN": { top: '75%', left: '85%' },
        "MADRID_DSN": { top: '35%', left: '48%' },
        "GOLDSTONE_DSN": { top: '38%', left: '18%' },
        "SECTOR_7_CORE": { top: '48%', left: '42%' },
    };
    return registry[name] || getRandomCoord();
};

export default function GlobalTacticalMap() {
    const [stations, setStations] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load from LocalStorage (Your dynamic database)
        const saved = localStorage.getItem('COSMO_STATIONS');
        if (saved) {
            setStations(JSON.parse(saved));
        } else {
            // Default seed data
            const defaults = [
                { station_id: 101, name: "CANBERRA_DSN", status: "Active" },
                { station_id: 102, name: "MADRID_DSN", status: "Active" },
                { station_id: 103, name: "GOLDSTONE_DSN", status: "Maintenance" },
                { station_id: 104, name: "SECTOR_7_CORE", status: "Active" }
            ];
            setStations(defaults);
            localStorage.setItem('COSMO_STATIONS', JSON.stringify(defaults));
        }
    }, []);

    if (!mounted) return <div style={{ background: '#000', minHeight: '100vh' }} />;

    return (
        <div style={containerStyle}>
            <div style={ambientGlowPrimary} />
            <div style={ambientGlowSecondary} />
            <div style={scanLineOverlay} />

            <div style={headerHUD}>
                <div style={textGroup}>
                    <h1 style={mainTitle}>GLOBAL_GROUND_STATIONS</h1>
                    <p style={subTitle}>LIVE_SATELLITE_FEED // {stations.length}_NODES_DETECTED</p>
                </div>
                <Link href="/ground_station" style={closeBtn} className="exit-btn">EXIT_INTERFACE [X]</Link>
            </div>

            <div style={mapWrapper}>
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
                    alt="World Map" 
                    style={mapImageStyle} 
                />

                {stations.map((gs) => {
                    const coords = getCoords(gs.name);
                    const isActive = gs.status === 'Active' || gs.status === 'ACTIVE';
                    const themeColor = isActive ? '#00ffd5' : '#ff0055';
                    
                    return (
                        <div key={gs.station_id} style={{ ...pingContainer, top: coords.top, left: coords.left }}>
                            <div style={{ ...pingStyle, backgroundColor: themeColor, boxShadow: `0 0 20px ${themeColor}` }}>
                                <div style={{ ...pingPulse, border: `2px solid ${themeColor}` }} />
                            </div>
                            <div style={labelGroup}>
                                <span style={nameLabel}>{gs.name}</span>
                                <span style={{ ...statusLabel, color: themeColor }}>{gs.status}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulseMap { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(4); opacity: 0; } }
                @keyframes scanMove { 0% { top: -100%; } 100% { top: 100%; } }
                .exit-btn:hover { background: #FFF !important; color: #000 !important; }
                body { margin: 0; background: #000; overflow: hidden; }
            `}} />
        </div>
    );
}

// Styles (Greenish Tactical Glow)
const containerStyle: React.CSSProperties = { width: '100vw', height: '100vh', backgroundColor: '#030a09', color: '#FFF', fontFamily: "'JetBrains Mono', monospace", position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' };
const ambientGlowPrimary: React.CSSProperties = { position: 'absolute', width: '1200px', height: '1200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 255, 213, 0.08) 0%, transparent 70%)', left: '-300px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 };
const ambientGlowSecondary: React.CSSProperties = { position: 'absolute', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 255, 213, 0.04) 0%, transparent 60%)', right: '-100px', bottom: '-100px', pointerEvents: 'none', zIndex: 1 };
const scanLineOverlay: React.CSSProperties = { position: 'absolute', width: '100%', height: '100px', background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 213, 0.05), transparent)', animation: 'scanMove 8s linear infinite', pointerEvents: 'none', zIndex: 2 };
const headerHUD: React.CSSProperties = { position: 'absolute', top: '40px', width: '92%', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0, 255, 213, 0.2)', paddingTop: '20px', zIndex: 10 };
const mainTitle = { margin: 0, fontSize: '1.4rem', letterSpacing: '4px', fontWeight: 900, textShadow: '0 0 10px rgba(0, 255, 213, 0.5)' };
const subTitle = { margin: '5px 0 0 0', fontSize: '0.65rem', color: '#00ffd5', letterSpacing: '2px', fontWeight: 800 };
const textGroup = { display: 'flex', flexDirection: 'column' as const };
const mapWrapper: React.CSSProperties = { position: 'relative', width: '85%', maxWidth: '1400px', height: '65%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 };
const mapImageStyle: React.CSSProperties = { width: '100%', height: 'auto', opacity: 0.2, filter: 'invert(1) brightness(0.9) hue-rotate(150deg) saturate(1.5)' };
const pingContainer: React.CSSProperties = { position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translate(-50%, -50%)' };
const pingStyle: React.CSSProperties = { width: '12px', height: '12px', borderRadius: '50%', position: 'relative' };
const pingPulse: React.CSSProperties = { position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', animation: 'pulseMap 2.5s infinite ease-out', left: 0, top: 0 };
const labelGroup: React.CSSProperties = { marginTop: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const nameLabel: React.CSSProperties = { fontSize: '0.6rem', fontWeight: 900, color: '#FFF', background: 'rgba(0,0,0,0.9)', padding: '3px 10px', border: '1px solid rgba(0, 255, 213, 0.3)', letterSpacing: '1px' };
const statusLabel: React.CSSProperties = { fontSize: '0.5rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' };
const closeBtn: React.CSSProperties = { color: '#FFF', textDecoration: 'none', fontSize: '0.75rem', border: '1px solid #FFF', padding: '10px 25px', transition: '0.3s', fontWeight: 800 };