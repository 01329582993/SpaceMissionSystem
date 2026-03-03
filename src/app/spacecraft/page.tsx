import Link from 'next/link';
import { pool } from '@/src/lib/db';
import CosmoLayout from '@/src/components/CosmoLayout';
import OrbitalTracker from '@/src/components/OrbitalTracker';

async function getSpacecraft() {
    try {
        const result = await pool.query(`
            SELECT s.spacecraft_id, s.name, s.model, s.fuel_level, s.health_status, s.mission_id, m.mission_name
            FROM spacecraft s
            LEFT JOIN mission_dashboard m ON s.mission_id = m.mission_id
            ORDER BY s.name
        `);
        return result.rows || [];
    } catch (err) {
        console.error("Spacecraft Hangar DB Error:", err);
        return [];
    }
}

export default async function SpacecraftPage() {
    const ships = await getSpacecraft();

    return (
        <CosmoLayout>
            <div style={pageContainer}>
                {/* --- 3D VISUALIZER SECTION --- */}
                <OrbitalTracker ships={ships} />

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
                                <span style={idBadge}>ID_{s.spacecraft_id.toString().padStart(3, '0')}</span>
                            </div>
                            
                            <p style={modelStyle}>{s.model || 'CLASSIFIED_CLASS'}</p>

                            <div style={fuelContainer}>
                                <div style={fuelLabelRow}>
                                    <span style={labelStyle}>FUEL_RESERVES</span>
                                    <span style={{...valueStyle, color: s.fuel_level < 20 ? '#ff0055' : '#00ffd5'}}>
                                        {s.fuel_level}%
                                    </span>
                                </div>
                                <div style={progressBarBg}>
                                    <div style={{
                                        width: `${s.fuel_level}%`,
                                        height: '100%',
                                        backgroundColor: s.fuel_level < 20 ? '#ff0055' : '#00ffd5',
                                        boxShadow: `0 0 10px ${s.fuel_level < 20 ? '#ff0055' : '#00ffd5'}`
                                    }} />
                                </div>
                            </div>

                            <div style={missionInfo}>
                                <span style={labelStyle}>ASSIGNMENT</span>
                                <p style={missionText}>{s.mission_name || 'STANDBY_HANGAR'}</p>
                            </div>

                            <div style={cardFooter}>
                                <div style={statusWrapper}>
                                    <div style={statusDot(s.health_status)} />
                                    <span style={statusText(s.health_status)}>{s.health_status}</span>
                                </div>
                                <Link href={`/api/telemetry?id=${s.spacecraft_id}`} style={telemetryLink}>
                                    UPLINK_DATA →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&family=Orbitron:wght@700;900&display=swap');
                .tactical-btn:hover { background: #00ffd5 !important; color: #000 !important; box-shadow: 0 0 20px #00ffd5; }
                .tactical-card:hover { border-color: #00ffd5 !important; background: rgba(255,255,255,0.02) !important; }
            `}} />
        </CosmoLayout>
    );
}

/* --- STYLES --- */
const pageContainer: React.CSSProperties = { padding: "60px", backgroundColor: "#000", minHeight: "100vh", color: "#FFF", fontFamily: "'JetBrains Mono', monospace" };
const headerNav: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', borderBottom: '1px solid #222', paddingBottom: '30px' };
const titleStyle = { margin: 0, fontSize: '2rem', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px' };
const subTitleStyle = { color: '#00ffd5', margin: '5px 0 0 0', fontSize: '0.75rem', fontWeight: 800 };
const primaryBtn = { padding: '12px 24px', backgroundColor: '#FFF', color: '#000', textDecoration: 'none', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' };
const gridContainer: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };
const cardStyle: React.CSSProperties = { background: '#080808', border: '1px solid #222', padding: '30px', position: 'relative' };
const cardGlow = { position: 'absolute' as const, top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #00ffd5, transparent)', opacity: 0.2 };
const cardTop = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' };
const shipNameStyle = { margin: 0, fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Orbitron', sans-serif" };
const idBadge = { fontSize: '0.65rem', color: '#555', fontWeight: 800 };
const modelStyle = { fontSize: '0.75rem', color: '#AAA', marginBottom: '30px', letterSpacing: '1px' };
const fuelContainer = { marginBottom: '25px' };
const fuelLabelRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' };
const labelStyle = { fontSize: '0.6rem', color: '#555', fontWeight: 800, letterSpacing: '1px' };
const valueStyle = { fontSize: '0.8rem', fontWeight: 800 };
const progressBarBg = { width: '100%', height: '4px', backgroundColor: '#111' };
const missionInfo = { marginBottom: '30px' };
const missionText = { margin: '5px 0 0 0', fontSize: '0.85rem', color: '#FFF' };
const cardFooter: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1a1a1a', paddingTop: '20px' };
const statusWrapper = { display: 'flex', alignItems: 'center', gap: '8px' };
const statusDot = (s: string) => ({ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s === 'Operational' ? '#00ffd5' : '#ff0055', boxShadow: `0 0 8px ${s === 'Operational' ? '#00ffd5' : '#ff0055'}` });
const statusText = (s: string) => ({ fontSize: '0.7rem', fontWeight: 800, color: s === 'Operational' ? '#00ffd5' : '#ff0055' });
const telemetryLink = { color: '#FFF', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px' };