import { resolve } from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool, db } from "./db-conn";
import { retry } from "ts-retry-promise";
import { PoolClient } from "pg";

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds between retries

const migrateDatabase = async () => {
  let client: PoolClient | null = null;

  try {
    // Retry connection with exponential backoff
    client = await retry(
      async () => {
        const c = await pool.connect();
        console.log("✅ Database connection established");
        return c;
      },
      {
        retries: MAX_RETRIES,
        delay: RETRY_DELAY,
        backoff: "EXPONENTIAL",
        logger: (msg) => console.log(`🔄 Retrying: ${msg}`),
      }
    );

    // Perform migrations with timeout
    await retry(
      async () => {
        console.log("🚀 Starting migrations...");
        await migrate(db, {
          migrationsFolder: resolve(__dirname, "../drizzle"),
        });
      },
      {
        retries: 3,
        delay: 1000,
        timeout: 30000, // 30 second timeout for migrations
      }
    );

    console.log("🎉 Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    if (client) {
      await client.release();
      console.log("🔌 Connection released");
    }
    await pool.end();
    process.exit(0);
  }
};

// Add Docker-ready check for production
const waitForDatabase = async () => {
  if (process.env.NODE_ENV === "production") {
    console.log("🐋 Waiting for database to be ready...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

waitForDatabase().then(migrateDatabase);
