import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set. Copy .env.example to .env and add your key.");
}

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Swapped to an openai/gpt-oss model: this Groq account has no Llama
// chat/instruct models enabled yet (only llama-prompt-guard-2-*, a safety
// filter). Switch back to a llama-3.x model once account access shows up.
export const COACH_MODEL = "openai/gpt-oss-20b";
