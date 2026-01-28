import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT astronaut_id, name, role, availability
      FROM astronaut
      ORDER BY name
    `);
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("ASTRONAUT ERROR:", err.message);
    return NextResponse.json([], { status: 200 });
  }
}
