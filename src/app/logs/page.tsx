import Link from 'next/link';
import { pool } from '@/src/lib/db';

async function getLogs() {
    try {
        const result = await pool.query(`
      SELECT log_id, action, table_name, record_id, changed_at, details 
      FROM audit_log 
      ORDER BY changed_at DESC 
      LIMIT 50
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
        <div style={{ padding: '40px', backgroundColor: '#0b0d17', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ color: '#4cc9f0', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>SYSTEM AUDIT LOGS</h1>
                <p style={{ color: '#888', margin: '5px 0 0 0' }}>REAL-TIME RELATIONAL DATA TRACEABILITY</p>
            </header>

            <div style={{ backgroundColor: '#161925', borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1b1d29', color: '#4cc9f0', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>Action</th>
                            <th style={{ padding: '15px' }}>Table</th>
                            <th style={{ padding: '15px' }}>Record ID</th>
                            <th style={{ padding: '15px' }}>Timestamp</th>
                            <th style={{ padding: '15px' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? logs.map((log: any) => (
                            <tr key={log.log_id} style={{ borderBottom: '1px solid #2a2d3e', fontSize: '0.9rem' }}>
                                <td style={{ padding: '15px', color: '#888' }}>#{log.log_id}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        color: log.action === 'INSERT' ? '#10b981' : (log.action === 'UPDATE' ? '#4cc9f0' : '#f72585'),
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem'
                                    }}>
                                        {log.action}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{log.table_name.toUpperCase()}</td>
                                <td style={{ padding: '15px' }}>{log.record_id}</td>
                                <td style={{ padding: '15px', color: '#aaa', fontSize: '0.8rem' }}>
                                    {new Date(log.changed_at).toLocaleString()}
                                </td>
                                <td style={{ padding: '15px', color: '#666' }}>{log.details}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#444' }}>NO LOGS RECORDED YET</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px' }}>
                <Link href="/dashboard" style={{ color: '#4cc9f0', textDecoration: 'none' }}>← BACK TO COMMAND</Link>
            </div>
        </div>
    );
}
