import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const { spacecraft_name, hours, reset } = await req.json();

    if (!spacecraft_name) {
      return NextResponse.json({ error: "ASSET_NAME_REQUIRED" }, { status: 400 });
    }

    // 1. REFUEL LOGIC
    if (reset) {
      const resetRes = await pool.query(
        "UPDATE mission SET fuel_level = 100 FROM spacecraft s WHERE s.mission_id = mission.mission_id AND s.name = $1 RETURNING mission.fuel_level",
        [spacecraft_name]
      );

      if (resetRes.rows.length === 0) {
        return NextResponse.json({ error: "ASSET_NOT_FOUND" }, { status: 404 });
      }

      return NextResponse.json({
        fuel_burn: 0,
        remaining_fuel: 100,
        temperature: 20,
        base_rate: 8.5,
        temp_multiplier: 1
      });
    }

    // 2. BURN CALCULATION
    const craftRes = await pool.query(
      "SELECT m.fuel_level, m.mission_id FROM mission m JOIN spacecraft s ON s.mission_id = m.mission_id WHERE s.name = $1",
      [spacecraft_name]
    );
    if (craftRes.rows.length === 0) {
      return NextResponse.json({ error: "INVALID_SPACECRAFT" }, { status: 404 });
    }

    const currentFuel = craftRes.rows[0].fuel_level;
    const missionId = craftRes.rows[0].mission_id;
    const baseRate = 8.5;
    const tempMultiplier = 1.0;
    const fuelBurned = Math.round(baseRate * hours * tempMultiplier); // Amount lost

    // Percentage calculation (assuming 1000kg tank)
    const burnPercent = (fuelBurned / 1000) * 100;

    // Math.round ensures we send an INTEGER to the DB
    const newFuel = Math.round(Math.max(currentFuel - burnPercent, 0));

    await pool.query(
      "UPDATE mission SET fuel_level = $1 WHERE mission_id = $2",
      [newFuel, missionId]
    );

    return NextResponse.json({
      fuel_burn: fuelBurned, // Positive value representing loss
      remaining_fuel: newFuel,
      temperature: 25,
      base_rate: baseRate,
      temp_multiplier: tempMultiplier
    });

  } catch (err) {
    console.error("Simulation error:", err);
    return NextResponse.json({ error: "DATABASE_CONNECTION_LOST" }, { status: 500 });
  }
}