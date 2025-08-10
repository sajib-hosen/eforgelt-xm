import { Router } from "express";
import {
  getMe,
  loginUser,
  registerUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logoutUser,
} from "./user.controller";
import asyncHandler from "../../utils/async-handler";
import { accessTokenGuard, refreshTokenGuard } from "../../guard/http-guards";

const router = Router();

router.post("/register", asyncHandler(registerUser));

router.post("/verify-email/:tokenId", asyncHandler(verifyEmail));

router.post("/login", asyncHandler(loginUser));

router.get("/me", asyncHandler(accessTokenGuard), asyncHandler(getMe));

router.post("/forgot-password", asyncHandler(forgotPassword));

router.post("/reset-password/:tokenId", asyncHandler(resetPassword));

router.get(
  "/refresh-token",
  asyncHandler(refreshTokenGuard),
  asyncHandler(refreshAccessToken)
);

router.post("/logout", asyncHandler(logoutUser));

export default router;
