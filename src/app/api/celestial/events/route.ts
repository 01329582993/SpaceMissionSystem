// src/app/api/celestial/events/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
    try {
        const result = await pool.query(
            "SELECT * FROM celestial_events ORDER BY start_time ASC LIMIT 100"
        );
        return NextResponse.json(result.rows);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, event_type, start_time, end_time, visibility_region, priority_level, data_source, details } = body;

        await pool.query(
            `INSERT INTO celestial_events (name, event_type, start_time, end_time, visibility_region, priority_level, data_source, details)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [name, event_type, start_time, end_time, visibility_region, priority_level, data_source, JSON.stringify(details)]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
