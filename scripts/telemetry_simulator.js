const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function simulate() {
    console.log("🚀 Starting CosmoTrack Telemetry Simulator...");

    while (true) {
        try {
            // Find active spacecraft (assigned to an Active mission)
            const res = await pool.query(`
        SELECT s.spacecraft_id, s.fuel_level 
        FROM spacecraft s
        JOIN mission m ON s.mission_id = m.mission_id
        WHERE m.status = 'Active'
      `);

            for (const ship of res.rows) {
                // Generate fluctuating data
                const temp = (90 + Math.random() * 10).toFixed(2); // 90-100 range
                const voltage = (24 + Math.random() * 4).toFixed(2); // 24-28 range
                const radiation = (0.5 + Math.random() * 2).toFixed(2);

                // Slow fuel consumption
                const newFuel = Math.max(0, ship.fuel_level - (Math.random() * 0.05)).toFixed(2);

                await pool.query(`
          INSERT INTO telemetry (spacecraft_id, temperature, voltage, fuel_level, radiation)
          VALUES ($1, $2, $3, $4, $5)
        `, [ship.spacecraft_id, temp, voltage, newFuel, radiation]);

                await pool.query(`
          UPDATE spacecraft SET fuel_level = $1 WHERE spacecraft_id = $2
        `, [newFuel, ship.spacecraft_id]);

                console.log(`📡 Transmitting for Ship #${ship.spacecraft_id}: T:${temp}°C, F:${newFuel}%`);
            }

        } catch (err) {
            console.error("❌ Link Error:", err.message);
        }

        // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

simulate();
