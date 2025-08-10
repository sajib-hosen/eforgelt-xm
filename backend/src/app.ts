import express, { Application } from "express";
import cors from "cors";
// import globalErrorHandler from "./middlewares/globalErrorHandler";
// import router from "./routes";
import cookieParser from "cookie-parser";
import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import AppError from "./errors/AppError";

const app: Application = express();

app.use(
  cors({
    origin: [process.env.CLIENT_BASE_URL as string], // Allow requests from this frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Send cookies and auth headers if needed
  })
);

app.use(helmet());

// Limit JSON body size
app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  next();
});

// General rate limiter for all APIs
// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   handler: (req, res, next) => {
//     // Pass the error to your global error handler
//     const error = new AppError(
//       429,
//       "Too many requests, please try again after 15 minutes."
//     );
//     next(error);
//   },
// });

// app.use("/api/", generalLimiter);
// app.use("/api/v1", router);

// app.use((req, res, next) => {
//   console.log("Request Origin:", req.headers.origin);
//   next();
// });

app.get("/", (req, res) => {
  console.log("Request Origin:", req.headers.origin);
  res.send("Hello world");
});

// app.use(globalErrorHandler);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", cors_sites);
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// app.use(globalErrorHandler);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API NOT Found !",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found",
    },
  });
});

export default app;
