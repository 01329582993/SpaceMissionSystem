import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
  try {
    
    const result = await pool.query("SELECT * FROM mission_dashboard ORDER BY mission_id DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch missions" }, { status: 500 });
  }
}