import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
    throw new Error("❌ MONGO_URI is missing from environment variables.");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URL, {});

        console.log("Database Connected! 🌧️");
    } catch (err) {
        console.error("Could not connect to db !", err);
        process.exit(1);
    }
};

export default connectToDatabase;
