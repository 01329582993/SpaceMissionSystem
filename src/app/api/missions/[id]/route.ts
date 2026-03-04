import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const missionRes = await pool.query(
      "SELECT * FROM mission_dashboard WHERE mission_id = $1", [params.id]
    );

    if (missionRes.rows.length === 0) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    // Optional: Get spacecraft assigned to this mission
    const craftRes = await pool.query(
      "SELECT name FROM spacecraft WHERE mission_id = $1", [params.id]
    );

    return NextResponse.json({
      ...missionRes.rows[0],
      spacecraft: craftRes.rows,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}