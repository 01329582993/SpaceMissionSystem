import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET() {
    try {
        const result = await pool.query(`
      SELECT log_id, action, table_name, record_id, old_data, new_data, changed_at, details
      FROM audit_log
      ORDER BY changed_at DESC
      LIMIT 100
    `);
        return NextResponse.json(result.rows);
    } catch (err: any) {
        console.error("AUDIT LOG GET ERROR:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
