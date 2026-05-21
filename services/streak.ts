import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_DATES_KEY = 'perfectflow_streak_dates';

const ymd = (d: Date) => d.toISOString().slice(0, 10);

export const getStreakDates = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(STREAK_DATES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === 'string');
  } catch {
    return [];
  }
};

export const markTodaySessionDone = async (): Promise<void> => {
  const today = ymd(new Date());
  const dates = await getStreakDates();
  if (dates.includes(today)) return;
  const next = [...dates, today].sort();
  await AsyncStorage.setItem(STREAK_DATES_KEY, JSON.stringify(next));
};

export const getCurrentStreak = async (): Promise<number> => {
  const dates = await getStreakDates();
  if (dates.length === 0) return 0;

  const set = new Set(dates);
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = ymd(cursor);
    if (!set.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const getWeekCompletion = async (): Promise<boolean[]> => {
  const dates = await getStreakDates();
  const set = new Set(dates);
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  const arr: boolean[] = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    arr.push(set.has(ymd(d)));
  }
  return arr;
};
