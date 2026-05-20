import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// Use the Supabase transaction-mode pooler URL (port 6543, ?pgbouncer=true).
// Transaction mode is stateless and works correctly inside Vercel serverless functions.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Serverless: one connection per function instance is sufficient.
  max: 1,
  connectionTimeoutMillis: 8000,
  ssl: { rejectUnauthorized: false },
});
