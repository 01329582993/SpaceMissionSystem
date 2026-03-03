import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        // Find current status
        const currentRes = await pool.query("SELECT status FROM mission WHERE mission_id = $1", [params.id]);
        const currentStatus = currentRes.rows[0].status;

        const flow: Record<string, string> = {
            'Planned': 'Active',
            'Active': 'Completed',
            'Completed': 'Completed'
        };

        const nextStatus = flow[currentStatus] || 'Active';

        await pool.query("UPDATE mission SET status = $1 WHERE mission_id = $2", [nextStatus, params.id]);

        // Auto-log the event in Audit Logs
        await pool.query(
            "INSERT INTO audit_log (action, table_name, record_id, details) VALUES ($1, $2, $3, $4)",
            ['STATUS_CHANGE', 'mission', params.id, `Mission advanced to ${nextStatus}`]
        );

        return NextResponse.json({ success: true, newStatus: nextStatus });
    } catch (err) {
        return NextResponse.json({ error: "Failed to advance mission" }, { status: 500 });
    }
}