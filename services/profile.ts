import AsyncStorage from '@react-native-async-storage/async-storage';

const NAME_KEY = 'perfectflow_profile_name';

export const getProfileName = async () => {
  const v = await AsyncStorage.getItem(NAME_KEY);
  return v?.trim() || '';
};

export const setProfileName = async (name: string) => {
  await AsyncStorage.setItem(NAME_KEY, name.trim());
};
