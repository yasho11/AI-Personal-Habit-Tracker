import express, { Response } from "express";
import Habits from "../models/habits.model"; // Assuming your Habit model is here
import { AuthRequest } from "../libs/types";
import mongoose from "mongoose";

export const recommend = async (req: AuthRequest, res: Response): Promise<any> => {
  // Extract habitId from req.params (which should be an object)
  const habitId = req.params.id;  // Assuming your route is like "/recommend/:id"

  // Validate habitId format
  if (!habitId) {
    return res.status(400).json({ error: "Habit ID is required!" });
  }

  // Convert habitId to ObjectId
  let habitObjectId;
  try {
    habitObjectId = new mongoose.Types.ObjectId(habitId);
  } catch (error) {
    return res.status(400).json({ error: "Invalid Habit ID format!" });
  }

  try {
    // Step 1: Fetch the habit from the DB using the correct ObjectId
    const habit = await Habits.findOne({ _id: habitObjectId });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found!" });
    } else {
      // Step 2: Format the prompt with habit data
      const prompt = `
        I am working on a habit called "${habit.HabitName}". 
        Here is the description: "${habit.HabitDesc}". 
        The habit points are ${habit.HabitPoints}, and I am currently on streak number ${habit.HabitStreak}.
        The current status of the habit is "${habit.Status}".
        The last time I completed it was on ${habit.LastCompleted}.
        Based on this information, give me suggestions on how I can improve and stay consistent with this habit.
        Please provide the response in a Markdown language.
      `;

      // Step 3: Send the prompt to Mistral API for recommendations
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral",
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendation");
      }

      // Step 4: Get the response and send back the recommendation
      const data = await response.json();
      console.log(`Recommendation : ${data.response}`)
      return res.status(200).json({ recommendation: data.response });
    }
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return res.status(500).json({ error: "Failed to fetch habit recommendation" });
  }
};
