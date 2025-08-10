import express, { Request, Response } from "express";
import userRouter from "./modules/user/user.route";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectToDatabase from "./config/db-connector";
import quizRouter from "./modules/quiz/quiz.route";
import adminRouter from "./modules/admin/admin.route";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [process.env.CLIENT_BASE_URL as string],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
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

app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

connectToDatabase();

export default app;
