import type { AppModule, ContextSection } from "../../core/modules/types";
import { habitsTablesSql } from "./schema";
import { listHabitsWithStats } from "./repository";

function formatFrequency(activeDays: number[]): string {
  return activeDays.length === 7 ? "daily" : `on ${activeDays.length} days/week`;
}

async function getAIContext(): Promise<ContextSection | null> {
  const habits = await listHabitsWithStats();
  if (habits.length === 0) return null;

  const summary = habits
    .map(
      (h) =>
        `- ${h.name} (${formatFrequency(h.activeDays)}): current streak ${h.currentStreak}, longest streak ${h.longestStreak}, completion rate ${Math.round(h.completionRate * 100)}%`
    )
    .join("\n");

  return { id: "habits", label: "Habits", summary };
}

export const habitsModule: AppModule = {
  id: "habits",
  name: "Habits",
  icon: "✅",
  createTablesSql: habitsTablesSql,
  getAIContext,
};
