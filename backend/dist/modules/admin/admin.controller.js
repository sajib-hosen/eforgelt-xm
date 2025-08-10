"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getAllUsers = void 0;
const user_model_1 = require("../../models/user.model");
const quiz_service_1 = require("../quiz/quiz.service");
const getAllUsers = async (req, res) => {
    try {
        const users = await user_model_1.User.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res) => {
    try {
        const user = await user_model_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const quizResult = await (0, quiz_service_1.getQuizResult)({ userId: req.params.id });
        res.status(200).json({
            ...user.toObject(),
            quizResult,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUser = getUser;
