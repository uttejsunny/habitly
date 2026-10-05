export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isActiveDay(date: Date, activeDays: number[]): boolean {
  return activeDays.includes(date.getDay());
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

/**
 * Walks the habit's history once forward (for longest streak / completion rate)
 * and once backward from today (for current streak). Today is exempt from
 * breaking the current streak since the day isn't over yet.
 */
export function computeStreakStats(
  activeDays: number[],
  completedDateKeys: Set<string>,
  createdAt: Date,
  today: Date = new Date()
): StreakStats {
  const start = startOfDay(createdAt);
  const end = startOfDay(today);

  let currentStreak = 0;
  const cursor = new Date(end);
  while (cursor >= start) {
    const key = toDateKey(cursor);
    if (isActiveDay(cursor, activeDays)) {
      const done = completedDateKeys.has(key);
      if (!done) {
        if (key === toDateKey(end)) {
          // today, still open
        } else {
          break;
        }
      } else {
        currentStreak++;
      }
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  let longestStreak = 0;
  let run = 0;
  let totalActive = 0;
  let totalDone = 0;
  const forward = new Date(start);
  while (forward <= end) {
    const key = toDateKey(forward);
    if (isActiveDay(forward, activeDays)) {
      totalActive++;
      if (completedDateKeys.has(key)) {
        totalDone++;
        run++;
        longestStreak = Math.max(longestStreak, run);
      } else {
        run = 0;
      }
    }
    forward.setDate(forward.getDate() + 1);
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  const completionRate = totalActive === 0 ? 0 : totalDone / totalActive;
  return { currentStreak, longestStreak, completionRate };
}
