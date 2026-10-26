import { useCallback, useEffect, useState } from "react";
import { createReminder, deleteReminder, listReminders, toggleReminderDone } from "./repository";
import type { NewReminderInput, Reminder } from "./types";

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await listReminders();
    setReminders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addReminder = useCallback(
    async (input: NewReminderInput) => {
      await createReminder(input);
      await refresh();
    },
    [refresh]
  );

  const toggleDone = useCallback(
    async (id: number, done: boolean) => {
      await toggleReminderDone(id, done);
      await refresh();
    },
    [refresh]
  );

  const removeReminder = useCallback(
    async (id: number) => {
      await deleteReminder(id);
      await refresh();
    },
    [refresh]
  );

  return { reminders, loading, refresh, addReminder, toggleDone, removeReminder };
}
