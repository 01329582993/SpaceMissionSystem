import { NextResponse } from "next/server";
import { query } from "@/src/lib/db"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Destructure with defaults to prevent null errors
    const { 
      mission_id, 
      fuel = 100, 
      radiation = 0, 
      health = 100, 
      budget = 1000000, 
      duration = 1 
    } = body;

    // 2. Validate Inputs
    if (!mission_id) {
      return NextResponse.json({ error: "MISSING_MISSION_ID" }, { status: 400 });
    }

    // 3. AI Logic Formula Calculation
    const budget_usage = ((1000000 - parseFloat(budget)) / 1000000) * 100;
    const duration_factor = Math.min(parseFloat(duration) / 3.65, 20); 

    const risk_score = (
      (100 - parseFloat(health)) * 0.3 +
      (parseFloat(radiation) * 2) * 0.2 + 
      (100 - parseFloat(fuel)) * 0.2 +
      (budget_usage * 0.2) +
      (duration_factor * 0.1)
    );

    // 4. Determine Risk Level
    let risk_level = "LOW";
    if (risk_score > 80) risk_level = "CRITICAL";
    else if (risk_score > 60) risk_level = "HIGH";
    else if (risk_score > 30) risk_level = "MEDIUM";

    // 5. Database Insertion with Error Catching
    // Ensure your table name 'mission_risk_assessment' matches exactly
    const sql = `
      INSERT INTO mission_risk_assessment 
      (mission_id, fuel_level, radiation_level, health_score, budget_remaining, duration_days, risk_score, risk_level) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *;
    `;

    const values = [
      mission_id, 
      fuel, 
      radiation, 
      health, 
      budget, 
      duration, 
      risk_score.toFixed(2), 
      risk_level
    ];

    const result = await query(sql, values);

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error: any) {
    // Log the actual error to your terminal so you can see why it failed
    console.error("CRITICAL_DATABASE_ERROR:", error.message);
    
    return NextResponse.json({ 
      error: "UPLINK_FAILURE", 
      details: error.message 
    }, { status: 500 });
  }
}