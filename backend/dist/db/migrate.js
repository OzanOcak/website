"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const db_conn_1 = require("./db-conn");
const migrateDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_conn_1.pool.connect(); // Get a client from the pool
    try {
        //await client.connect(); // Connect to the database
        console.log("Connected to PostgreSQL database for migrations.");
        // Perform the migrations
        yield (0, migrator_1.migrate)(db_conn_1.db, { migrationsFolder: (0, node_path_1.resolve)(__dirname, "../drizzle") });
        console.log("Migrations completed successfully.");
    }
    catch (error) {
        console.error("Migration error:", error);
    }
    finally {
        client.release(); // Ensure the client is closed
        console.log("PostgreSQL client disconnected.");
        process.exit(0);
    }
});
migrateDatabase();
