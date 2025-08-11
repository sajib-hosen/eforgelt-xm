"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodPost = void 0;
const mongoose_1 = require("mongoose");
const bloodPostSchema = new mongoose_1.Schema({
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    district: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    noOfBags: {
        type: Number,
        required: true,
    },
    accepted: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["pending", "donated", "canceled", "due"],
        default: "pending",
    },
    donar: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    postCreator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    phoneNumberOpened: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
            phoneStatus: {
                type: Boolean,
            },
        },
    ],
}, {
    timestamps: true,
});
exports.BloodPost = (0, mongoose_1.model)("BloodPost", bloodPostSchema);
