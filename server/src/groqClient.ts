import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set. Copy .env.example to .env and add your key.");
}

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const COACH_MODEL = "llama-3.3-70b-versatile";
