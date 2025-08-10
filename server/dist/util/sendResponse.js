"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, responseData) => {
    const statusCode = 200;
    res.status(statusCode).json({
        success: responseData.success,
        message: responseData.message,
        data: responseData.data,
    });
};
exports.sendResponse = sendResponse;
