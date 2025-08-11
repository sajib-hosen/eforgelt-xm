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
exports.AuthServices = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../users/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_utils_1 = require("./auth.utils");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // -------------- checking user is exist or not ---------------
    const isUserExist = yield user_model_1.User.findOne({ name: payload.name }).select("+password");
    if (!isUserExist) {
        throw new AppError_1.default(404, "User is not found");
    }
    //console.log("pass", isUserExist, payload?.password, isUserExist?.password);
    // -------------- password matching ---------------
    const isPasswordMatched = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(401, "Wrong password");
    }
    // -------------- creating access and refresh token using jwt ---------------
    const user = {
        name: isUserExist.name,
        email: isUserExist.email,
        id: isUserExist._id,
    };
    const accessToken = (0, auth_utils_1.createToken)(user, config_1.default.jwt_access_secret, "10d");
    const refreshToken = (0, auth_utils_1.createToken)(user, config_1.default.jwt_refresh_secret, "30d");
    return { accessToken, refreshToken };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // ------------- checking whether token is sent or not -------------
    if (!token) {
        throw new AppError_1.default(401, "You are not authorized");
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { name } = decoded;
    const isUserExist = yield user_model_1.User.findOne({ name: name });
    if (!isUserExist) {
        throw new AppError_1.default(404, "User is not found");
    }
    // -------------- creating access token using jwt ---------------
    const user = {
        name: isUserExist.name,
        email: isUserExist.email,
        id: isUserExist._id,
    };
    const accessToken = (0, auth_utils_1.createToken)(user, config_1.default.jwt_access_secret, "10s");
    return { accessToken };
});
const userNameChecking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const similarUsers = yield user_model_1.User.find({
        name: { $regex: `^${payload.name}`, $options: "i" },
    }).select("name");
    return similarUsers;
});
exports.AuthServices = {
    loginUser,
    refreshToken,
    userNameChecking,
};
