import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

/**
 * MISSION_REGISTRY_HANDLER
 * Creates a new mission and links the selected spacecraft asset.
 */
export async function POST(req: Request) {
  // Start a client from the pool to handle multiple queries in a transaction
  const client = await pool.connect();

  try {
    const body = await req.json();
    const { 
      name, 
      commander_id, 
      objective, 
      status, 
      launch_date, 
      spacecraft_id 
    } = body;

    // 1. Basic Validation
    if (!name || !commander_id || !objective || !launch_date || !spacecraft_id) {
      return NextResponse.json(
        { error: "INCOMPLETE_DATA_PACKET: All fields including Spacecraft are required." },
        { status: 400 }
      );
    }

    // Begin Database Transaction
    await client.query('BEGIN');

    // 2. Insert Mission into 'mission' table
    // We use launch_date for the start_date column
    const missionQuery = `
      INSERT INTO mission 
      (name, status, start_date, objective, commander_id, created_by)
      VALUES ($1, $2, $3, $4, $5, $5)
      RETURNING mission_id
    `;

    const missionRes = await client.query(missionQuery, [
      name,
      status || 'Planned',
      launch_date,
      objective,
      commander_id
    ]);

    const newMissionId = missionRes.rows[0].mission_id;

    // 3. Link Spacecraft to the New Mission
    // This is the step that was missing, causing "UNASSIGNED" or "NOT_FOUND" errors.
    const updateSpacecraftQuery = `
      UPDATE spacecraft 
      SET mission_id = $1 
      WHERE spacecraft_id = $2
    `;

    await client.query(updateSpacecraftQuery, [newMissionId, spacecraft_id]);

    // Commit Transaction
    await client.query('COMMIT');

    return NextResponse.json(
      { 
        message: "MISSION_ESTABLISHED", 
        mission_id: newMissionId,
        status: "SUCCESS" 
      }, 
      { status: 201 }
    );

  } catch (error: any) {
    // Rollback changes if any part of the process fails
    await client.query('ROLLBACK');
    console.error("CRITICAL_MISSION_FAILURE:", error);
    
    return NextResponse.json(
      { error: "INTERNAL_DATABASE_FAILURE", details: error.message },
      { status: 500 }
    );
  } finally {
    // Release the database client back to the pool
    client.release();
  }
}

/**
 * MISSION_QUERY_HANDLER
 * Fetches all missions for the directory.
 */
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT m.*, u.username as commander_name 
      FROM mission m
      LEFT JOIN users u ON m.commander_id = u.user_id
      ORDER BY m.mission_id DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}