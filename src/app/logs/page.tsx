import Link from 'next/link';
import { pool } from '@/src/lib/db';
import CosmoLayout from '@/src/components/CosmoLayout';

async function getLogs() {
    try {
        const result = await pool.query(`
      SELECT log_id, action, table_name, record_id, changed_at, details 
      FROM audit_log 
      ORDER BY changed_at DESC 
      LIMIT 100
    `);
        return result.rows;
    } catch (err) {
        console.error("Logs Fetch Error:", err);
        return [];
    }
}

export default async function AuditLogsPage() {
    const logs = await getLogs();

    return (
        <CosmoLayout>
            <div style={{ padding: '60px', color: 'white', fontFamily: 'sans-serif' }}>
                <header style={{ marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                    <h1 style={{ color: '#4cc9f0', fontSize: '2.5rem', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>SYSTEM AUDIT LOGS</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>REAL-TIME RELATIONAL DATA TRACEABILITY</p>
                </header>

                <div style={{
                    backgroundColor: 'rgba(22, 25, 37, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(76, 201, 240, 0.1)', color: '#4cc9f0', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                                <th style={{ padding: '20px' }}>Log ID</th>
                                <th style={{ padding: '20px' }}>Action</th>
                                <th style={{ padding: '20px' }}>Target Table</th>
                                <th style={{ padding: '20px' }}>Reference</th>
                                <th style={{ padding: '20px' }}>Timestamp</th>
                                <th style={{ padding: '20px' }}>Command Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? logs.map((log: any) => (
                                <tr key={log.log_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '20px', color: 'rgba(255,255,255,0.3)' }}>#{log.log_id}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            color: log.action === 'INSERT' ? '#10b981' : (log.action === 'UPDATE' ? '#4cc9f0' : (log.action === 'PROCEDURE' ? '#7209b7' : '#f72585')),
                                            fontWeight: '800',
                                            fontSize: '0.7rem',
                                            letterSpacing: '1px',
                                            backgroundColor: log.action === 'INSERT' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(76, 201, 240, 0.1)',
                                            padding: '4px 10px',
                                            borderRadius: '4px'
                                        }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>{log.table_name.toUpperCase()}</td>
                                    <td style={{ padding: '20px', color: '#4cc9f0' }}>ID: {log.record_id}</td>
                                    <td style={{ padding: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                        {new Date(log.changed_at).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '20px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>{log.details}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem' }}>NO SYSTEM LOGS RECORDED</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </CosmoLayout>
    );
}
