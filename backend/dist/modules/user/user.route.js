"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const async_handler_1 = __importDefault(require("../../utils/async-handler"));
const http_guards_1 = require("../../guard/http-guards");
const router = (0, express_1.Router)();
router.post("/register", (0, async_handler_1.default)(user_controller_1.registerUser));
router.post("/verify-email/:tokenId", (0, async_handler_1.default)(user_controller_1.verifyEmail));
router.post("/login", (0, async_handler_1.default)(user_controller_1.loginUser));
router.get("/me", (0, async_handler_1.default)(http_guards_1.accessTokenGuard), (0, async_handler_1.default)(user_controller_1.getMe));
router.post("/forgot-password", (0, async_handler_1.default)(user_controller_1.forgotPassword));
router.post("/reset-password/:tokenId", (0, async_handler_1.default)(user_controller_1.resetPassword));
router.get("/refresh-token", (0, async_handler_1.default)(http_guards_1.refreshTokenGuard), (0, async_handler_1.default)(user_controller_1.refreshAccessToken));
router.post("/logout", (0, async_handler_1.default)(user_controller_1.logoutUser));
exports.default = router;
