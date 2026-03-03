import Link from 'next/link';
import { pool } from '@/src/lib/db';
import AnalyticsDashboard from '@/src/components/AnalyticsDashboard';
import CosmoLayout from '@/src/components/CosmoLayout';

async function getDashboardData() {
  try {
    const result = await pool.query("SELECT * FROM mission_dashboard ORDER BY mission_id DESC");
    return result.rows || [];
  } catch (error) {
    console.error("Data Fetch Error:", error);
    return [];
  }
}

async function getAggregatedStats() {
  try {
    const spacecraft = await pool.query("SELECT fuel_level FROM spacecraft");
    const missions = await pool.query("SELECT mission_status FROM mission_dashboard");
    const astronauts = await pool.query("SELECT astronaut_id FROM astronaut");

    const total = spacecraft.rows.length;
    const operational = spacecraft.rows.filter((s: any) => s.fuel_level > 15).length;
    const avgFuel = spacecraft.rows.reduce((acc: number, curr: any) => acc + curr.fuel_level, 0) / (total || 1);
    const activeMissions = missions.rows.filter((m: any) => m.mission_status === 'Active').length;

    return {
      total_spacecraft: total,
      operational_vessels: operational,
      avg_fuel_level: Math.round(avgFuel),
      active_missions: activeMissions,
      utilization_pct: total > 0 ? Math.round((activeMissions / total) * 100) : 0,
      deployed_personnel: astronauts.rows.length
    };
  } catch (e) {
    return null;
  }
}

