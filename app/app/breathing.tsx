import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import Slider from '@react-native-community/slider';
import BreathingCircle from '../components/BreathingCircle';
import BottomNav from '../components/BottomNav';
import { markTodaySessionDone } from '../services/streak';
import { useI18n } from '../services/i18n';
import {
  BREATH_BACKGROUNDS,
  getBreathBackgroundKey,
  saveBreathBackgroundKey,
  type BreathBackgroundKey,
} from '../services/breathingPrefs';
import { getSoundPrefs, saveSoundPrefs } from '../services/soundPrefs';

type TechniqueName = 'Box Breathing' | '4-7-8 Breathing' | 'Coherent Breathing' | 'Calm Reset' | 'Wim Hof';
type PhaseName = 'Inhale' | 'Exhale' | 'Hold';

const DEFAULT_SESSION_OPTIONS = [3, 5, 10, 15] as const;
const WIM_HOF_ROUND_OPTIONS = [2, 3, 4] as const;
const WIM_HOF_BREATHS_PER_ROUND = 35;
const WIM_HOF_EMPTY_HOLD_SECONDS = 60;
const WIM_HOF_RECOVERY_HOLD_SECONDS = 15;

const TECHNIQUES: Record<TechniqueName, { pattern: { name: PhaseName; seconds: number }[] }> = {
  'Box Breathing': {
    pattern: [
      { name: 'Inhale', seconds: 4 },
      { name: 'Hold', seconds: 4 },
      { name: 'Exhale', seconds: 4 },
      { name: 'Hold', seconds: 4 },
    ],
  },
  '4-7-8 Breathing': {
    pattern: [
      { name: 'Inhale', seconds: 4 },
      { name: 'Hold', seconds: 7 },
      { name: 'Exhale', seconds: 8 },
    ],
  },
  'Coherent Breathing': {
    pattern: [
      { name: 'Inhale', seconds: 5 },
      { name: 'Exhale', seconds: 5 },
    ],
  },
  'Calm Reset': {
    pattern: [
      { name: 'Inhale', seconds: 4 },
      { name: 'Exhale', seconds: 6 },
    ],
  },
  'Wim Hof': {
    pattern: [
      { name: 'Inhale', seconds: 2 },
      { name: 'Exhale', seconds: 2 },
      { name: 'Hold', seconds: WIM_HOF_EMPTY_HOLD_SECONDS },
      { name: 'Inhale', seconds: 2 },
      { name: 'Hold', seconds: WIM_HOF_RECOVERY_HOLD_SECONDS },
      { name: 'Exhale', seconds: 2 },
    ],
  },
};

const TECHNIQUE_INFO: Record<TechniqueName, string> = {
  'Box Breathing': 'Box Breathing: 4s inhale + 4s hold + 4s exhale + 4s hold',
  '4-7-8 Breathing': '4-7-8 Breathing: 4s inhale + 7s hold + 8s exhale',
  'Coherent Breathing': 'Coherent Breathing: 5s inhale + 5s exhale',
  'Calm Reset': 'Calm Reset: 4s inhale + 6s exhale',
  'Wim Hof': 'Wim Hof: 35 breaths with recovery and hold rounds',
};

const BACKGROUNDS = BREATH_BACKGROUNDS;

