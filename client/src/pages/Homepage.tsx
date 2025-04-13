import React, { useState, useEffect } from "react";
import { useHabitStores } from "../stores/useHabitStores";
import { Flame, Star } from "lucide-react";
import AddHabitForm from "../component/AddHabits";
import EditHabitForm from "../component/EditHabits";
import { HabitType } from "../libs/types";
import toast from "react-hot-toast";



const Homepage: React.FC = () => {
  const { Habits, isFetchingHabit, fetchAllHabit, search, isDeletingHabit, deleteHabit } = useHabitStores();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchAllHabit();
  }, [fetchAllHabit]);

  const handleSearch = () => {
    if (searchTerm === "") {
      toast.error("Please type the search term");
      fetchAllHabit(); // If no search term, fetch all habits
    } else {
      search(searchTerm); // Pass search term to Zustand store
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Done":
        return "badge-success";
      case "In Progress":
        return "badge-secondary";
      case "Not Done":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    fetchAllHabit();
  };

  const handleDelete = (id: string) => {
    deleteHabit(id);
    fetchAllHabit();
  };

  return (
    <div className="h-screen pt-20">
      {/* 🔍 Search Bar */}
      <div className="flex items-center gap-2 mb-6">
        <input
          className="input input-bordered w-full max-w-md"
          placeholder="Search habits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* ➕ Add Habit Button */}
      <div className="z-10 mb-4">
        <button className="btn btn-accent" onClick={handleAdd}>
          + Add Habit
        </button>
      </div>

      {/* 📋 Habit List or Loading */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isFetchingHabit ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="skeleton h-32 w-full rounded-xl"></div>
          ))
        ) : (
          Habits?.map((habit: HabitType) => (
            <div key={habit._id} className="card shadow-lg p-4 bg-base-100 rounded-xl">
              <h3 className="text-xl font-semibold">{habit.HabitName}</h3>
              <p className="text-l font-light">
                <b>Habit Description: </b>
                {habit.HabitDesc}
              </p>

              <div className="flex gap-4 mt-2 text-sm items-center">
                <span className={`badge ${getStatusBadgeColor(habit.Status)}`}>
                  {habit.Status}
                </span>

                <span className="badge badge-info flex items-center gap-1">
                  <Star className="w-4 h-4" /> {habit.HabitPoints}
                </span>
                <span className="badge badge-warning flex items-center gap-1">
                  <Flame className="w-4 h-4" /> {habit.HabitStreak}
                </span>
              </div>
              <button onClick={() => handleEdit(habit._id)} className="btn btn-secondary mt-4">
                Edit
              </button>
              <button onClick={() => handleDelete(habit._id)} className="btn btn-error mt-4">
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Show Form Modal */}
      {showForm && (editingId ? (
        <EditHabitForm habitId={editingId} closeForm={closeForm} />
      ) : (
        <AddHabitForm closeForm={closeForm} />
      ))}
    </div>
  );
};

export default Homepage;
