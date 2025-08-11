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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const bloodPost_model_1 = require("../bloodPost/bloodPost.model");
const user_model_1 = require("./user.model");
const getAllActiveUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({ donationAvailability: true });
    if (!result) {
        throw new Error("Failed to retrieve all active users");
    }
    return result;
});
const getAllUsers = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const specificUser = yield user_model_1.User.find({ name: payload });
    //console.log(specificUser[0]);
    const allUsers = yield user_model_1.User.find();
    const usersWithoutConnectors = allUsers.filter((user) => { var _a, _b; return !((_b = (_a = specificUser[0]) === null || _a === void 0 ? void 0 : _a.friends) === null || _b === void 0 ? void 0 : _b.includes(user === null || user === void 0 ? void 0 : user._id)); });
    if (!usersWithoutConnectors) {
        throw new Error("Failed to retrieve all users");
    }
    return usersWithoutConnectors;
});
const getAllUsersWithDonationHistory = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find().populate({
        path: "donationHistory",
        strictPopulate: false,
    });
    if (!result) {
        throw new Error("Failed to retrieve all active users");
    }
    return result;
});
const getSingleUser = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({ name });
    if (!result) {
        throw new Error("Failed to retrieve single user");
    }
    return result;
});
const createUserRegistration = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserAlreadyExist = yield user_model_1.User.findOne({ name: payload.name });
    if (isUserAlreadyExist) {
        throw new Error("User is already exists");
    }
    const result = yield user_model_1.User.create(payload);
    if (!result) {
        throw new Error("Failed to register new user");
    }
    return result;
});
const updateUserRegistration = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(id, user);
    const result = yield user_model_1.User.findByIdAndUpdate(id, user, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new Error("Failed to update user profile");
    }
    return result;
});
const getMyPost = (uName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ name: uName }).populate("postHistory");
    if (!result) {
        throw new Error("Failed to retrieved my posts");
    }
    return result;
});
const getRequestedDonor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    const result = yield bloodPost_model_1.BloodPost.findById(id).populate("donar");
    if (!result) {
        throw new Error("Failed to retrieved requested donor");
    }
    return result;
});
const getMyDonationHistory = (uName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ name: uName }).populate("donationHistory");
    console.log(result);
    if (!result) {
        throw new Error("Failed to retrieved my posts");
    }
    return result;
});
const makeConnection = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOneAndUpdate({ name: payload.name }, {
        $addToSet: { friends: payload.id },
    }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new Error("Failed to create connection");
    }
    return result;
});
const connectedUsers = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({ name: name }).populate("friends");
    if (!result) {
        throw new Error("Failed to find connected users");
    }
    return result;
});
const pointReduction = (name, postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.updateOne({ name: name, points: { $gte: 1 } }, {
        $inc: { points: -1 },
    }, {
        new: true,
        runValidators: true,
    });
    //console.log("result", result, id);
    const numberOpened = {
        user: userId,
        phoneStatus: true,
    };
    const openMobileNumber = yield bloodPost_model_1.BloodPost.findByIdAndUpdate(postId, {
        $push: { phoneNumberOpened: numberOpened },
    }, {
        new: true,
        runValidators: true,
    });
    console.log(openMobileNumber);
    if (!result) {
        throw new Error("Failed to reduce points from user");
    }
    else if (result.modifiedCount === 0) {
        throw new AppError_1.default(200, "You have 0 points");
    }
    return result;
});
exports.default = {
    createUserRegistration,
    updateUserRegistration,
    getAllActiveUsers,
    getAllUsersWithDonationHistory,
    getSingleUser,
    getMyPost,
    getMyDonationHistory,
    getAllUsers,
    makeConnection,
    connectedUsers,
    pointReduction,
    getRequestedDonor,
};
