"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenGuard = accessTokenGuard;
exports.refreshTokenGuard = refreshTokenGuard;
exports.adminGuard = adminGuard;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Guard to validate Access Token sent in Authorization header (Bearer token)
 */
async function accessTokenGuard(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
                return res.status(401).json({ message: "User unauthorized!" });
            }
            req.user = {
                id: decoded.id,
                role: decoded.role,
                email: decoded.email,
            };
            next();
        }
        catch (error) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Invalid access token" });
        }
    }
    else {
        return res
            .status(401)
            .json({ message: "Unauthorized: No access token provided" });
    }
}
/**
 * Guard to validate Refresh Token sent in HTTP-only cookie "refreshToken"
 */
async function refreshTokenGuard(req, res, next) {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
                return res.status(401).json({ message: "User unauthorized!" });
            }
            req.user = {
                id: decoded.id,
                role: decoded.role,
                email: decoded.email,
            };
            next();
        }
        catch (error) {
            console.log("refresh error", error);
            return res
                .status(401)
                .json({ message: "Unauthorized: Invalid refresh token" });
        }
    }
    else {
        return res
            .status(401)
            .json({ message: "Unauthorized: No refresh token provided" });
    }
}
async function adminGuard(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log("admin guard", decoded);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id) || decoded.role !== "admin") {
                return res.status(401).json({ message: "User unauthorized!" });
            }
            req.user = {
                id: decoded.id,
                role: decoded.role,
                email: decoded.email,
            };
            next();
        }
        catch (error) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Invalid access token" });
        }
    }
    else {
        return res
            .status(401)
            .json({ message: "Unauthorized: No access token provided" });
    }
}
