import { useCallback, useEffect, useState } from "react";
import { createHabit, deleteHabit, listHabitsWithStats, toggleCompletion } from "./repository";
import type { HabitWithStats, NewHabitInput } from "./types";

export function useHabits() {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await listHabitsWithStats();
    setHabits(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addHabit = useCallback(
    async (input: NewHabitInput) => {
      await createHabit(input);
      await refresh();
    },
    [refresh]
  );

  const removeHabit = useCallback(
    async (id: number) => {
      await deleteHabit(id);
      await refresh();
    },
    [refresh]
  );

  const toggleToday = useCallback(
    async (habitId: number) => {
      await toggleCompletion(habitId);
      await refresh();
    },
    [refresh]
  );

  return { habits, loading, refresh, addHabit, removeHabit, toggleToday };
}
