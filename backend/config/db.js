
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI not set in env");
        await mongoose.connect(uri, { dbName: process.env.MONGO_DB_NAME || undefined });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err.message, "- server keeps running; DB-backed endpoints return 500 until MongoDB is available");
    }
};