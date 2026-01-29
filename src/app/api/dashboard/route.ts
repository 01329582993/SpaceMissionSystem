import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export const GET = async () => {
  try {
    
    const missionsRes = await pool.query("SELECT * FROM mission ORDER BY mission_id");
    const missions = missionsRes.rows;


    const astronautsRes = await pool.query("SELECT * FROM astronaut ORDER BY astronaut_id");
    const astronauts = astronautsRes.rows;


    const spacecraftRes = await pool.query("SELECT * FROM spacecraft ORDER BY spacecraft_id");
    const spacecraft = spacecraftRes.rows;


    const crewRes = await pool.query("SELECT * FROM mission_crew ORDER BY mission_id, astronaut_id");
    const missionCrew = crewRes.rows;

    
    const telemetryRes = await pool.query(`
      SELECT t1.*
      FROM telemetry t1
      INNER JOIN (
        SELECT spacecraft_id, MAX(recorded_at) AS max_time
        FROM telemetry
        GROUP BY spacecraft_id
      ) t2 ON t1.spacecraft_id = t2.spacecraft_id AND t1.recorded_at = t2.max_time
      ORDER BY t1.spacecraft_id
    `);
    const telemetry = telemetryRes.rows;

  
    const alertsRes = await pool.query("SELECT * FROM alert ORDER BY alert_id DESC");
    const alerts = alertsRes.rows;

    return NextResponse.json({ missions, astronauts, spacecraft, missionCrew, telemetry, alerts });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
};
