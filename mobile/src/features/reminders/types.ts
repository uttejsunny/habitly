export interface Reminder {
  id: number;
  title: string;
  dueDate: string | null; // "YYYY-MM-DD", null = no specific date
  done: boolean;
  createdAt: string;
}

export interface NewReminderInput {
  title: string;
  dueDate: string | null;
}