const SOUNDS = [
  { key: 'ocean', label: 'Ocean Waves', icon: require('../images/icons_sounds/ocean_1.png'), src: require('../sounds/ocean_1.mp3') },
  { key: 'ocean2', label: 'Ocean 2', icon: require('../images/icons_sounds/ocean_2.png'), src: require('../sounds/ocean_2.mp3') },
  { key: 'ocean3', label: 'Ocean 3', icon: require('../images/icons_sounds/ocean_3.png'), src: require('../sounds/ocean_3.mp3') },
  { key: 'ocean4', label: 'Ocean 4', icon: require('../images/icons_sounds/ocean_4.png'), src: require('../sounds/ocean_4.mp3') },
  { key: 'rain', label: 'Rain', icon: require('../images/icons_sounds/rain_1.png'), src: require('../sounds/rain_1.mp3') },
  { key: 'rain2', label: 'Rain 2', icon: require('../images/icons_sounds/rain_2.png'), src: require('../sounds/rain_2.mp3') },
  { key: 'rain3', label: 'Rain 3', icon: require('../images/icons_sounds/rain_3.png'), src: require('../sounds/rain_3.mp3') },
  { key: 'rain4', label: 'Rain 4', icon: require('../images/icons_sounds/rain_4.png'), src: require('../sounds/rain_4.mp3') },
  { key: 'rain5', label: 'Rain 5', icon: require('../images/icons_sounds/rain_5.png'), src: require('../sounds/rain_5.mp3') },
  { key: 'rain6', label: 'Rain 6', icon: require('../images/icons_sounds/rain_6.png'), src: require('../sounds/rain_6.mp3') },
  { key: 'wind', label: 'Wind', icon: require('../images/icons_sounds/wind_1.png'), src: require('../sounds/wind_1.mp3') },
  { key: 'wind2', label: 'Wind 2', icon: require('../images/icons_sounds/wind_2.png'), src: require('../sounds/wind_2.mp3') },
  { key: 'wind3', label: 'Wind 3', icon: require('../images/icons_sounds/wind_3.png'), src: require('../sounds/wind_3.mp3') },
  { key: 'forest', label: 'Forest', icon: require('../images/icons_sounds/forest_1.png'), src: require('../sounds/forest_1.mp3') },
  { key: 'water1', label: 'Water Stream', icon: require('../images/icons_sounds/water_1.png'), src: require('../sounds/water_1.mp3') },
  { key: 'water2', label: 'Water Flow', icon: require('../images/icons_sounds/water_2.png'), src: require('../sounds/water_2.mp3') },
  { key: 'waterfall', label: 'Waterfall', icon: require('../images/icons_sounds/waterfall.png'), src: require('../sounds/waterfall.mp3') },
  { key: 'bird1', label: 'Birds 1', icon: require('../images/icons_sounds/bird_1.png'), src: require('../sounds/bird_1.mp3') },
  { key: 'bird2', label: 'Birds 2', icon: require('../images/icons_sounds/bird_2.png'), src: require('../sounds/bird_2.mp3') },
  { key: 'bird3', label: 'Birds 3', icon: require('../images/icons_sounds/bird_3.png'), src: require('../sounds/bird_3.mp3') },
  { key: 'bird4', label: 'Birds 4', icon: require('../images/icons_sounds/bird_4.png'), src: require('../sounds/bird_4.mp3') },
  { key: 'cricket1', label: 'Crickets 1', icon: require('../images/icons_sounds/cricket_1.png'), src: require('../sounds/cricket_1.mp3') },
  { key: 'cricket2', label: 'Crickets 2', icon: require('../images/icons_sounds/cricket_2.png'), src: require('../sounds/cricket_2.mp3') },
  { key: 'fire1', label: 'Fire 1', icon: require('../images/icons_sounds/fire_1.png'), src: require('../sounds/fire_1.mp3') },
  { key: 'fire2', label: 'Fire 2', icon: require('../images/icons_sounds/fire_2.png'), src: require('../sounds/fire_2.mp3') },
  { key: 'frog', label: 'Frog', icon: require('../images/icons_sounds/frog_1.png'), src: require('../sounds/frog_1.mp3') },
  { key: 'grass', label: 'Grass', icon: require('../images/icons_sounds/grass.png'), src: require('../sounds/grass.mp3') },
  { key: 'whale', label: 'Whale', icon: require('../images/icons_sounds/whale.png'), src: require('../sounds/whale.mp3') },
  { key: 'meditation', label: 'Meditation', icon: require('../images/icons_sounds/meditation.png'), src: require('../sounds/meditation.mp3') },
  { key: 'bell2', label: 'Bell', icon: require('../images/icons_sounds/bell.png'), src: require('../sounds/bell2.mp3') },
] as const;

const GUIDE_AUDIO = {
  en: {
    intro: require('../assets/sounds/audio-guide/intro.mp3'),
    wimHofIntro: require('../assets/sounds/audio-guide/winhof-intro.wav'),
    steps: {
      Inhale: require('../assets/sounds/audio-guide/Inhale.mp3'),
      Exhale: require('../assets/sounds/audio-guide/Exhale.mp3'),
      Hold: require('../assets/sounds/audio-guide/Hold.mp3'),
    },
    numbers: {
      1: require('../assets/sounds/audio-guide/One.mp3'),
      2: require('../assets/sounds/audio-guide/Two.mp3'),
      3: require('../assets/sounds/audio-guide/three.mp3'),
      4: require('../assets/sounds/audio-guide/four.mp3'),
      5: require('../assets/sounds/audio-guide/five.mp3'),
      6: require('../assets/sounds/audio-guide/six.mp3'),
      7: require('../assets/sounds/audio-guide/seven.mp3'),
      8: require('../assets/sounds/audio-guide/eight.mp3'),
      9: require('../assets/sounds/audio-guide/Nine.mp3'),
      10: require('../assets/sounds/audio-guide/ten.mp3'),
    } as Record<number, any>,
    done: require('../assets/sounds/audio-guide/you-did-it.mp3'),
    feel: require('../assets/sounds/audio-guide/how-do-you-feel.mp3'),
  },
  es: {
    intro: require('../assets/sounds/audio-guide/es/es-intro.mp3'),
    wimHofIntro: require('../assets/sounds/audio-guide/es/winhof-intro-es.wav'),
    steps: {
      Inhale: require('../assets/sounds/audio-guide/es/Inhale.mp3'),
      Exhale: require('../assets/sounds/audio-guide/es/Exhale.mp3'),
      Hold: require('../assets/sounds/audio-guide/es/hold.mp3'),
    },
    numbers: {
      1: require('../assets/sounds/audio-guide/es/uno.mp3'),
      2: require('../assets/sounds/audio-guide/es/dos.mp3'),
      3: require('../assets/sounds/audio-guide/es/tres.mp3'),
      4: require('../assets/sounds/audio-guide/es/cuatro.mp3'),
      5: require('../assets/sounds/audio-guide/es/cinco.mp3'),
      6: require('../assets/sounds/audio-guide/es/seis.mp3'),
      7: require('../assets/sounds/audio-guide/es/siete.mp3'),
      8: require('../assets/sounds/audio-guide/es/ocho.mp3'),
      9: require('../assets/sounds/audio-guide/es/nueve.mp3'),
      10: require('../assets/sounds/audio-guide/es/diez.mp3'),
    } as Record<number, any>,
    done: require('../assets/sounds/audio-guide/es/lo-hiciste.mp3'),
    feel: require('../assets/sounds/audio-guide/es/como te sientes.mp3'),
  },
} as const;

