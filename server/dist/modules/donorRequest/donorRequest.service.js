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
Object.defineProperty(exports, "__esModule", { value: true });
const donorRequest_model_1 = require("./donorRequest.model");
const donorRequestSendToDatabase = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donorRequest_model_1.DonorRequest.create(payload);
    if (!result) {
        throw new Error("Failed to send request");
    }
    return result;
});
const getReceivedDonorRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donorRequest_model_1.DonorRequest.find({
        receiver: id,
    })
        .populate("post")
        .populate("sender", "name email");
    if (!result) {
        throw new Error("Failed to retrieved requests");
    }
    return result;
});
const updatePendingStatusToAccepted = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donorRequest_model_1.DonorRequest.findByIdAndUpdate(id, { status: "accepted" }, { new: true, runValidators: true });
    if (!result) {
        throw new Error("Failed to retrieved requests");
    }
    return result;
});
const updatePendingStatusToRejected = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donorRequest_model_1.DonorRequest.findByIdAndUpdate(id, { status: "rejected" }, { new: true, runValidators: true });
    if (!result) {
        throw new Error("Failed to retrieved requests");
    }
    return result;
});
exports.default = {
    donorRequestSendToDatabase,
    getReceivedDonorRequest,
    updatePendingStatusToAccepted,
    updatePendingStatusToRejected,
};
