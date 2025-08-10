import express, { Request, Response } from "express";

// import userRouter from "./modules/user/user.route"; // User-related routes
import cors from "cors"; // Middleware to handle CORS (Cross-Origin requests)
import helmet from "helmet"; // Security middleware to set HTTP headers
import dotenv from "dotenv"; // To load environment variables from .env file
import rateLimit from "express-rate-limit"; // To limit repeated requests (e.g. brute-force protection)
import cookieParser from "cookie-parser"; // To parse cookies from the client
import morgan from "morgan"; // HTTP request logger middleware
import connectToDatabase from "./config/db-connector";
// import connectToDatabase from "./config/db-connector";
// import quizRouter from "./modules/quiz/quiz.route"; // Quiz-related routes
// import adminRouter from "./modules/admin/admin.route"; // Admin-related routes

// Create Express application
const app = express();

// Load environment variables from .env into process.env
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing) for the frontend
app.use(
  cors({
    origin: [process.env.CLIENT_BASE_URL as string], // Allow requests from this frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Send cookies and auth headers if needed
  })
);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per IP
});
app.use(limiter); // Apply rate limiter globally

app.use(cookieParser());

app.use(morgan("dev")); // logs method, url, status, response time, etc.

// connectToDatabase()
//   .then(() => {
//     console.log("Connected to Database");
//   })
//   .catch((error) => {
//     console.error("Database connection failed:", error);
//   });

// app.use("/api/users", userRouter);
// app.use("/api/quizzes", quizRouter);
// app.use("/api/admin", adminRouter);

// Simple health check or test route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Hello, World!");
});

// Centralized error-handling middleware for catching all unhandled errors
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ message: "Something went wrong!" }); // Send generic error response
});

// Start server only if DB connects
const run = async () => {
  // await connectToDatabase();

  app.listen(PORT, () => {
    console.log(
      `\x1b[38;2;50;205;50m🚀 Server is running on http://localhost:${PORT}\x1b[0m`
    );
  });
};

run().catch((err) => {
  console.error("❌ App failed to start:", err);
  // process.exit(1);
});
