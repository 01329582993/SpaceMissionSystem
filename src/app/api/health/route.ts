import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const result = await pool.query("SELECT now(), version()");
  return NextResponse.json(result.rows[0]);
}
