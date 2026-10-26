import Constants from "expo-constants";
import { modules } from "../modules/registry";
import type { ContextSection } from "../modules/types";

const API_BASE_URL = (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? "http://10.0.2.2:3000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function gatherContext(): Promise<ContextSection[]> {
  const sections = await Promise.all(modules.map((m) => m.getAIContext()));
  return sections.filter((s): s is ContextSection => s !== null);
}

export async function sendCoachMessage(messages: ChatMessage[]): Promise<string> {
  const context = await gatherContext();
  const res = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context }),
  });
  if (!res.ok) throw new Error(`Coach request failed: ${res.status}`);
  const data = await res.json();
  return data.reply as string;
}

export async function fetchInsights(): Promise<string[]> {
  const context = await gatherContext();
  const res = await fetch(`${API_BASE_URL}/ai/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context }),
  });
  if (!res.ok) throw new Error(`Insights request failed: ${res.status}`);
  const data = await res.json();
  return data.insights as string[];
}
