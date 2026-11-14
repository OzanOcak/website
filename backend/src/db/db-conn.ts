import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

dotenv.config(); // Load environment variables

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || "localhost", // The hostname or IP address of your database server.
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "database",
});

// Initialize the database connection
const db = drizzle(pool, { schema });

// Connection state
// Verify database connectivity before starting the server
export async function connectDatabase() {
  await pool.query("SELECT 1");
  console.log("Connected to PostgreSQL database.");
}

// Export the client and db for use in other parts of your application
export { pool, db };
