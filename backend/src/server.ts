import express from "express";
import { connectDatabase } from "./db/db-conn";
import authRoutes from "./routes/authRoutes";
import roleRoutes from "./routes/roleRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import commentRoutes from "./routes/commentRoutes";
import likeblogRoutes from "./routes/likeblogRoutes";
import visitRoutes from "./routes/visitRoutes";

import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "node:path";
import helmet from "helmet";

dotenv.config({
  path: path.resolve(
    __dirname,
    `.env.${process.env.NODE_ENV || "development"}`
  ),
}); // If process.env.NODE_ENV is undefined, it defaults to development and loads
// .env.development (or .env if .env.development doesn't exist).

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  try {
    // Optionally, run migrations or initialize other resources here
    await connectDatabase();
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    // List of allowed origins
    const allowedOrigins = [
      "http://localhost:5173", // Development origin
      "https://website-nine-eta-87.vercel.app", // Production origin
    ];

    // Enable CORS for all routes
    const corsOptions = {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); // Allow the request
        } else {
          callback(new Error("Not allowed by CORS")); // Block the request
        }
      },
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
      exposedHeaders: ["Refresh-Token-ID", "Authorization"], // Expose the Authorization header
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"], // Allow the necessary methods
    };

    app.use(cors(corsOptions));
    app.use(helmet());

    // app.use(trackVisit);

    app.use("/api", authRoutes);
    app.use("/api", roleRoutes);
    app.use("/api", oauthRoutes);
    app.use("/api", commentRoutes);
    app.use("/api", likeblogRoutes);
    app.use("/api", visitRoutes);

    app.get("/api/hello", (req, res) => {
      res.json({ message: "Hello, World!" });
    });

    app.listen(PORT, "0.0.0.0", () => {
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
