import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mId = searchParams.get('mission_id');
    const sId = searchParams.get('spacecraft_id');

    let query = `
      SELECT t.telemetry_id, t.spacecraft_id, t.temperature, t.voltage, t.fuel_level, t.radiation, t.recorded_at, s.mission_id
      FROM telemetry t
      JOIN spacecraft s ON t.spacecraft_id = s.spacecraft_id
    `;
    const params = [];

    if (mId) {
      query += ` WHERE s.mission_id = $1`;
      params.push(parseInt(mId));
    } else if (sId) {
      query += ` WHERE t.spacecraft_id = $1`;
      params.push(parseInt(sId));
    }

    query += ` ORDER BY t.recorded_at DESC LIMIT 50`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("TELEMETRY GET ERROR:", err.message);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const { spacecraft_id, temperature, voltage, fuel_level, radiation } = await req.json();

    const result = await pool.query(
      `INSERT INTO telemetry (spacecraft_id, temperature, voltage, fuel_level, radiation) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [spacecraft_id, temperature, voltage, fuel_level, radiation]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    console.error("TELEMETRY POST ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

