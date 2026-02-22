import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET() {
    try {
        const result = await pool.query(`
      SELECT s.spacecraft_id, s.name, s.model, s.fuel_level, s.health_status, s.mission_id, m.name as mission_name
      FROM spacecraft s
      LEFT JOIN mission m ON s.mission_id = m.mission_id
      ORDER BY s.name
    `);
        return NextResponse.json(result.rows);
    } catch (err: any) {
        console.error("SPACECRAFT GET ERROR:", err.message);
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, model, fuel_level, mission_id } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Spacecraft name is required" }, { status: 400 });
        }

        const result = await pool.query(
            "INSERT INTO spacecraft (name, model, fuel_level, health_status, mission_id) VALUES ($1, $2, $3, 'Operational', $4) RETURNING *",
            [name, model, fuel_level || 100, mission_id || null]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err: any) {
        console.error("SPACECRAFT POST ERROR:", err.message);
        return NextResponse.json({ error: err.message || "Failed to register spacecraft" }, { status: 500 });
    }
}
