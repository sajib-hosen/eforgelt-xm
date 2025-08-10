"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuizResult = exports.getQuizResult = exports.saveQuizResult = void 0;
const quiz_model_1 = require("../../models/quiz.model");
/**
 * Save a quiz result to the database
 */
const saveQuizResult = async (data) => {
    const result = new quiz_model_1.QuizResult({
        userId: data.userId,
        email: data.email,
        step: data.step,
        answers: data.answers,
        scorePercent: data.scorePercent,
        certification: data.certification,
        proceedToNextStep: data.proceedToNextStep,
    });
    return result.save();
};
exports.saveQuizResult = saveQuizResult;
const getQuizResult = async (query) => {
    const filter = {};
    if (query.userId) {
        filter.userId = query.userId;
    }
    else if (query.email) {
        filter.email = query.email;
    }
    else {
        throw new Error("Either userId or email must be provided");
    }
    // Find the latest result by createdAt descending
    return quiz_model_1.QuizResult.findOne(filter).sort({ createdAt: -1 }).exec();
};
exports.getQuizResult = getQuizResult;
const updateQuizResult = async (data) => {
    const filter = {};
    if (data.userId) {
        filter.userId = data.userId;
    }
    else if (data.email) {
        filter.email = data.email;
    }
    else {
        throw new Error("Either userId or email must be provided");
    }
    // Find the latest result and update it with new data
    return quiz_model_1.QuizResult.findOneAndUpdate(filter, {
        step: data.step,
        answers: data.answers,
        certification: data.certification,
        proceedToNextStep: data.proceedToNextStep,
        scorePercent: data.scorePercent,
        updatedAt: new Date(),
    }, { new: true }).exec();
};
exports.updateQuizResult = updateQuizResult;
