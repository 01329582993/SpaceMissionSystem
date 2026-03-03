import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1. Fetch Spacecraft Life Support Data
    const envRes = await pool.query(
      `SELECT * FROM life_support_telemetry 
       WHERE spacecraft_id = (SELECT spacecraft_id FROM spacecraft WHERE mission_id = $1 LIMIT 1)
       ORDER BY recorded_at DESC LIMIT 1`,
      [id]
    );

    // 2. Fetch Crew Vitals
    const crewRes = await pool.query(
      `SELECT a.name, a.role, v.* FROM astronaut a
       JOIN crew_vitals v ON a.astronaut_id = v.astronaut_id
       WHERE a.current_mission_id = $1
       ORDER BY v.recorded_at DESC`,
      [id]
    );

    return NextResponse.json({
      environment: envRes.rows[0] || null,
      crew: crewRes.rows || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}