const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function run() {
    try {
        const sql = fs.readFileSync('sql/06_views_updated.sql', 'utf8');
        await pool.query(sql);
        console.log('✅ View mission_dashboard updated successfully');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error updating view:', err.message);
        process.exit(1);
    }
}

run();
