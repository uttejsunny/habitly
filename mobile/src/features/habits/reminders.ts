import Constants from "expo-constants";
import type * as NotificationsType from "expo-notifications";

// expo-notifications' Android functionality was removed from Expo Go in SDK 53 -
// it only works in a standalone app or a custom dev client build. Even just
// `import`-ing it throws there, since the native binding is accessed at module
// load time - so it must be loaded with a runtime require() inside this guard,
// never a static top-level import, or Metro hoists the import above the check.
const isExpoGo = Constants.appOwnership === "expo";

let Notifications: typeof NotificationsType | null = null;
if (!isExpoGo) {
  Notifications = require("expo-notifications");
  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
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
