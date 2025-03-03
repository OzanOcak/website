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
let isConnected = false;
// Function to connect the database
export async function connectDatabase() {
  if (!isConnected) {
    try {
      await pool.connect(); // Connect to the database
      isConnected = true; // Update the connection state
      console.log("Connected to PostgreSQL database!!!!");
    } catch (err) {
      console.error("Connection error", err);
    }
  } else {
    console.log("Already connected to PostgreSQL database");
  }
}

// Export the client and db for use in other parts of your application
export { pool, db };
