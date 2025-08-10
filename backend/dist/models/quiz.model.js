"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizResult = void 0;
const mongoose_1 = require("mongoose");
const quizResultSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    step: {
        type: Number,
        required: true,
        enum: [1, 2, 3],
    },
    answers: {
        type: Map,
        of: String,
        required: true,
    },
    scorePercent: {
        type: Number,
        required: true,
    },
    certification: {
        type: String,
        required: true,
    },
    proceedToNextStep: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
});
exports.QuizResult = (0, mongoose_1.model)("QuizResult", quizResultSchema);
