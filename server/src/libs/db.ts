import mongoose from "mongoose";
import dotenv from "dotenv";


const env = dotenv.config();
//this function connects to the database

export const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
        }); //this is the connection to the database
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed");
        process.exit(1);
    }
}