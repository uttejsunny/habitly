import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { reminders } from "../../db/schema";
import type { NewReminderInput, Reminder } from "./types";

function rowToReminder(row: typeof reminders.$inferSelect): Reminder {
  return {
    id: row.id,
    title: row.title,
    dueDate: row.dueDate,
    done: row.done === 1,
    createdAt: row.createdAt,
  };
}

export async function listReminders(): Promise<Reminder[]> {
  const rows = await db.select().from(reminders);
  return rows.map(rowToReminder).sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });
}

export async function createReminder(input: NewReminderInput): Promise<void> {
  await db.insert(reminders).values({
    title: input.title,
    dueDate: input.dueDate,
    createdAt: new Date().toISOString(),
  });
}

export async function toggleReminderDone(id: number, done: boolean): Promise<void> {
  await db
    .update(reminders)
    .set({ done: done ? 1 : 0 })
    .where(eq(reminders.id, id));
}

export async function deleteReminder(id: number): Promise<void> {
  await db.delete(reminders).where(eq(reminders.id, id));
}
