import { NextResponse } from "next/server";
import pool from "@/src/lib/db";

export async function GET() {
  const result = await pool.query("SELECT * FROM astronaut");
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, role, availability } = body;

  const result = await pool.query(
    `INSERT INTO astronaut (name, role, availability)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [name, role, availability]
  );

  return NextResponse.json(result.rows[0]);
}
