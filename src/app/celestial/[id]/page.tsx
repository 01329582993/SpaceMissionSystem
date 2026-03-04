"use client";

import { useState, useEffect } from "react";
import CosmoLayout from "@/src/components/CosmoLayout";
import { useParams, useRouter } from "next/navigation";
import { ShieldAlert, Activity, Radio, AlertTriangle, ArrowLeft, Database, Satellite } from "lucide-react";

export default function EventIntelligenceDashboard() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const res = await fetch("/api/celestial/events");
                const data = await res.json();
                const found = data.find((e: any) => e.event_id.toString() === params.id);
                setEvent(found);
            } catch (e) {
                console.error("Failed to fetch event details", e);
            } finally {
                setLoading(false);
            }
        }
        if (params.id) fetchEvent();
    }, [params.id]);

    if (loading) {
        return (
            <CosmoLayout>
                <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: "60px 40px", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    <div style={{ color: "#666", fontSize: "0.8rem", letterSpacing: "2px", fontWeight: "900" }}>INITIALIZING_INTELLIGENCE_DASHBOARD...</div>
                </div>
            </CosmoLayout>
        );
    }

    if (!event) {
        return (
            <CosmoLayout>
                <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: "60px 40px", color: "#fff", fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    <button onClick={() => router.back()} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "900", letterSpacing: "1px", fontSize: "0.75rem", textTransform: "uppercase" }}>
                        <ArrowLeft size={16} /> RETURN_TO_OBSERVATORY
                    </button>
                    <div style={{ marginTop: "40px", padding: "80px", textAlign: "center", border: "1px dashed #333", color: "#ff4d4d", fontSize: "0.8rem", letterSpacing: "2px", fontWeight: "900" }}>
                        ERROR_404: EVENT_DATA_NOT_FOUND
                    </div>
                </div>
            </CosmoLayout>
        );
    }

    const priority = event.priority_level.toUpperCase();
    const isCritical = priority === "CRITICAL";
    const startTime = new Date(event.start_time);
    const timeDiff = startTime.getTime() - now;
    const isPast = timeDiff < 0;

    let statusText = isPast ? "COMPLETED / ACTIVE" : "UPCOMING";

    // Formatting Countdown Timer
    let countdownText = "T-MINUS 00:00:00:00";
    if (!isPast) {
        const d = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const h = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((timeDiff / 1000 / 60) % 60);
        const s = Math.floor((timeDiff / 1000) % 60);
        countdownText = `T-MINUS ${d.toString().padStart(2, '0')}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // Dynamic Theming based on Priority
    const accentColor = isCritical ? "#ff4d4d" : (priority === "HIGH" ? "#ff9f1c" : "#fff");
    const bgGlow = isCritical ? "rgba(255, 77, 77, 0.05)" : "transparent";

    // Mock Dynamic Data based on Event Type
    const getTechData = () => {
        switch (event.event_type) {
            case 'space_weather': return { stat1: "SOLAR_FLARE_CLASS // X-CLASS", stat2: "PEAK_INTENSITY // 1400 W/m2", risk: "CRITICAL_COMMS_BLACKOUT" };
            case 'asteroid': return { stat1: "VELOCITY // 24.5 km/s", stat2: "CLOSEST_APPROACH // 0.0024 AU", risk: "KINETIC_IMPACT_RISK" };
            case 'eclipse': return { stat1: "MAGNITUDE // 1.034", stat2: "OBSCURATION // 100%", risk: "NOMINAL" };
            case 'meteor_shower': return { stat1: "ZHR // 120 meteors/hr", stat2: "RADIANT // Leo Constellation", risk: "MICRO_DEBRIS_HAZARD" };
            default: return { stat1: "TRAJECTORY // NOMINAL", stat2: "INTENSITY // STANDARD", risk: "MODERATE" };
        }
    };
    const techData = getTechData();

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
                <button
                    onClick={() => router.push('/celestial')}
                    style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: "900", letterSpacing: "1px", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "30px", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget as any).style.color = "#fff"}
                    onMouseLeave={(e) => (e.currentTarget as any).style.color = "#666"}
                >
                    <ArrowLeft size={16} /> RETURN_TO_OBSERVATORY
                </button>

                {/* HEADER ROW */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", paddingBottom: "20px", borderBottom: `1px solid ${isCritical ? 'rgba(255,77,77,0.3)' : '#222'}` }}>
                    <div>
                        <div style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "15px" }}>
                            <span style={{ fontSize: "0.7rem", fontWeight: "900", color: "#000", backgroundColor: "#fff", padding: "4px 12px", borderRadius: "50px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                {event.event_type}
                            </span>
                            <span style={{ fontSize: "0.7rem", fontWeight: "900", border: `1px solid ${accentColor}`, color: accentColor, padding: "4px 12px", borderRadius: "50px", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }}>
                                {isCritical && <ShieldAlert size={12} />} PRIORITY // {priority}
                            </span>
                        </div>
                        <h1 style={{ margin: 0, fontSize: "3rem", fontWeight: "900", letterSpacing: "-1.5px", textTransform: "uppercase", color: accentColor, textShadow: isCritical ? "0 0 20px rgba(255,77,77,0.5)" : "none" }}>
                            {event.name}
                        </h1>
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.75rem", color: "#666", fontWeight: "900", letterSpacing: "2px", marginBottom: "8px" }}>
                            STATUS // {statusText}
                        </div>
                        <div style={{ fontSize: "2.4rem", fontWeight: "900", color: isPast ? '#666' : '#fff', letterSpacing: "-1px", fontFamily: 'monospace' }}>
                            {countdownText}
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
                    {/* LEFT COLUMN: CORE DATA & IMPACT */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

                        {/* MISSION IMPACT SECTION */}
                        <div style={{ background: bgGlow, border: `1px solid ${isCritical ? 'rgba(255,77,77,0.5)' : '#151515'}`, padding: "30px", borderRadius: "4px", position: "relative" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                                <span style={{ fontSize: "0.85rem", color: accentColor, fontWeight: "900", letterSpacing: "1.5px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <AlertTriangle size={18} /> MISSION_IMPACT_ANALYSIS
                                </span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div style={{ background: "#050505", border: "1px solid #111", padding: "20px", borderRadius: "2px" }}>
                                    <span style={{ fontSize: "0.65rem", color: "#666", fontWeight: "900", letterSpacing: "1px" }}>AFFECTED_SYSTEMS</span>
                                    <h4 style={{ margin: "10px 0 0 0", fontSize: "1rem", fontWeight: "800", color: "#fff", textTransform: "uppercase" }}>
                                        {event.event_type === 'space_weather' ? 'High-Frequency Comms & GPS' : 'Orbital Maneuvering Thrusters'}
                                    </h4>
                                </div>
                                <div style={{ background: "#050505", border: "1px solid #111", padding: "20px", borderRadius: "2px" }}>
                                    <span style={{ fontSize: "0.65rem", color: "#666", fontWeight: "900", letterSpacing: "1px" }}>RADIATION_RISK</span>
                                    <h4 style={{ margin: "10px 0 0 0", fontSize: "1rem", fontWeight: "800", color: isCritical ? '#ff4d4d' : '#fff', textTransform: "uppercase" }}>
                                        {isCritical ? 'FATAL_EXPOSURE_BEYOND_L.E.O.' : 'NOMINAL_SHIELDING_ADEQUATE'}
                                    </h4>
                                </div>
                            </div>

                            <div style={{ marginTop: "20px", borderTop: "1px solid #222", paddingTop: "20px" }}>
                                <span style={{ fontSize: "0.65rem", color: "#666", fontWeight: "900", letterSpacing: "1px" }}>RECOMMENDED_OPERATIONAL_ACTIONS</span>
                                <ul style={{ listStyleType: "square", paddingLeft: "15px", margin: "10px 0 0 0", color: "#ccc", fontSize: "0.9rem", lineHeight: "1.8", fontWeight: "600", letterSpacing: "0.5px" }}>
                                    <li style={{ color: isCritical ? '#ff4d4d' : 'inherit' }}>{isCritical ? 'ACTIVATE_EMERGENCY_SHIELDING_PROTOCOLS' : 'CONTINUE_NOMINAL_OPERATIONS'}</li>
                                    <li>NOTIFY_ALL_ORBITAL_PERSONNEL</li>
                                    <li>{event.event_type === 'asteroid' ? 'INITIATE_COLLISION_AVOIDANCE_COMPUTATIONS' : 'MONITOR_SOLAR_ARRAY_EFFICIENCY'}</li>
                                </ul>
                            </div>
                        </div>

                        {/* TECHNICAL DATA */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                            {[
                                { label: "EVENT_UTC_TIME", value: startTime.toUTCString().replace(" GMT", "") },
                                { label: "LOCAL_TIME", value: startTime.toLocaleString() },
                                { label: "VISIBILITY_REGION", value: event.visibility_region || "N/A" },
                                { label: techData.stat1.split(" // ")[0], value: techData.stat1.split(" // ")[1] },
                                { label: techData.stat2.split(" // ")[0], value: techData.stat2.split(" // ")[1] },
                                { label: "RISK_ASSESSMENT", value: techData.risk, color: isCritical ? '#ff4d4d' : '#fff' },
                            ].map((stat, i) => (
                                <div key={i} style={{ background: "#080808", border: "1px solid #151515", padding: "20px", borderRadius: "2px" }}>
                                    <span style={{ fontSize: "0.6rem", color: "#666", fontWeight: "900", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>{stat.label}</span>
                                    <div style={{ fontSize: "1rem", fontWeight: "800", color: stat.color || "#fff", letterSpacing: "0.5px" }}>{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: TELEMETRY & HISTORY */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

                        {/* REAL TIME TELEMETRY */}
                        <div style={{ background: "#050505", border: "1px solid #111", padding: "30px", borderRadius: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid #222", paddingBottom: "15px" }}>
                                <span style={{ fontSize: "0.85rem", color: "#fff", fontWeight: "900", letterSpacing: "1.5px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Activity size={18} color="#4cc9f0" /> REAL_TIME_TELEMETRY
                                </span>
                                <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981", animation: "pulse 2s infinite" }}></span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "0.65rem", color: "#666", fontWeight: "900", letterSpacing: "1px" }}>MAGNETIC_DISTURBANCE</span>
                                        <span style={{ fontSize: "0.75rem", color: "#fff", fontWeight: "800", fontFamily: "monospace" }}>Kp {(Math.random() * (isCritical ? 9 : 4)).toFixed(1)}</span>
                                    </div>
                                    <div style={{ height: "4px", background: "#222", width: "100%", borderRadius: "2px", overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: isCritical ? "85%" : "30%", background: isCritical ? "#ff4d4d" : "#4cc9f0", transition: "width 1s ease" }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "0.65rem", color: "#666", fontWeight: "900", letterSpacing: "1px" }}>XRAY_FLUX</span>
                                        <span style={{ fontSize: "0.75rem", color: "#fff", fontWeight: "800", fontFamily: "monospace" }}>{isCritical ? 'X2.4' : 'M1.2'}</span>
                                    </div>
                                    <div style={{ height: "4px", background: "#222", width: "100%", borderRadius: "2px", overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: isCritical ? "95%" : "40%", background: isCritical ? "#ff4d4d" : "#f72585", transition: "width 1s ease" }}></div>
                                    </div>
                                </div>

                                <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "15px", borderRadius: "2px", display: "flex", alignItems: "center", gap: "15px", marginTop: "10px" }}>
                                    <Satellite size={24} color="#666" />
                                    <div>
                                        <span style={{ fontSize: "0.6rem", color: "#666", fontWeight: "900", letterSpacing: "1px", display: "block" }}>SENSOR_ARRAY_STATUS</span>
                                        <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#10b981", letterSpacing: "1px" }}>ONLINE_AND_TRACKING</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DATA SOURCE & ORBITAL HISTORY */}
                        <div style={{ border: "1px dashed #333", padding: "30px", borderRadius: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <span style={{ fontSize: "0.85rem", color: "#666", fontWeight: "900", letterSpacing: "1.5px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Database size={18} /> DATA_ATTRIBUTION
                                </span>
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#999", lineHeight: "1.6", fontWeight: "600" }}>
                                Intelligence aggregated from primary telemetry feed: <span style={{ color: "#fff" }}>{event.data_source.toUpperCase()}</span>.
                                Cross-referenced with orbital historical databases.
                            </div>

                            <div style={{ marginTop: "25px" }}>
                                <span style={{ fontSize: "0.65rem", color: "#666", fontWeight: "900", letterSpacing: "1px" }}>LAST_KNOWN_SIMILAR_EVENTS</span>
                                <div style={{ marginTop: "10px" }}>
                                    <div style={{ fontSize: "0.8rem", color: "#fff", fontWeight: "600", padding: "10px", borderBottom: "1px solid #222" }}>2015-08-11 // MODERATE_IMPACT</div>
                                    <div style={{ fontSize: "0.8rem", color: "#fff", fontWeight: "600", padding: "10px", borderBottom: "1px solid #222" }}>2003-11-04 // CRITICAL_IMPACT (HALLOWEEN STORMS)</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </CosmoLayout>
    );
}
