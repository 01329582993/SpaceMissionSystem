require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function runTest(testName, query, processResult = (res) => console.table(res.rows)) {
    console.log(`\n=== TEST: ${testName} ===`);
    try {
        const res = await pool.query(query);
        processResult(res);
        console.log(`✅ ${testName} passed.`);
    } catch (err) {
        console.error(`❌ ${testName} failed:`, err.message);
    }
}

async function verifyAll() {
    console.log("Starting RDBMS Power Feature Verification...");

    // 1. Ranking
    await runTest("RANKING (Astronaut Leaderboard)",
        "SELECT name, rank, mission_count, experience_rank FROM v_astronaut_leaderboard ORDER BY experience_rank LIMIT 5;"
    );

    // 2. Windowing
    await runTest("WINDOWING (Telemetry Trends)",
        "SELECT spacecraft_name, radiation, radiation_moving_avg, temperature, temp_moving_avg FROM v_telemetry_trends LIMIT 5;"
    );

    // 3. Rollup (OLAP)
    await runTest("ROLLUP (Mission Stats)",
        "SELECT status, commander, mission_count FROM v_mission_summary_stats LIMIT 10;"
    );

    // 4. Recursive CTE
    await runTest("RECURSIVE CTE (Mission Hierarchy)",
        "SELECT depth, path FROM v_mission_hierarchy LIMIT 10;"
    );

    // 5. Procedural Logic (Cursor)
    console.log("\n=== TEST: PROCEDURAL LOGIC (Cursor) ===");
    try {
        const before = await pool.query("SELECT COUNT(*) FROM maintenance_log;");
        console.log(`Log count before: ${before.rows[0].count}`);

        await pool.query("CALL sp_batch_schedule_maintenance(100);");
        console.log("Procedure sp_batch_schedule_maintenance(100) called.");

        const after = await pool.query("SELECT COUNT(*) FROM maintenance_log;");
        console.log(`Log count after: ${after.rows[0].count}`);

        if (parseInt(after.rows[0].count) > parseInt(before.rows[0].count)) {
            console.log("✅ Procedural Logic test passed (maintenance logs created).");
        } else {
            console.log("⚠️ Procedural Logic test: No new logs created (might be due to criteria).");
        }
    } catch (err) {
        console.error("❌ Procedural Logic failed:", err.message);
    }

    // 6. Regex
    await runTest("REGEX & STRING OPS (Mission Tags)",
        "SELECT name, tags FROM v_mission_tags LIMIT 5;"
    );

    // 7. Audit Logging
    await runTest("AUDIT LOGGING",
        "SELECT action, table_name, changed_at FROM audit_log ORDER BY changed_at DESC LIMIT 3;"
    );

    await pool.end();
}

verifyAll();
