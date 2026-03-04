import { pool } from '@/src/lib/db';
import CosmoLayout from '@/src/components/CosmoLayout';
import Link from 'next/link';

export default async function TraceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const logId = parseInt(id, 10);
    
    if (isNaN(logId)) {
        return (
            <CosmoLayout>
                <div style={errorScreenStyle}>
                    <h1 style={{ color: '#ff0055' }}>[!] ERR_INVALID_TRACE_ID</h1>
                    <p>SYSTEM CANNOT RESOLVE ID: "{id}"</p>
                    <Link href="/logs" style={backBtnStyle}>RETURN_TO_TERMINAL</Link>
                </div>
            </CosmoLayout>
        );
    }

    try {
        const result = await pool.query(`
            SELECT a.*, m.origin_node, m.request_method, m.auth_level, m.process_signature
            FROM audit_log a
            LEFT JOIN audit_meta m ON a.log_id = m.log_id
            WHERE a.log_id = $1
        `, [logId]);

        const trace = result.rows[0];

        if (!trace) {
            return (
                <CosmoLayout>
                    <div style={errorScreenStyle}>
                        <h1 style={{ color: '#ff0055' }}>404 // TRACE_NOT_FOUND</h1>
                        <Link href="/logs" style={backBtnStyle}>BACK</Link>
                    </div>
                </CosmoLayout>
            );
        }

        return (
            <CosmoLayout>
                <div style={containerStyle}>
                    
                    {/* Header Terminal */}
                    <div style={headerStyle}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800' }}>TRACE_ID: {trace.log_id.toString().padStart(4, '0')}</h1>
                            <p style={{ color: '#00ffd5', margin: '5px 0 0 0', letterSpacing: '2px' }}>
                                STATUS: STABLE // ACTION: {trace.action}
                            </p>
                        </div>
                        <Link href="/logs" style={backBtnStyle}>CLOSE_REPORT</Link>
                    </div>

                    {/* METADATA BOX - System Intelligence */}
                    {trace.action === 'INSERT' && (
                        <div style={metaBoxStyle}>
                            <h3 style={sectionTitleStyle}>[!] DECODED_INSERT_METADATA</h3>
                            <div style={gridStyle}>
                                <div>
                                    <small style={labelStyle}>ORIGIN_NODE</small><br/>
                                    <b style={valueStyle}>{trace.origin_node || 'CORE_SYSTEM'}</b>
                                </div>
                                <div>
                                    <small style={labelStyle}>REQ_METHOD</small><br/>
                                    <b style={valueStyle}>{trace.request_method || 'POST'}</b>
                                </div>
                                <div>
                                    <small style={labelStyle}>AUTH_LEVEL</small><br/>
                                    <b style={valueStyle}>{trace.auth_level || 'ADMIN_L1'}</b>
                                </div>
                                <div>
                                    <small style={labelStyle}>PROC_SIG</small><br/>
                                    <b style={valueStyle}>{trace.process_signature || '0xUNKNOWN'}</b>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STRUCTURED DATA SNAPSHOT (Replacing RAW JSON) */}
                    <div style={codeWrapperStyle}>
                        <div style={codeHeaderStyle}>
                            <span>DECODED_DATA_SNAPSHOT</span>
                            <span style={{ color: '#444' }}>V_ALPHA_6</span>
                        </div>
                        
                        <div style={dataGridStyle}>
                            {(() => {
                                const payload = trace.new_data || trace.old_data || {};
                                return (
                                    <>
                                        <div style={dataItemStyle}>
                                            <span style={labelStyle}>SIGNAL_MESSAGE</span>
                                            <div style={messageValueStyle}>{payload.message || "NO_SIGNAL_MSG"}</div>
                                        </div>

                                        <div style={dataItemStyle}>
                                            <span style={labelStyle}>THREAT_LEVEL</span>
                                            <div style={{
                                                ...valueStyle, 
                                                color: payload.type === 'critical' ? '#ff0055' : '#00ff66',
                                                fontWeight: '900'
                                            }}>
                                                {payload.type?.toUpperCase() || "INFO"}
                                            </div>
                                        </div>

                                        <div style={dataItemStyle}>
                                            <span style={labelStyle}>RESOLUTION_STATUS</span>
                                            <div style={valueStyle}>
                                                {payload.resolved ? "✔ RESOLVED" : "✖ UNRESOLVED / ACTIVE"}
                                            </div>
                                        </div>

                                        <div style={dataItemStyle}>
                                            <span style={labelStyle}>INTERNAL_REF_ID</span>
                                            <div style={{...valueStyle, color: '#00ffd5'}}>
                                                #{payload.alert_id || trace.record_id || "N/A"}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Footer Details */}
                    <div style={footerStyle}>
                        <small style={labelStyle}>EXECUTION_DETAILS</small>
                        <p style={{ margin: '10px 0 0 0', fontSize: '1.1rem' }}>{trace.details || "NEW_THREAT_DETECTED"}</p>
                    </div>

                    {/* Collapsible Raw Buffer */}
                    <details style={{ marginTop: '40px', cursor: 'pointer' }}>
                        <summary style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '1px' }}>VIEW_RAW_LOG_BUFFER</summary>
                        <pre style={rawJsonStyle}>
                            {JSON.stringify(trace.new_data || trace.old_data, null, 4)}
                        </pre>
                    </details>

                </div>
            </CosmoLayout>
        );
    } catch (err) {
        console.error(err);
        return <div style={{ background: '#000', color: '#ff0055', padding: '50px' }}>DATABASE_UPLINK_ERROR_77</div>;
    }
}

/* --- TACTICAL STYLING OBJECTS --- */

const containerStyle: React.CSSProperties = {
    padding: '40px 60px',
    backgroundColor: '#000',
    minHeight: '100vh',
    fontFamily: "'JetBrains Mono', monospace",
    color: '#fff'
};

const errorScreenStyle: React.CSSProperties = {
    background: '#000', 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    fontFamily: 'JetBrains Mono'
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #222',
    paddingBottom: '30px',
    marginBottom: '30px'
};

const sectionTitleStyle = { color: '#00ffd5', marginTop: 0, fontSize: '0.9rem', letterSpacing: '1px' };

const backBtnStyle = {
    color: '#fff',
    border: '1px solid #fff',
    padding: '10px 25px',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const
};

const metaBoxStyle = {
    marginTop: '30px',
    border: '1px solid #00ffd5',
    padding: '25px',
    backgroundColor: '#050505',
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
};

const dataGridStyle = {
    padding: '30px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px'
};

const dataItemStyle = {
    borderBottom: '1px solid #111',
    paddingBottom: '15px'
};

const labelStyle = { color: '#555', fontSize: '0.7rem', letterSpacing: '1.5px', fontWeight: 'bold' };
const valueStyle = { fontSize: '1.1rem', color: '#fff', marginTop: '5px' };
const messageValueStyle = { fontSize: '1.2rem', color: '#fff', marginTop: '5px', lineHeight: '1.4' };

const codeWrapperStyle = {
    marginTop: '30px',
    backgroundColor: '#050505',
    border: '1px solid #222',
};

const codeHeaderStyle = {
    backgroundColor: '#0a0a0a',
    padding: '12px 20px',
    fontSize: '0.7rem',
    color: '#00ffd5',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #222',
    letterSpacing: '1px'
};

const rawJsonStyle = {
    padding: '20px',
    color: '#444',
    background: '#020202',
    fontSize: '0.85rem',
    margin: '10px 0 0 0',
    border: '1px solid #111'
};

const footerStyle = {
    marginTop: '30px',
    padding: '25px',
    borderLeft: '4px solid #00ffd5',
    backgroundColor: '#050505'
};