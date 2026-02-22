import Link from 'next/link';
import { pool } from '@/src/lib/db';
import CosmoLayout from '@/src/components/CosmoLayout';

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
        <CosmoLayout>
            <div style={{ padding: '60px', color: 'white', fontFamily: 'sans-serif' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#4cc9f0', letterSpacing: '-1px' }}>FLEET DIRECTORY</h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>ACTIVE SPACE ASSETS: {ships.length}</p>
                    </div>

                    <Link href="/spacecraft/new" style={{
                        padding: '14px 28px',
                        backgroundColor: '#4cc9f0',
                        color: '#0b0d17',
                        textDecoration: 'none',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 0 20px rgba(76, 201, 240, 0.3)'
                    }}>
                        + Register Vessel
                    </Link>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                    {ships.map((s: any) => (
                        <div key={s.spacecraft_id} style={{
                            backgroundColor: 'rgba(27, 29, 41, 0.7)',
                            backdropFilter: 'blur(10px)',
                            padding: '30px',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700' }}>{s.name}</h3>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        backgroundColor: 'rgba(76, 201, 240, 0.1)',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        color: '#4cc9f0',
                                        fontWeight: '800',
                                        border: '1px solid rgba(76, 201, 240, 0.5)'
                                    }}>#{s.spacecraft_id}</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 25px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.model || 'Unknown Class'}</p>

                                <div style={{ marginBottom: '25px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>FUEL RESERVES</span>
                                        <span style={{ color: s.fuel_level < 20 ? '#f72585' : '#4cc9f0' }}>{s.fuel_level}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${s.fuel_level}%`,
                                            height: '100%',
                                            backgroundColor: s.fuel_level < 20 ? '#f72585' : '#4cc9f0',
                                            boxShadow: `0 0 10px ${s.fuel_level < 20 ? '#f72585' : '#4cc9f0'}`
                                        }} />
                                    </div>
                                </div>

                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                    <span style={{ color: '#4cc9f0', fontWeight: 'bold' }}>ASSIGNED TO:</span> {s.mission_name || 'UNASSIGNED'}
                                </p>
                            </div>

                            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{
                                    color: s.health_status === 'Operational' ? '#10b981' : '#f72585',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.health_status === 'Operational' ? '#10b981' : '#f72585', boxShadow: `0 0 10px ${s.health_status === 'Operational' ? '#10b981' : '#f72585'}` }} />
                                    {s.health_status}
                                </span>
                                <Link href={`/api/telemetry?spacecraft_id=${s.spacecraft_id}`} style={{
                                    color: '#4cc9f0',
                                    fontSize: '0.8rem',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    letterSpacing: '1px'
                                }}>
                                    TELEMETRY LINK →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CosmoLayout>
    );
}

