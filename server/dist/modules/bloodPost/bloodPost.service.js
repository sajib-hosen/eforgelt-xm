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
const user_model_1 = require("../users/user.model");
const bloodPost_model_1 = require("./bloodPost.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const getAllBloodPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bloodPost_model_1.BloodPost.find({
        $expr: { $gt: ["$noOfBags", "$accepted"] },
    });
    if (!result) {
        throw new Error("Failed to get all blood event posts");
    }
    return result;
});
const getSingleBloodPosts = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    const result = yield bloodPost_model_1.BloodPost.findById(id);
    if (!result) {
        throw new Error("Failed to get single blood event post");
    }
    return result;
});
const bloodPostSendToDatabase = (userName, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(userName);
    const result = yield bloodPost_model_1.BloodPost.create(payload);
    const addPostHistory = yield user_model_1.User.findOneAndUpdate({ name: userName }, {
        $push: { postHistory: result._id },
    }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new Error("Failed to posting blood event");
    }
    return result;
});
const updateBloodPostToDatabase = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const result = yield bloodPost_model_1.BloodPost.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new Error("Failed to update blood event post");
    }
    return result;
});
const saveDonationHistoryIntoDb = (id, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield user_model_1.User.findById(id);
    const findDonationHistory = findUser === null || findUser === void 0 ? void 0 : findUser.donationHistory.includes(postId.id);
    console.log("findDonationHistory", findDonationHistory);
    if (findDonationHistory) {
        throw new AppError_1.default(200, "This post is already accepted");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, {
        $push: { donationHistory: postId.id },
        $inc: { accepted: 1 },
    }, {
        new: true,
        runValidators: true,
    });
    const increaseAcceptedValueAndAddDonor = yield bloodPost_model_1.BloodPost.findByIdAndUpdate(postId.id, {
        // $inc: { accepted: 1 },
        $push: { donar: id },
    });
    if (!result) {
        throw new Error("Failed to add blood donation history");
    }
    return result;
});
const saveDonationCancelHistoryIntoDb = (id, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, {
        $push: { cancelHistory: postId.id },
    }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new Error("Failed to cancel blood donation history");
    }
    return result;
});
const deleteBloodPost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bloodPost_model_1.BloodPost.findByIdAndDelete(id);
    if (!result) {
        throw new Error("Failed to delete blood post");
    }
    return result;
});
const updatePostStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id, payload);
    const result = yield bloodPost_model_1.BloodPost.findByIdAndUpdate(id, {
        status: "donated",
    });
    if (!result) {
        throw new Error("Failed to update post status");
    }
    return result;
});
const cancelRequestedDonor = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id, payload);
    const result = yield bloodPost_model_1.BloodPost.findByIdAndUpdate(id, { $pull: { donar: payload } }, { new: true });
    if (!result) {
        throw new Error("Failed to delete requested donor from donor list");
    }
    return result;
});
const dueRequestedDonor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bloodPost_model_1.BloodPost.findByIdAndUpdate(id, {
        $inc: { accepted: 1 },
        status: "due",
    }, { new: true });
    if (!result) {
        throw new Error("Failed to due requested donor.");
    }
    return result;
});
const donatedRequestedDonor = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bloodPost_model_1.BloodPost.findByIdAndUpdate(id, {
        $inc: { points: 1 },
        status: "donated",
    }, { new: true });
    const increasePoints = yield user_model_1.User.findByIdAndUpdate(userId, {
        $inc: { points: 1 },
    }, { new: true });
    if (!result) {
        throw new Error("Failed to updated due to donate status of post.");
    }
    return result;
});
exports.default = {
    getAllBloodPosts,
    bloodPostSendToDatabase,
    updateBloodPostToDatabase,
    saveDonationHistoryIntoDb,
    saveDonationCancelHistoryIntoDb,
    deleteBloodPost,
    updatePostStatus,
    getSingleBloodPosts,
    cancelRequestedDonor,
    dueRequestedDonor,
    donatedRequestedDonor,
};
