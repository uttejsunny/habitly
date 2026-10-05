import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const sqlite = SQLite.openDatabaseSync("habitai.db");
export const db = drizzle(sqlite, { schema });

export async function initDatabase() {
  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '⭐',
      color TEXT NOT NULL DEFAULT '#5B8DEF',
      activeDays TEXT NOT NULL DEFAULT '[0,1,2,3,4,5,6]',
      reminderTime TEXT,
      notificationId TEXT,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitId INTEGER NOT NULL,
      date TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS habit_date_unique ON habit_logs (habitId, date);
  `);
}
