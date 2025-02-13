import mongoose, { Document, Schema } from "mongoose";

export interface IHabits extends Document {
  HabitName: string;
  HabitDesc?: string;
  HabitPoints: number;
  HabitStreak: number;
  UserEmail: string;
  Status: string;
  LastCompleted?: Date; // New field to track last completed date
}

const HabitSchema: Schema = new Schema(
  {
    HabitName: {
      type: String,
      required: true,
    },
    HabitDesc: {
      type: String,
      required: false,
    },
    HabitPoints: {
      type: Number,
      required: true,
    },
    HabitStreak: {
      type: Number,
      required: true,
      default: 0, // Default streak to 0
    },
    UserEmail: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
    LastCompleted: {
      type: Date, // Track last time habit was marked as "Done"
      required: false,
    },
  },
  {
    timestamps: true, // Auto-updates createdAt & updatedAt
  }
);

export default mongoose.model<IHabits>("Habits", HabitSchema);
