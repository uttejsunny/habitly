import { and, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { habitLogs, habits } from "../../db/schema";
import { cancelHabitReminder, ensureNotificationPermission, scheduleHabitReminder } from "./reminders";
import { computeStreakStats, toDateKey } from "./streaks";
import type { Habit, HabitWithStats, NewHabitInput } from "./types";

function rowToHabit(row: typeof habits.$inferSelect): Habit {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    activeDays: JSON.parse(row.activeDays) as number[],
    reminderTime: row.reminderTime,
    createdAt: row.createdAt,
  };
}

export async function createHabit(input: NewHabitInput): Promise<void> {
  let notificationId: string | null = null;
  if (input.reminderTime) {
    const granted = await ensureNotificationPermission();
    if (granted) notificationId = await scheduleHabitReminder(input.name, input.reminderTime);
  }

  await db.insert(habits).values({
    name: input.name,
    icon: input.icon,
    color: input.color,
    activeDays: JSON.stringify(input.activeDays),
    reminderTime: input.reminderTime,
    notificationId,
    createdAt: new Date().toISOString(),
  });
}

export async function deleteHabit(id: number): Promise<void> {
  const rows = await db.select().from(habits).where(eq(habits.id, id));
  if (rows[0]?.notificationId) {
    await cancelHabitReminder(rows[0].notificationId);
  }
  await db.delete(habitLogs).where(eq(habitLogs.habitId, id));
  await db.delete(habits).where(eq(habits.id, id));
}

export async function getLogDatesForHabit(habitId: number): Promise<Set<string>> {
  const rows = await db.select().from(habitLogs).where(eq(habitLogs.habitId, habitId));
  return new Set(rows.map((r) => r.date));
}

export async function toggleCompletion(habitId: number, date: Date = new Date()): Promise<void> {
  const dateKey = toDateKey(date);
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, dateKey)));

  if (existing.length > 0) {
    await db.delete(habitLogs).where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, dateKey)));
  } else {
    await db.insert(habitLogs).values({ habitId, date: dateKey });
  }
}

export async function listHabitsWithStats(): Promise<HabitWithStats[]> {
  const rows = await db.select().from(habits);
  const today = new Date();
  const todayKey = toDateKey(today);

  const result: HabitWithStats[] = [];
  for (const row of rows) {
    const habit = rowToHabit(row);
    const completedDateKeys = await getLogDatesForHabit(habit.id);
    const stats = computeStreakStats(habit.activeDays, completedDateKeys, new Date(habit.createdAt), today);
    result.push({
      ...habit,
      ...stats,
      completedToday: completedDateKeys.has(todayKey),
    });
  }
  return result;
}

export async function getHabitWithStats(id: number): Promise<HabitWithStats | undefined> {
  const rows = await db.select().from(habits).where(eq(habits.id, id));
  if (rows.length === 0) return undefined;
  const habit = rowToHabit(rows[0]);
  const completedDateKeys = await getLogDatesForHabit(habit.id);
  const stats = computeStreakStats(habit.activeDays, completedDateKeys, new Date(habit.createdAt));
  return { ...habit, ...stats, completedToday: completedDateKeys.has(toDateKey(new Date())) };
}
