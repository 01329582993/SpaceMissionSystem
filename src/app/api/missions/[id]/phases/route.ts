import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const missionId = parseInt(id);

        const result = await pool.query(
            "SELECT * FROM mission_phase WHERE mission_id = $1 ORDER BY phase_id ASC",
            [missionId]
        );

        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error("Phases GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { phase_id, status } = await req.json();

        if (!phase_id || !status) {
            return NextResponse.json({ error: "Phase ID and status are required" }, { status: 400 });
        }

        await pool.query(
            "UPDATE mission_phase SET status = $1 WHERE phase_id = $2",
            [status, phase_id]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Phase Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
