import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cosmotrack",
  password: "postgres",
  port: 5432,
});

export default pool;


pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("❌ DB connection failed:", err);
  else console.log("✅ DB connected! Current time:", res.rows[0].now);
});
