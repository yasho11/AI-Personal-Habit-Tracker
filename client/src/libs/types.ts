export interface HabitType {
    _id: string;
    HabitName: string;
    HabitDesc: string;
    HabitPoints: number;
    HabitStreak: number;
    Status: "Not Done" | "In Progress" | "Done";
    UserEmail: string;
    createdAt: string;
    updatedAt: string;
  }
  