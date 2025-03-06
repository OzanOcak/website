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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_conn_1 = require("./db/db-conn");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const oauthRoutes_1 = __importDefault(require("./routes/oauthRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const likeblogRoutes_1 = __importDefault(require("./routes/likeblogRoutes"));
const visitRoutes_1 = __importDefault(require("./routes/visitRoutes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_path_1 = __importDefault(require("node:path"));
dotenv_1.default.config({
    path: node_path_1.default.resolve(__dirname, `.env.${process.env.NODE_ENV || "development"}`),
}); // If process.env.NODE_ENV is undefined, it defaults to development and loads
// .env.development (or .env if .env.development doesn't exist).
const PORT = Number(process.env.PORT) || 3000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Optionally, run migrations or initialize other resources here
        yield (0, db_conn_1.connectDatabase)();
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, cookie_parser_1.default)());
        // List of allowed origins
        const allowedOrigins = [
            "http://localhost:5173", // Development origin
            "https://website-nine-eta-87.vercel.app", // Production origin
        ];
        // Enable CORS for all routes
        const corsOptions = {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true); // Allow the request
                }
                else {
                    callback(new Error("Not allowed by CORS")); // Block the request
                }
            },
            credentials: true, // Allow credentials (cookies, authorization headers, etc.)
            exposedHeaders: ["Refresh-Token-ID", "Authorization"], // Expose the Authorization header
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"], // Allow the necessary methods
        };
        app.use((0, cors_1.default)(corsOptions));
        // app.use(trackVisit);
        app.use("/api", authRoutes_1.default);
        app.use("/api", roleRoutes_1.default);
        app.use("/api", oauthRoutes_1.default);
        app.use("/api", commentRoutes_1.default);
        app.use("/api", likeblogRoutes_1.default);
        app.use("/api", visitRoutes_1.default);
        app.get("/api/hello", (req, res) => {
            res.json({ message: "Hello, World!" });
        });
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error);
    }
});
startServer();
/**
    // No Caching
    app.use((req, res, next) => {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      next();
    });
 */
