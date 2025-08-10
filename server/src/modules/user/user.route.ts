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
// import asyncHandler from "../../utils/async-handler";
import { accessTokenGuard, refreshTokenGuard } from "../../guard/http-guards";
import asyncHandler from "../../utils/async-handler";
// import { accessTokenGuard, refreshTokenGuard } from "../../guard/http-guards";

const userRouter = Router();

userRouter.post("/register", asyncHandler(registerUser));

userRouter.post("/verify-email/:tokenId", asyncHandler(verifyEmail));

userRouter.post("/login", asyncHandler(loginUser));

userRouter.get("/me", asyncHandler(accessTokenGuard), asyncHandler(getMe));

userRouter.post("/forgot-password", asyncHandler(forgotPassword));

userRouter.post("/reset-password/:tokenId", asyncHandler(resetPassword));

userRouter.get(
  "/refresh-token",
  asyncHandler(refreshTokenGuard),
  asyncHandler(refreshAccessToken)
);

userRouter.post("/logout", asyncHandler(logoutUser));

export default userRouter;
