// src/components/CelestialCalendar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CelestialCalendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch("/api/celestial/events");
                const data = await res.json();
                setEvents(data);
            } catch (e) {
                console.error("Failed to fetch celestial events", e);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(e => filter === "all" || e.event_type === filter);

    return (
        <div>
            {/* Filters */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                <select
                    style={{
                        backgroundColor: "#111",
                        color: "#fff",
                        border: "1px solid #333",
                        padding: "10px 20px",
                        borderRadius: "50px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        outline: "none",
                        cursor: "pointer"
                    }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">ALL EVENTS</option>
                    <option value="space_weather">SPACE WEATHER</option>
                    <option value="asteroid">NEO OBJECTS</option>
                    <option value="eclipse">ECLIPSES</option>
                    <option value="meteor_shower">METEOR SHOWERS</option>
                    <option value="comet">COMETS</option>
                </select>
            </div>

            {loading ? (
                <div style={{ padding: "80px", textAlign: "center", color: "#666", border: "1px dashed #333", fontSize: "0.8rem", letterSpacing: "2px", fontWeight: "900" }}>
                    INITIALIZING_DATA...
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    {filteredEvents.length === 0 ? (
                        <div style={{ padding: "80px", textAlign: "center", border: "1px dashed #333", color: "#666", fontSize: "0.8rem", letterSpacing: "2px", fontWeight: "900" }}>
                            NO EVENT DATA DETECTED
                        </div>
                    ) : (
                        filteredEvents.map((event, idx) => {
                            const status = event.priority_level.toUpperCase();
                            let badgeStyle = { ...statusTagBase };
                            const isCritical = status === "CRITICAL";

                            if (isCritical) {
                                badgeStyle = { ...badgeStyle, backgroundColor: "#111", color: "#ff4d4d", border: "1px solid #ff4d4d", boxShadow: "0 0 10px rgba(255, 77, 77, 0.3)" };
                            } else if (status === "HIGH") {
                                badgeStyle = { ...badgeStyle, backgroundColor: "#111", color: "#ff9f1c", border: "1px solid #ff9f1c" };
                            } else {
                                badgeStyle = { ...badgeStyle, backgroundColor: "#111", color: "#fff", border: "1px solid #555" };
                            }

                            return (
                                <Link href={`/celestial/${event.event_id}`} key={event.event_id || idx} className={`event-card-wrapper ${isCritical ? 'critical-event' : ''}`}>
                                    <div className="event-card" style={cardWrapperStyle}>
                                        <div style={{ borderLeft: `4px solid ${isCritical ? '#ff4d4d' : '#fff'}`, paddingLeft: "20px" }}>
                                            <span style={technicalLabelStyle}>EVENT_TYPE // {event.event_type.toUpperCase()}</span>
                                            <h3 style={{ margin: "8px 0 0 0", fontSize: "1.3rem", fontWeight: "800", textTransform: "uppercase", color: isCritical ? '#ff4d4d' : '#fff' }}>
                                                {event.name}
                                            </h3>
                                        </div>

                                        <div style={{ width: "40px" }}></div>

                                        <div style={{ color: "#aaa", fontSize: "0.9rem", lineHeight: "1.6", paddingRight: "30px" }}>
                                            <span style={technicalLabelStyle}>EVENT_START_TIME</span>
                                            <div style={{ marginTop: "8px", fontWeight: "600", textTransform: "uppercase", color: isCritical ? '#ffaaaa' : '#aaa' }}>
                                                {new Date(event.start_time).toLocaleString()}
                                            </div>
                                        </div>

                                        <div style={{ textAlign: "center" }}>
                                            <span style={badgeStyle}>{status}</span>
                                        </div>

                                        <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
                                            <span style={technicalLabelStyle}>SOURCE</span>
                                            <div style={{ fontWeight: "900", marginTop: "6px", color: isCritical ? '#ff4d4d' : '#ddd' }}>{event.data_source.toUpperCase()}</div>
                                        </div>

                                        <div style={{ textAlign: "right", color: isCritical ? '#ff4d4d' : '#fff', fontSize: "1.2rem", fontWeight: "900" }}>
                                            →
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            )}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                  .event-card-wrapper {
                    transition: transform 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67);
                    color: inherit;
                    text-decoration: none;
                    display: block;
                  }
                  .event-card-wrapper:hover {
                    transform: translateY(-6px);
                  }
                  .event-card-wrapper:hover .event-card {
                    border: 1px solid #fff !important;
                    box-shadow: 0 12px 0px #111;
                  }
                  .event-card-wrapper:active .event-card {
                    transform: translateY(0px);
                    box-shadow: 0 4px 0px #111;
                  }

                  /* CRITICAL EVENT SHINE / GLOW */
                  .critical-event:hover .event-card {
                    border: 1px solid #ff4d4d !important;
                    box-shadow: 0 12px 25px rgba(255, 77, 77, 0.4), 0 0 10px rgba(255, 77, 77, 0.2) inset !important;
                  }
                  .critical-event:active .event-card {
                    transform: translateY(0px);
                    box-shadow: 0 4px 15px rgba(255, 77, 77, 0.6) !important;
                  }
                `
                }}
            />
        </div>
    );
}

const cardWrapperStyle = {
    backgroundColor: "#0d0d0d",
    padding: "30px",
    display: "grid",
    gridTemplateColumns: "1.5fr 40px 3fr 1fr 1.2fr 60px",
    alignItems: "center",
    border: "1px solid #222",
    cursor: "pointer",
    transition: "all 0.2s ease"
};

const technicalLabelStyle = {
    fontSize: "0.65rem",
    fontWeight: "900",
    color: "#666",
    letterSpacing: "1px",
    display: "block"
};

const statusTagBase = {
    fontSize: "0.7rem",
    fontWeight: "900",
    textTransform: "uppercase",
    padding: "6px 18px",
    letterSpacing: "1px",
    display: "inline-block",
    borderRadius: "50px"
};
