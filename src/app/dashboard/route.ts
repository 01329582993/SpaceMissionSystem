import { NextResponse } from "next/server";
import pool from "@/src/lib/db";

export async function GET() {
  const result = await pool.query("SELECT * FROM mission_dashboard");
  return NextResponse.json(result.rows);
}
