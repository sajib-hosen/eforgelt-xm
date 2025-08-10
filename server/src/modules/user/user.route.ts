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
import { accessTokenGuard, refreshTokenGuard } from "../../guard/http-guards";
import asyncHandler from "../../utils/async-handler";

const userRouter = Router();

userRouter.post("/register", registerUser);

userRouter.post("/verify-email/:tokenId", verifyEmail);

userRouter.post("/login", loginUser);
userRouter.get("/me", accessTokenGuard, getMe);

userRouter.post("/forgot-password", forgotPassword);

userRouter.post("/reset-password/:tokenId", resetPassword);

userRouter.get("/refresh-token", refreshTokenGuard, refreshAccessToken);

userRouter.post("/logout", asyncHandler(logoutUser));

export default userRouter;