const GUIDE_INTRO_OFFSET_FALLBACK_MS = 5000;
const GUIDE_INTRO_END_BUFFER_MS = 400;

export default function BreathingScreen({ navigation, route }: any) {
  const { language } = useI18n();
  const [technique, setTechnique] = useState<TechniqueName>(route.params?.technique || '4-7-8 Breathing');
  const [showTechniqueMenu, setShowTechniqueMenu] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [customizeTab, setCustomizeTab] = useState<'backgrounds' | 'sounds'>('sounds');

  const [bgKey, setBgKey] = useState<BreathBackgroundKey>('mountain');
  const [soundKey, setSoundKey] = useState<(typeof SOUNDS)[number]['key'] | 'default'>('default');

  const pattern = useMemo(() => TECHNIQUES[technique].pattern, [technique]);
  const isWimHof = technique === 'Wim Hof';
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [left, setLeft] = useState(pattern[0].seconds);
  const [sessionMinutes, setSessionMinutes] = useState<(typeof DEFAULT_SESSION_OPTIONS)[number]>(5);
  const [sessionLeft, setSessionLeft] = useState(5 * 60);
  const [completed, setCompleted] = useState(false);
  const [wimHofRounds, setWimHofRounds] = useState<(typeof WIM_HOF_ROUND_OPTIONS)[number]>(3);
  const [wimHofRoundIndex, setWimHofRoundIndex] = useState(1);
  const [wimHofBreathCount, setWimHofBreathCount] = useState(1);

  const [soundObj, setSoundObj] = useState<Audio.Sound | null>(null);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [baseSoundVolume, setBaseSoundVolume] = useState(0.65);
  const [guideObj, setGuideObj] = useState<Audio.Sound | null>(null);
  const [guidePlaying, setGuidePlaying] = useState(false);
  const [guideEnabled, setGuideEnabled] = useState(true);
  const [guidedMode, setGuidedMode] = useState(false);
  const [guideSyncPending, setGuideSyncPending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSounds, setActiveSounds] = useState<Array<{ key: (typeof SOUNDS)[number]['key']; sound: Audio.Sound; volume: number }>>([]);
  const isSpanish = String(language).toLowerCase().startsWith('es');
  const stepLabel = (name: string) => {
    if (!isSpanish) return name;
    if (name === 'Ready') return 'Listo';
    if (name === 'Inhale') return 'Inhala';
    if (name === 'Exhale') return 'Exhala';
    if (name === 'Hold') return 'Sostén';
    return name;
  };
  const showTechniqueInfo = () => {
    Alert.alert(technique, TECHNIQUE_INFO[technique]);
  };

  const currentBg = BACKGROUNDS.find((b) => b.key === bgKey) ?? BACKGROUNDS[0];
  const currentSound = SOUNDS.find((s) => s.key === soundKey) ?? null;
  const hasAnySoundSelected = activeSounds.length > 0 || !!soundObj;
  const sessionActive = running || guideSyncPending;
  const [guideStartTimeout, setGuideStartTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const soundObjRef = useRef<Audio.Sound | null>(null);
  const guideObjRef = useRef<Audio.Sound | null>(null);
  const activeSoundsRef = useRef<Array<{ key: (typeof SOUNDS)[number]['key']; sound: Audio.Sound; volume: number }>>([]);
  const guideStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guideCompletionResolverRef = useRef<(() => void) | null>(null);
  const guideLaunchTokenRef = useRef(0);
  const guideCueKeyRef = useRef<string>('');
  const sessionVersionRef = useRef(0);

  useEffect(() => {
    soundObjRef.current = soundObj;
  }, [soundObj]);

  useEffect(() => {
    guideObjRef.current = guideObj;
  }, [guideObj]);

  useEffect(() => {
    activeSoundsRef.current = activeSounds;
  }, [activeSounds]);

  useEffect(() => {
    guideStartTimeoutRef.current = guideStartTimeout;
  }, [guideStartTimeout]);

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
    (async () => {
      setBgKey(await getBreathBackgroundKey());
      // Keep persistence storage but avoid auto-loading sounds on mount
      // to prevent startup freezes on some devices/emulators.
      await getSoundPrefs();
    })();
  }, []);

  const resetSessionUi = async () => {
    sessionVersionRef.current += 1;
    guideLaunchTokenRef.current += 1;
    if (guideStartTimeoutRef.current) {
      clearTimeout(guideStartTimeoutRef.current);
      guideStartTimeoutRef.current = null;
    }
    setGuideStartTimeout(null);
    setGuideSyncPending(false);
    setRunning(false);
    setCompleted(false);
    setGuidePlaying(false);
    setGuidedMode(false);
    guideCueKeyRef.current = '';
    await stopGuideClip();
  };

  const finishSession = async (sessionVersion = sessionVersionRef.current) => {
    if (sessionVersion !== sessionVersionRef.current) return;
    setRunning(false);
    setCompleted(true);
    await markTodaySessionDone();
    if (sessionVersion !== sessionVersionRef.current) return;
    if (soundObjRef.current) {
      try {
        const st = await soundObjRef.current.getStatusAsync();
        if (st.isLoaded) await soundObjRef.current.stopAsync();
      } catch {
        // Ignore stale unloaded sound instances.
      }
      setSoundPlaying(false);
    }
    if (guideObjRef.current) {
      try {
        const st = await guideObjRef.current.getStatusAsync();
        if (st.isLoaded) await guideObjRef.current.stopAsync();
      } catch {
        // Ignore stale unloaded sound instances.
      }
      setGuidePlaying(false);
      setGuidedMode(false);
    }
    for (const item of activeSoundsRef.current) {
      try {
        const st = await item.sound.getStatusAsync();
        if (st.isLoaded) await item.sound.stopAsync();
      } catch {
        // Ignore stale unloaded sound instances.
      }
    }
  };

  useEffect(() => {
    sessionVersionRef.current += 1;
    setPhaseIndex(0);
    setLeft(pattern[0].seconds);
    setRunning(false);
    setCompleted(false);
    setWimHofRoundIndex(1);
    setWimHofBreathCount(1);
    setSessionLeft(isWimHof ? 0 : sessionMinutes * 60);
  }, [pattern, isWimHof, sessionMinutes, wimHofRounds]);

  useEffect(() => {
    let timer: any;
    if (running && !showTechniqueMenu) {
      timer = setInterval(() => {
        setLeft((v) => {
          if (v <= 1) {
            if (isWimHof) {
              const currentPhase = pattern[phaseIndex];
              const nextPhase = pattern[phaseIndex + 1];
              const currentSessionVersion = sessionVersionRef.current;

              if (currentPhase.name === 'Inhale') {
                if (nextPhase) {
                  setPhaseIndex(phaseIndex + 1);
                  return nextPhase.seconds;
                }
                void finishSession(currentSessionVersion);
                return 0;
              }

              if (currentPhase.name === 'Exhale' && phaseIndex === 1) {
                if (wimHofBreathCount >= WIM_HOF_BREATHS_PER_ROUND) {
                  if (nextPhase) {
                    setPhaseIndex(phaseIndex + 1);
                    return nextPhase.seconds;
                  }
                  void finishSession(currentSessionVersion);
                  return 0;
                }
                setWimHofBreathCount((count) => count + 1);
                setPhaseIndex(0);
                return pattern[0].seconds;
              }

              if (currentPhase.name === 'Hold') {
                if (nextPhase) {
                  setPhaseIndex(phaseIndex + 1);
                  return nextPhase.seconds;
                }
                void finishSession(currentSessionVersion);
                return 0;
              }

              if (currentPhase.name === 'Exhale') {
                if (wimHofRoundIndex >= wimHofRounds) {
                  void finishSession(currentSessionVersion);
                  return 0;
                }

                setWimHofRoundIndex((round) => round + 1);
                setWimHofBreathCount(1);
                setPhaseIndex(0);
                return pattern[0].seconds;
              }
            }

            setPhaseIndex((x) => {
              const next = (x + 1) % pattern.length;
              return next;
            });
            return pattern[(phaseIndex + 1) % pattern.length].seconds;
          }
          return v - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [running, pattern, phaseIndex, showTechniqueMenu, isWimHof, wimHofBreathCount, wimHofRoundIndex, wimHofRounds]);

  useEffect(() => {
    let sessionTimer: any;
    if (!isWimHof && running && sessionLeft > 0 && !showTechniqueMenu) {
      sessionTimer = setInterval(() => {
        setSessionLeft((v) => (v > 0 ? v - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(sessionTimer);
  }, [running, sessionLeft, showTechniqueMenu, isWimHof]);

  useEffect(() => {
    if (isWimHof || sessionLeft !== 0 || completed) return;
    const finish = async () => {
      await finishSession();
    };
    void finish();
  }, [sessionLeft, completed, isWimHof]);

  useEffect(() => {
    if (isWimHof) return;
    setSessionLeft(sessionMinutes * 60);
  }, [sessionMinutes, isWimHof]);

  useEffect(() => {
    setLeft(pattern[phaseIndex].seconds);
  }, [phaseIndex, pattern]);

  useEffect(() => {
    return () => {
      if (guideStartTimeoutRef.current) clearTimeout(guideStartTimeoutRef.current);
      if (soundObjRef.current) void soundObjRef.current.unloadAsync().catch(() => {});
      if (guideObjRef.current) void guideObjRef.current.unloadAsync().catch(() => {});
      activeSoundsRef.current.forEach((item) => {
        void item.sound.unloadAsync().catch(() => {});
      });
    };
  }, []);

  const playOrSwitchSound = async (key?: (typeof SOUNDS)[number]['key']) => {
    const picked = SOUNDS.find((s) => s.key === (key ?? soundKey)) ?? SOUNDS[0];

    if (soundObj) {
      await soundObj.stopAsync();
      await soundObj.unloadAsync();
      setSoundObj(null);
    }

    const { sound } = await Audio.Sound.createAsync(picked.src, {
      isLooping: true,
      shouldPlay: true,
      volume: baseSoundVolume,
    });
    await sound.setStatusAsync({ shouldPlay: true, isLooping: true, volume: baseSoundVolume, positionMillis: 0 });
    setSoundObj(sound);
    setSoundPlaying(true);
    setSoundKey(picked.key);
    setIsMuted(false);
  };

  const toggleSound = async () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (soundObj) {
      try {
        const st = await soundObj.getStatusAsync();
        if (st.isLoaded) {
          await soundObj.setVolumeAsync(nextMuted ? 0 : baseSoundVolume);
          if (!nextMuted && !st.isPlaying) await soundObj.playAsync();
        }
      } catch {
        // Ignore stale unloaded sound instances.
      }
    }
    if (guideObj) {
      await guideObj.setVolumeAsync(nextMuted ? 0 : 0.85);
    }

    for (const item of activeSounds) {
      try {
        const st = await item.sound.getStatusAsync();
        if (!st.isLoaded) continue;
        await item.sound.setVolumeAsync(nextMuted ? 0 : item.volume);
        if (!nextMuted && !st.isPlaying) await item.sound.playAsync();
      } catch {
        // Ignore stale unloaded sound instances.
      }
    }
  };

  const updateBaseSoundVolume = async (value: number) => {
    setBaseSoundVolume(value);
    if (!soundObj) return;
    try {
      const st = await soundObj.getStatusAsync();
      if (st.isLoaded) {
        await soundObj.setVolumeAsync(isMuted ? 0 : value);
      }
    } catch {
      // Ignore stale unloaded sound instances.
    }
  };

  const stopBaseSound = async () => {
    if (!soundObj) return;
    try {
      const st = await soundObj.getStatusAsync();
      if (st.isLoaded) {
        await soundObj.stopAsync();
        await soundObj.unloadAsync();
      }
    } catch {
      // Ignore stale unloaded sound instances.
    } finally {
      setSoundObj(null);
      setSoundPlaying(false);
    }
  };

  const getGuideLang = (): 'en' | 'es' => (
    String(language).toLowerCase().startsWith('es') ? 'es' : 'en'
  );

  const stopGuideClip = async () => {
    if (!guideObjRef.current) return;
    try {
      const st = await guideObjRef.current.getStatusAsync();
      if (st.isLoaded) {
        await guideObjRef.current.stopAsync();
        await guideObjRef.current.unloadAsync();
      }
    } catch {
      // Ignore stale unloaded sound instances.
    } finally {
      guideCompletionResolverRef.current?.();
      guideCompletionResolverRef.current = null;
      guideObjRef.current = null;
      setGuideObj(null);
    }
  };

  const playGuideClip = async (
    src: any,
    options?: { interrupt?: boolean; volume?: number; waitForCompletion?: boolean },
  ): Promise<number> => {
    const interrupt = options?.interrupt ?? true;
    const volume = options?.volume ?? 0.95;
    const waitForCompletion = options?.waitForCompletion ?? false;
    if (interrupt) {
      await stopGuideClip();
    }
    const finishedPromise = waitForCompletion
      ? new Promise<void>((resolve) => {
          guideCompletionResolverRef.current = resolve;
        })
      : null;
    const { sound, status } = await Audio.Sound.createAsync(src, {
      shouldPlay: true,
      isLooping: false,
      volume: isMuted ? 0 : volume,
    });
    guideObjRef.current = sound;
    setGuideObj(sound);
    setGuidePlaying(true);
    sound.setOnPlaybackStatusUpdate((playStatus) => {
      if (!playStatus.isLoaded) return;
      if (playStatus.didJustFinish) {
        void sound.unloadAsync().catch(() => {});
        if (guideObjRef.current === sound) {
          guideObjRef.current = null;
          setGuideObj(null);
        }
        guideCompletionResolverRef.current?.();
        guideCompletionResolverRef.current = null;
      }
    });
    if (finishedPromise) {
      await finishedPromise;
    }
    if (status.isLoaded && typeof status.durationMillis === 'number') {
      return status.durationMillis;
    }
    return 0;
  };

  const startGuidedSession = async () => {
    const launchToken = ++guideLaunchTokenRef.current;
    const lang = getGuideLang();
    const pack = GUIDE_AUDIO[lang];
    const introClip = isWimHof ? pack.wimHofIntro : pack.intro;

    setGuidedMode(true);
    setGuidePlaying(true);
    setGuideSyncPending(true);
    guideCueKeyRef.current = '';
    if (isMuted) setIsMuted(false);

    const introMs = await playGuideClip(introClip, { waitForCompletion: true });
    if (launchToken !== guideLaunchTokenRef.current) return;
    const delayMs = introMs > 0 ? GUIDE_INTRO_END_BUFFER_MS : GUIDE_INTRO_OFFSET_FALLBACK_MS;

    if (guideStartTimeoutRef.current) clearTimeout(guideStartTimeoutRef.current);
    const timeout = setTimeout(() => {
      setCompleted(false);
      setPhaseIndex(0);
      setLeft(pattern[0].seconds);
      setWimHofRoundIndex(1);
      setWimHofBreathCount(1);
      setSessionLeft(isWimHof ? 0 : sessionMinutes * 60);
      setRunning(true);
      setGuideSyncPending(false);
    }, delayMs);
    setGuideStartTimeout(timeout);
  };

  const toggleGuide = async () => {
    try {
      if (guideEnabled) {
        guideLaunchTokenRef.current += 1;
        if (guideStartTimeoutRef.current) clearTimeout(guideStartTimeoutRef.current);
        setGuideStartTimeout(null);
        setGuideSyncPending(false);
        setGuideEnabled(false);
        setGuidedMode(false);
        setGuidePlaying(false);
        guideCueKeyRef.current = '';
        await stopGuideClip();
        return;
      }

      setGuideEnabled(true);
      await startGuidedSession();
    } catch (error: any) {
      console.error('toggleGuide error', error);
      Alert.alert('Audio Error', error?.message ?? 'Could not play voice guide.');
    }
  };

  useEffect(() => {
    if (!guideEnabled || !guidedMode || !running || showTechniqueMenu || guideSyncPending || completed) return;
    const phase = pattern[phaseIndex];
    const cueKey = `${phaseIndex}:${left}`;
    if (guideCueKeyRef.current === cueKey) return;
    guideCueKeyRef.current = cueKey;

    const lang = getGuideLang();
    const pack = GUIDE_AUDIO[lang];

    const playCue = async () => {
      try {
        if (left === phase.seconds) {
          const stepClip = pack.steps[phase.name as 'Inhale' | 'Exhale' | 'Hold'];
          if (stepClip) {
            await playGuideClip(stepClip, { volume: 0.95 });
            return;
          }
        }
        if (isWimHof && (phase.name === 'Inhale' || phase.name === 'Exhale')) {
          return;
        }
        const numberClip = pack.numbers[left];
        if (numberClip) {
          await playGuideClip(numberClip, { volume: 0.7 });
        }
      } catch (error) {
        console.error('guide cue error', error);
      }
    };

    void playCue();
  }, [guideEnabled, guidedMode, running, showTechniqueMenu, guideSyncPending, completed, pattern, phaseIndex, left, language, isWimHof]);

  useEffect(() => {
    if (!completed || !guideEnabled) return;
    const lang = getGuideLang();
    const pack = GUIDE_AUDIO[lang];
    const playEnd = async () => {
      try {
        await playGuideClip(pack.done);
        setTimeout(() => {
          void playGuideClip(pack.feel);
        }, 900);
      } catch (error) {
        console.error('guide ending cue error', error);
      }
    };
    void playEnd();
  }, [completed, guideEnabled, language]);

  const addOrToggleSound = async (key: (typeof SOUNDS)[number]['key']) => {
    try {
      const existing = activeSounds.find((item) => item.key === key);
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
        const next = activeSounds.filter((item) => item.key !== key);
        setActiveSounds(next);
        await saveSoundPrefs(next.map((x) => ({ key: x.key, volume: x.volume })));

        // If no layered sounds remain, also stop the legacy base loop to avoid ghost audio.
        if (next.length === 0 && soundObj) {
          try {
            const baseStatus = await soundObj.getStatusAsync();
            if (baseStatus.isLoaded) {
              await soundObj.stopAsync();
              await soundObj.unloadAsync();
            }
          } catch {
            // Ignore stale unloaded sound instances.
          } finally {
            setSoundObj(null);
            setSoundPlaying(false);
          }
        }
        return;
      }

      if (activeSounds.length >= 6) return;

      const picked = SOUNDS.find((s) => s.key === key);
      if (!picked) return;

      // Stop base loop when user starts using layered sound mixer.
      if (soundObj) {
        try {
          const baseStatus = await soundObj.getStatusAsync();
          if (baseStatus.isLoaded) {
            await soundObj.stopAsync();
            await soundObj.unloadAsync();
          }
        } catch {
          // Ignore stale unloaded sound instances.
        } finally {
          setSoundObj(null);
          setSoundPlaying(false);
        }
      }

      const { sound } = await Audio.Sound.createAsync(picked.src, {
        isLooping: true,
        shouldPlay: true,
        volume: 0.7,
      });
      await sound.setStatusAsync({ shouldPlay: true, isLooping: true, volume: 0.7, positionMillis: 0 });
      const next = [...activeSounds, { key, sound, volume: 0.7 }];
      setActiveSounds(next);
      await saveSoundPrefs(next.map((x) => ({ key: x.key, volume: x.volume })));
      setIsMuted(false);
    } catch (error) {
      console.error('addOrToggleSound error', key, error);
      Alert.alert('Sound Error', String(error));
    }
  };

  const updateSoundVolume = async (key: (typeof SOUNDS)[number]['key'], value: number) => {
    const item = activeSounds.find((x) => x.key === key);
    if (!item) return;
    try {
      const st = await item.sound.getStatusAsync();
      if (st.isLoaded) {
        await item.sound.setVolumeAsync(value);
      }
    } catch {
      // Ignore stale unloaded sound instances.
    }
    const next = activeSounds.map((x) => (x.key === key ? { ...x, volume: value } : x));
    setActiveSounds(next);
    await saveSoundPrefs(next.map((x) => ({ key: x.key, volume: x.volume })));
  };

  const stopAllActiveSounds = async () => {
    for (const item of activeSounds) {
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
    setActiveSounds([]);
    await saveSoundPrefs([]);
  };

  const sessionTimeLabel = isWimHof
    ? `${wimHofRoundIndex}/${wimHofRounds}`
    : `${String(Math.floor(sessionLeft / 60)).padStart(2, '0')}:${String(sessionLeft % 60).padStart(2, '0')}`;

  return (
    <ImageBackground source={currentBg.src} style={s.bg} imageStyle={s.bgImage} blurRadius={8}>
      <LinearGradient colors={['rgba(2,8,35,0.68)', 'rgba(3,12,48,0.82)']} style={s.overlay}>
        <SafeAreaView edges={['top']} style={s.topSafeArea}>
        <View style={s.topRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name='chevron-back' size={28} color='white' />
          </TouchableOpacity>

          <TouchableOpacity style={s.techniquePill} onPress={() => setShowTechniqueMenu((v) => !v)}>
            <Text style={s.techniquePillText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
              {technique}
            </Text>
            <Ionicons name='chevron-down' size={16} color='#D8E0FF' />
          </TouchableOpacity>

          <View style={s.topRightActions}>
            <TouchableOpacity
              style={[s.iconBtn, hasAnySoundSelected && !isMuted && s.iconBtnActiveGreen]}
              onPress={toggleSound}
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
              onPress={toggleGuide}
            >
              <Image
                source={require('../images/icon-talk.png')}
                style={[
                  s.guideIconImage,
                  {
                    tintColor: guidePlaying ? '#8BFFB7' : guideEnabled ? '#BDA8FF' : '#fff',
                  },
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
              <Ionicons
                name='options-outline'
                size={20}
                color={hasAnySoundSelected ? '#BDA8FF' : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>
        </SafeAreaView>

        {showTechniqueMenu ? (
          <View style={s.dropdown}>
            {(Object.keys(TECHNIQUES) as TechniqueName[]).map((name) => (
              <TouchableOpacity
                key={name}
                style={[s.dropdownItem, technique === name && s.dropdownItemActive]}
                onPress={async () => {
                  await resetSessionUi();
                  setTechnique(name);
                  setShowTechniqueMenu(false);
                }}
              >
                <Text style={[s.dropdownText, technique === name && s.dropdownTextActive]}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <View style={s.centerWrap}>
          {(() => {
            const rawStep = running ? pattern[phaseIndex].name : completed ? pattern[phaseIndex].name : 'Ready';
            const localizedStep = stepLabel(rawStep);
            const isWimHofBreathPhase = isWimHof && (rawStep === 'Inhale' || rawStep === 'Exhale');
            const countdownDisplay = isWimHofBreathPhase ? `${wimHofBreathCount}/${WIM_HOF_BREATHS_PER_ROUND}` : (running ? left : completed ? left : 0);
            return (
          <BreathingCircle
            step={localizedStep}
            countdown={countdownDisplay}
            duration={pattern[phaseIndex].seconds * 1000}
            isRunning={running && !showTechniqueMenu}
            completed={completed}
            doneTitle={isSpanish ? '¡Lo hiciste!' : 'You did it!'}
            doneBody={isSpanish ? '¿Cómo te sientes?' : 'How do you feel?'}
          />
            );
          })()}
        </View>

        <View style={s.controlsWrap}>
          <View style={s.timerWrap}>
            <Text style={s.timerValue}>{sessionTimeLabel}</Text>
            <Text style={s.timerLabel}>{isWimHof ? (isSpanish ? 'RONDA ACTUAL' : 'CURRENT ROUND') : 'SESSION TIME'}</Text>
            {isWimHof ? (
              <Text style={s.timerHint}>
                {isSpanish
                  ? `${wimHofBreathCount}/${WIM_HOF_BREATHS_PER_ROUND} respiraciones`
                  : `${wimHofBreathCount}/${WIM_HOF_BREATHS_PER_ROUND} breaths`}
              </Text>
            ) : null}
            <View style={s.timerOptionsRow}>
              <View style={s.timerOptionsWrap}>
                {(isWimHof ? WIM_HOF_ROUND_OPTIONS : DEFAULT_SESSION_OPTIONS).map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      s.timerOptionBtn,
                      ((isWimHof ? wimHofRounds : sessionMinutes) === option) && s.timerOptionBtnActive,
                    ]}
                    onPress={() => {
                      setRunning(false);
                      setCompleted(false);
                      setPhaseIndex(0);
                      setLeft(pattern[0].seconds);
                      if (isWimHof) {
                        setWimHofRounds(option as (typeof WIM_HOF_ROUND_OPTIONS)[number]);
                        setWimHofRoundIndex(1);
                        setWimHofBreathCount(1);
                      } else {
                        setSessionMinutes(option as (typeof DEFAULT_SESSION_OPTIONS)[number]);
                      }
                    }}
                  >
                    <Text style={[
                      s.timerOptionTxt,
                      ((isWimHof ? wimHofRounds : sessionMinutes) === option) && s.timerOptionTxtActive,
                    ]}>
                      {isWimHof ? `${option}x` : `${option}m`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={s.infoBtn} onPress={showTechniqueInfo}>
                <Text style={s.infoBtnText}>i</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[s.startBtn, sessionActive && s.startBtnPaused]}
            onPress={async () => {
              const next = !sessionActive;
              if (guideEnabled && next === false) {
                guideLaunchTokenRef.current += 1;
                await stopGuideClip();
                if (guideStartTimeoutRef.current) clearTimeout(guideStartTimeoutRef.current);
                guideStartTimeoutRef.current = null;
                setGuideStartTimeout(null);
                setGuideSyncPending(false);
                setRunning(false);
                setGuidePlaying(false);
                setGuidedMode(false);
              }
              if (completed) {
                setCompleted(false);
                setSessionLeft(isWimHof ? 0 : sessionMinutes * 60);
                setPhaseIndex(0);
                setLeft(pattern[0].seconds);
                setWimHofRoundIndex(1);
                setWimHofBreathCount(1);
                guideCueKeyRef.current = '';
              }
              if (next && guideEnabled) {
                await startGuidedSession();
              } else {
                setRunning(next);
              }
              if (next && !soundObj && activeSounds.length === 0) await playOrSwitchSound();
            }}
          >
            <Text style={s.startBtnText}>{sessionActive ? 'Pause' : 'Start'}</Text>
          </TouchableOpacity>

        </View>

        <BottomNav active='breathing' navigate={(screen) => navigation.navigate(screen)} />
      </LinearGradient>

      <Modal visible={showCustomize} animationType='slide' transparent>
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {customizeTab === 'backgrounds' ? (
                <>
                  <Text style={s.sectionTitle}>Choose a Background</Text>
                  <View style={s.grid}>
                    {BACKGROUNDS.map((bg) => (
                      <TouchableOpacity
                        key={bg.key}
                        style={s.bgItem}
                        onPress={async () => {
                          setBgKey(bg.key);
                          await saveBreathBackgroundKey(bg.key);
                        }}
                      >
                        <Image source={bg.src} style={[s.bgThumb, bgKey === bg.key && s.bgThumbActive]} />
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
                          <View style={{ flex: 1 }}>
                            <Text style={s.selectedSoundLabel}>{currentSound.label}</Text>
                            <Slider
                              style={{ width: '100%', height: 30 }}
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
                              <View style={{ flex: 1 }}>
                                <Text style={s.selectedSoundLabel}>{soundMeta.label}</Text>
                                <Slider
                                  style={{ width: '100%', height: 30 }}
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
                    {SOUNDS.map((snd) => (
                      <TouchableOpacity
                        key={snd.key}
                        style={[
                          s.soundItem,
                          activeSounds.some((a) => a.key === snd.key) && s.soundItemActive,
                          soundObj && activeSounds.length === 0 && soundKey === snd.key && s.soundItemActive,
                        ]}
                        onPress={() => void (soundObj && activeSounds.length === 0 ? playOrSwitchSound(snd.key) : addOrToggleSound(snd.key))}
                      >
                        <Image source={snd.icon} style={s.soundIcon} />
                        <Text style={s.soundLabel}>{snd.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  techniquePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.49)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    flex: 1,
    minWidth: 0,
    maxWidth: 270,
  },
  techniquePillText: { color: '#fff', fontSize: 17, fontWeight: '600', flexShrink: 1 },
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
  topRightActions: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  dropdown: {
    position: 'absolute',
    top: 108,
    left: 16,
    right: 16,
    zIndex: 30,
    borderRadius: 14,
    backgroundColor: 'rgba(3,10,38,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    overflow: 'hidden',
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12 },
  dropdownItemActive: { backgroundColor: 'rgba(124,122,255,0.28)' },
  dropdownText: { color: '#D8E0FF', fontSize: 16 },
  dropdownTextActive: { color: '#fff', fontWeight: '700' },
  centerWrap: { flex: 1, justifyContent: 'center', paddingTop: 8 },
  controlsWrap: { marginTop: -18, marginBottom: 22 },
  timerWrap: { alignItems: 'center', marginBottom: 22 },
  timerValue: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 32,
    fontWeight: '500',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.26)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  timerLabel: {
    color: 'rgba(197,210,255,0.72)',
    fontSize: 11,
    letterSpacing: 2.8,
    marginTop: 1,
  },
  timerHint: {
    color: 'rgba(217,226,255,0.88)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  timerOptionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  timerOptionsWrap: { flexDirection: 'row', gap: 8 },
  timerOptionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  timerOptionBtnActive: {
    borderColor: '#8E7DFF',
    backgroundColor: 'rgba(124,122,255,0.35)',
  },
  timerOptionTxt: { color: '#D9E2FF', fontSize: 12, fontWeight: '600' },
  timerOptionTxtActive: { color: '#FFF', fontWeight: '700' },
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
  infoBtnText: { color: '#F1F4FF', fontSize: 15, fontWeight: '700' },
  startBtn: {
    backgroundColor: 'rgba(124,122,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.49)',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
  },
  startBtnPaused: {
    backgroundColor: 'rgba(139,146,166,0.7)',
    borderColor: 'rgba(228,231,239,0.55)',
  },
  startBtnText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '86%',
    backgroundColor: 'rgba(3,12,42,0.97)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalHeaderSpacer: { width: 40 },
  modalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  modalTitle: { color: '#fff', fontSize: 28, fontWeight: '700' },
  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    padding: 4,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentBtnActive: { backgroundColor: '#6D63FF' },
  segmentTxt: { color: '#CAD6FF', fontWeight: '600' },
  segmentTxtActive: { color: '#fff', fontWeight: '700' },
  sectionTitle: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 10 },
  sectionSubTitle: { color: '#CFD9FF', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  selectedSoundsWrap: { marginBottom: 12, gap: 8 },
  selectedSoundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectedSoundIcon: { width: 28, height: 28, resizeMode: 'contain' },
  selectedSoundLabel: { color: '#fff', fontWeight: '600', fontSize: 13, marginBottom: 2 },
  stopAllBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124,122,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 10,
  },
  stopAllTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  bgItem: { width: '31%', marginBottom: 12 },
  bgThumb: { width: '100%', height: 106, borderRadius: 12 },
  bgThumbActive: { borderWidth: 3, borderColor: '#8B7BFF' },
  bgLabel: { color: '#DFE7FF', marginTop: 6, textAlign: 'center', fontSize: 12 },
  soundGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  soundItem: {
    width: '30%',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
  },
  soundItemActive: { borderColor: '#8B7BFF', backgroundColor: 'rgba(123,109,255,0.2)' },
  soundIcon: { width: 32, height: 32, marginBottom: 8, resizeMode: 'contain' },
  soundLabel: { color: '#DFE7FF', fontSize: 12, textAlign: 'center' },
});
