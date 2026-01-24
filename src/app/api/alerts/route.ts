import { NextResponse } from "next/server";
import pool from "@/src/lib/db";


export async function GET() {
  const result = await pool.query(
    "SELECT * FROM alert ORDER BY created_at DESC"
  );
  return NextResponse.json(result.rows);
}
