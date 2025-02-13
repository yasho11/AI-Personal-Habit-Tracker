import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // To get the habit ID from URL parameters
import axiosInstance from "../../api/axios";
import styles from "./recommend.module.css"; // Import the CSS module

// Define the types for the habit and recommendation
interface Habit {
  HabitName: string;
  HabitDesc: string;
  HabitStreak: number;
  Status: string;
  LastCompleted: string;
  HabitPoints: number;
}

interface RecommendationResponse {
  recommendation: string;
}

const RecommendHabit: React.FC = () => {
  const { habitId } = useParams<{ habitId: string }>(); // Get the habit ID from the URL params
  const [habit, setHabit] = useState<Habit | null>(null); // Store habit data
  const [recommendation, setRecommendation] = useState<string>(""); // Store recommendation
  const [loading, setLoading] = useState<boolean>(false); // Manage loading state
  const [error, setError] = useState<string | null>(null); // Manage error state
  const navigate = useNavigate();

  // Fetch habit data when the component mounts or the habit ID changes
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate("/login");
    } else {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (habitId) {
        fetchHabitData();
      }
    }
  }, [navigate, habitId]);

  const fetchHabitData = async () => {
    try {
      const response = await axiosInstance.get<{ habit: Habit }>(`/getHabit/${habitId}`);
      setHabit(response.data.habit); // Store the nested habit data
    } catch (err) {
      setError("Failed to fetch habit data.");
    }
  };

  // Function to fetch the recommendation
  const getRecommendation = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await axiosInstance.post<RecommendationResponse>(`/recommend/${habitId}`);
      setRecommendation(response.data.recommendation); // Store the recommendation
    } catch (err) {
      setError("Failed to fetch recommendation. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after fetching is done
    }
  };

  return (
    <div className={styles["recommendation-container"]}>
      <h1>Habit Recommendation</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Show habit details if available */}
      {habit ? (
        <div className={styles["habit-card"]}>
          <h2>Habit Details</h2>
          <p><strong>Name:</strong> {habit.HabitName}</p>
          <p><strong>Description:</strong> {habit.HabitDesc}</p>
          <p><strong>Streak:</strong> {habit.HabitStreak}</p>
          <p><strong>Status:</strong> {habit.Status}</p>
          <p><strong>Last Completed:</strong> {habit.LastCompleted}</p>
          <p><strong>Points:</strong> {habit.HabitPoints}</p> {/* Accessing nested habitPoints */}

          {/* Button to fetch recommendation */}
          <button onClick={getRecommendation} disabled={loading}>
            {loading ? "Loading..." : "Get Recommendation"}
          </button>

          {/* Display the recommendation if available */}
          {recommendation && (
            <div className={styles["recommendation-card"]}>
              <h2>Recommendation:</h2>
              <p>{recommendation}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Loading habit data...</p>
      )}
    </div>
  );
};

export default RecommendHabit;
