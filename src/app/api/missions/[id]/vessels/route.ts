import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { spacecraft_id } = await req.json();

        if (!spacecraft_id) {
            return NextResponse.json({ error: "Spacecraft ID is required" }, { status: 400 });
        }

        const missionId = parseInt(id);

        // Update the spacecraft to be assigned to this mission
        const result = await pool.query(
            "UPDATE spacecraft SET mission_id = $1 WHERE spacecraft_id = $2 RETURNING *",
            [missionId, spacecraft_id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Spacecraft not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (err: any) {
        console.error("VESSEL ASSIGNMENT POST ERROR:", err.message);
        return NextResponse.json({ error: err.message || "Failed to assign vessel" }, { status: 500 });
    }
}
