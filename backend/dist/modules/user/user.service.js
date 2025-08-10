"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserToken = exports.verifyUserEmail = exports.findUserTokenById = exports.createUserToken = exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const token_model_1 = require("../../models/token.model");
const user_model_1 = require("../../models/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = async (userData) => {
    const user = new user_model_1.User(userData);
    return user.save();
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    return user_model_1.User.findOne({ email }).select("+password");
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    return user_model_1.User.findById(id);
};
exports.findUserById = findUserById;
const createUserToken = async (tokenData) => {
    const userToken = new token_model_1.UserToken(tokenData);
    return userToken.save();
};
exports.createUserToken = createUserToken;
const findUserTokenById = async (tokenId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(tokenId)) {
        return null;
    }
    return token_model_1.UserToken.findOne({ _id: tokenId });
};
exports.findUserTokenById = findUserTokenById;
const verifyUserEmail = async (userId) => {
    return user_model_1.User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
};
exports.verifyUserEmail = verifyUserEmail;
const updateUserToken = async (tokenId, updateData) => {
    return token_model_1.UserToken.findByIdAndUpdate(tokenId, updateData, {
        new: true,
    });
};
exports.updateUserToken = updateUserToken;
