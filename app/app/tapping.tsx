import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Ionicons } from '@expo/vector-icons';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import Slider from '@react-native-community/slider';
import BottomNav from '../components/BottomNav';
import {
  BREATH_BACKGROUNDS,
  BREATH_BACKGROUND_FALLBACK_SRC,
  getBreathBackgroundKey,
  saveBreathBackgroundKey,
  type BreathBackgroundKey,
} from '../services/breathingPrefs';
import { useI18n } from '../services/i18n';
import { getSoundPrefs, saveSoundPrefs } from '../services/soundPrefs';

type TappingStep = {
  id: number;
  title: { en: string; es: string };
  body: { en: string; es: string };
  image: any;
  audio: { en: any; es?: any };
};

const AUTO_STEP_MS = 11000;

const SOUNDS = [
  { key: 'ocean', label: 'Ocean Waves', icon: require('../assets/images/icons_sounds/ocean_1.png'), src: require('../assets/sounds/ocean_1.mp3') },
  { key: 'ocean2', label: 'Ocean 2', icon: require('../assets/images/icons_sounds/ocean_2.png'), src: require('../assets/sounds/ocean_2.mp3') },
  { key: 'ocean3', label: 'Ocean 3', icon: require('../assets/images/icons_sounds/ocean_3.png'), src: require('../assets/sounds/ocean_3.mp3') },
  { key: 'ocean4', label: 'Ocean 4', icon: require('../assets/images/icons_sounds/ocean_4.png'), src: require('../assets/sounds/ocean_4.mp3') },
  { key: 'rain', label: 'Rain', icon: require('../assets/images/icons_sounds/rain_1.png'), src: require('../assets/sounds/rain_1.mp3') },
  { key: 'rain2', label: 'Rain 2', icon: require('../assets/images/icons_sounds/rain_2.png'), src: require('../assets/sounds/rain_2.mp3') },
  { key: 'rain3', label: 'Rain 3', icon: require('../assets/images/icons_sounds/rain_3.png'), src: require('../assets/sounds/rain_3.mp3') },
  { key: 'rain4', label: 'Rain 4', icon: require('../assets/images/icons_sounds/rain_4.png'), src: require('../assets/sounds/rain_4.mp3') },
  { key: 'rain5', label: 'Rain 5', icon: require('../assets/images/icons_sounds/rain_5.png'), src: require('../assets/sounds/rain_5.mp3') },
  { key: 'rain6', label: 'Rain 6', icon: require('../assets/images/icons_sounds/rain_6.png'), src: require('../assets/sounds/rain_6.mp3') },
  { key: 'wind', label: 'Wind', icon: require('../assets/images/icons_sounds/wind_3.png'), src: require('../assets/sounds/wind_3.mp3') },
  { key: 'wind2', label: 'Wind 2', icon: require('../assets/images/icons_sounds/wind_2.png'), src: require('../assets/sounds/wind_2.mp3') },
  { key: 'wind3', label: 'Wind Chimes', icon: require('../assets/images/icons_sounds/wind_1.png'), src: require('../assets/sounds/wind_1.mp3') },
  { key: 'forest', label: 'Forest', icon: require('../assets/images/icons_sounds/forest_1.png'), src: require('../assets/sounds/forest_1.mp3') },
  { key: 'water1', label: 'Water Stream', icon: require('../assets/images/icons_sounds/water_1.png'), src: require('../assets/sounds/water_1.mp3') },
  { key: 'water2', label: 'Water Flow', icon: require('../assets/images/icons_sounds/water_2.png'), src: require('../assets/sounds/water_2.mp3') },
  { key: 'waterfall', label: 'Waterfall', icon: require('../assets/images/icons_sounds/waterfall.png'), src: require('../assets/sounds/waterfall.mp3') },
  { key: 'bird1', label: 'Birds 1', icon: require('../assets/images/icons_sounds/bird_1.png'), src: require('../assets/sounds/bird_1.mp3') },
  { key: 'bird2', label: 'Birds 2', icon: require('../assets/images/icons_sounds/bird_2.png'), src: require('../assets/sounds/bird_2.mp3') },
  { key: 'bird3', label: 'Birds 3', icon: require('../assets/images/icons_sounds/bird_3.png'), src: require('../assets/sounds/bird_3.mp3') },
  { key: 'bird4', label: 'Birds 4', icon: require('../assets/images/icons_sounds/bird_4.png'), src: require('../assets/sounds/bird_4.mp3') },
  { key: 'cricket1', label: 'Crickets 1', icon: require('../assets/images/icons_sounds/cricket_1.png'), src: require('../assets/sounds/cricket_1.mp3') },
  { key: 'cricket2', label: 'Crickets 2', icon: require('../assets/images/icons_sounds/cricket_2.png'), src: require('../assets/sounds/cricket_2.mp3') },
  { key: 'fire1', label: 'Fire 1', icon: require('../assets/images/icons_sounds/fire_1.png'), src: require('../assets/sounds/fire_1.mp3') },
  { key: 'fire2', label: 'Fire 2', icon: require('../assets/images/icons_sounds/fire_2.png'), src: require('../assets/sounds/fire_2.mp3') },
  { key: 'frog', label: 'Frog', icon: require('../assets/images/icons_sounds/frog_1.png'), src: require('../assets/sounds/frog_1.mp3') },
  { key: 'grass', label: 'Grass', icon: require('../assets/images/icons_sounds/grass.png'), src: require('../assets/sounds/grass.mp3') },
  { key: 'whale', label: 'Whale', icon: require('../assets/images/icons_sounds/whale.png'), src: require('../assets/sounds/whale.mp3') },
  { key: 'meditation', label: 'Meditation', icon: require('../assets/images/icons_sounds/meditation.png'), src: require('../assets/sounds/meditation.mp3') },
  { key: 'bell2', label: 'Bell', icon: require('../assets/images/icons_sounds/bell.png'), src: require('../assets/sounds/bell2.mp3') },
] as const;

