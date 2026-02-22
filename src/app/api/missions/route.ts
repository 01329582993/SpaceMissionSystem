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

export async function POST(req: Request) {
  try {
    const { name, objective, commander } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Mission name is required" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO mission (name, objective, commander, status) VALUES ($1, $2, $3, 'Planned') RETURNING *",
      [name, objective, commander]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Database POST Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create mission" }, { status: 500 });
  }
}
