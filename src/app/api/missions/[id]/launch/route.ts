import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const runtime = "nodejs";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const missionId = parseInt(id);

        // Call the stored procedure
        // Note: In pg, we use CALL for procedures
        await pool.query("CALL sp_launch_sequence($1)", [missionId]);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("LAUNCH ERROR:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
