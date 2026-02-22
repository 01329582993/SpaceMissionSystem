import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET() {
    try {
        const result = await pool.query("SELECT * FROM v_operational_analytics LIMIT 1");
        // Also get alert distribution for a small chart
        const alerts = await pool.query(`
        SELECT severity, COUNT(*) as count 
        FROM alert 
        WHERE is_resolved = false 
        GROUP BY severity
    `);

        return NextResponse.json({
            stats: result.rows[0],
            alerts: alerts.rows
        });
    } catch (err: any) {
        console.error("ANALYTICS GET ERROR:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
