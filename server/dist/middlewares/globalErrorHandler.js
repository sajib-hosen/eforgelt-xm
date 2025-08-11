"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../errors/AppError"));
const globalErrorHandler = (err, req, res, next) => {
    //console.log("global", err);
    let statusCode = 500;
    let message = "Something went wrong";
    let errMessage = "Something went wrong";
    if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        errMessage = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errMessage: err.message,
    });
};
exports.default = globalErrorHandler;
