import { NextResponse } from "next/server";
import pool from "@/src/lib/db";


export async function GET() {
  const result = await pool.query(
    "SELECT * FROM telemetry ORDER BY recorded_at DESC LIMIT 20"
  );
  return NextResponse.json(result.rows);
}


export async function POST(req: Request) {
  const body = await req.json();
  const { mission_id, temperature, battery, fuel, signal } = body;

  const result = await pool.query(
    `INSERT INTO telemetry
     (mission_id, temperature, battery, fuel, signal)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [mission_id, temperature, battery, fuel, signal]
  );

  return NextResponse.json(result.rows[0]);
}
