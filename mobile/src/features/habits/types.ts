export interface Habit {
  id: number;
  name: string;
  icon: string;
  color: string;
  activeDays: number[]; // 0 (Sun) - 6 (Sat)
  reminderTime: string | null;
  createdAt: string;
}

export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  completedToday: boolean;
}

export interface NewHabitInput {
  name: string;
  icon: string;
  color: string;
  activeDays: number[];
  reminderTime: string | null;
}
