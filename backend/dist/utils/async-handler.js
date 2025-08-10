"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This higher-order function wraps your async middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.default = asyncHandler;
