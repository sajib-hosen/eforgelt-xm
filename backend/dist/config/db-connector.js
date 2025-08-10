"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB_URL = process.env.DB_URL;
if (!DB_URL) {
    throw new Error("❌ MONGO_URI is missing from environment variables.");
}
const connectToDatabase = async () => {
    try {
        await mongoose_1.default.connect(DB_URL, {});
        console.log("Database Connected! 🌧️");
    }
    catch (err) {
        console.error("Could not connect to db !", err);
        process.exit(1);
    }
};
exports.default = connectToDatabase;
