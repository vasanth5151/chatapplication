import mongoose from "mongoose";

const dbconnect = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("db connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

export default dbconnect;