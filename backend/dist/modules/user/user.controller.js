"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.refreshAccessToken = exports.resetPassword = exports.forgotPassword = exports.getMe = exports.loginUser = exports.verifyEmail = exports.registerUser = void 0;
const user_service_1 = require("./user.service");
const bcrypt = __importStar(require("bcrypt"));
const send_email_1 = require("../../utils/send-email");
const verify_email_html_1 = require("../../email-temps/verify-email-html");
const constants_1 = require("../../utils/constants");
const token_util_1 = require("../../utils/token.util");
const reset_password_email_html_1 = require("../../email-temps/reset-password-email-html");
const expiry_stamp_1 = require("../../utils/expiry-stamp");
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await (0, user_service_1.findUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        await (0, user_service_1.createUser)({ name, email, password }); // Create new user in the database
        const userToken = await (0, user_service_1.createUserToken)({
            type: "verify-email",
            email,
            isUsed: false,
        });
        const newLink = `${process.env.CLIENT_BASE_URL}/verify-email/${userToken.id}`; // Generate verification link
        await (0, send_email_1.sendEmail)(email, // Recipient email
        `Confirm your email address for ${constants_1.APP_NAME}`, // Email subject
        (0, verify_email_html_1.verificationEmailHTML)(name, newLink) // HTML email content
        );
        res.status(201).json({ message: "User created successfully" }); // Send success response
    }
    catch (error) {
        console.log("register error", error);
        res.status(500).json({ message: "Internal server error" }); // Handle unexpected errors
    }
};
exports.registerUser = registerUser;
const verifyEmail = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const userToken = await (0, user_service_1.findUserTokenById)(tokenId);
        if (!userToken) {
            return res
                .status(400)
                .json({ message: "Invalid or expired verification link" });
        }
        if (userToken.isUsed || userToken.type !== "verify-email") {
            return res.status(400).json({ message: "Invalid or already used token" });
        }
        //Find the user by email from token
        const user = await (0, user_service_1.findUserByEmail)(userToken.email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await (0, user_service_1.verifyUserEmail)(user.id);
        await (0, user_service_1.updateUserToken)(userToken.id, { isUsed: true });
        const { accessToken, refreshToken } = (0, token_util_1.generateTokens)({
            id: user._id,
            email: user.email,
            role: user.role,
        });
        // Set refresh token as HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // Cannot be accessed via JavaScript
            secure: process.env.NODE_ENV === "production", // Use HTTPS in production
            sameSite: "strict", // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });
        res.status(200).json({ accessToken });
    }
    catch (error) {
        console.error("Email verification failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.verifyEmail = verifyEmail;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // Get credentials from request
        const user = await (0, user_service_1.findUserByEmail)(email); // Find user in DB
        if (!user || !password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (!user.isVerified)
            return res.status(401).json({ message: "User not verified" });
        // Validate password
        const isPasswordValid = user.password && (await bcrypt.compare(password, user.password));
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const { accessToken, refreshToken } = (0, token_util_1.generateTokens)({
            id: user._id,
            email: user.email,
            role: user.role,
        });
        // Set refresh token as HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // Cannot be accessed via JavaScript
            secure: process.env.NODE_ENV === "production", // HTTPS in production
            sameSite: "strict", // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });
        // Send access token to client
        res.status(200).json({ accessToken });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.loginUser = loginUser;
const getMe = async (req, res) => {
    try {
        // Extract user id from req.user (set by your auth middleware)
        const reqUser = req.user;
        if (!(reqUser === null || reqUser === void 0 ? void 0 : reqUser.id)) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Fetch fresh user data from DB by ID
        const user = await (0, user_service_1.findUserById)(reqUser.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Optionally remove sensitive fields before sending, like password
        const { password, ...safeUser } = user.toObject();
        res.status(200).json(safeUser);
    }
    catch (error) {
        console.error("GetMe error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMe = getMe;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await (0, user_service_1.findUserByEmail)(email);
        if (!user) {
            return res.status(200).json({
                message: "If a matching account exists, a reset link has been sent.",
            });
        }
        if (!user.isVerified)
            return res.status(401).json({ message: "User not verified" });
        const resetToken = await (0, user_service_1.createUserToken)({
            type: "reset-password",
            email,
            isUsed: false,
            expiresAt: expiry_stamp_1.EXPIRY_STAMP,
        });
        const resetLink = `${process.env.CLIENT_BASE_URL}/reset-password/${resetToken.id}`;
        await (0, send_email_1.sendEmail)(email, `Reset your password for ${constants_1.APP_NAME}`, (0, reset_password_email_html_1.resetPasswordEmailHTML)(user.name, resetLink));
        res.status(200).json({
            message: "If a matching account exists, a reset link has been sent.",
        });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const { newPassword } = req.body;
        const userToken = await (0, user_service_1.findUserTokenById)(tokenId);
        if (!userToken || userToken.isUsed || userToken.type !== "reset-password") {
            return res
                .status(400)
                .json({ message: "Invalid or expired reset token." });
        }
        const user = await (0, user_service_1.findUserByEmail)(userToken.email);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const hashedPassword = await bcrypt.hash(newPassword, constants_1.SALT_ROUND);
        await user.updateOne({ password: hashedPassword });
        await (0, user_service_1.updateUserToken)(userToken.id, { isUsed: true });
        res.status(200).json({ message: "Password has been reset successfully." });
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.resetPassword = resetPassword;
const refreshAccessToken = async (req, res) => {
    try {
        // The refreshTokenGuard middleware has verified the refresh token and attached user info to req.user
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Generate new access and refresh tokens
        const { accessToken, refreshToken } = (0, token_util_1.generateTokens)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        // Set new refresh token cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Send new access token in response
        res.status(200).json({ accessToken });
    }
    catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.refreshAccessToken = refreshAccessToken;
const logoutUser = async (req, res) => {
    try {
        // Clear the refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.logoutUser = logoutUser;
