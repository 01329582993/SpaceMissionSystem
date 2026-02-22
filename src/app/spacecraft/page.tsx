import Link from 'next/link';
import { pool } from '@/src/lib/db';

async function getSpacecraft() {
    try {
        const result = await pool.query(`
      SELECT s.spacecraft_id, s.name, s.model, s.fuel_level, s.health_status, s.mission_id, m.name as mission_name
      FROM spacecraft s
      LEFT JOIN mission m ON s.mission_id = m.mission_id
      ORDER BY s.name
    `);
        return result.rows;
    } catch (err) {
        console.error("Spacecraft Hangar DB Error:", err);
        return [];
    }
}

export default async function SpacecraftPage() {
    const ships = await getSpacecraft();

    return (
        <div style={{
            padding: '40px',
            backgroundColor: '#0b0d17',
            minHeight: '100vh',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800' }}>FLEET DIRECTORY</h1>
                    <p style={{ color: '#4cc9f0', margin: '5px 0 0 0' }}>ACTIVE SPACE ASSETS: {ships.length}</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Link href="/spacecraft/new" style={{
                        padding: '10px 20px',
                        backgroundColor: '#4cc9f0',
                        color: '#0b0d17',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase'
                    }}>
                        + Register Vessel
                    </Link>
                    <Link href="/dashboard" style={{
                        padding: '10px 20px',
                        border: '1px solid #4cc9f0',
                        color: '#4cc9f0',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}>
                        RETURN TO COMMAND
                    </Link>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                {ships.map((s: any) => (
                    <div key={s.spacecraft_id} style={{
                        backgroundColor: '#161925',
                        padding: '25px',
                        borderRadius: '12px',
                        border: '1px solid #2a2d3e',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{s.name}</h3>
                                <span style={{
                                    fontSize: '0.65rem',
                                    backgroundColor: '#2a2d3e',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    color: '#aaa'
                                }}>#{s.spacecraft_id}</span>
                            </div>
                            <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 20px 0' }}>MODEL: {s.model || 'Unknown Class'}</p>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.8rem' }}>
                                    <span>FUEL SYSTEM</span>
                                    <span style={{ color: s.fuel_level < 20 ? '#ff4d4d' : '#4cc9f0' }}>{s.fuel_level}%</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', backgroundColor: '#0b0d17', borderRadius: '2px' }}>
                                    <div style={{
                                        width: `${s.fuel_level}%`,
                                        height: '100%',
                                        backgroundColor: s.fuel_level < 20 ? '#ff4d4d' : '#4cc9f0',
                                        borderRadius: '2px',
                                        boxShadow: `0 0 10px ${s.fuel_level < 20 ? '#ff4d4d' : '#4cc9f0'}`
                                    }} />
                                </div>
                            </div>

                            <p style={{ margin: 0, fontSize: '0.85rem' }}>
                                <span style={{ color: '#4cc9f0' }}>ASSIGNED TO:</span> {s.mission_name || 'UNASSIGNED'}
                            </p>
                        </div>

                        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{
                                color: s.health_status === 'Operational' ? '#10b981' : '#f72585',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                ● {s.health_status}
                            </span>
                            <Link href={`/api/telemetry?spacecraft_id=${s.spacecraft_id}`} style={{ color: '#4cc9f0', fontSize: '0.8rem', textDecoration: 'none' }}>
                                VIEW TELEMETRY →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
