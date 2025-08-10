import { Request, Response } from "express";
import {
  createUser,
  createUserToken,
  findUserByEmail,
  findUserById,
  findUserTokenById,
  updateUserToken,
  verifyUserEmail,
} from "./user.service";
import * as bcrypt from "bcrypt";
import { IUser } from "../../types/user/user.types";
import { sendEmail } from "../../utils/send-email";
import { verificationEmailHTML } from "../../email-temps/verify-email-html";
import { APP_NAME, SALT_ROUND } from "../../utils/constants";
import { generateTokens } from "../../utils/token.util";
import { resetPasswordEmailHTML } from "../../email-temps/reset-password-email-html";
import { EXPIRY_STAMP } from "../../utils/expiry-stamp";
import environment from "../../config";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await createUser({ name, email, password }); // Create new user in the database

    const userToken = await createUserToken({
      type: "verify-email",
      email,
      isUsed: false,
    });

    const newLink = `${environment.client_base_url}/verify-email/${userToken.id}`; // Generate verification link

    await sendEmail(
      email, // Recipient email
      `Confirm your email address for ${APP_NAME}`, // Email subject
      verificationEmailHTML(name, newLink) // HTML email content
    );

    res.status(201).json({ message: "User created successfully" }); // Send success response
  } catch (error) {
    console.log("register error", error);
    res.status(500).json({ message: "Internal server error" }); // Handle unexpected errors
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;

    const userToken = await findUserTokenById(tokenId);

    if (!userToken) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link" });
    }

    if (userToken.isUsed || userToken.type !== "verify-email") {
      return res.status(400).json({ message: "Invalid or already used token" });
    }

    //Find the user by email from token
    const user = await findUserByEmail(userToken.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await verifyUserEmail(user.id);

    await updateUserToken(userToken.id, { isUsed: true });

    const { accessToken, refreshToken } = generateTokens({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Cannot be accessed via JavaScript
      secure: environment.node_env === "production", // Use HTTPS in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Email verification failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; // Get credentials from request

    const user = await findUserByEmail(email); // Find user in DB
    if (!user || !password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified)
      return res.status(401).json({ message: "User not verified" });

    // Validate password
    const isPasswordValid =
      user.password && (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Cannot be accessed via JavaScript
      secure: environment.node_env === "production", // HTTPS in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Send access token to client
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // Extract user id from req.user (set by your auth middleware)
    const reqUser = (req as any).user as IUser;

    if (!reqUser?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch fresh user data from DB by ID
    const user = await findUserById(reqUser.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally remove sensitive fields before sending, like password
    const { password, ...safeUser } = user.toObject();

    res.status(200).json(safeUser);
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(200).json({
        message: "If a matching account exists, a reset link has been sent.",
      });
    }

    if (!user.isVerified)
      return res.status(401).json({ message: "User not verified" });

    const resetToken = await createUserToken({
      type: "reset-password",
      email,
      isUsed: false,
      expiresAt: EXPIRY_STAMP,
    });

    const resetLink = `${environment.client_base_url}/reset-password/${resetToken.id}`;

    await sendEmail(
      email,
      `Reset your password for ${APP_NAME}`,
      resetPasswordEmailHTML(user.name, resetLink)
    );

    res.status(200).json({
      message: "If a matching account exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    const { newPassword } = req.body;

    const userToken = await findUserTokenById(tokenId);
    if (!userToken || userToken.isUsed || userToken.type !== "reset-password") {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const user = await findUserByEmail(userToken.email);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUND);

    await user.updateOne({ password: hashedPassword });

    await updateUserToken(userToken.id, { isUsed: true });

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    // The refreshTokenGuard middleware has verified the refresh token and attached user info to req.user
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set new refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: environment.node_env === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send new access token in response
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: environment.node_env === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