export default async function DashboardPage() {
  const [missions, stats] = await Promise.all([
    getDashboardData(),
    getAggregatedStats()
  ]);

  return (
    <CosmoLayout>
      <div style={pageContainer}>
        
        {/* TOP TACTICAL NAVIGATION */}
        <nav style={tacticalNav}>
          <div style={logoSection}>
            <div style={squareIcon}></div>
            <h1 style={navTitle}>COSMO_SYS / <span style={{opacity: 0.8, color: '#00ffd5'}}>CORE_DASH</span></h1>
          </div>
          
          <div style={navMeta}>
            <div style={metaItem}>
              <span style={metaLabel}>NET_STATUS</span>
              <span style={metaValue}>ENCRYPTED_UPLINK</span>
            </div>
            <div style={metaItem}>
              <span style={metaLabel}>STATION_TIME</span>
              <span style={metaValue}>04:00:26 UTC</span>
            </div>
          </div>

          <Link href="/missions/new" className="tactical-btn" style={primaryBtn}>
            DEPLOY_MISSION +
          </Link>
        </nav>

        {/* ANALYTICS HUD */}
        <section style={hudWrapper}>
           <AnalyticsDashboard stats={stats || undefined} />
        </section>

        {/* SECTION HEADER */}
        <div style={headerStrip}>
          <div style={stripTitle}>OPERATIONAL_LOGS</div>
          <div style={stripLine}></div>
          <div style={stripTag}>V_4.0.5</div>
        </div>
        
        {/* GRID LAYOUT */}
        <div style={gridContainer}>
          {missions.map((m: any) => (
            <div key={m.mission_id} className="tactical-card" style={missionCard}>
              <div style={cardGlow}></div>
              
              <div style={cardTop}>
                <div style={missionId}>ID_{m.mission_id.toString().padStart(3, '0')}</div>
                <div style={statusTag(m.mission_status)}>{m.mission_status}</div>
              </div>

              <h2 style={cardTitle}>{m.mission_name}</h2>
              
              <p style={cardDescription}>
                {m.objective || "Standard protocol mission parameters active. Telemetry link established."}
              </p>

              <div style={dataStrip}>
                <div style={dataPiece}>
                  <div style={dataLabel}>VESSELS</div>
                  <div style={dataValue}>{m.spacecraft_count || 0}</div>
                </div>
                <div style={dataPiece}>
                  <div style={dataLabel}>ERRORS</div>
                  <div style={{...dataValue, color: m.alert_count > 0 ? '#ff0055' : '#00ffd5'}}>
                    {m.alert_count || 0}
                  </div>
                </div>
              </div>

              <Link href={`/missions/${m.mission_id}`} className="card-btn" style={cardLink}>
                OPEN_UPLINK_STREAM
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;500;800&display=swap');
        
        .tactical-btn {
          transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
          border: 1px solid #FFF !important;
        }
        .tactical-btn:hover {
          background: #00ffd5 !important;
          color: #000 !important;
          border-color: #00ffd5 !important;
          box-shadow: 0 0 20px rgba(0, 255, 213, 0.5);
          transform: translateY(-2px);
        }
        .tactical-card {
          transition: all 0.3s ease;
        }
        .tactical-card:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: #00ffd5 !important;
          transform: translateY(-5px);
        }
        .card-btn {
          transition: all 0.2s ease;
        }
        .card-btn:hover {
          background: #FFFFFF !important;
          color: #000000 !important;
          border-color: #FFFFFF !important;
        }
      `}} />
    </CosmoLayout>
  );
}

/* --- THEME STYLING (WHITE CONTRAST) --- */

const pageContainer: React.CSSProperties = {
  padding: "40px 60px",
  backgroundColor: "#000000",
  minHeight: "100vh",
  color: "#FFFFFF",
  fontFamily: "'JetBrains Mono', monospace",
};

const tacticalNav: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '30px',
  borderBottom: '2px solid #222',
  marginBottom: '40px'
};

const logoSection = { display: 'flex', alignItems: 'center', gap: '15px' };
const squareIcon = { width: '12px', height: '12px', background: '#00ffd5', boxShadow: '0 0 10px #00ffd5' };
const navTitle = { fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '2px' };

const navMeta = { display: 'flex', gap: '40px' };
const metaItem = { display: 'flex', flexDirection: 'column' as const };
const metaLabel = { fontSize: '0.65rem', color: '#FFFFFF', fontWeight: 800, opacity: 0.6 };
const metaValue = { fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 500 };

const primaryBtn: React.CSSProperties = {
  backgroundColor: '#FFF',
  color: '#000',
  padding: '12px 25px',
  fontWeight: 800,
  fontSize: '0.85rem',
  textDecoration: 'none',
  borderRadius: '0px',
};

const hudWrapper: React.CSSProperties = {
  marginBottom: '60px',
  border: '1px solid #222',
  padding: '20px',
  background: 'rgba(255,255,255,0.02)'
};

const headerStrip = { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' };
const stripTitle = { fontSize: '0.8rem', color: '#00ffd5', fontWeight: 800, letterSpacing: '4px' };
const stripLine = { flex: 1, height: '1px', background: '#333' };
const stripTag = { fontSize: '0.7rem', color: '#FFFFFF' };

const gridContainer: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '25px',
};

const missionCard: React.CSSProperties = {
  background: '#0a0a0a',
  border: '1px solid #333',
  padding: '35px',
  borderRadius: '0px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
};

const cardGlow = {
  position: 'absolute' as const,
  top: 0, left: 0, width: '100%', height: '3px',
  background: 'linear-gradient(90deg, transparent, #00ffd5, transparent)',
  opacity: 0.3
};

const cardTop = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const missionId = { fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 800, opacity: 0.5 };

const statusTag = (s: string): React.CSSProperties => ({
  fontSize: '0.65rem',
  fontWeight: 800,
  color: s === 'Active' ? '#00ffd5' : '#FFFFFF',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  border: `1px solid ${s === 'Active' ? '#00ffd5' : '#FFFFFF'}`,
  padding: '3px 8px'
});

const cardTitle = { fontSize: '1.6rem', fontWeight: 800, margin: '0 0 15px 0', letterSpacing: '-1px', color: '#FFFFFF' };
const cardDescription = { fontSize: '0.9rem', color: '#FFFFFF', opacity: 0.8, lineHeight: '1.6', marginBottom: '35px', minHeight: '50px' };

const dataStrip = { display: 'flex', gap: '35px', marginBottom: '35px', borderTop: '1px solid #333', paddingTop: '20px' };
const dataPiece = { display: 'flex', flexDirection: 'column' as const };
const dataLabel = { fontSize: '0.7rem', color: '#FFFFFF', fontWeight: 800, letterSpacing: '1px', opacity: 0.6 };
const dataValue = { fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' };

const cardLink: React.CSSProperties = {
  padding: '14px',
  textAlign: 'center',
  border: '2px solid #FFFFFF',
  color: '#FFFFFF',
  textDecoration: 'none',
  fontSize: '0.75rem',
  fontWeight: 800,
  letterSpacing: '2px',
  borderRadius: '0px',
};