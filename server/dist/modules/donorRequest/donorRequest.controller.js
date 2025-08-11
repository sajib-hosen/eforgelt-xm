"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donorRequestControllers = void 0;
const sendResponse_1 = require("../../util/sendResponse");
const donorRequest_service_1 = __importDefault(require("./donorRequest.service"));
const createDonorRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { request } = req.body;
    //console.log(request);
    const result = yield donorRequest_service_1.default.donorRequestSendToDatabase(request);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Request Sent successfully",
        data: result,
    });
});
const getReceivedDonorRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    console.log(userId);
    const result = yield donorRequest_service_1.default.getReceivedDonorRequest(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Requests retrieved successfully",
        data: result,
    });
});
const updatePendingStatusToAccepted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.query;
    console.log(requestId);
    const result = yield donorRequest_service_1.default.updatePendingStatusToAccepted(requestId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Pending status updated successfully",
        data: result,
    });
});
const updatePendingStatusToRejected = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.query;
    console.log(requestId);
    const result = yield donorRequest_service_1.default.updatePendingStatusToRejected(requestId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Pending status updated successfully",
        data: result,
    });
});
exports.donorRequestControllers = {
    createDonorRequest,
    getReceivedDonorRequest,
    updatePendingStatusToAccepted,
    updatePendingStatusToRejected,
};
