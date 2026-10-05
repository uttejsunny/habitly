import { int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const habits = sqliteTable("habits", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  icon: text().notNull().default("⭐"),
  color: text().notNull().default("#5B8DEF"),
  // Days of week this habit is active on, e.g. [0,1,2,3,4,5,6] for every day (0 = Sunday).
  activeDays: text().notNull().default("[0,1,2,3,4,5,6]"),
  reminderTime: text(), // "HH:mm", null = no reminder
  notificationId: text(), // id returned by expo-notifications, for cancellation
  createdAt: text().notNull(),
});

export const habitLogs = sqliteTable(
  "habit_logs",
  {
    id: int().primaryKey({ autoIncrement: true }),
    habitId: int().notNull(),
    date: text().notNull(), // "YYYY-MM-DD"
  },
  (table) => ({
    habitDateUnique: uniqueIndex("habit_date_unique").on(table.habitId, table.date),
  })
);
