import mongoose from "mongoose";

const dbconnect = async () => {
    if (mongoose.connection.readyState >= 1) return;

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is missing from environment variables!");
        throw new Error("MONGODB_URI is missing");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("db connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

export default dbconnect;