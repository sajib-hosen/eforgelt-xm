import express from "express";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import rateLimit from "express-rate-limit";
import AppError from "../../errors/AppError";

const router = express.Router();

const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 5,
  handler: (req, res, next) => {
    const error = new AppError(
      429,
      "Too many login attempts. Please try again in 10 minutes."
    );
    next(error);
  },
});

router.post(
  "/login",
  generalLimiter,
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post("/logout", AuthControllers.logOut);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.post(
  "/similar-username-checking",
  AuthControllers.similarUserNameChecking
);

router.get("/verify-email", AuthControllers.verifyEmail);

export const AuthRouters = router;
