import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect to Mongo DB successfully")
    } catch (error) {
        console.log("Error in connect Mongo DB: ", error.message);
    }
}