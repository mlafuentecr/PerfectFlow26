import { Audio } from 'expo-av';

/* =====================
   Interfaces
===================== */

interface SoundInfo {
  sound: any;   // require('mp3')
  image: any;   // require('png')
}

interface ImagesAndSound {
  [key: string]: SoundInfo;
}

interface SoundInstances {
  [key: string]: Audio.Sound;
}

/* =====================
   Data (IMÁGENES + AUDIOS)
===================== */

const Imgs_and_snd: ImagesAndSound = {
  bird_1: {
    sound: require('../../../assets/sounds/bird_1.mp3'),
    image: require('../../../assets/images/icons_sounds/bird_1.png'),
  },
  bird_2: {
    sound: require('../../../assets/sounds/bird_2.mp3'),
    image: require('../../../assets/images/icons_sounds/bird_2.png'),
  },
  bird3: {
    sound: require('../../../assets/sounds/bird_3.mp3'),
    image: require('../../../assets/images/icons_sounds/bird_3.png'),
  },
  bird_4: {
    sound: require('../../../assets/sounds/bird_4.mp3'),
    image: require('../../../assets/images/icons_sounds/bird_4.png'),
  },
  bell: {
    sound: require('../../../assets/sounds/meditation.mp3'),
    image: require('../../../assets/images/icons_sounds/bell.png'),
  },
  bell2: {
    sound: require('../../../assets/sounds/bell2.mp3'),
    image: require('../../../assets/images/icons_sounds/meditation.png'),
  },
  crickets_1: {
    sound: require('../../../assets/sounds/cricket_1.mp3'),
    image: require('../../../assets/images/icons_sounds/cricket_1.png'),
  },
  crickets_2: {
    sound: require('../../../assets/sounds/cricket_2.mp3'),
    image: require('../../../assets/images/icons_sounds/cricket_2.png'),
  },
  fire_1: {
    sound: require('../../../assets/sounds/fire_1.mp3'),
    image: require('../../../assets/images/icons_sounds/fire_1.png'),
  },
  fire_2: {
    sound: require('../../../assets/sounds/fire_2.mp3'),
    image: require('../../../assets/images/icons_sounds/fire_2.png'),
  },
  forest: {
    sound: require('../../../assets/sounds/forest_1.mp3'),
    image: require('../../../assets/images/icons_sounds/forest_1.png'),
  },
  frog: {
    sound: require('../../../assets/sounds/frog_1.mp3'),
    image: require('../../../assets/images/icons_sounds/frog_1.png'),
  },
  grass: {
    sound: require('../../../assets/sounds/grass.mp3'),
    image: require('../../../assets/images/icons_sounds/grass.png'),
  },
  ocean_1: {
    sound: require('../../../assets/sounds/ocean_1.mp3'),
    image: require('../../../assets/images/icons_sounds/ocean_1.png'),
  },
  ocean_2: {
    sound: require('../../../assets/sounds/ocean_2.mp3'),
    image: require('../../../assets/images/icons_sounds/ocean_2.png'),
  },
  ocean_3: {
    sound: require('../../../assets/sounds/ocean_3.mp3'),
    image: require('../../../assets/images/icons_sounds/ocean_3.png'),
  },
  ocean_4: {
    sound: require('../../../assets/sounds/ocean_4.mp3'),
    image: require('../../../assets/images/icons_sounds/ocean_4.png'),
  },
  rain_1: {
    sound: require('../../../assets/sounds/rain_1.mp3'),
    image: require('../../../assets/images/icons_sounds/rain_1.png'),
  },
  rain_2: {
    sound: require('../../../assets/sounds/rain_2.mp3'),
    image: require('../../../assets/images/icons_sounds/rain_2.png'),
  },
  rain_3: {
    sound: require('../../../assets/sounds/rain_3.mp3'),
    image: require('../../../assets/images/icons_sounds/rain_3.png'),
  },
  rain_4: {
    sound: require('../../../assets/sounds/rain_4.mp3'),
    image: require('../../../assets/images/icons_sounds/rain_4.png'),
  },
  rain_5: {
    sound: require('../../../assets/sounds/rain_5.mp3'),
    image: require('../../../assets/images/icons_sounds/rain_5.png'),
  },
  rain_6: {
    sound: require('../../../assets/sounds/rain_6.mp3'),
    image: require('../../../assets/images/icons_sounds/rain_6.png'),
  },
  wind_1: {
    sound: require('../../../assets/sounds/wind_1.mp3'),
    image: require('../../../assets/images/icons_sounds/wind_1.png'),
  },
  wind_2: {
    sound: require('../../../assets/sounds/wind_2.mp3'),
    image: require('../../../assets/images/icons_sounds/wind_2.png'),
  },
  wind_3: {
    sound: require('../../../assets/sounds/wind_3.mp3'),
    image: require('../../../assets/images/icons_sounds/wind_3.png'),
  },
  water_1: {
    sound: require('../../../assets/sounds/water_1.mp3'),
    image: require('../../../assets/images/icons_sounds/water_1.png'),
  },
  water_2: {
    sound: require('../../../assets/sounds/water_2.mp3'),
    image: require('../../../assets/images/icons_sounds/water_2.png'),
  },
  waterfall: {
    sound: require('../../../assets/sounds/waterfall.mp3'),
    image: require('../../../assets/images/icons_sounds/waterfall.png'),
  },
  whale: {
    sound: require('../../../assets/sounds/whale.mp3'),
    image: require('../../../assets/images/icons_sounds/whale.png'),
  },
};

/* =====================
   SONIDOS (expo-av)
===================== */

const soundInstances: SoundInstances = {};

/**
 * Carga todos los sonidos en memoria
 */
export const loadAllSounds = async () => {
  for (const key of Object.keys(Imgs_and_snd)) {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(Imgs_and_snd[key].sound);
      soundInstances[key] = sound;
    } catch (error) {
      console.error(`Error loading sound ${key}`, error);
    }
  }
};

/**
 * Reproduce un sonido por nombre
 */
export const playSound = async (key: string) => {
  const sound = soundInstances[key];
  if (!sound) return;

  try {
    await sound.replayAsync();
  } catch (error) {
    console.error(`Error playing sound ${key}`, error);
  }
};

/**
 * Libera memoria (IMPORTANTE)
 */
export const unloadAllSounds = async () => {
  for (const key of Object.keys(soundInstances)) {
    await soundInstances[key].unloadAsync();
  }
};

/* =====================
   EXPORTS
===================== */

export { soundInstances };
export default Imgs_and_snd;
