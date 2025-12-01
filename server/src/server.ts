import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import habitRoutes from "./routes/habitRoutes";
import mongoose from "mongoose";
import Habits from "./models/habits.model";
import cron from "node-cron";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Enable JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
// ✅ FIX OPAQUE RESPONSE BLOCKING: Correct CORS settings
app.use(
  cors({
    origin: ["http://localhost:5173", "http://172.23.0.2:5173", "http://172.23.0.3:5173"], // Explicitly allow frontend origin
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);



// ✅ Register Routes
app.use("/api", authRoutes);
app.use("/api", habitRoutes);

// ✅ Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  throw new Error("MongoDB connection string is not defined in environment variables.");
}
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Couldn't connect to MongoDB", err));

// ✅ Schedule habit status reset at midnight
const resetHabitStatus = async () => {
  try {
    const updatedHabits = await Habits.updateMany({}, { Status: "Not Done" });
    console.log(
      `Habit statuses reset at midnight. Updated count: ${updatedHabits.modifiedCount}`
    );
  } catch (error) {
    console.error("Error resetting habit statuses:", error);
  }
};

cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled task: Reset Habit Statuses...");
  resetHabitStatus();
});

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
