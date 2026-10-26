import type { AppModule, ContextSection } from "../../core/modules/types";
import { remindersTablesSql } from "./schema";
import { listReminders } from "./repository";

async function getAIContext(): Promise<ContextSection | null> {
  const items = await listReminders();
  const pending = items.filter((r) => !r.done);
  if (pending.length === 0) return null;

  const todayKey = new Date().toISOString().slice(0, 10);
  const summary = pending
    .map((r) => {
      if (!r.dueDate) return `- ${r.title} (no due date)`;
      const overdue = r.dueDate < todayKey ? " (overdue)" : "";
      return `- ${r.title}, due ${r.dueDate}${overdue}`;
    })
    .join("\n");

  return { id: "reminders", label: "Reminders", summary };
}

export const remindersModule: AppModule = {
  id: "reminders",
  name: "Reminders",
  icon: "🔔",
  createTablesSql: remindersTablesSql,
  getAIContext,
};
