import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HabitCard from "../component/HabitCard";
import { useHabitStores } from "../stores/useHabitStores"; // adjust path
import { toast } from "react-hot-toast";

const ViewHabits: React.FC = () => {
  const navigate = useNavigate();

  const {
    Habits,
    isFetchingHabit,
    fetchAllHabit,
    updateStreak,
    deleteHabit,
    recommend,
  } = useHabitStores();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
    } else {
      fetchAllHabit();
    }
  }, [fetchAllHabit, navigate]);

  const handleDone = async (id: string) => {
    try {
      await updateStreak(id, "Done");
      // Optimistic UI update
      toast.success("Habit marked as done!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark habit as done.");
    }
  };

  const handleEdit = (id: string) => navigate(`/editHabit/${id}`);
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      await deleteHabit(id);
      fetchAllHabit(); // refresh list
    }
  };
  const handleRecommend = (id: string) => recommend(id);
  const handleCreateNew = () => navigate("/createHabit");

  if (isFetchingHabit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Habits</h1>
            <p className="text-gray-600">
              {Habits.length === 0
                ? "Start building better habits today!"
                : `You have ${Habits.length} ${Habits.length === 1 ? "habit" : "habits"} to track`}
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Habit
          </button>
        </div>

        {/* Habits Grid */}
        {Habits.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-gray-100">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Habits Yet</h3>
              <p className="text-gray-600 mb-6">
                Start your journey to better habits! Create your first habit and begin tracking your progress.
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Your First Habit
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Habits.map((habit: any) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onDone={handleDone}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRecommend={handleRecommend}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewHabits;
