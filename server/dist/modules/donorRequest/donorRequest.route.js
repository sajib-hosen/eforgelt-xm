"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donorRequestRouter = void 0;
const express_1 = __importDefault(require("express"));
const donorRequest_controller_1 = require("./donorRequest.controller");
const router = express_1.default.Router();
router.post("/send-request", donorRequest_controller_1.donorRequestControllers.createDonorRequest);
router.get("/received-request", donorRequest_controller_1.donorRequestControllers.getReceivedDonorRequest);
router.patch("/status-accepted", donorRequest_controller_1.donorRequestControllers.updatePendingStatusToAccepted);
router.patch("/status-rejected", donorRequest_controller_1.donorRequestControllers.updatePendingStatusToRejected);
exports.donorRequestRouter = router;
