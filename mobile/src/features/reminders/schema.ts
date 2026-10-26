import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reminders = sqliteTable("reminders", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  dueDate: text(), // "YYYY-MM-DD", null = no specific date
  done: int().notNull().default(0),
  createdAt: text().notNull(),
});

export const remindersTablesSql = `
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    dueDate TEXT,
    done INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL
  );
`;
