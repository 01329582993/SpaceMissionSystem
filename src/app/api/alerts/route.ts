import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/db';

// FETCH ACTIVE ALERTS
export async function GET() {
    try {
        const result = await pool.query(`
            SELECT alert_id, type, message, status, created_at 
            FROM system_alerts 
            WHERE status = 'active' 
            ORDER BY created_at DESC
        `);
        return NextResponse.json(result.rows);
    } catch (err) {
        return NextResponse.json({ error: "DB_FETCH_ERROR" }, { status: 500 });
    }
}

// RESOLVE AN ALERT
export async function PATCH(request: Request) {
    try {
        const { alert_id } = await request.json();
        await pool.query(
            'UPDATE system_alerts SET status = $1 WHERE alert_id = $2',
            ['resolved', alert_id]
        );
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "DB_UPDATE_ERROR" }, { status: 500 });
    }
}