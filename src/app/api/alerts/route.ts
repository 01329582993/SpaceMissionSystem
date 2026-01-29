import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT alert_id, mission_id, message, severity, created_at
      FROM alert
      ORDER BY created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("ALERT ERROR:", err.message);
    return NextResponse.json([], { status: 200 });
  }
}