import React, { useEffect, useState } from "react";
import axiosInstance from "../libs/axios";
import { useNavigate } from "react-router-dom";



const AddHabit: React.FC = () => {
    const [habitName, setHabitName] = useState<string>("");
    const [habitDesc, setHabitDesc] = useState<string>("");
    const [habitPoints, setHabitPoints] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/login");
        } else {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!habitName || !habitPoints) {
            setErrorMessage("Both Habit Name and Habit Points are required!");
            return;
        }

        if (isNaN(Number(habitPoints)) || Number(habitPoints) <= 0) {
            setErrorMessage("Habit Points should be a positive number.");
            return;
        }

        setErrorMessage(null); // Clear any previous error

        // Prepare habit data
        const habitData = {
            HabitName: habitName,
            HabitDesc: habitDesc || "", // Ensure it's a string
            HabitPoints: habitPoints,
        };

        setLoading(true);

        try {
            const response = await axiosInstance.post("/createHabit", habitData);
            alert(response.data.message);
            navigate("/viewHabit");
        } catch (error: any) {
            console.error("Error creating habit:", error);
            setErrorMessage("Failed to create habit.");
        } finally {
            setLoading(false);
        }
    };

    return (
        
        // Inside the component
        <div className="{styles.container}">
            <h2>Add a New Habit</h2>
            {errorMessage && <p className="{styles.error}">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Habit Name:</label>
                    <input
                        type="text"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        required
                    />
                </div>
        
                <div>
                    <label>Habit Description:</label>
                    <textarea
                        value={habitDesc}
                        onChange={(e) => setHabitDesc(e.target.value)}
                    />
                </div>
        
                <div>
                    <label>Habit Points:</label>
                    <input
                        type="number"
                        value={habitPoints}
                        onChange={(e) => setHabitPoints(e.target.value)}
                        required
                    />
                </div>
        
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Habit"}
                </button>
            </form>
        </div>
        
    );
};

export default AddHabit;
