import Link from 'next/link';
import { pool } from '@/src/lib/db';
import CosmoLayout from '@/src/components/CosmoLayout';

/**
 * Server Component to fetch the latest 150 audit entries.
 */
async function getLogs() {
    try {
        const result = await pool.query(`
            SELECT log_id, action, table_name, record_id, changed_at, details 
            FROM audit_log 
            ORDER BY changed_at DESC 
            LIMIT 150
        `);
        return result.rows;
    } catch (err) {
        console.error("CRITICAL_DATABASE_UPLINK_FAILURE:", err);
        return [];
    }
}

export default async function AuditLogsPage() {
    const logs = await getLogs();

    return (
        <CosmoLayout>
            <div style={containerStyle}>
                {/* --- HEADER SECTION --- */}
                <header style={headerStyle}>
                    <div>
                        <h1 style={titleStyle}>SYSTEM_AUDIT_LOGS</h1>
                        <p style={subtitleStyle}>REAL-TIME RELATIONAL DATA TRACEABILITY // SECTOR_7</p>
                    </div>
                    <div style={navGroup}>
                        <Link href="/alerts" style={navLink}>BACK_TO_MATRIX</Link>
                        <div style={countBadge}>{logs.length} ENTRIES_RECOVERED</div>
                    </div>
                </header>

                {/* --- LOG TABLE TERMINAL --- */}
                <div style={logTerminal}>
                    <table style={tableStyle}>
                        <thead style={theadStyle}>
                            <tr>
                                <th style={thStyle}>TRACE_ID</th>
                                <th style={thStyle}>OP_TYPE</th>
                                <th style={thStyle}>TARGET_TABLE</th>
                                <th style={thStyle}>RECORD_REF</th>
                                <th style={thStyle}>TIMESTAMP (UTC)</th>
                                <th style={thStyle}>EXECUTION_DETAILS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? (
                                logs.map((log: any) => (
                                    <tr key={log.log_id} style={trStyle}>
                                        <td style={idCol}>
                                            [{log.log_id.toString().padStart(4, '0')}]
                                        </td>
                                        
                                        <td style={paddingStyle}>
                                            <Link 
                                                href={`/logs/trace/${log.log_id}`} 
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <span style={actionBadgeStyle(log.action)}>
                                                    {log.action}
                                                </span>
                                            </Link>
                                        </td>

                                        <td style={whiteTextBold}>
                                            {log.table_name.toUpperCase()}
                                        </td>

                                        <td style={cyanText}>
                                            REF_ID: {log.record_id}
                                        </td>

                                        <td style={whiteText}>
                                            {/* Static UTC slice prevents hydration mismatches from local time conversion */}
                                            {new Date(log.changed_at).toISOString().replace('T', ' ').slice(0, 19)}
                                        </td>

                                        <td style={detailText}>
                                            {log.details || "NO_ADDITIONAL_METADATA"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={emptyStateStyle}>
                                        NO_SYSTEM_LOGS_DETECTED_IN_SECTOR_7
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- TACTICAL CSS --- */}
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
                
                tbody tr:hover {
                    background-color: rgba(0, 255, 213, 0.05) !important;
                }
                
                /* Custom Scrollbar */
                div::-webkit-scrollbar { width: 8px; }
                div::-webkit-scrollbar-track { background: #000; }
                div::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                div::-webkit-scrollbar-thumb:hover { background: #00ffd5; }
            `}} />
        </CosmoLayout>
    );
}

/* --- STYLE DEFINITIONS --- */

const containerStyle: React.CSSProperties = {
    padding: '40px 60px',
    backgroundColor: '#000',
    minHeight: '100vh',
    fontFamily: "'JetBrains Mono', monospace",
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '30px',
    borderBottom: '2px solid #222',
    paddingBottom: '20px'
};

const titleStyle = {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#fff',
    margin: 0,
    letterSpacing: '1px'
};

const subtitleStyle = {
    color: '#00ffd5',
    fontSize: '0.85rem',
    margin: '5px 0 0 0',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const
};

const navGroup = { display: 'flex', alignItems: 'center', gap: '20px' };

const navLink = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.8rem',
    border: '1px solid #444',
    padding: '8px 16px',
    fontWeight: 'bold'
};

const countBadge = {
    backgroundColor: '#00ffd5',
    color: '#000',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '800'
};

const logTerminal = {
    backgroundColor: '#050505',
    border: '1px solid #222',
    maxHeight: '75vh',
    overflowY: 'auto' as const,
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
};

const theadStyle = {
    position: 'sticky' as const,
    top: 0,
    backgroundColor: '#0a0a0a',
    zIndex: 10,
    borderBottom: '2px solid #333'
};

const thStyle = {
    padding: '20px',
    textAlign: 'left' as const,
    color: '#00ffd5',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const
};

const trStyle = { borderBottom: '1px solid #111' };
const paddingStyle = { padding: '15px 20px' };

const whiteText = { ...paddingStyle, color: '#FFFFFF', fontSize: '0.95rem' };
const whiteTextBold = { ...whiteText, fontWeight: 'bold' };
const cyanText = { ...paddingStyle, color: '#00ffd5', fontSize: '0.95rem', fontWeight: 'bold' };
const idCol = { ...paddingStyle, color: '#444', fontSize: '0.9rem' };
const detailText = { ...paddingStyle, color: '#EEE', fontSize: '0.95rem', fontStyle: 'italic' };

const emptyStateStyle = {
    padding: '100px',
    textAlign: 'center' as const,
    color: '#333',
    letterSpacing: '5px',
    fontSize: '1.2rem'
};

const actionBadgeStyle = (action: string) => ({
    padding: '5px 12px',
    borderRadius: '2px',
    fontSize: '0.75rem',
    fontWeight: '900',
    backgroundColor: action === 'INSERT' ? '#00ff66' : action === 'UPDATE' ? '#0099ff' : '#ff0055',
    color: '#000',
    display: 'inline-block',
    textTransform: 'uppercase' as const
});