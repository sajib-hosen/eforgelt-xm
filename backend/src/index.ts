import express, { Request, Response } from "express";

import userRouter from "./modules/user/user.route"; // User-related routes
import cors from "cors"; // Middleware to handle CORS (Cross-Origin requests)
import helmet from "helmet"; // Security middleware to set HTTP headers
import dotenv from "dotenv"; // To load environment variables from .env file
import rateLimit from "express-rate-limit"; // To limit repeated requests (e.g. brute-force protection)
import cookieParser from "cookie-parser"; // To parse cookies from the client
import morgan from "morgan"; // HTTP request logger middleware
import connectToDatabase from "./config/db-connector";
import quizRouter from "./modules/quiz/quiz.route"; // Quiz-related routes
import adminRouter from "./modules/admin/admin.route"; // Admin-related routes
import serverless from "serverless-http";

// Load environment variables from .env into process.env
dotenv.config();

const app = express();

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
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Max 100 requests per IP
});
app.use(limiter);

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/users", userRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Hello, World!");
});

// Centralized error-handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Database connection caching to reuse connection across lambda invocations
let isDbConnected = false;

const connectDbIfNeeded = async () => {
  if (!isDbConnected) {
    await connectToDatabase();
    isDbConnected = true;
  }
};

// Export the serverless handler
export const handler = async (req: any, res: any) => {
  try {
    await connectDbIfNeeded();
    return serverless(app)(req, res);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Database connection error" });
  }
};