const TAPPING_STEPS: TappingStep[] = [
  {
    id: 1,
    title: { en: 'Karate Chop', es: 'Karate Chop' },
    body: {
      en: 'Start by tapping the side of your hand while repeating: "I choose calm."',
      es: 'Comienza dando suaves golpecitos en el costado de tu mano mientras repites: "Elijo la calma."',
    },
    image: require('../assets/tapping/images/1.png'),
    audio: {
      en: require('../assets/tapping/audio/1.mp3'),
      es: require('../assets/tapping/audio/1-esp-7s.mp3'),
    },
  },
  {
    id: 2,
    title: { en: 'Top of Head', es: 'Coronilla' },
    body: {
      en: 'Move to the top of your head while repeating: "I am safe."',
      es: 'Ahora pasa a la parte superior de tu cabeza mientras repites: "Estoy a salvo."',
    },
    image: require('../assets/tapping/images/2.png'),
    audio: {
      en: require('../assets/tapping/audio/2.mp3'),
      es: require('../assets/tapping/audio/2-esp.mp3'),
    },
  },
  {
    id: 3,
    title: { en: 'Eyebrow', es: 'Ceja' },
    body: {
      en: 'Tap the beginning of your eyebrow while repeating: "My mind is becoming quieter."',
      es: 'Da suaves golpecitos al inicio de la ceja mientras repites: "Mi mente está cada vez más tranquila."',
    },
    image: require('../assets/tapping/images/3.png'),
    audio: {
      en: require('../assets/tapping/audio/3.mp3'),
      es: require('../assets/tapping/audio/3-esp.mp3'),
    },
  },
  {
    id: 4,
    title: { en: 'Side of Eye', es: 'Lado del ojo' },
    body: {
      en: 'Tap the side of your eye while repeating: "I let go of what I can\'t control."',
      es: 'Da suaves golpecitos al lado del ojo mientras repites: "Suelto lo que no puedo controlar."',
    },
    image: require('../assets/tapping/images/4.png'),
    audio: {
      en: require('../assets/tapping/audio/4.mp3'),
      es: require('../assets/tapping/audio/4-esp.mp3'),
    },
  },
  {
    id: 5,
    title: { en: 'Under Eye', es: 'Debajo del ojo' },
    body: {
      en: 'Tap below your eye while repeating: "I release all tension."',
      es: 'Da suaves golpecitos debajo del ojo mientras repites: "Libero toda la tensión."',
    },
    image: require('../assets/tapping/images/5.png'),
    audio: {
      en: require('../assets/tapping/audio/5.mp3'),
      es: require('../assets/tapping/audio/5-esp.mp3'),
    },
  },
  {
    id: 6,
    title: { en: 'Under Nose', es: 'Debajo de la nariz' },
    body: {
      en: 'Tap between your nose and upper lip while repeating: "Everything is okay in this moment."',
      es: 'Da suaves golpecitos entre la nariz y el labio superior mientras repites: "Todo está bien en este momento."',
    },
    image: require('../assets/tapping/images/6.png'),
    audio: {
      en: require('../assets/tapping/audio/6.mp3'),
      es: require('../assets/tapping/audio/6-esp-9s.mp3'),
    },
  },
  {
    id: 7,
    title: { en: 'Chin', es: 'Mentón' },
    body: {
      en: 'Tap the center of your chin while repeating: "I feel lighter with every breath."',
      es: 'Da suaves golpecitos en el centro del mentón mientras repites: "Me siento más ligero con cada respiración."',
    },
    image: require('../assets/tapping/images/7.png'),
    audio: {
      en: require('../assets/tapping/audio/7.mp3'),
      es: require('../assets/tapping/audio/7-esp.mp3'),
    },
  },
  {
    id: 8,
    title: { en: 'Collarbone', es: 'Clavícula' },
    body: {
      en: 'Tap just below your collarbone while repeating: "My body knows how to relax."',
      es: 'Da suaves golpecitos justo debajo de la clavícula mientras repites: "Mi cuerpo sabe cómo relajarse."',
    },
    image: require('../assets/tapping/images/8.png'),
    audio: {
      en: require('../assets/tapping/audio/8.mp3'),
      es: require('../assets/tapping/audio/8-esp.mp3'),
    },
  },
  {
    id: 9,
    title: { en: 'Under Arm', es: 'Debajo del brazo' },
    body: {
      en: 'Tap below your armpit while repeating: "I choose peace."',
      es: 'Da suaves golpecitos debajo de la axila mientras repites: "Elijo la paz."',
    },
    image: require('../assets/tapping/images/9.png'),
    audio: {
      en: require('../assets/tapping/audio/9.mp3'),
      es: require('../assets/tapping/audio/9-esp.mp3'),
    },
  },
];

