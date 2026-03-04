// src/lib/celestialService.ts
import { pool } from "./db";

export interface CelestialEvent {
    name: string;
    type: string;
    startTime: string;
    endTime?: string;
    visibility?: string;
    priority?: "low" | "medium" | "high" | "critical";
    source: string;
    details?: any;
}

export const NATIVE_EVENTS: CelestialEvent[] = [
    {
        name: "Halley's Comet Approach",
        type: "comet",
        startTime: new Date(Date.now() + 86400000 * 5).toISOString(),
        priority: "medium",
        source: "CosmoTrack Sensors",
    },
    {
        name: "Solar Flare Alpha-9",
        type: "space_weather",
        startTime: new Date(Date.now() + 86400000 * 2).toISOString(),
        priority: "critical",
        source: "CosmoTrack Sensors",
    },
    {
        name: "Leonid Meteor Shower",
        type: "meteor_shower",
        startTime: new Date(Date.now() + 86400000 * 12).toISOString(),
        priority: "low",
        source: "CosmoTrack Sensors",
    },
    {
        name: "Asteroid 2026-XQ Close Approach",
        type: "asteroid",
        startTime: new Date(Date.now() + 86400000 * 20).toISOString(),
        priority: "high",
        source: "CosmoTrack Sensors",
    },
    {
        name: "Lunar Eclipse (Total)",
        type: "eclipse",
        startTime: new Date(Date.now() + 86400000 * 30).toISOString(),
        visibility: "Global - Night Side",
        priority: "medium",
        source: "CosmoTrack Sensors",
    },
    {
        name: "Gamma-Ray Burst GRB-26",
        type: "space_weather",
        startTime: new Date(Date.now() + 86400000 * 1).toISOString(),
        priority: "critical",
        source: "Deep Space Array",
    },
    {
        name: "Orbital Debris Cluster Zeta",
        type: "asteroid",
        startTime: new Date(Date.now() + 86400000 * 3).toISOString(),
        priority: "critical",
        source: "Orbital Radar",
    },
    {
        name: "Perseid Meteor Storm",
        type: "meteor_shower",
        startTime: new Date(Date.now() + 86400000 * 15).toISOString(),
        visibility: "Northern Hemisphere",
        priority: "high",
        source: "CosmoTrack Sensors",
    }
];

export async function syncCelestialEvents() {
    for (const event of NATIVE_EVENTS) {
        await pool.query(
            `INSERT INTO celestial_events (name, event_type, start_time, end_time, visibility_region, priority_level, data_source, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (name) DO NOTHING`,
            [
                event.name,
                event.type,
                event.startTime,
                event.endTime || null,
                event.visibility || null,
                event.priority || "medium",
                event.source,
                JSON.stringify(event.details || {})
            ]
        );
    }
}
