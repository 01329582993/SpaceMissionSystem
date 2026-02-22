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

export async function POST(req: Request) {
  try {
    const { name, role, rank } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Officer name is required" }, { status: 400 });
    }

    const result = await pool.query(
      "INSERT INTO astronaut (name, role, rank, availability) VALUES ($1, $2, $3, 'Available') RETURNING *",
      [name, role, rank]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    console.error("ASTRONAUT POST ERROR:", err.message);
    return NextResponse.json({ error: err.message || "Failed to register personnel" }, { status: 500 });
  }
}

