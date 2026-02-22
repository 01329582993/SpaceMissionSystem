import Link from 'next/link';
import { pool } from '@/src/lib/db';
import CosmoLayout from '@/src/components/CosmoLayout';

async function getPersonnel() {
    try {
        const result = await pool.query(`
      SELECT astronaut_id, name, role, availability
      FROM astronaut
      ORDER BY name
    `);
        return result.rows;
    } catch (err) {
        console.error("Personnel Roster DB Error:", err);
        return [];
    }
}

export default async function PersonnelPage() {
    const staff = await getPersonnel();

    return (
        <CosmoLayout>
            <div style={{ padding: '60px', color: 'white', fontFamily: 'sans-serif' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#4cc9f0', letterSpacing: '-1px' }}>PERSONNEL ROSTER</h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>ACTIVE DUTY OFFICERS: {staff.length}</p>
                    </div>

                    <Link href="/personnel/new" style={{
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
                        + Register Officer
                    </Link>
                </header>

                <div style={{
                    backgroundColor: 'rgba(22, 25, 37, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(76, 201, 240, 0.1)', color: '#4cc9f0', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                                <th style={{ padding: '25px' }}>OFFICER NAME</th>
                                <th style={{ padding: '25px' }}>DESIGNATION</th>
                                <th style={{ padding: '25px' }}>OPERATIONAL STATUS</th>
                                <th style={{ padding: '25px', textAlign: 'right' }}>ASSET ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((a: any) => (
                                <tr key={a.astronaut_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s ease' }}>
                                    <td style={{ padding: '25px', fontWeight: '700', fontSize: '1.1rem' }}>{a.name.toUpperCase()}</td>
                                    <td style={{ padding: '25px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: '0.85rem' }}>{a.role}</td>
                                    <td style={{ padding: '25px' }}>
                                        <span style={{
                                            color: a.availability === 'Available' ? '#10b981' : '#f72585',
                                            fontSize: '0.85rem',
                                            fontWeight: '800',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            letterSpacing: '1px'
                                        }}>
                                            <span style={{
                                                width: '10px', height: '10px', borderRadius: '50%',
                                                backgroundColor: a.availability === 'Available' ? '#10b981' : '#f72585',
                                                boxShadow: `0 0 10px ${a.availability === 'Available' ? '#10b981' : '#f72585'}`
                                            }}></span>
                                            {a.availability.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '25px', textAlign: 'right', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>
                                        #{a.astronaut_id}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </CosmoLayout>
    );
}

