import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs"; // IMPORTANT: make sure it runs in Node (not edge)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    // 1) confirm env is loaded
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { ok: false, error: "DATABASE_URL is missing in env" },
        { status: 500 }
      );
    }

    // 2) test basic query
  const result = await pool.query("SELECT * FROM spacecraft ORDER BY spacecraft_id LIMIT 10");

    return NextResponse.json({ ok: true, rows: result.rows });
  } catch (err: any) {
    console.error("DB ERROR:", err); // shows full error in terminal
    return NextResponse.json(
      {
        ok: false,
        message: err?.message,
        code: err?.code,
        detail: err?.detail,
        hint: err?.hint,
      },
      { status: 500 }
    );
  }
}
