"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_handler_1 = __importDefault(require("../../utils/async-handler"));
const http_guards_1 = require("../../guard/http-guards");
const quiz_controller_1 = require("./quiz.controller");
const router = (0, express_1.Router)();
// POST answers, evaluate, save and respond
router.post("/:step", (0, async_handler_1.default)(http_guards_1.accessTokenGuard), (0, async_handler_1.default)(quiz_controller_1.submitQuizAnswers));
router.get("/current-step", (0, async_handler_1.default)(http_guards_1.accessTokenGuard), (0, async_handler_1.default)(quiz_controller_1.getCurrentStep));
exports.default = router;
