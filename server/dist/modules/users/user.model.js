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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: 0,
    },
    age: {
        type: Number,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    lastDonationDate: {
        type: String,
    },
    donationAvailability: {
        type: Boolean,
        required: true,
        default: true,
    },
    bloodGroup: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
        min: 0,
        default: 2,
    },
    donationHistory: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "BloodPost",
        },
    ],
    postHistory: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "BloodPost",
        },
    ],
    friends: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, {
    timestamps: true,
    strictPopulate: false,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);
