import Link from "next/link";
import { pool } from "@/src/lib/db";
import CosmoLayout from "@/src/components/CosmoLayout";

async function getMissionsList() {
  try {
    const result = await pool.query(
      "SELECT * FROM mission_dashboard ORDER BY mission_id DESC"
    );
    return result.rows;
  } catch (err) {
    console.error("Missions Directory DB Error:", err);
    return [];
  }
}

export default async function MissionsCatalogPage() {
  const missions = await getMissionsList();

  return (
    <CosmoLayout>
      <div
        style={{
          backgroundColor: "#000",
          minHeight: "100vh",
          padding: "60px 40px",
          color: "#fff",
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "60px",
            paddingBottom: "20px",
            borderBottom: "1px solid #222"
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "2.6rem",
                fontWeight: "900",
                letterSpacing: "-1px",
                textTransform: "uppercase"
              }}
            >
              Mission Directory
            </h1>
            <p
              style={{
                color: "#888",
                margin: "6px 0 0 0",
                letterSpacing: "2px",
                fontSize: "0.75rem",
                textTransform: "uppercase"
              }}
            >
              Registry Operational // {missions.length} Assets
            </p>
          </div>

          <Link href="/missions/new" style={modernButtonStyle}>
            + Initialize Mission
          </Link>
        </header>

        {/* LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {missions.length === 0 ? (
            <div
              style={{
                padding: "80px",
                textAlign: "center",
                border: "1px dashed #333",
                color: "#666"
              }}
            >
              NO MISSION DATA DETECTED
            </div>
          ) : (
            missions.map((m: any) => {
              // DYNAMIC STATUS LOGIC: Normalize the DB string (Planned, Active, etc.)
              const status = (m.mission_status || "PLANNED").toUpperCase();

              let badgeStyle: React.CSSProperties = { ...statusTagBase };

              if (status === "ACTIVE") {
                badgeStyle = {
                  ...badgeStyle,
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #fff"
                };
              } else if (status === "COMPLETED") {
                badgeStyle = {
                  ...badgeStyle,
                  backgroundColor: "#111",
                  color: "#aaa",
                  border: "1px solid #444"
                };
              } else if (status === "ABORTED") {
                badgeStyle = {
                  ...badgeStyle,
                  backgroundColor: "#111",
                  color: "#ff4d4d",
                  border: "1px solid #ff4d4d"
                };
              } else {
                // PLANNED / DEFAULT
                badgeStyle = {
                  ...badgeStyle,
                  backgroundColor: "#111",
                  color: "#fff",
                  border: "1px solid #555"
                };
              }

              return (
                <Link
                  key={m.mission_id}
                  href={`/missions/${m.mission_id}`}
                  className="mission-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={cardWrapperStyle}>
                    {/* ID & Name */}
                    <div style={{ borderLeft: "4px solid #fff", paddingLeft: "20px" }}>
                      <span style={technicalLabelStyle}>
                        ASSET_ID // 0{m.mission_id}
                      </span>
                      <h3
                        style={{
                          margin: "8px 0 0 0",
                          fontSize: "1.3rem",
                          fontWeight: "800",
                          textTransform: "uppercase"
                        }}
                      >
                        {m.mission_name}
                      </h3>
                    </div>

                    {/* Spacer */}
                    <div style={{ width: "40px" }} />

                    {/* Objective */}
                    <div
                      style={{
                        color: "#aaa",
                        fontSize: "0.9rem",
                        lineHeight: "1.6",
                        paddingRight: "30px"
                      }}
                    >
                      <span style={technicalLabelStyle}>
                        PRIMARY_OBJECTIVE
                      </span>
                      <div style={{ marginTop: "8px" }}>
                        {m.objective
                          ? m.objective.length > 90
                            ? m.objective.substring(0, 90) + "..."
                            : m.objective
                          : "VOID"}
                      </div>
                    </div>

                    {/* STATUS */}
                    <div style={{ textAlign: "center" }}>
                      <span style={badgeStyle}>{status}</span>
                    </div>

                    {/* STATS */}
                    <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
                      <div style={{ fontWeight: "900" }}>
                        {m.spacecraft_count || 0} UNITS
                      </div>
                      <div
                        style={{
                          color: (m.alert_count || 0) > 0 ? "#ff4d4d" : "#666",
                          fontWeight: "900",
                          marginTop: "6px"
                        }}
                      >
                        {m.alert_count || 0} ALERTS
                      </div>
                    </div>

                    {/* Arrow */}
                    <div
                      style={{
                        textAlign: "right",
                        color: "#fff",
                        fontSize: "1.2rem",
                        fontWeight: "900"
                      }}
                    >
                      →
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Hover Effects */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .mission-card {
                transition: transform 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67);
              }
              .mission-card:hover {
                transform: translateY(-6px);
              }
              .mission-card:hover > div {
                border: 1px solid #fff !important;
                box-shadow: 0 12px 0px #111;
              }
              .mission-card:active > div {
                transform: translateY(0px);
                box-shadow: 0 4px 0px #111;
              }
            `
          }}
        />
      </div>
    </CosmoLayout>
  );
}

/* ---------------- STYLES ---------------- */

const modernButtonStyle: React.CSSProperties = {
  padding: "12px 24px",
  backgroundColor: "#fff",
  color: "#000",
  textDecoration: "none",
  fontSize: "0.8rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "1px",
  border: "1px solid #fff",
  borderRadius: "50px",
  transition: "all 0.2s ease"
};

const cardWrapperStyle: React.CSSProperties = {
  backgroundColor: "#0d0d0d",
  padding: "30px",
  display: "grid",
  gridTemplateColumns: "1.5fr 40px 3fr 1fr 1.2fr 60px",
  alignItems: "center",
  border: "1px solid #222",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const technicalLabelStyle: React.CSSProperties = {
  fontSize: "0.65rem",
  fontWeight: "900",
  color: "#666",
  letterSpacing: "1px",
  display: "block"
};

const statusTagBase: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: "900",
  textTransform: "uppercase",
  padding: "6px 18px",
  letterSpacing: "1px",
  display: "inline-block",
  borderRadius: "50px"
};