const TAPPING_INTRO = {
  en: require('../assets/sounds/audio-guide/intro.mp3'),
  es: require('../assets/sounds/audio-guide/es/es-intro.mp3'),
} as const;

const TAPPING_OUTRO = {
  en: require('../assets/tapping/audio/end.mp3'),
  es: require('../assets/tapping/audio/fin.mp3'),
} as const;

type SoundKey = (typeof SOUNDS)[number]['key'];
type ActiveSound = { key: SoundKey; sound: Audio.Sound; volume: number };
const DEFAULT_TAPPING_SOUND: SoundKey = 'ocean';
const DEFAULT_TAPPING_VOLUME = 0.3;
const TAPPING_KEEP_AWAKE_TAG = 'perfectflow-tapping-session';

export default function TappingScreen({ navigation }: any) {
  const { language } = useI18n();
  const isSpanish = String(language).toLowerCase().startsWith('es');
  const { height, width } = useWindowDimensions();
  const compact = height < 860;

  const [bgKey, setBgKey] = useState<BreathBackgroundKey>('mountain');
  const [soundKey, setSoundKey] = useState<SoundKey | 'default'>(DEFAULT_TAPPING_SOUND);
  const [soundObj, setSoundObj] = useState<Audio.Sound | null>(null);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [baseSoundVolume, setBaseSoundVolume] = useState(DEFAULT_TAPPING_VOLUME);
  const [activeSounds, setActiveSounds] = useState<ActiveSound[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [guideEnabled, setGuideEnabled] = useState(true);
  const [guidePlaying, setGuidePlaying] = useState(false);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [customizeTab, setCustomizeTab] = useState<'backgrounds' | 'sounds'>('sounds');
  const [isMuted, setIsMuted] = useState(false);
  const [failedBackgroundThumbs, setFailedBackgroundThumbs] = useState<Record<string, boolean>>({});

  const guideObjRef = useRef<Audio.Sound | null>(null);
  const soundObjRef = useRef<Audio.Sound | null>(null);
  const activeSoundsRef = useRef<ActiveSound[]>([]);
  const playbackTokenRef = useRef(0);
  const autoAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextGuideEffectRef = useRef(false);

  const step = useMemo(() => TAPPING_STEPS[stepIndex], [stepIndex]);
  const currentBg = BREATH_BACKGROUNDS.find((b) => b.key === bgKey) ?? BREATH_BACKGROUNDS[0];
  const currentAudio = (isSpanish ? step.audio.es : step.audio.en) ?? step.audio.en;
  const currentSound = SOUNDS.find((item) => item.key === soundKey) ?? null;
  const hasAnySoundSelected = activeSounds.length > 0 || !!soundObj;
  const progress = `${stepIndex + 1}/${TAPPING_STEPS.length}`;
  const imageWidth = Math.min(width - 44, compact ? 332 : 430);
  const imageHeight = Math.max(220, Math.min(height * 0.29, compact ? 270 : 320));

  useEffect(() => {
    soundObjRef.current = soundObj;
  }, [soundObj]);

  useEffect(() => {
    activeSoundsRef.current = activeSounds;
  }, [activeSounds]);

  const stopGuideClip = async () => {
    if (!guideObjRef.current) return;
    try {
      const status = await guideObjRef.current.getStatusAsync();
      if (status.isLoaded) {
        await guideObjRef.current.stopAsync();
        await guideObjRef.current.unloadAsync();
      }
    } catch {
      // Ignore stale unloaded sound instances.
    } finally {
      guideObjRef.current = null;
      setGuidePlaying(false);
    }
  };

  const clearAutoAdvanceTimeout = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
  };

  const stopAmbientSounds = async () => {
    if (soundObjRef.current) {
      try {
        const st = await soundObjRef.current.getStatusAsync();
        if (st.isLoaded) {
          await soundObjRef.current.stopAsync();
          await soundObjRef.current.unloadAsync();
        }
      } catch {
        // Ignore stale unloaded sound instances.
      } finally {
        soundObjRef.current = null;
        setSoundObj(null);
        setSoundPlaying(false);
      }
    }

    for (const item of activeSoundsRef.current) {
      try {
        const st = await item.sound.getStatusAsync();
        if (st.isLoaded) {
          await item.sound.stopAsync();
          await item.sound.unloadAsync();
        }
      } catch {
        // Ignore stale unloaded sound instances.
      }
    }

    activeSoundsRef.current = [];
    setActiveSounds([]);
  };

  const playGuideClip = async (src: any, options?: { waitForCompletion?: boolean }) => {
    const token = ++playbackTokenRef.current;
    await stopGuideClip();
    const waitForCompletion = options?.waitForCompletion ?? false;
    let resolver: (() => void) | null = null;
    const finishedPromise = waitForCompletion
      ? new Promise<void>((resolve) => {
          resolver = resolve;
        })
      : null;

    const { sound } = await Audio.Sound.createAsync(src, {
      shouldPlay: true,
      isLooping: false,
      // Voice guide stays audible even if ambient sound is muted.
      volume: 0.95,
    });

    guideObjRef.current = sound;
    setGuidePlaying(true);
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish && playbackTokenRef.current === token) {
        void sound.unloadAsync().catch(() => {});
        if (guideObjRef.current === sound) {
          guideObjRef.current = null;
        }
        setGuidePlaying(false);
        resolver?.();
      }
    });

    if (finishedPromise) {
      await finishedPromise;
    }
  };

  const resetSession = async () => {
    playbackTokenRef.current += 1;
    clearAutoAdvanceTimeout();
    setRunning(false);
    setCompleted(false);
    setStepIndex(0);
    setShowCustomize(false);
    await stopGuideClip();
    await stopAmbientSounds();
  };

  useEffect(() => {
    void Audio.setIsEnabledAsync(true);
    void Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
  }, []);

  useEffect(() => {
    const shouldKeepAwake = running || guidePlaying;

    if (shouldKeepAwake) {
      void activateKeepAwakeAsync(TAPPING_KEEP_AWAKE_TAG).catch(() => {});
      return () => {
        void deactivateKeepAwake(TAPPING_KEEP_AWAKE_TAG).catch(() => {});
      };
    }

    void deactivateKeepAwake(TAPPING_KEEP_AWAKE_TAG).catch(() => {});
  }, [running, guidePlaying]);

  useEffect(() => {
    (async () => {
      setBgKey(await getBreathBackgroundKey());
      await getSoundPrefs();
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      void (async () => {
        await resetSession();
        setSoundKey(DEFAULT_TAPPING_SOUND);
        setBaseSoundVolume(DEFAULT_TAPPING_VOLUME);
        setIsMuted(false);
        await playOrSwitchSound(DEFAULT_TAPPING_SOUND, DEFAULT_TAPPING_VOLUME);
      })();
      return () => {
        void resetSession();
      };
    }, [])
  );

  useEffect(() => {
    if (!running || !guideEnabled || !currentAudio) return;
    if (skipNextGuideEffectRef.current) {
      skipNextGuideEffectRef.current = false;
      return;
    }
    void playGuideClip(currentAudio);
  }, [stepIndex, running, guideEnabled, currentAudio]);

  useEffect(() => {
    return () => {
      void deactivateKeepAwake(TAPPING_KEEP_AWAKE_TAG).catch(() => {});
      clearAutoAdvanceTimeout();
      void stopGuideClip();
      void stopAmbientSounds();
    };
  }, []);

  useEffect(() => {
    clearAutoAdvanceTimeout();
    if (!running || completed) return;

    autoAdvanceTimeoutRef.current = setTimeout(() => {
      void advanceStep();
    }, AUTO_STEP_MS);

    return () => {
      clearAutoAdvanceTimeout();
    };
  }, [running, completed, stepIndex]);

  const toggleMute = async () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (guideObjRef.current) {
      try {
        const status = await guideObjRef.current.getStatusAsync();
        if (status.isLoaded) {
          await guideObjRef.current.setVolumeAsync(nextMuted ? 0 : 0.95);
        }
      } catch {
        // Ignore stale unloaded sound instances.
      }
    }

    if (soundObjRef.current) {
      try {
        const status = await soundObjRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundObjRef.current.setVolumeAsync(nextMuted ? 0 : baseSoundVolume);
          if (!nextMuted && !status.isPlaying) await soundObjRef.current.playAsync();
        }
      } catch {
        // Ignore stale unloaded sound instances.
      }
    }

    for (const item of activeSoundsRef.current) {
      try {
        const status = await item.sound.getStatusAsync();
        if (!status.isLoaded) continue;
        await item.sound.setVolumeAsync(nextMuted ? 0 : item.volume);
        if (!nextMuted && !status.isPlaying) await item.sound.playAsync();
      } catch {
        // Ignore stale unloaded sound instances.
      }
    }
  };

  const toggleGuide = async () => {
    if (guideEnabled) {
      setGuideEnabled(false);
      await stopGuideClip();
      return;
    }

    setGuideEnabled(true);
    if (running && currentAudio) {
      skipNextGuideEffectRef.current = true;
      await playGuideClip(currentAudio);
    }
  };

  const playOrSwitchSound = async (key?: SoundKey, volumeOverride?: number) => {
    const picked = SOUNDS.find((item) => item.key === (key ?? soundKey)) ?? SOUNDS[0];
    const nextVolume = volumeOverride ?? baseSoundVolume;

    if (soundObjRef.current) {
      try {
        const status = await soundObjRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundObjRef.current.stopAsync();
          await soundObjRef.current.unloadAsync();
        }
      } catch {
        // Ignore stale unloaded sound instances.
      }
      setSoundObj(null);
    }

    const { sound } = await Audio.Sound.createAsync(picked.src, {
      isLooping: true,
      shouldPlay: true,
      volume: isMuted ? 0 : nextVolume,
    });

    await sound.setStatusAsync({
      shouldPlay: true,
      isLooping: true,
      volume: isMuted ? 0 : nextVolume,
      positionMillis: 0,
    });

    setSoundObj(sound);
    setSoundPlaying(true);
    setSoundKey(picked.key);
  };

  const updateBaseSoundVolume = async (value: number) => {
    setBaseSoundVolume(value);
    if (!soundObjRef.current) return;
    try {
      const st = await soundObjRef.current.getStatusAsync();
      if (st.isLoaded) {
        await soundObjRef.current.setVolumeAsync(isMuted ? 0 : value);
      }
    } catch {
      // Ignore stale unloaded sound instances.
    }
  };

  const stopBaseSound = async () => {
    if (!soundObjRef.current) return;
    try {
      const st = await soundObjRef.current.getStatusAsync();
      if (st.isLoaded) {
        await soundObjRef.current.stopAsync();
        await soundObjRef.current.unloadAsync();
      }
    } catch {
      // Ignore stale unloaded sound instances.
    } finally {
      soundObjRef.current = null;
      setSoundObj(null);
      setSoundPlaying(false);
      setSoundKey('default');
    }
  };

  const addOrToggleSound = async (key: SoundKey) => {
    try {
      const existing = activeSoundsRef.current.find((item) => item.key === key);
      if (existing) {
        try {
          const st = await existing.sound.getStatusAsync();
          if (st.isLoaded) {
            await existing.sound.stopAsync();
            await existing.sound.unloadAsync();
          }
        } catch {
          // Ignore stale unloaded sound instances.
        }

        const next = activeSoundsRef.current.filter((item) => item.key !== key);
        activeSoundsRef.current = next;
        setActiveSounds(next);
        await saveSoundPrefs(next.map((item) => ({ key: item.key, volume: item.volume })));
        return;
      }

      if (activeSoundsRef.current.length >= 6) return;

      if (soundObjRef.current) {
        await stopBaseSound();
      }

      const picked = SOUNDS.find((item) => item.key === key);
      if (!picked) return;

      const { sound } = await Audio.Sound.createAsync(picked.src, {
        isLooping: true,
        shouldPlay: true,
        volume: isMuted ? 0 : 0.7,
      });

      await sound.setStatusAsync({
        shouldPlay: true,
        isLooping: true,
        volume: isMuted ? 0 : 0.7,
        positionMillis: 0,
      });

      const next = [...activeSoundsRef.current, { key, sound, volume: 0.7 }];
      activeSoundsRef.current = next;
      setActiveSounds(next);
      await saveSoundPrefs(next.map((item) => ({ key: item.key, volume: item.volume })));
    } catch (error) {
      Alert.alert('Sound Error', String(error));
    }
  };

  const updateSoundVolume = async (key: SoundKey, value: number) => {
    const item = activeSoundsRef.current.find((entry) => entry.key === key);
    if (!item) return;
    try {
      const st = await item.sound.getStatusAsync();
      if (st.isLoaded) {
        await item.sound.setVolumeAsync(isMuted ? 0 : value);
      }
    } catch {
      // Ignore stale unloaded sound instances.
    }

    const next = activeSoundsRef.current.map((entry) => (
      entry.key === key ? { ...entry, volume: value } : entry
    ));
    activeSoundsRef.current = next;
    setActiveSounds(next);
    await saveSoundPrefs(next.map((entry) => ({ key: entry.key, volume: entry.volume })));
  };

  const stopAllActiveSounds = async () => {
    for (const item of activeSoundsRef.current) {
      try {
        const st = await item.sound.getStatusAsync();
        if (st.isLoaded) {
          await item.sound.stopAsync();
          await item.sound.unloadAsync();
        }
      } catch {
        // Ignore stale unloaded sound instances.
      }
    }

    activeSoundsRef.current = [];
    setActiveSounds([]);
    await saveSoundPrefs([]);
  };

  const startTappingSession = async () => {
    setCompleted(false);
    const intro = isSpanish ? TAPPING_INTRO.es : TAPPING_INTRO.en;
    if (guideEnabled) {
      await playGuideClip(intro, { waitForCompletion: true });
    }
    setRunning(true);
    if (!soundObjRef.current && activeSoundsRef.current.length === 0) {
      await playOrSwitchSound();
    }
  };

  const advanceStep = async () => {
    if (!running) {
      await startTappingSession();
      return;
    }

    if (stepIndex < TAPPING_STEPS.length - 1) {
      setStepIndex((value) => value + 1);
      return;
    }

    clearAutoAdvanceTimeout();
    setCompleted(true);
    setRunning(false);
    if (guideEnabled) {
      const outro = isSpanish ? TAPPING_OUTRO.es : TAPPING_OUTRO.en;
      await playGuideClip(outro);
    } else {
      await stopGuideClip();
    }
  };

  const jumpToStep = async (nextIndex: number) => {
    clearAutoAdvanceTimeout();
    setCompleted(false);
    setStepIndex(nextIndex);

    if (running && guideEnabled) {
      const nextStep = TAPPING_STEPS[nextIndex];
      const nextAudio = (isSpanish ? nextStep.audio.es : nextStep.audio.en) ?? nextStep.audio.en;
      if (nextAudio) {
        skipNextGuideEffectRef.current = true;
        await playGuideClip(nextAudio);
      }
    } else if (guideEnabled) {
      await stopGuideClip();
    }
  };

  const buttonLabel = completed
    ? (isSpanish ? 'Empezar de nuevo' : 'Start Again')
    : running
      ? (isSpanish ? 'Pausar tapping' : 'Pause Tapping')
      : stepIndex > 0
        ? (isSpanish ? 'Continuar tapping' : 'Resume Tapping')
        : (isSpanish ? 'Empieza' : 'Start Tapping');

  const handlePrimaryAction = async () => {
    try {
      if (completed) {
        await resetSession();
        return;
      }
      if (running) {
        clearAutoAdvanceTimeout();
        setRunning(false);
        await stopGuideClip();
        return;
      }
      if (stepIndex > 0) {
        setRunning(true);
        if (guideEnabled && currentAudio) {
          skipNextGuideEffectRef.current = true;
          await playGuideClip(currentAudio);
        }
        return;
      }
      await startTappingSession();
    } catch (error: any) {
      Alert.alert('Audio Error', error?.message ?? 'Could not play tapping guide.');
    }
  };

  const bodyCopy = completed
    ? (isSpanish
      ? 'Haz una pausa. Nota tu respiración y cómo se siente tu cuerpo ahora.'
      : 'Take a pause. Notice your breathing and how your body feels now.')
    : step.body[isSpanish ? 'es' : 'en'];

  return (
    <ImageBackground source={currentBg.src} style={s.bg} imageStyle={s.bgImage} blurRadius={8}>
      <LinearGradient colors={['rgba(2,8,35,0.68)', 'rgba(3,12,48,0.82)']} style={s.overlay}>
        <SafeAreaView edges={['top']} style={s.topSafeArea}>
          <View style={s.topRow}>
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name='chevron-back' size={28} color='white' />
            </TouchableOpacity>

            <View style={s.headerTitleWrap}>
              <Text style={s.headerEyebrow} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.84}>
                {isSpanish ? 'Guía de tapping' : 'Tapping Guide'}
              </Text>
              <Text style={s.headerTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.84}>
                {isSpanish ? 'Sesión' : 'Session'}
              </Text>
            </View>

            <View style={s.topRightActions}>
              <TouchableOpacity
                style={[s.iconBtn, hasAnySoundSelected && !isMuted && s.iconBtnActiveGreen]}
                onPress={() => void toggleMute()}
              >
                <Ionicons
                  name={isMuted ? 'volume-mute-outline' : 'volume-high-outline'}
                  size={20}
                  color={hasAnySoundSelected && !isMuted ? '#8BFFB7' : '#fff'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  s.iconBtn,
                  guidePlaying && s.iconBtnActiveGreen,
                  !guidePlaying && guideEnabled && s.iconBtnActivePurple,
                ]}
                onPress={() => void toggleGuide()}
              >
                <Image
                  source={require('../assets/images/icon-talk.png')}
                  style={[
                    s.guideIconImage,
                    { tintColor: guidePlaying ? '#8BFFB7' : guideEnabled ? '#BDA8FF' : '#fff' },
                  ]}
                  resizeMode='contain'
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={s.iconBtn}
                onPress={() => {
                  setCustomizeTab('sounds');
                  setShowCustomize(true);
                }}
              >
                <Ionicons name='musical-notes-outline' size={20} color={hasAnySoundSelected ? '#BDA8FF' : '#fff'} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView
          style={s.centerScroll}
          contentContainerStyle={[s.centerWrap, compact && s.centerWrapCompact]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[s.imagePanel, { width: imageWidth }]}>
            <Image
              source={completed ? require('../assets/tapping/images/end.png') : step.image}
              style={[s.stepImage, { height: imageHeight }]}
              resizeMode='cover'
            />
            <View style={s.progressRow}>
              <View style={s.progressPill}>
                <Text style={s.progressPillText}>{progress}</Text>
              </View>
              <TouchableOpacity style={s.infoBtnFloating} onPress={() => setShowInfo(true)}>
                <Text style={s.infoBtnFloatingText}>i</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.copyWrap}>
            <Text style={s.stepTitle} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.84}>
              {completed ? (isSpanish ? 'Sesión completada' : 'Session completed') : step.title[isSpanish ? 'es' : 'en']}
            </Text>
            <Text style={s.stepBody} numberOfLines={4} ellipsizeMode='tail'>
              {bodyCopy}
            </Text>
          </View>

          <View style={s.progressGrid}>
            {[TAPPING_STEPS.slice(0, 5), TAPPING_STEPS.slice(5)].map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={s.progressGridRow}>
                {row.map((item, itemIndex) => {
                  const index = rowIndex === 0 ? itemIndex : itemIndex + 5;
                  const active = index === stepIndex;
                  const done = index < stepIndex || completed;

                  return (
                    <React.Fragment key={item.id}>
                      <TouchableOpacity
                        style={[s.progressNode, active && s.progressNodeActive, done && s.progressNodeDone]}
                        onPress={() => void jumpToStep(index)}
                        activeOpacity={0.8}
                      >
                        <Text style={[s.progressNodeText, (active || done) && s.progressNodeTextActive]}>{item.id}</Text>
                      </TouchableOpacity>
                      {itemIndex < row.length - 1 ? (
                        <View style={[s.progressConnector, (done || active) && s.progressConnectorActive]} />
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </View>
            ))}
          </View>

        </ScrollView>

        <View style={s.controlsWrap}>
          {completed ? (
            <Text style={s.completionBadge}>{isSpanish ? 'Bien hecho' : 'Well done!'}</Text>
          ) : null}
          <TouchableOpacity style={s.primaryBtn} onPress={() => void handlePrimaryAction()}>
            <Text style={s.primaryBtnText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78}>
              {buttonLabel}
            </Text>
          </TouchableOpacity>
        </View>

        <BottomNav active='tapping' navigate={(screen) => navigation.navigate(screen)} />

        <Modal visible={showInfo} animationType='slide' transparent onRequestClose={() => setShowInfo(false)}>
          <View style={s.modalWrap}>
            <View style={s.modalCard}>
              <View style={s.modalHeader}>
                <View style={s.modalHeaderSpacer} />
                <Text style={s.modalTitle}>{isSpanish ? 'Mapa de tapping' : 'Tapping map'}</Text>
                <TouchableOpacity onPress={() => setShowInfo(false)} style={s.modalCloseBtn}>
                  <Ionicons name='close' size={24} color='white' />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={require('../assets/tapping/images/info.png')} style={s.infoImage} resizeMode='contain' />
                <Text style={s.infoBody}>
                  {isSpanish
                    ? 'Sigue los puntos en orden y repite una frase corta que te ayude a regularte. Puedes avanzar manualmente a tu ritmo.'
                    : 'Follow the points in order and repeat a short phrase that helps you regulate. You can move forward manually at your own pace.'}
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal visible={showCustomize} animationType='slide' transparent onRequestClose={() => setShowCustomize(false)}>
          <View style={s.modalWrap}>
            <View style={s.modalCard}>
              <View style={s.modalHeader}>
                <View style={s.modalHeaderSpacer} />
                <Text style={s.modalTitle}>Customize</Text>
                <TouchableOpacity onPress={() => setShowCustomize(false)} style={s.modalCloseBtn}>
                  <Ionicons name='close' size={24} color='white' />
                </TouchableOpacity>
              </View>

              <View style={s.segmentWrap}>
                <TouchableOpacity
                  style={[s.segmentBtn, customizeTab === 'backgrounds' && s.segmentBtnActive]}
                  onPress={() => setCustomizeTab('backgrounds')}
                >
                  <Text style={[s.segmentTxt, customizeTab === 'backgrounds' && s.segmentTxtActive]}>Backgrounds</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.segmentBtn, customizeTab === 'sounds' && s.segmentBtnActive]}
                  onPress={() => setCustomizeTab('sounds')}
                >
                  <Text style={[s.segmentTxt, customizeTab === 'sounds' && s.segmentTxtActive]}>Sounds</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.modalScrollContent}>
                {customizeTab === 'backgrounds' ? (
                  <>
                    <Text style={s.sectionTitle}>Choose a Background</Text>
                    <View style={s.grid}>
                      {BREATH_BACKGROUNDS.map((bg) => (
                        <TouchableOpacity
                          key={bg.key}
                          style={s.bgItem}
                          onPress={async () => {
                            setBgKey(bg.key);
                            await saveBreathBackgroundKey(bg.key);
                          }}
                        >
                          <Image
                            source={failedBackgroundThumbs[bg.key] ? BREATH_BACKGROUND_FALLBACK_SRC : bg.src}
                            style={[s.bgThumb, bgKey === bg.key && s.bgThumbActive]}
                            onError={() => {
                              setFailedBackgroundThumbs((current) => (
                                current[bg.key] ? current : { ...current, [bg.key]: true }
                              ));
                            }}
                          />
                          <Text style={s.bgLabel}>{bg.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={s.sectionTitle}>Choose a Sound</Text>
                    {!soundObj && activeSounds.length === 0 ? (
                      <Text style={s.sectionSubTitle}>Current Sound: Default</Text>
                    ) : null}

                    {soundObj && activeSounds.length === 0 && currentSound ? (
                      <>
                        <Text style={s.sectionSubTitle}>Current Sound</Text>
                        <View style={s.selectedSoundsWrap}>
                          <View style={s.selectedSoundRow}>
                            <Image source={currentSound.icon} style={s.selectedSoundIcon} />
                            <View style={s.selectedSoundCopy}>
                              <Text style={s.selectedSoundLabel}>{currentSound.label}</Text>
                              <Slider
                                style={s.slider}
                                minimumValue={0}
                                maximumValue={1}
                                step={0.05}
                                value={baseSoundVolume}
                                onValueChange={(v) => void updateBaseSoundVolume(v)}
                                minimumTrackTintColor='#9D8CFF'
                                maximumTrackTintColor='rgba(255,255,255,0.4)'
                                thumbTintColor='#E7DEFF'
                              />
                            </View>
                            <TouchableOpacity onPress={() => void stopBaseSound()}>
                              <Ionicons name='close-circle' size={22} color='#D9DFFF' />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    ) : null}

                    {activeSounds.length > 0 ? (
                      <>
                        <Text style={s.sectionSubTitle}>Selected Sounds ({activeSounds.length}/6)</Text>
                        <View style={s.selectedSoundsWrap}>
                          {activeSounds.map((active) => {
                            const soundMeta = SOUNDS.find((snd) => snd.key === active.key);
                            if (!soundMeta) return null;
                            return (
                              <View key={active.key} style={s.selectedSoundRow}>
                                <Image source={soundMeta.icon} style={s.selectedSoundIcon} />
                                <View style={s.selectedSoundCopy}>
                                  <Text style={s.selectedSoundLabel}>{soundMeta.label}</Text>
                                  <Slider
                                    style={s.slider}
                                    minimumValue={0}
                                    maximumValue={1}
                                    step={0.05}
                                    value={active.volume}
                                    onValueChange={(v) => void updateSoundVolume(active.key, v)}
                                    minimumTrackTintColor='#9D8CFF'
                                    maximumTrackTintColor='rgba(255,255,255,0.4)'
                                    thumbTintColor='#E7DEFF'
                                  />
                                </View>
                                <TouchableOpacity onPress={() => void addOrToggleSound(active.key)}>
                                  <Ionicons name='close-circle' size={22} color='#D9DFFF' />
                                </TouchableOpacity>
                              </View>
                            );
                          })}
                        </View>

                        <TouchableOpacity style={s.stopAllBtn} onPress={() => void stopAllActiveSounds()}>
                          <Text style={s.stopAllTxt}>Stop All</Text>
                        </TouchableOpacity>
                      </>
                    ) : null}

                    <View style={s.soundGrid}>
                      {SOUNDS.map((sound) => {
                        const selected = soundObj ? sound.key === soundKey : activeSounds.some((item) => item.key === sound.key);
                        return (
                          <TouchableOpacity
                            key={sound.key}
                            style={[s.soundItem, selected && s.soundItemActive]}
                            onPress={() => void addOrToggleSound(sound.key)}
                          >
                            <Image source={sound.icon} style={s.soundIcon} />
                            <Text style={s.soundLabel}>{sound.label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: 'cover' },
  overlay: { flex: 1, paddingHorizontal: 16 },
  topSafeArea: { paddingTop: 6 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  backBtn: {
    width: 34,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitleWrap: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEyebrow: {
    color: 'rgba(226,233,255,0.82)',
    fontSize: 13,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  topRightActions: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.49)',
  },
  iconBtnActiveGreen: {
    borderColor: 'rgba(139,255,183,0.75)',
    backgroundColor: 'rgba(102,224,156,0.2)',
  },
  iconBtnActivePurple: {
    borderColor: 'rgba(189,168,255,0.75)',
    backgroundColor: 'rgba(140,110,255,0.22)',
  },
  guideIconImage: {
    width: 18,
    height: 18,
  },
  centerScroll: { flex: 1 },
  centerWrap: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  centerWrapCompact: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  imagePanel: {
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(160,182,255,0.38)',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: 'rgba(53,78,125,0.42)',
    shadowColor: '#06143B',
    shadowOpacity: 0.34,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    overflow: 'hidden',
  },
  stepImage: {
    width: '100%',
    borderRadius: 24,
    alignSelf: 'center',
  },
  progressPill: {
    minWidth: 78,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(83,71,160,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(233,223,255,0.4)',
  },
  progressPillText: {
    color: '#F4F6FF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  progressRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: -18,
  },
  copyWrap: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  stepBody: {
    color: '#DCE8FF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 320,
    fontWeight: '500',
  },
  progressGrid: {
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 10,
  },
  progressGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNode: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(20,34,70,0.84)',
    borderWidth: 1,
    borderColor: 'rgba(112,139,198,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#07142E',
    shadowOpacity: 0.26,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  progressNodeActive: {
    backgroundColor: '#8AF2D2',
    borderColor: '#B7FFE9',
  },
  progressNodeDone: {
    backgroundColor: 'rgba(93,122,194,0.52)',
    borderColor: 'rgba(155,186,255,0.72)',
  },
  progressNodeText: {
    color: '#F4F7FF',
    fontSize: 16,
    fontWeight: '800',
  },
  progressNodeTextActive: {
    color: '#14312B',
  },
  progressConnector: {
    width: 12,
    height: 2,
    backgroundColor: 'rgba(129,151,198,0.58)',
    marginHorizontal: 2,
    borderRadius: 999,
  },
  progressConnectorActive: {
    backgroundColor: 'rgba(137,242,209,0.86)',
  },
  infoBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.38)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  infoBtnText: {
    color: '#ECF2FF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: -1,
  },
  infoBtnFloating: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233,223,255,0.4)',
    backgroundColor: 'rgba(83,71,160,0.88)',
  },
  infoBtnFloatingText: {
    color: '#F4F6FF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  controlsWrap: {
    marginTop: 6,
    marginBottom: 18,
  },
  completionBadge: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  primaryBtn: {
    height: 58,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124,122,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.49)',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  modalWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(3,8,28,0.72)',
  },
  modalCard: {
    maxHeight: '86%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(8,17,46,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(172,192,255,0.26)',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 22,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalHeaderSpacer: {
    width: 36,
    height: 36,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  modalScrollContent: {
    paddingBottom: 24,
  },
  segmentWrap: {
    flexDirection: 'row',
    borderRadius: 18,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 18,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(157,140,255,0.28)',
  },
  segmentTxt: {
    color: '#BFC9EA',
    fontSize: 14,
    fontWeight: '700',
  },
  segmentTxtActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  sectionSubTitle: {
    color: '#BFC9EA',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bgItem: {
    width: '31%',
    marginBottom: 12,
  },
  bgThumb: {
    width: '100%',
    height: 106,
    borderRadius: 12,
  },
  bgThumbActive: {
    borderWidth: 3,
    borderColor: '#8B7BFF',
  },
  bgLabel: {
    color: '#DFE7FF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  selectedSoundsWrap: {
    gap: 10,
    marginBottom: 14,
  },
  selectedSoundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 18,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  selectedSoundIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  selectedSoundCopy: {
    flex: 1,
  },
  selectedSoundLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    height: 30,
  },
  stopAllBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    marginBottom: 16,
  },
  stopAllTxt: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  soundItem: {
    width: '30%',
    minWidth: 90,
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  soundItemActive: {
    borderColor: 'rgba(157,140,255,0.9)',
    backgroundColor: 'rgba(157,140,255,0.18)',
  },
  soundIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 8,
  },
  soundLabel: {
    color: '#E8EEFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoImage: {
    width: '100%',
    height: 520,
  },
  infoBody: {
    color: '#DCE8FF',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 6,
  },
});
