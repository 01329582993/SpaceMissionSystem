import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "cosmotrack", 
  password: process.env.DB_PASSWORD || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Logic to check connection on boot
pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("❌ DB connection failed:", err.message);
  else console.log("✅ DB connected to CosmoTrack Core!");
});

// THIS LINE FIXES YOUR ERROR:
export default pool;