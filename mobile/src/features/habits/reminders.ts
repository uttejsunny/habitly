import type * as NotificationsType from "expo-notifications";

// expo-notifications' Android functionality is unavailable in Expo Go (removed
// since SDK 53) - requiring it there throws immediately, since the native
// binding is accessed at module load time. Environment-detection flags proved
// unreliable across SDK bumps (Constants.appOwnership is deprecated and
// stopped reporting "expo" for Expo Go as of SDK 58's expo-constants; the
// recommended replacement, Constants.executionEnvironment, didn't catch it
// either). So instead of guessing the environment, just try the require and
// treat any failure as "notifications aren't available here" - this stays
// correct regardless of how future SDKs report the environment.
let Notifications: typeof NotificationsType | null = null;
try {
  Notifications = require("expo-notifications");
  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  Notifications = null;
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (!Notifications) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleHabitReminder(habitName: string, time: string): Promise<string | null> {
  if (!Notifications) return null;
  const [hour, minute] = time.split(":").map(Number);
  return Notifications.scheduleNotificationAsync({
    content: { title: habitName, body: "Time to check in on this habit." },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
}

export async function cancelHabitReminder(notificationId: string): Promise<void> {
  if (!Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
