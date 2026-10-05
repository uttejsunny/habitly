import Constants from "expo-constants";
import type { HabitWithStats } from "../habits/types";

const API_BASE_URL = (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? "http://10.0.2.2:3000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function toHabitSummary(habits: HabitWithStats[]) {
  return habits.map((h) => ({
    name: h.name,
    frequency: h.activeDays.length === 7 ? "daily" : `on ${h.activeDays.length} days/week`,
    currentStreak: h.currentStreak,
    longestStreak: h.longestStreak,
    completionRate: h.completionRate,
  }));
}

export async function sendCoachMessage(messages: ChatMessage[], habits: HabitWithStats[]): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, habits: toHabitSummary(habits) }),
  });
  if (!res.ok) throw new Error(`Coach request failed: ${res.status}`);
  const data = await res.json();
  return data.reply as string;
}

export async function fetchInsights(habits: HabitWithStats[]): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/ai/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ habits: toHabitSummary(habits) }),
  });
  if (!res.ok) throw new Error(`Insights request failed: ${res.status}`);
  const data = await res.json();
  return data.insights as string[];
}
