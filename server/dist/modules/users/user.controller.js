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
const user_service_1 = __importDefault(require("./user.service"));
const sendResponse_1 = require("../../util/sendResponse");
const activeUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.default.getAllActiveUsers();
        res.status(200).json({
            success: true,
            message: "Retrieved all active users",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const allUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield user_service_1.default.getAllUsers((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name);
        res.status(200).json({
            success: true,
            message: "Retrieved all users",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const usersWithDonationHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.default.getAllUsersWithDonationHistory();
        res.status(200).json({
            success: true,
            message: "Retrieved all users with respective donation history",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const result = yield user_service_1.default.getSingleUser(name);
        res.status(200).json({
            success: true,
            message: "Retrieved single user successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        //console.log("user from controller", user);
        const result = yield user_service_1.default.createUserRegistration(user);
        res.status(200).json({
            success: true,
            message: "User is Registered successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield user_service_1.default.updateUserRegistration(id, req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            message: "User profile is updated successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const getMyPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield user_service_1.default.getMyPost((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            message: "My posts are retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const getRequestedDonor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield user_service_1.default.getRequestedDonor(id);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            message: "Requested donors are retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const getMyDonationHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield user_service_1.default.getMyDonationHistory((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            message: "My donation history are retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const makeConnection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //console.log("cc", req.params);
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    try {
        const result = yield user_service_1.default.makeConnection({
            id,
            name: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name,
        });
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            message: "Connection created successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const makingConnection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //console.log("cc", req.body);
    try {
        const result = yield user_service_1.default.makeConnection({
            id: req === null || req === void 0 ? void 0 : req.body,
            name: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name,
        });
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            message: "Connection created successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const connectedUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //console.log("cc", req.body);
    try {
        const result = yield user_service_1.default.connectedUsers((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.name);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            message: "Connected users are retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
const pointReduction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId, userId } = req.body;
        const result = yield user_service_1.default.pointReduction((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.name, postId, userId);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            message: "User point reduced successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = {
    createUser,
    updateUser,
    activeUsers,
    allUsers,
    usersWithDonationHistory,
    getSingleUser,
    getMyPost,
    getMyDonationHistory,
    makeConnection,
    makingConnection,
    connectedUsers,
    pointReduction,
    getRequestedDonor,
};
