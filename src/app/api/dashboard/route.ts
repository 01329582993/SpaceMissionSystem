import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const GET = async () => {
  try {
    // 1. Fetch Missions with counts
    const missionsRes = await pool.query("SELECT * FROM mission_dashboard ORDER BY start_date DESC");

    // 2. Fetch Fleet Health (Joining mission for fuel)
    const spacecraftRes = await pool.query(`
      SELECT s.spacecraft_id, s.name, s.model, s.health_status, m.fuel_level 
      FROM spacecraft s
      LEFT JOIN mission m ON s.mission_id = m.mission_id
      ORDER BY m.fuel_level DESC
    `);

    // 3. Fetch Latest Alerts
    const alertsRes = await pool.query("SELECT * FROM alert ORDER BY created_at DESC LIMIT 5");

    // 4. Fetch Personnel
    const astronautsRes = await pool.query("SELECT * FROM astronaut ORDER BY rank");

    return NextResponse.json({
      missions: missionsRes.rows,
      spacecraft: spacecraftRes.rows,
      alerts: alertsRes.rows,
      astronauts: astronautsRes.rows
    });
  } catch (err: any) {
    console.error("DASHBOARD API ERROR:", err.message);
    return NextResponse.json({ error: "Failed to fetch terminal data" }, { status: 500 });
  }
};