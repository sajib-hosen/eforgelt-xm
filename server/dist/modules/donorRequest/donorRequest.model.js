"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorRequest = void 0;
const mongoose_1 = require("mongoose");
const donorRequestSchema = new mongoose_1.Schema({
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BloodPost",
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
}, {
    timestamps: true,
});
exports.DonorRequest = (0, mongoose_1.model)("DonorRequest", donorRequestSchema);
