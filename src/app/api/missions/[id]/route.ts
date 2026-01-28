import { NextResponse } from "next/server";
import pool from "@/src/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM mission_dashboard");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}