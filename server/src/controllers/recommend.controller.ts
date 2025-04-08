import express from "express";
import Habits from "../models/habits.model"; // Assuming your Habit model is here

const router = express.Router();

// Route to get habit recommendations from Ollama
router.post("/recommend/:habitId", async (req, res) => {
  const habitId = req.params.habitId; // Get habit ID from the request body

  if (!habitId) {
    res.status(400).json({ error: "Habit ID is required!" });
  } else {
    try {
      // Step 1: Fetch the habit from the DB
      const habit = await Habits.findById(habitId);

      if (!habit) {
        res.status(404).json({ error: "Habit not found!" });
      } else {
      // Step 2: Format the prompt with habit data
      const prompt = `
      I am working on a habit called "${habit.HabitName}". 
      Here is the description: "${habit.HabitDesc}". 
      The habit points are ${habit.HabitPoints}, and I am currently on streak number ${habit.HabitStreak}.
      The current status of the habit is "${habit.Status}".
      The last time I completed it was on ${habit.LastCompleted}.
      Based on this information, give me suggestions on how I can improve and stay consistent with this habit.
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
        res.status(200).json({ recommendation: data.response });
      }
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      res.status(500).json({ error: "Failed to fetch habit recommendation" });
    }
  }
});

export default router;
