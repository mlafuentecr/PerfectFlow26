import AsyncStorage from '@react-native-async-storage/async-storage';

export const BREATH_BG_KEY = 'perfectflow_breath_bg_key';

export const BREATH_BACKGROUNDS = [
  { key: 'mountain', label: 'Mountain', src: require('../images/background/mountain1.jpg') },
  { key: 'mountain2', label: 'Mountain 2', src: require('../images/background/mountain2.jpg') },
  { key: 'mountain3', label: 'Mountain 3', src: require('../images/background/mountain3.jpg') },
  { key: 'forest', label: 'Forest', src: require('../images/background/forest1.jpg') },
  { key: 'forest2', label: 'Forest 2', src: require('../images/background/forest2.jpg') },
  { key: 'forest3', label: 'Forest 3', src: require('../images/background/forest3.jpg') },
  { key: 'ocean', label: 'Ocean', src: require('../images/background/ocean1.jpg') },
  { key: 'ocean2', label: 'Ocean 2', src: require('../images/background/ocean2.jpg') },
  { key: 'ocean3', label: 'Ocean 3', src: require('../images/background/ocean3.jpg') },
  { key: 'sunset', label: 'Sunset', src: require('../images/background/sky3.jpg') },
  { key: 'nightsky', label: 'Night Sky', src: require('../images/background/sky1.jpg') },
  { key: 'sky2', label: 'Sky 2', src: require('../images/background/sky2.jpg') },
  { key: 'sky4', label: 'Sky 4', src: require('../images/background/sky4.jpg') },
  { key: 'waterfall', label: 'Waterfall', src: require('../images/background/leaves4.jpg') },
  { key: 'leaves1', label: 'Leaves 1', src: require('../images/background/leaves1.jpg') },
  { key: 'fire1', label: 'Fire 1', src: require('../images/background/fire_1.jpg') },
  { key: 'fire2', label: 'Fire 2', src: require('../images/background/fire_2.jpg') },
] as const;

export type BreathBackgroundKey = (typeof BREATH_BACKGROUNDS)[number]['key'];

export const saveBreathBackgroundKey = async (key: BreathBackgroundKey) => {
  await AsyncStorage.setItem(BREATH_BG_KEY, key);
};

export const getBreathBackgroundKey = async (): Promise<BreathBackgroundKey> => {
  const raw = await AsyncStorage.getItem(BREATH_BG_KEY);
  const exists = BREATH_BACKGROUNDS.some((b) => b.key === raw);
  return exists ? (raw as BreathBackgroundKey) : 'mountain';
};
