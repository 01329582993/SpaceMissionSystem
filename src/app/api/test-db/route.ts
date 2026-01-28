import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs"; 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
 
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { ok: false, error: "DATABASE_URL is missing in env" },
        { status: 500 }
      );
    }

  const result = await pool.query("SELECT * FROM spacecraft ORDER BY spacecraft_id LIMIT 10");

    return NextResponse.json({ ok: true, rows: result.rows });
  } catch (err: any) {
    console.error("DB ERROR:", err); 
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
