import { Router } from "express";
import { groq, COACH_MODEL } from "../groqClient";

export const aiRouter = Router();

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface HabitSummary {
  name: string;
  frequency: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

function buildHabitContext(habits: HabitSummary[] | undefined): string {
  if (!habits || habits.length === 0) return "The user has not logged any habits yet.";
  return habits
    .map(
      (h) =>
        `- ${h.name} (${h.frequency}): current streak ${h.currentStreak}, longest streak ${h.longestStreak}, completion rate ${Math.round(h.completionRate * 100)}%`
    )
    .join("\n");
}

aiRouter.post("/chat", async (req, res) => {
  try {
    const { messages, habits } = req.body as { messages: ChatMessage[]; habits?: HabitSummary[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages must be a non-empty array" });
    }

    const systemPrompt = `You are an encouraging, concise habit-coaching assistant inside a habit-tracking app. Use the user's current habit data to ground your advice. Keep replies short (2-4 sentences) and actionable.\n\nUser's habits:\n${buildHabitContext(habits)}`;

    const completion = await groq.chat.completions.create({
      model: COACH_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 400,
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI chat request failed" });
  }
});

aiRouter.post("/insights", async (req, res) => {
  try {
    const { habits } = req.body as { habits: HabitSummary[] };
    if (!Array.isArray(habits) || habits.length === 0) {
      return res.status(400).json({ error: "habits must be a non-empty array" });
    }

    const prompt = `Analyze this user's habit-tracking data and return 3-5 short, specific insights or suggestions (e.g. at-risk streaks, best/worst performing habits, patterns worth noting). Respond as a JSON array of strings, nothing else.\n\nHabit data:\n${buildHabitContext(habits)}`;

    const completion = await groq.chat.completions.create({
      model: COACH_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";
    let insights: string[];
    try {
      insights = JSON.parse(raw);
    } catch {
      insights = [raw];
    }

    res.json({ insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI insights request failed" });
  }
});
