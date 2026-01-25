import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: false, error: "DATABASE_URL missing" }, { status: 500 });
    }

    const info = await pool.query(`
      SELECT current_database() AS db, current_schema() AS schema, current_user AS user
    `);

    const tables = await pool.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type='BASE TABLE'
      ORDER BY table_schema, table_name
      LIMIT 200
    `);

    return NextResponse.json({ ok: true, info: info.rows[0], tables: tables.rows });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message, code: err?.code, detail: err?.detail },
      { status: 500 }
    );
  }
}
