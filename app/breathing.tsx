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

const TECHNIQUES: Record<TechniqueName, { pattern: { name: string; seconds: number }[] }> = {
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
      { name: 'Hold', seconds: 15 },
    ],
  },
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

const GUIDE_AUDIO_INTRO = {
  en: require('../assets/sounds/audio-guide/intro.mp3'),
  es: require('../assets/sounds/audio-guide/es/es-intro.mp3'),
} as const;

const GUIDE_INTRO_OFFSET_MS = 8000;

export default function BreathingScreen({ navigation, route }: any) {
  const { language } = useI18n();
  const SESSION_OPTIONS = [3, 5, 10, 15] as const;
  const [technique, setTechnique] = useState<TechniqueName>(route.params?.technique || '4-7-8 Breathing');
  const [showTechniqueMenu, setShowTechniqueMenu] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [customizeTab, setCustomizeTab] = useState<'backgrounds' | 'sounds'>('backgrounds');

  const [bgKey, setBgKey] = useState<BreathBackgroundKey>('mountain');
  const [soundKey, setSoundKey] = useState<(typeof SOUNDS)[number]['key']>('ocean');

  const pattern = useMemo(() => TECHNIQUES[technique].pattern, [technique]);
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [left, setLeft] = useState(pattern[0].seconds);
  const [sessionMinutes, setSessionMinutes] = useState<(typeof SESSION_OPTIONS)[number]>(5);
  const [sessionLeft, setSessionLeft] = useState(5 * 60);
  const [completed, setCompleted] = useState(false);

  const [soundObj, setSoundObj] = useState<Audio.Sound | null>(null);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [guideObj, setGuideObj] = useState<Audio.Sound | null>(null);
  const [guidePlaying, setGuidePlaying] = useState(false);
  const [guideTrackKey, setGuideTrackKey] = useState<string>('');
  const [guideEnabled, setGuideEnabled] = useState(false);
  const [guidedMode, setGuidedMode] = useState(false);
  const [guideSyncPending, setGuideSyncPending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSounds, setActiveSounds] = useState<Array<{ key: (typeof SOUNDS)[number]['key']; sound: Audio.Sound; volume: number }>>([]);

  const currentBg = BACKGROUNDS.find((b) => b.key === bgKey) ?? BACKGROUNDS[0];
  const currentSound = SOUNDS.find((s) => s.key === soundKey) ?? SOUNDS[0];
  const hasAnySoundSelected = activeSounds.length > 0 || !!soundObj;
  const [guideStartTimeout, setGuideStartTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const soundObjRef = useRef<Audio.Sound | null>(null);
  const guideObjRef = useRef<Audio.Sound | null>(null);
  const activeSoundsRef = useRef<Array<{ key: (typeof SOUNDS)[number]['key']; sound: Audio.Sound; volume: number }>>([]);
  const guideStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    setPhaseIndex(0);
    setLeft(pattern[0].seconds);
    setRunning(false);
    setCompleted(false);
    setSessionLeft(sessionMinutes * 60);
  }, [pattern]);

  useEffect(() => {
    let timer: any;
    if (running && !showTechniqueMenu) {
      timer = setInterval(() => {
        setLeft((v) => {
          if (v <= 1) {
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
  }, [running, pattern, phaseIndex, showTechniqueMenu]);

  useEffect(() => {
    let sessionTimer: any;
    if (running && sessionLeft > 0 && !showTechniqueMenu) {
      sessionTimer = setInterval(() => {
        setSessionLeft((v) => (v > 0 ? v - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(sessionTimer);
  }, [running, sessionLeft, showTechniqueMenu]);

  useEffect(() => {
    if (sessionLeft !== 0 || completed) return;
    const finish = async () => {
      setRunning(false);
      setCompleted(true);
      await markTodaySessionDone();
      if (soundObj) {
        await soundObj.stopAsync();
        setSoundPlaying(false);
      }
      if (guideObj) {
        try {
          const st = await guideObj.getStatusAsync();
          if (st.isLoaded) await guideObj.stopAsync();
        } catch {
          // Ignore stale unloaded sound instances.
        }
        setGuidePlaying(false);
        setGuideEnabled(false);
        setGuidedMode(false);
      }
      for (const item of activeSounds) {
        try {
          const st = await item.sound.getStatusAsync();
          if (st.isLoaded) await item.sound.stopAsync();
        } catch {
          // Ignore stale unloaded sound instances.
        }
      }
    };
    void finish();
  }, [sessionLeft, completed, soundObj, guideObj, activeSounds]);

  useEffect(() => {
    setSessionLeft(sessionMinutes * 60);
  }, [sessionMinutes]);

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
    const picked = SOUNDS.find((s) => s.key === (key ?? soundKey)) ?? currentSound;

    if (soundObj) {
      await soundObj.stopAsync();
      await soundObj.unloadAsync();
      setSoundObj(null);
    }

    const { sound } = await Audio.Sound.createAsync(picked.src, {
      isLooping: true,
      shouldPlay: true,
      volume: 0.65,
    });
    await sound.setStatusAsync({ shouldPlay: true, isLooping: true, volume: 0.65, positionMillis: 0 });
    setSoundObj(sound);
    setSoundPlaying(true);
    setIsMuted(false);
  };

  const toggleSound = async () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (soundObj) {
      try {
        const st = await soundObj.getStatusAsync();
        if (st.isLoaded) {
          await soundObj.setVolumeAsync(nextMuted ? 0 : 0.65);
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

  const toggleGuide = async () => {
    try {
      const langKey = String(language).toLowerCase().startsWith('es') ? 'es' : 'en';
      const src = GUIDE_AUDIO_INTRO[langKey as 'en' | 'es'] ?? GUIDE_AUDIO_INTRO.en;
      if (!src) return;
      const wantedKey = `${langKey}:intro`;

      const introOffset = GUIDE_INTRO_OFFSET_MS;
      const scheduleVisualStart = () => {
        if (guideStartTimeout) clearTimeout(guideStartTimeout);
        setGuideSyncPending(true);
        const timeout = setTimeout(() => {
          setCompleted(false);
          setPhaseIndex(0);
          setLeft(pattern[0].seconds);
          setSessionLeft(sessionMinutes * 60);
          setRunning(true);
          setGuideSyncPending(false);
        }, introOffset);
        setGuideStartTimeout(timeout);
      };

      if (isMuted) {
        setIsMuted(false);
      }

      if (!guideObj || guideTrackKey !== wantedKey) {
        if (guideObj) {
          await guideObj.stopAsync();
          await guideObj.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(src, {
          shouldPlay: true,
          isLooping: false,
          volume: 0.95,
        });
        await sound.setVolumeAsync(0.95);
        await sound.setStatusAsync({ shouldPlay: true, volume: 0.95, positionMillis: 0 });
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            setGuidePlaying(false);
            setGuidedMode(false);
            setGuideSyncPending(false);
            setRunning(false);
          }
        });
        setGuideObj(sound);
        setGuidePlaying(true);
        setGuideTrackKey(wantedKey);
        setGuideEnabled(true);
        setGuidedMode(true);
        scheduleVisualStart();
        return;
      }

      const status = await guideObj.getStatusAsync();
      if (!status.isLoaded) return;

      if (status.isPlaying) {
        await guideObj.pauseAsync();
        setGuidePlaying(false);
        setGuideEnabled(true);
        setGuidedMode(false);
        if (guideStartTimeout) clearTimeout(guideStartTimeout);
        setGuideSyncPending(false);
        setRunning(false);
      } else {
        await guideObj.setVolumeAsync(0.95);
        await guideObj.playAsync();
        setGuidePlaying(true);
        setGuideEnabled(true);
        setGuidedMode(true);
        if (!completed) scheduleVisualStart();
      }
    } catch (error: any) {
      console.error('toggleGuide error', error);
      Alert.alert('Audio Error', error?.message ?? 'Could not play voice guide.');
    }
  };

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
        return;
      }

      if (activeSounds.length >= 6) return;

      const picked = SOUNDS.find((s) => s.key === key);
      if (!picked) return;

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

  const sessionTimeLabel = `${String(Math.floor(sessionLeft / 60)).padStart(2, '0')}:${String(
    sessionLeft % 60
  ).padStart(2, '0')}`;

  return (
    <ImageBackground source={currentBg.src} style={s.bg} imageStyle={s.bgImage} blurRadius={8}>
      <LinearGradient colors={['rgba(2,8,35,0.68)', 'rgba(3,12,48,0.82)']} style={s.overlay}>
        <View style={s.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='chevron-back' size={28} color='white' />
          </TouchableOpacity>

          <TouchableOpacity style={s.techniquePill} onPress={() => setShowTechniqueMenu((v) => !v)}>
            <Text style={s.techniquePillText}>{technique}</Text>
            <Ionicons name='chevron-down' size={18} color='#D8E0FF' />
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
              <Ionicons
                name={guidePlaying ? 'body' : 'body-outline'}
                size={20}
                color={guidePlaying ? '#8BFFB7' : guideEnabled ? '#BDA8FF' : '#fff'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={s.iconBtn} onPress={() => setShowCustomize(true)}>
              <Ionicons
                name='options-outline'
                size={20}
                color={hasAnySoundSelected ? '#BDA8FF' : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {showTechniqueMenu ? (
          <View style={s.dropdown}>
            {(Object.keys(TECHNIQUES) as TechniqueName[]).map((name) => (
              <TouchableOpacity
                key={name}
                style={[s.dropdownItem, technique === name && s.dropdownItemActive]}
                onPress={() => {
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
          <BreathingCircle
            step={running ? pattern[phaseIndex].name : completed ? pattern[phaseIndex].name : 'Ready'}
            countdown={running ? left : completed ? left : 0}
            duration={pattern[phaseIndex].seconds * 1000}
            isRunning={running && !showTechniqueMenu}
            completed={completed}
          />
        </View>

        <View style={s.controlsWrap}>
          <View style={s.timerWrap}>
            <Text style={s.timerValue}>{sessionTimeLabel}</Text>
            <Text style={s.timerLabel}>SESSION TIME</Text>
            <View style={s.timerOptionsWrap}>
              {SESSION_OPTIONS.map((min) => (
                <TouchableOpacity
                  key={min}
                  style={[s.timerOptionBtn, sessionMinutes === min && s.timerOptionBtnActive]}
                  onPress={() => {
                    setRunning(false);
                    setCompleted(false);
                    setSessionMinutes(min);
                  }}
                >
                  <Text style={[s.timerOptionTxt, sessionMinutes === min && s.timerOptionTxtActive]}>{min}m</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[s.startBtn, running && s.startBtnPaused]}
            onPress={async () => {
              const next = !running;
              if (guidedMode && next === false) {
                if (guideObj) {
                  await guideObj.pauseAsync();
                  setGuidePlaying(false);
                  setGuidedMode(false);
                }
              }
              if (completed) {
                setCompleted(false);
                setSessionLeft(sessionMinutes * 60);
                setPhaseIndex(0);
                setLeft(pattern[0].seconds);
              }
              setRunning(next);
              if (next && !soundObj) await playOrSwitchSound();
            }}
          >
            <Text style={s.startBtnText}>{running ? 'Pause' : 'Start'}</Text>
          </TouchableOpacity>

        </View>

        <BottomNav active='breathing' navigate={(screen) => navigation.navigate(screen)} />
      </LinearGradient>

      <Modal visible={showCustomize} animationType='slide' transparent>
        <View style={s.modalWrap}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={() => setShowCustomize(false)}>
                <Ionicons name='chevron-back' size={24} color='white' />
              </TouchableOpacity>
              <Text style={s.modalTitle}>Customize</Text>
              <View style={{ width: 24 }} />
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
                        style={[s.soundItem, activeSounds.some((a) => a.key === snd.key) && s.soundItemActive]}
                        onPress={() => void addOrToggleSound(snd.key)}
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
  overlay: { flex: 1, paddingTop: 56, paddingHorizontal: 16, paddingBottom: 6 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  techniquePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.49)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  techniquePillText: { color: '#fff', fontSize: 20, fontWeight: '600' },
  iconBtn: {
    width: 40,
    height: 40,
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
  topRightActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
  timerOptionsWrap: { flexDirection: 'row', gap: 8, marginTop: 10 },
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
