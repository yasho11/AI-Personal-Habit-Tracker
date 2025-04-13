import { useEffect, useState } from "react";
import { useHabitStores } from "../stores/useHabitStores";
import { Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { HabitType } from "../libs/types";


function Recommend() {
  // Zustand store destructuring
  const {Habits, isFetchingHabit, fetchAllHabit, recommend, Recommendation, isFetchingRecommendation} = useHabitStores();

  // State to track selected habit
  const [selectedHabitId, setSelectedHabitId] = useState<string>("");

  // Fetch all habits on mount
  useEffect(() => {
    fetchAllHabit();
  }, [fetchAllHabit]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 h-screen">
      <h1 className="text-3xl font-bold text-center">🌟 Get Habit Recommendations</h1>

      {/* Habit Selector */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Select a Habit</span>
        </label>
        {isFetchingHabit ? (
          <div className="flex items-center gap-2">
            <Loader className="animate-spin" />
            <span>Loading Habits...</span>
          </div>
        ) : (
          <select
            className="select select-bordered w-full"
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
          >
            <option disabled value="">Choose a habit</option>
            {Habits.map((habit: HabitType) => (
              <option key={habit._id} value={habit._id}>
                {habit.HabitName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Recommend Button */}
      <div className="text-center">
        <button
          className="btn btn-primary btn-wide"
          onClick={() => selectedHabitId && recommend(selectedHabitId)}
          disabled={!selectedHabitId || isFetchingRecommendation}
        >
          {isFetchingRecommendation ? (
            <>
              <Loader className="animate-spin mr-2" /> Generating...
            </>
          ) : (
            "Recommend"
          )}
        </button>
      </div>

      {/* Output Recommendation */}
      {Recommendation && (
        <div className="card bg-base-200 shadow-xl p-4">
          <div className="card-body">
            <h2 className="card-title">🧠 Recommendation:</h2>
            <div className="prose max-w-none dark:prose-invert">
              <ReactMarkdown>{Recommendation}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommend;
