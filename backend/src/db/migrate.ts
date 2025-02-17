import { resolve } from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool, db } from "./db-conn";

const migrateDatabase = async () => {
  const client = await pool.connect(); // Get a client from the pool

  try {
    //await client.connect(); // Connect to the database
    console.log("Connected to PostgreSQL database for migrations.");

    // Perform the migrations
    await migrate(db, { migrationsFolder: resolve(__dirname, "../drizzle") });
    console.log("Migrations completed successfully.");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    client.release(); // Ensure the client is closed
    console.log("PostgreSQL client disconnected.");
    process.exit(0);
  }
};

migrateDatabase();
