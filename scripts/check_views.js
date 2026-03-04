require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function check() {
    const res = await pool.query("SELECT table_name FROM information_schema.views WHERE table_schema = 'public';");
    console.table(res.rows);
    await pool.end();
}

check();
