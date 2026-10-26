import { Router } from "express";
import { groq, COACH_MODEL } from "../groqClient";

export const aiRouter = Router();

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Each app module (habits, reminders, wardrobe, ...) renders its own data into
// one of these on the client before sending it here. The server never needs to
// know what a "habit" or "wardrobe item" is - it just assembles whatever
// sections it's given into a prompt. Adding a new module never requires a
// server change.
interface ContextSection {
  id: string;
  label: string;
  summary: string;
}

function buildContextBlock(context: ContextSection[] | undefined): string {
  if (!context || context.length === 0) return "The user has no data logged yet in any module.";
  return context.map((section) => `### ${section.label}\n${section.summary}`).join("\n\n");
}

aiRouter.post("/chat", async (req, res) => {
  try {
    const { messages, context } = req.body as { messages: ChatMessage[]; context?: ContextSection[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages must be a non-empty array" });
    }

    const systemPrompt = `You are an encouraging, concise personal-assistant coach inside the user's all-in-one personal app (habits, reminders, wardrobe, and more over time). Use whatever data sections below are relevant to ground your advice. Keep replies short (2-4 sentences) and actionable.\n\n${buildContextBlock(context)}`;

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
    const { context } = req.body as { context: ContextSection[] };
    if (!Array.isArray(context) || context.length === 0) {
      return res.status(400).json({ error: "context must be a non-empty array" });
    }

    const prompt = `Analyze this user's personal data below and return 3-5 short, specific insights or suggestions (patterns, risks, things worth noting - draw connections across sections when relevant, e.g. between habits and wardrobe or reminders). Respond as a JSON array of strings, nothing else.\n\n${buildContextBlock(context)}`;

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
