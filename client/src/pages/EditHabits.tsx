import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../libs/axios";
import styles from "./EditHabits.module.css";


interface Habit {
  _id: string;
  HabitName: string;
  HabitDesc: string;
  HabitPoints: number;
}

const EditHabit = () => {
  const { habitId } = useParams(); // Extract habitId from URL params
  const [habit, setHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState({
    UpHabitName: "",
    UpHabitDesc: "",
    UpHabitPoints: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!habitId) return;

    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
    } else {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchHabit();
    }
  }, [habitId, navigate]);

  const fetchHabit = async () => {
    try {
      const response = await axiosInstance.get(`getHabit/${habitId}`);
      console.log(response.data); // Log the response to check its structure
  
      if (response.data && response.data.habit && response.data.habit.HabitPoints !== undefined) {
        setHabit(response.data.habit); // Access the habit object
        setFormData({
          UpHabitName: response.data.habit.HabitName,
          UpHabitDesc: response.data.habit.HabitDesc,
          UpHabitPoints: response.data.habit.HabitPoints.toString(),
        });
      } else {
        throw new Error("HabitPoints is missing in the response");
      }
    } catch (error) {
      console.error("Error fetching habit:", error);
    }
  };
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.patch("/UpdateHabit", {
        _id: habitId,
        ...formData,
      });
      alert("Habit updated successfully!");
      navigate('/viewHabit');
    } catch (error) {
      console.error("Error updating habit:", error);
      alert("Failed to update habit.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    try {
      await axiosInstance.delete(`/deleteHabits/${habitId}`);
      alert("Habit deleted successfully!");
      navigate("/viewHabit"); // Redirect to habits list after deletion
    } catch (error) {
      console.error("Error deleting habit:", error);
      alert("Failed to delete habit.");
    }
  };

  if (!habit) return <p>Loading habit...</p>;

  return (
      <div className={styles.container}>
          <h2>Edit Habit</h2>
          <form onSubmit={handleSubmit}>
              <label>
                  Habit Name:
                  <input
                      type="text"
                      name="UpHabitName"
                      value={formData.UpHabitName}
                      onChange={handleChange}
                  />
              </label>
  
              <label>
                  Habit Description:
                  <textarea
                      name="UpHabitDesc"
                      value={formData.UpHabitDesc}
                      onChange={handleChange}
                  />
              </label>
  
              <label>
                  Habit Points:
                  <input
                      type="number"
                      name="UpHabitPoints"
                      value={formData.UpHabitPoints}
                      onChange={handleChange}
                  />
              </label>
  
              <button type="submit">Update Habit</button>
              <button type="button" onClick={handleDelete} className={styles.deleteButton}>
                  Delete Habit
              </button>
          </form>
      </div>
  );
  
};

export default EditHabit;
