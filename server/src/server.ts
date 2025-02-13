import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import UserRoutes from "./routes/UserRoutes";
import HabitRoutes from "./routes/HabitRoutes";
import RecommendRoutes from "./routes/RecommendRoutes";
import mongoose from "mongoose";
import Habits from "./models/Habits";
import cron from "node-cron";

const app = express();
const PORT = 5000;

// Enable JSON parsing
app.use(express.json());
app.use(express.static("public"));

// ✅ FIX OPAQUE RESPONSE BLOCKING: Correct CORS settings
app.use(
  cors({
    origin: "http://localhost:5173", // Explicitly allow frontend origin
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// ✅ Register Routes
app.use("/api", UserRoutes);
app.use("/api", HabitRoutes);
app.use("/api", RecommendRoutes);

// ✅ Connect to MongoDB
const mongoURI = "mongodb://127.0.0.1:27017/HabitTracker";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Couldn't connect to MongoDB"));

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
