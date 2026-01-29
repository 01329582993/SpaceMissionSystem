import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT t.telemetry_id, t.spacecraft_id, t.temperature, t.voltage, t.fuel_level, t.radiation, t.recorded_at
      FROM telemetry t
      ORDER BY t.recorded_at DESC
      LIMIT 50;
    `);

    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("TELEMETRY ERROR:", err.message);
    return NextResponse.json([], { status: 200 });
  }
}
