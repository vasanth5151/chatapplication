import mongoose from "mongoose";

const dbconnect = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("FATAL ERROR: MONGODB_URI is undefined! Did you forget to add Environment Variables in Render?");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("db connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

export default dbconnect;