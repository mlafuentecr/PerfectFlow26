import AsyncStorage from '@react-native-async-storage/async-storage';

const SOUND_PREFS_KEY = 'perfectflow_sound_prefs';

export type SavedSoundPref = { key: string; volume: number };

export const saveSoundPrefs = async (sounds: SavedSoundPref[]) => {
  await AsyncStorage.setItem(SOUND_PREFS_KEY, JSON.stringify(sounds));
};

export const getSoundPrefs = async (): Promise<SavedSoundPref[]> => {
  const raw = await AsyncStorage.getItem(SOUND_PREFS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x.key === 'string' && typeof x.volume === 'number')
      .map((x) => ({ key: x.key, volume: Math.max(0, Math.min(1, x.volume)) }));
  } catch {
    return [];
  }
};
