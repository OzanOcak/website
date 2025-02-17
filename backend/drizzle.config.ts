import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/db/schema.ts",
  out: "src/drizzle", // drizzle folder should be under src directory
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
