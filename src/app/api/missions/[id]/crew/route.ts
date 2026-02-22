import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { astronaut_id, position } = await req.json();

        if (!astronaut_id) {
            return NextResponse.json({ error: "Astronaut selection is required" }, { status: 400 });
        }

        const missionId = parseInt(id);

        // Check if mission exists
        const missionCheck = await pool.query("SELECT mission_id FROM mission WHERE mission_id = $1", [missionId]);
        if (missionCheck.rowCount === 0) {
            return NextResponse.json({ error: "Mission not found" }, { status: 404 });
        }

        // Insert into mission_crew
        await pool.query(
            "INSERT INTO mission_crew (mission_id, astronaut_id, position) VALUES ($1, $2, $3) ON CONFLICT (mission_id, astronaut_id) DO UPDATE SET position = $3",
            [missionId, astronaut_id, position || 'Specialist']
        );

        // Update astronaut availability
        await pool.query(
            "UPDATE astronaut SET availability = 'On Mission' WHERE astronaut_id = $1",
            [astronaut_id]
        );

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: any) {
        console.error("Crew Assignment Error:", error);
        return NextResponse.json({ error: error.message || "Failed to assign crew" }, { status: 500 });
    }
}
