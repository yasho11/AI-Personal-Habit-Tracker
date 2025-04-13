import React, { useState, FormEvent } from "react";
import { useHabitStores } from "../stores/useHabitStores";

interface FormData {
  HabitName: string;
  HabitPoints: number;
  HabitDesc: string; // added description field
}

interface AddHabitFormProps {
  closeForm: () => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ closeForm }) => {
  const { createHabit } = useHabitStores();
  const [formData, setFormData] = useState<FormData>({
    HabitName: "",
    HabitPoints: 0,
    HabitDesc: "",
  });

  // 📤 Submit form to create habit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createHabit(formData); // Create a new habit
    closeForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">Add Habit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input input-bordered w-full"
            placeholder="Habit title"
            value={formData.HabitName}
            onChange={(e) => setFormData({ ...formData, HabitName: e.target.value })}
          />
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Points"
            value={formData.HabitPoints}
            onChange={(e) =>
              setFormData({ ...formData, HabitPoints: Number(e.target.value) })
            }
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Description"
            value={formData.HabitDesc}
            onChange={(e) =>
              setFormData({ ...formData, HabitDesc: e.target.value })
            }
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeForm}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitForm;
