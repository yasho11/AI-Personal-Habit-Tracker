// EditHabitForm.tsx
import React, { useEffect, useState } from "react";
import { useHabitStores } from "../stores/useHabitStores";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  habitId: string;
  closeForm: () => void;
}

const EditHabitForm: React.FC<Props> = ({ habitId, closeForm }) => {
  const { fetchHabit, editHabit, updateStreak} = useHabitStores();
  const navigate = useNavigate();
  // 📦 State for editable form
  const [formData, setFormData] = useState({
    HabitName: "",
    HabitPoints: 0,
    HabitDesc: "",
    HabitStreak: 0,
    Status: "",
  });

  // 📦 State for fetched habit (used for placeholders)
  const [originalHabit, setOriginalHabit] = useState<typeof formData | null>(
    null
  );

  // 🔁 Fetch habit on mount
  useEffect(() => {
    const loadHabit = async () => {
      const habit = await fetchHabit(habitId);  
      if (habit) {
        setFormData({
          HabitName: habit.HabitName,
          HabitPoints: habit.HabitPoints,
          HabitDesc: habit.HabitDesc,
          HabitStreak: habit.HabitStreak || 0,
          Status: habit.Status,
        });
        setOriginalHabit(habit); // for placeholders
        console.log("Original Habit: ", originalHabit )
        console.log("FormData: ", formData)
      }
    };
    loadHabit();
  }, [habitId, fetchHabit]);

  // ✍️ Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "HabitPoints" || name === "HabitStreak"
          ? Number(value)
          : value,
    }));
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editHabit(formData, habitId);
    closeForm();
    if(formData.Status == "Done"){
        updateStreak(habitId,formData.Status);
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="card shadow-lg p-4 bg-base-100 rounded-xl w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Habit</h2>

        <div className="mb-3">
          <label className="label">Habit Name</label>
          <input
            type="text"
            name="HabitName"
            value={formData.HabitName}
            onChange={handleChange}
            placeholder={originalHabit?.HabitName || "Habit name..."}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-3">
          <label className="label">Points</label>
          <input
            type="number"
            name="HabitPoints"
            value={formData.HabitPoints}
            onChange={handleChange}
            placeholder={
              originalHabit ? String(originalHabit.HabitPoints) : "0"
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-3">
          <label className="label">Description</label>
          <input
            type="text"
            name="HabitDesc"
            value={formData.HabitDesc}
            onChange={handleChange}
            placeholder={originalHabit?.HabitDesc || "Habit description..."}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-3">
          <label className="label">Streak</label>
          <input
            type="number"
            name="HabitStreak"
            value={formData.HabitStreak}
            onChange={handleChange}
            placeholder={
              originalHabit ? String(originalHabit.HabitStreak) : "0"
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <label className="label">Status</label>
          <select
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select status</option>
            <option value="Not Done">Not Done</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={closeForm} className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHabitForm;
