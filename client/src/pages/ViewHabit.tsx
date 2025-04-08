import React, { useEffect, useState } from "react";
import { axiosInstance } from "../libs/axios";
import { useNavigate } from "react-router-dom";
import styles from "./ViewHabit.module.css"; // Import the CSS module

const ViewHabits: React.FC = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
        navigate("/login");
    } else {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        fetchHabits();
    }
  }, [navigate]);
   
  const fetchHabits = async () => {
    try {
      const response = await axiosInstance.get("/getHabits");
      setHabits(response.data);
    } catch (error: any) {
      console.error("Error fetching habits:", error);
    }
  };

  const handleDone = async (habitId: string) => {
    try {
      await axiosInstance.patch(`/updateStreak/${habitId}`, { Status: "Done" });
      alert("Habit marked as done!");
      fetchHabits(); // Refresh list
    } catch (error: any) {
      console.error("Error marking habit as done:", error.response?.data || error.message);
      alert("Failed to mark habit as done.");
    }
  };

  const handleRecommend = async (habitId: string) => {
    navigate(`/Recommendation/${habitId}`);
  };

  const handleEdit = (habitId: string) => {
    navigate(`/editHabit/${habitId}`);
  };

  return (
    <div>
      <h2>Your Habits</h2>
      {habits.length === 0 ? (
        <p>No habits found!</p>
      ) : (
        <div className={styles["habits-container"]}>
          {habits.map((habit) => (
            <div key={habit._id} className={styles["habit-card"]}>
              <h3>{habit.HabitName}</h3>
              <p>{habit.HabitDesc}</p>
              <p className={styles["habit-points"]}>Points: {habit.HabitPoints}</p>
              <p className={styles["habit-streak"]}>Streak: {habit.HabitStreak}</p>
              <p>Status: {habit.Status}</p>
              <div className={styles["habit-buttons"]}>
                <button
                  className={styles["done-btn"]}
                  onClick={() => handleDone(habit._id)}
                >
                  Done
                </button>
                <button
                  className={styles["edit-btn"]}
                  onClick={() => handleEdit(habit._id)}
                >
                  Edit
                </button>
                <button
                  className={styles["recommend-btn"]}
                  onClick={() => handleRecommend(habit._id)}
                >
                  Recommend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewHabits;
