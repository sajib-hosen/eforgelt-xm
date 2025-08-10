"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./modules/user/user.route")); // User-related routes
const cors_1 = __importDefault(require("cors")); // Middleware to handle CORS (Cross-Origin requests)
const helmet_1 = __importDefault(require("helmet")); // Security middleware to set HTTP headers
const dotenv_1 = __importDefault(require("dotenv")); // To load environment variables from .env file
const express_rate_limit_1 = __importDefault(require("express-rate-limit")); // To limit repeated requests (e.g. brute-force protection)
const cookie_parser_1 = __importDefault(require("cookie-parser")); // To parse cookies from the client
const morgan_1 = __importDefault(require("morgan")); // HTTP request logger middleware
const db_connector_1 = __importDefault(require("./config/db-connector"));
const quiz_route_1 = __importDefault(require("./modules/quiz/quiz.route")); // Quiz-related routes
const admin_route_1 = __importDefault(require("./modules/admin/admin.route")); // Admin-related routes
// Create Express application
const app = (0, express_1.default)();
// Load environment variables from .env into process.env
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Enable CORS (Cross-Origin Resource Sharing) for the frontend
app.use((0, cors_1.default)({
    origin: [process.env.CLIENT_BASE_URL], // Allow requests from this frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Send cookies and auth headers if needed
}));
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP
});
app.use(limiter); // Apply rate limiter globally
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev")); // logs method, url, status, response time, etc.
// Middleware to log every request
// app.use((req, res, next) => {
//   const start = Date.now();
//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     // ANSI escape codes for colors
//     const reset = "\x1b[0m";
//     const cyan = "\x1b[36m";
//     const magenta = "\x1b[35m";
//     const green = "\x1b[32m";
//     const yellow = "\x1b[33m";
//     const red = "\x1b[31m";
//     const blue = "\x1b[34m";
//     // Choose color based on status code
//     let statusColor = green;
//     if (res.statusCode >= 300 && res.statusCode < 400) statusColor = yellow;
//     else if (res.statusCode >= 400) statusColor = red;
//     console.log(
//       `${cyan}${req.method}${reset} ${magenta}${req.originalUrl}${reset} -> ${statusColor}${res.statusCode}${reset} [${blue}${duration}ms${reset}]`
//     );
//   });
//   next();
// });
app.use("/api/users", user_route_1.default);
app.use("/api/quizzes", quiz_route_1.default);
app.use("/api/admin", admin_route_1.default);
// Simple health check or test route
app.get("/", (req, res) => {
    res.status(200).json("Hello, World!");
});
// Centralized error-handling middleware for catching all unhandled errors
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).json({ message: "Something went wrong!" }); // Send generic error response
});
// Start server only if DB connects
const run = async () => {
    await (0, db_connector_1.default)();
    app.listen(PORT, () => {
        console.log(`\x1b[38;2;50;205;50m🚀 Server is running on http://localhost:${PORT}\x1b[0m`);
    });
};
run().catch((err) => {
    console.error("❌ App failed to start:", err);
    process.exit(1);
});
