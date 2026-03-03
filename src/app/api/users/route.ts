import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const role = url.searchParams.get("role"); // e.g., "Commander", "Pilot"

    const query = role
      ? "SELECT user_id, username, role FROM users WHERE role = $1 ORDER BY username"
      : "SELECT user_id, username, role FROM users ORDER BY username";

    const { rows } = await pool.query(query, role ? [role] : []);

    return NextResponse.json({ users: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}