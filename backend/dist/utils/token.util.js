"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates access and refresh tokens for a user.
 *
 * @param payload - The payload to embed in the tokens (e.g., user id, role).
 * @returns An object containing accessToken and refreshToken.
 */
const generateTokens = (payload) => {
    // Generate Access Token (1 hour)
    const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    // Generate Refresh Token (7 days)
    const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
