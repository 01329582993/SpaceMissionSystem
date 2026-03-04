require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function runSQL(filePath) {
    console.log(`Executing ${filePath}...`);
    const sql = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    await pool.query(sql);
}

async function setup() {
    try {
        console.log("Starting Database Setup...");

        // Ordered execution
        await runSQL('sql/01_schema.sql');
        await runSQL('sql/02_seed.sql');
        await runSQL('sql/02_views.sql');
        await runSQL('sql/03_functions.sql');
        await runSQL('sql/04_procedures.sql');
        await runSQL('sql/05_triggers.sql');
        await runSQL('sql/09_triggers_views.sql');
        await runSQL('sql/10_audit_logging.sql');
        await runSQL('sql/11_operational_analytics.sql');
        await runSQL('sql/12_integrity_constraints.sql');
        await runSQL('sql/13_stored_procedures.sql');
        await runSQL('sql/14_advanced_analytics.sql');
        await runSQL('sql/15_recursive_missions.sql');
        await runSQL('sql/16_procedural_utils.sql');

        console.log(" Database Setup Complete!");
    } catch (err) {
        console.error(" Setup Failed:", err.message);
    } finally {
        await pool.end();
    }
}

setup();
