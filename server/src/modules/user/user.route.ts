import { Router } from "express";
import // getMe,
// loginUser,
// registerUser,
// verifyEmail,
// forgotPassword,
// resetPassword,
// refreshAccessToken,
// logoutUser,
"./user.controller";
import { createUser } from "./user.service";
// import { accessTokenGuard, refreshTokenGuard } from "../../guard/http-guards";
// import asyncHandler from "../../utils/async-handler";

const userRouter = Router();

userRouter.post("/register", createUser);

// userRouter.post("/verify-email/:tokenId", verifyEmail);

// userRouter.post("/login", loginUser);
// userRouter.get("/me", accessTokenGuard, getMe);

// userRouter.post("/forgot-password", forgotPassword);

// userRouter.post("/reset-password/:tokenId", resetPassword);

// userRouter.get("/refresh-token", refreshTokenGuard, refreshAccessToken);

// userRouter.post("/logout", logoutUser);

export default userRouter;
