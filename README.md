# HabitAI (working name)

A HabitBull-style habit tracker with an AI coach, built with React Native (Expo) and a thin Llama (Groq) proxy server. Designed to grow beyond habits over time.

## Structure

- `mobile/` — Expo Router app (TypeScript). Habits, streaks, and reminders are stored locally on-device via SQLite; nothing leaves the phone except AI requests.
- `server/` — Minimal Node/Express proxy that holds the Groq API key and forwards chat/insight requests to Meta's Llama models. Never ship the API key inside the mobile app itself.

## Running it

### 1. AI server

```bash
cd server
npm install
cp .env.example .env   # add your GROQ_API_KEY (free at console.groq.com)
npm run dev
```

Confirm it's up: `curl http://localhost:3000/health`

### 2. Mobile app

```bash
cd mobile
npm install
npx expo start
```

Press `a` to launch on a connected Android device/emulator (or scan the QR code with Expo Go).

The app talks to the AI server at the URL in `mobile/app.json` → `expo.extra.apiBaseUrl` (defaults to `http://10.0.2.2:3000`, the Android emulator's alias for your machine's `localhost`). If you're using a physical device, change this to your computer's LAN IP, e.g. `http://192.168.1.23:3000`.

## Notes

- Habit data is local-only for now — no accounts, no cloud sync of habit data. Git here only tracks source code.
- AI features (Coach chat, Insights) require the server to be running and reachable from the device.

## Security scanning (Snyk)

`.github/workflows/snyk.yml` runs on every push/PR to `master`: a dependency vulnerability scan for both `mobile/` and `server/`, plus a Snyk Code (SAST) scan. Results upload to the repo's **Security → Code scanning** tab.

To activate it: add a `SNYK_TOKEN` repo secret (Settings → Secrets and variables → Actions) with an API token from your Snyk account (account.snyk.io → Account settings). Until that secret is set, the workflow's Snyk steps will fail — they're set to `continue-on-error: true` so that doesn't block the rest of CI. Once the project's known issues are triaged, remove `continue-on-error` so new vulnerabilities actually fail the build.
