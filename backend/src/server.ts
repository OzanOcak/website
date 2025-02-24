import express from "express";
import { connectDatabase } from "./db/db-conn";
import authRoutes from "./routes/authRoutes";
import roleRoutes from "./routes/roleRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import commentRoutes from "./routes/commentRoutes";
import likeblogRoutes from "./routes/likeblogRoutes";

import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Optionally, run migrations or initialize other resources here
    await connectDatabase();
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    // Enable CORS for all routes
    app.use(
      cors({
        origin: "http://localhost:5173", //  frontend origin
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
        exposedHeaders: ["Refresh-Token-ID", "Authorization"], // Expose the Authorization header
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"], // Allow the necessary methods
      })
    );

    app.use("/api", authRoutes);
    app.use("/api", roleRoutes);
    app.use("/api", oauthRoutes);
    app.use("/api", commentRoutes);
    app.use("/api", likeblogRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();

/**
    // No Caching
    app.use((req, res, next) => {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      next();
    });
 */
