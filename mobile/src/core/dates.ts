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

export function daysSince(dateKey: string, today: Date = new Date()): number {
  const then = startOfDay(new Date(dateKey));
  const now = startOfDay(today);
  return Math.round((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}
