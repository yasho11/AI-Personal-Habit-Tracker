import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2, Star, CheckCircle } from "lucide-react";

interface HabitCardProps {
    habit: {
        _id: string;
        HabitName: string;
        HabitDesc: string;
        HabitPoints: number;
        HabitStreak: number;
        Status: string;
    };
    onDone: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onRecommend: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onDone, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isDoneAnimating, setIsDoneAnimating] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isDone = habit.Status === "Done";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDoneClick = () => {
        if (!isDone) {
            setIsDoneAnimating(true);
            setTimeout(() => {
                onDone(habit._id);
                setIsDoneAnimating(false);
            }, 400);
        }
    };

    return (
        <div
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 
      ${isDone ? "opacity-70" : ""} ${isDoneAnimating ? "scale-105 animate-bounce" : ""}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex-1">{habit.HabitName}</h3>

                {/* Three Dot Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        aria-label="Menu"
                    >
                        <MoreVertical size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10 animate-fade-in">
                            <button
                                onClick={() => {
                                    onEdit(habit._id);
                                    setShowMenu(false);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition"
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(habit._id);
                                    setShowMenu(false);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-600 hover:text-red-600 dark:hover:text-white transition"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{habit.HabitDesc}</p>

            {/* Stats */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900">
                    <Star size={16} className="text-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">{habit.HabitPoints} pts</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900">
                    <Star size={16} className="text-orange-500" />
                    <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">{habit.HabitStreak} day streak</span>
                </div>
            </div>

            {/* Done Button */}
            <button
                onClick={handleDoneClick}
                disabled={isDone}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300
          ${isDone ? "bg-green-100 text-green-700 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"}
          ${isDoneAnimating ? "animate-bounce" : ""}`}
            >
                {isDone ? <CheckCircle size={20} /> : <CheckCircle size={20} />}
                {isDone ? "Completed Today" : "Mark as Done"}
            </button>

            {/* Done Badge */}
            {isDone && (
                <div className="absolute top-4 right-16 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    ✓ Done
                </div>
            )}
        </div>
    );
};

export default HabitCard;
