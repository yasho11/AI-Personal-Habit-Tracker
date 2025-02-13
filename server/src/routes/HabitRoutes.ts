import express, { Router, Request, Response } from "express";
import { verifyToken } from "../middleware/verifyToken";
import Habits from "../models/Habits";
import Users from "../models/Users";
import mongoose from "mongoose";
const router = Router();
interface CustomRequest extends Request {
  UserEmail?: string;
}

router.get("/getHabits", verifyToken, async (req: CustomRequest, res) => {
  const UserEmail = req.UserEmail;
  if (UserEmail) {
    try {
      const habits = await Habits.find({ UserEmail });

      res.status(201).json(habits);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  } else {
    res.status(404).json({ message: "Token Not decoded: " });
  }
});

//-------------------------------------------------------------------------------------------------------
router.post("/createHabit", verifyToken, async (req: CustomRequest, res) => {
  const UserEmail = req.UserEmail;
  const { HabitName, HabitDesc = "", HabitPoints } = req.body; // Default HabitDesc to empty string
  const HabitStreak = 0;
  const Status = "Not Done";

  if (!HabitName || HabitPoints === undefined) {
    res
      .status(400)
      .json({ error: "Both Habit Name and Habit Points are required!" });
  } else if (!UserEmail) {
    res.status(401).json({ error: "User email not found in token!" });
  } else {
    try {
      const newHabit = new Habits({
        HabitName,
        HabitDesc,
        HabitPoints,
        HabitStreak,
        UserEmail,
        Status: "Not Done",
      });

      await newHabit.save();
      res
        .status(201)
        .json({ message: "Habit created successfully!", habit: newHabit });
    } catch (error) {
      console.error("Error creating habit:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

//------------------------------------------------------------------------------------------------\
router.patch(
  "/UpdateHabit",
  verifyToken,
  async (req: CustomRequest, res: Response) => {
    const UserEmail = req.UserEmail;
    const _id = req.body;
    const SelectedHabit = await Habits.findById(_id);
    if (!UserEmail) {
      res.status(400).json({ message: "User email not found in token" });
    } else {
      try {
        if (!SelectedHabit) {
          res.status(404).json({ message: "Habit not found" });
        } else {
          const { UpHabitName, UpHabitDesc, UpHabitPoints } = req.body;

          const updatedData: any = {};
          if (UpHabitName) updatedData.HabitName = UpHabitName;
          if (UpHabitDesc) updatedData.HabitDesc = UpHabitDesc;
          if (UpHabitPoints) updatedData.HabitPoints = UpHabitPoints;

          const UpdatedHabit = await Habits.findOneAndUpdate(
            { _id },
            { $set: updatedData },
            { new: true }
          );

          res.status(200).json({
            message: "Habit profile updated successfully",
            Habits: UpdatedHabit,
          });
        }
      } catch (error: any) {
        console.error("Error updating habit:", error);
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    }
  }
);

//---------------------------------------------------------------------------------------
router.delete(
  "/deleteHabits/:habitId",
  verifyToken,
  async (req: CustomRequest, res) => {
    const UserEmail = req.UserEmail;
    const _id = req.params.habitId;

    if (!UserEmail) {
      res.status(400).json({ message: "User email not found" });
    } else {
      try {
        const habit = await Habits.findByIdAndDelete(_id);
        res.status(200).json({ message: "Habit Deleted Successfully", habit });
      } catch (error: any) {
        console.error("Error deleting habit:", error);
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    }
  }
);
//-------------------------------------------------------------------------------------------
router.patch(
  "/updateStreak/:id",
  verifyToken,
  async (req: CustomRequest, res: Response): Promise<any> => {
    const Useremail = req.UserEmail;
    const id = req.params.id;
    const status = req.body.Status;
    const today = new Date();

    if (!Useremail) {
      return res
        .status(401)
        .json({ error: "Email is empty! Need Token to proceed" });
    }
    if (!id || !status) {
      return res
        .status(428)
        .json({ error: "Status and Id for the habit required!" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid habit ID" });
    }

    try {
      const habit = await Habits.findById(id);
      if (!habit) {
        return res.status(404).json({ error: "Habit not found!" });
      }

      let updatedStreak = habit.HabitStreak;
      let lastCompleted = habit.LastCompleted;
      let streakDiff = 0; // Track how much streak increases

      if (status === "Done") {
        if (lastCompleted) {
          const lastDate = new Date(lastCompleted);
          const diffDays = Math.floor(
            (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            streakDiff = 1; // Streak increased by 1
            updatedStreak += 1;
          } else if (diffDays > 1) {
            updatedStreak = 1; // Reset streak
          }
        } else {
          updatedStreak = 1;
          streakDiff = 1;
        }
        lastCompleted = today;
      }

      // Update habit in database
      const updHabit = await Habits.findByIdAndUpdate(
        id,
        {
          $set: {
            Status: status,
            HabitStreak: updatedStreak,
            LastCompleted: lastCompleted,
          },
        },
        { new: true }
      );

      // Find user and update points
      const user = await Users.findOne({ UserEmail: Useremail });
      if (user && streakDiff > 0) {
        const habitPoints = habit.HabitPoints || 0;
        const additionalPoints = streakDiff * habitPoints; // Increase based on streak growth

        await Users.updateOne(
          { UserEmail: Useremail },
          { $inc: { Points: additionalPoints } }
        );
      }

      return res.status(200).json({
        message: "Habit updated successfully!",
        updatedHabit: updHabit,
      });
    } catch (error) {
      console.error("Error updating habit status:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//-----------------------------------------------------------------------------

router.get("/getHabit/:habitId", async (req, res) => {
  const habitId = req.params.habitId;

  try {
    if (!habitId) {
      res.status(400).json({ error: "HabitId NOT FOUND!" });
    } else {
      const habit = await Habits.findById(habitId);
      if (!habit) {
        res.status(400).json({ error: "Habit not found" });
      } else {
        res.status(200).json({ message: "Habit found", habit });
      }
    }
  } catch (error) {}
});

export default router;
