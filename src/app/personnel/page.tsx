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
        return result.rows || [];
    } catch (err) {
        console.error("Personnel Roster DB Error:", err);
        return [];
    }
}

export default async function PersonnelPage() {
    const staff = await getPersonnel();

    return (
        <CosmoLayout>
            <div style={containerStyle}>
                <header style={headerStyle}>
                    <div>
                        <h1 style={titleStyle}>PERSONNEL_ROSTER</h1>
                        <p style={statsStyle}>ACTIVE_DUTY_OFFICERS // {staff.length} UNITS</p>
                    </div>

                    <Link href="/personnel/new" className="tactical-link" style={registerBtnStyle}>
                        ENLIST_OFFICER +
                    </Link>
                </header>

                <div style={tableWrapper}>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={theadRowStyle}>
                                <th style={thStyle}>OFFICER_IDENTIFICATION</th>
                                <th style={thStyle}>DESIGNATION</th>
                                <th style={thStyle}>OPERATIONAL_STATUS</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>ASSET_ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((a: any) => (
                                <tr key={a.astronaut_id} className="roster-row" style={trStyle}>
                                    <td style={nameTdStyle}>
                                        {/* Added safety check for toUpperCase */}
                                        {a.name ? a.name.toUpperCase() : "UNKNOWN_OFFICER"}
                                    </td>
                                    <td style={roleTdStyle}>{a.role || 'UNASSIGNED'}</td>
                                    <td style={tdStyle}>
                                        <div style={statusWrapper}>
                                            <span style={statusDot(a.availability)}></span>
                                            <span style={statusText(a.availability)}>
                                                {a.availability ? a.availability.toUpperCase() : 'OFFLINE'}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={idTdStyle}>
                                        USR_{a.astronaut_id.toString().padStart(4, '0')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@900&display=swap');
                .tactical-link:hover { background: #00ffd5 !important; color: #000 !important; box-shadow: 0 0 20px #00ffd5; }
                .roster-row:hover { background: rgba(255, 255, 255, 0.03) !important; border-left: 4px solid #00ffd5 !important; }
            `}} />
        </CosmoLayout>
    );
}

/* --- THEME STYLES --- */
const containerStyle: React.CSSProperties = { padding: '60px', backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: "'JetBrains Mono', monospace" };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', borderBottom: '1px solid #222', paddingBottom: '30px' };
const titleStyle = { margin: 0, fontSize: '1.8rem', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px' };
const statsStyle = { color: '#00ffd5', margin: '8px 0 0 0', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px' };
const registerBtnStyle = { padding: '12px 24px', backgroundColor: '#fff', color: '#000', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '1px', transition: '0.3s' };
const tableWrapper = { background: '#080808', border: '1px solid #1a1a1a', borderRadius: '4px', overflow: 'hidden' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const theadRowStyle = { background: '#111', color: '#555' };
const thStyle: React.CSSProperties = { padding: '20px 25px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px' };
const trStyle: React.CSSProperties = { borderBottom: '1px solid #111', transition: '0.2s' };
const tdStyle: React.CSSProperties = { padding: '25px' };
const nameTdStyle: React.CSSProperties = { ...tdStyle, fontWeight: 700, fontSize: '1rem', letterSpacing: '0.5px' };
const roleTdStyle: React.CSSProperties = { ...tdStyle, color: '#aaa', fontSize: '0.8rem' };
const idTdStyle: React.CSSProperties = { ...tdStyle, textAlign: 'right', color: '#444', fontSize: '0.75rem', fontWeight: 'bold' };
const statusWrapper = { display: 'flex', alignItems: 'center', gap: '10px' };
const statusDot = (avail: string) => ({ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: avail === 'Available' ? '#00ffd5' : '#ff0055', boxShadow: `0 0 10px ${avail === 'Available' ? '#00ffd5' : '#ff0055'}` });
const statusText = (avail: string) => ({ fontSize: '0.75rem', fontWeight: 800, color: avail === 'Available' ? '#00ffd5' : '#ff0055' });