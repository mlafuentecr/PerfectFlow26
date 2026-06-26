import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_KEY = 'perfectflow_daily_reminder_v1';
const CHANNEL_ID = 'perfectflow-reminders';

export type DailyReminder = {
  hour: number;
  minute: number;
  notificationId: string;
};

export async function ensureReminderPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const requested = await Notifications.requestPermissionsAsync();
  return !!(requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL);
}

export async function scheduleDailyReminder(
  hour: number,
  minute: number,
  language: 'en' | 'es'
): Promise<DailyReminder> {
  const hasPermission = await ensureReminderPermission();
  if (!hasPermission) {
    throw new Error('NOTIFICATION_PERMISSION_DENIED');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'PerfectFlow reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
      vibrationPattern: [0, 200, 120, 200],
      lightColor: '#8D7BFF',
    });
  }

  const existing = await getDailyReminder();
  if (existing?.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(existing.notificationId).catch(() => {});
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: language === 'es' ? 'Momento de respirar' : 'Time to breathe',
      body:
        language === 'es'
          ? 'Tómate 5 minutos para volver a tu calma.'
          : 'Take 5 minutes to reset your calm.',
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
    },
  });

  const reminder: DailyReminder = { hour, minute, notificationId };
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(reminder));
  return reminder;
}

export async function getDailyReminder(): Promise<DailyReminder | null> {
  const raw = await AsyncStorage.getItem(REMINDER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DailyReminder;
    if (
      typeof parsed?.hour === 'number' &&
      typeof parsed?.minute === 'number' &&
      typeof parsed?.notificationId === 'string'
    ) {
      return parsed;
    }
  } catch {
    // ignore parse errors and clear invalid value below
  }
  await AsyncStorage.removeItem(REMINDER_KEY);
  return null;
}

export async function clearDailyReminder(): Promise<void> {
  const existing = await getDailyReminder();
  if (existing?.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(existing.notificationId).catch(() => {});
  }
  await AsyncStorage.removeItem(REMINDER_KEY);
}

export function formatReminderTime(hour: number, minute: number, language: 'en' | 'es') {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}
