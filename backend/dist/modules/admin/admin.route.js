"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const async_handler_1 = __importDefault(require("../../utils/async-handler"));
const http_guards_1 = require("../../guard/http-guards");
const router = (0, express_1.Router)();
router.get("/users", (0, async_handler_1.default)(http_guards_1.adminGuard), (0, async_handler_1.default)(admin_controller_1.getAllUsers));
router.get("/users/:id", (0, async_handler_1.default)(admin_controller_1.getUser));
// router.put("/users/:id", asyncHandler(updateUser));
// router.delete("/users/:id", asyncHandler(deleteUser));
exports.default = router;
