import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
  try {
    const res = await pool.query(
      "SELECT spacecraft_id, name FROM spacecraft ORDER BY name"
    );
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error("Failed to fetch spacecrafts:", err);
    return NextResponse.json({ error: "Failed to fetch spacecrafts" }, { status: 500 });
  }
}