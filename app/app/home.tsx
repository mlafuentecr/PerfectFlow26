import React, { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../App';
import BottomNav from '../components/BottomNav';
import ScreenBackground from '../components/ScreenBackground';
import { auth } from '../services/firebase';
import { useI18n } from '../services/i18n';
import { getProfileName } from '../services/profile';
import { getCurrentStreak, getWeekCompletion } from '../services/streak';
import { BREATH_BACKGROUNDS, getBreathBackgroundKey } from '../services/breathingPrefs';
import { GLASS_CARD_BASE, TYPE_SCALE } from '../services/uiStyles';
import {
  clearDailyReminder,
  DailyReminder,
  formatReminderTime,
  getDailyReminder,
  scheduleDailyReminder,
} from '../services/reminders';

type Props = NativeStackScreenProps<RootStackParamList, 'home'>;
type BreathTechnique = 'Box Breathing' | '4-7-8 Breathing' | 'Coherent Breathing' | 'Calm Reset' | 'Wim Hof';

const MOOD_SESSIONS: Array<{
  title: string;
  time: string;
  technique: BreathTechnique;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  gradient: [string, string];
}> = [
  { title: 'Anxiety Relief', time: '7 min', technique: '4-7-8 Breathing', icon: 'water-outline', tint: '#98E9FF', gradient: ['rgba(9,43,78,0.82)', 'rgba(21,108,143,0.44)'] },
  { title: 'Stress Reset', time: '5 min', technique: 'Calm Reset', icon: 'leaf-outline', tint: '#9FF5C4', gradient: ['rgba(11,56,67,0.84)', 'rgba(29,118,108,0.42)'] },
  { title: 'Anger Release', time: '6 min', technique: 'Box Breathing', icon: 'flame-outline', tint: '#FFB59B', gradient: ['rgba(70,23,33,0.86)', 'rgba(137,66,54,0.44)'] },
  { title: 'Overthinking Calm', time: '8 min', technique: 'Coherent Breathing', icon: 'cloud-outline', tint: '#CAD7FF', gradient: ['rgba(22,37,82,0.86)', 'rgba(74,91,152,0.42)'] },
  { title: 'Deep Focus', time: '10 min', technique: 'Box Breathing', icon: 'radio-button-on-outline', tint: '#CDB9FF', gradient: ['rgba(32,24,92,0.87)', 'rgba(89,66,164,0.42)'] },
  { title: 'Sleep Wind Down', time: '12 min', technique: '4-7-8 Breathing', icon: 'moon-outline', tint: '#E1D6FF', gradient: ['rgba(31,22,82,0.86)', 'rgba(91,70,151,0.43)'] },
  { title: 'Sadness Support', time: '7 min', technique: 'Coherent Breathing', icon: 'rainy-outline', tint: '#A9CFFF', gradient: ['rgba(12,37,79,0.87)', 'rgba(59,95,159,0.44)'] },
  { title: 'Panic Reset', time: '5 min', technique: 'Calm Reset', icon: 'heart-half-outline', tint: '#FFB8CC', gradient: ['rgba(59,21,73,0.88)', 'rgba(121,57,113,0.43)'] },
  { title: 'Confidence Boost', time: '6 min', technique: 'Box Breathing', icon: 'trophy-outline', tint: '#FFD794', gradient: ['rgba(64,38,14,0.86)', 'rgba(138,98,42,0.44)'] },
  { title: 'Low Energy Reset', time: '5 min', technique: 'Wim Hof', icon: 'flash-outline', tint: '#FFF0A8', gradient: ['rgba(71,54,18,0.87)', 'rgba(146,114,44,0.44)'] },
];

const INSIGHTS: Array<{ hook: string; message: string }> = [
  { hook: 'Feeling anxious?', message: 'A slower exhale can help your body feel safer and more grounded.' },
  { hook: 'Feeling stressed?', message: 'Take 5 minutes to slow your rhythm and reset your mind.' },
  { hook: 'Need focus?', message: 'A steady breathing pattern can help clear mental noise.' },
  { hook: 'Before sleep', message: 'Slow breathing can help your body shift into rest mode.' },
  { hook: 'Mind racing?', message: 'Try inhale 4, exhale 6 for a gentler mental pace.' },
  { hook: 'Low energy?', message: 'A short active breathing cycle can wake up your attention.' },
  { hook: 'Heavy day?', message: 'One mindful minute is enough to interrupt tension.' },
  { hook: 'Need balance?', message: 'Consistent breathing creates emotional stability over time.' },
  { hook: 'Overthinking?', message: 'Return to your breath and your thoughts will soften.' },
  { hook: 'Quick reset', message: 'Breathe in calm, breathe out pressure.' },
];

const INSIGHTS_ES: Array<{ hook: string; message: string }> = [
  { hook: '¿Ansiedad?', message: 'Exhalar más lento puede ayudar a tu cuerpo a sentirse más seguro y en calma.' },
  { hook: '¿Estrés?', message: 'Toma 5 minutos para bajar el ritmo y reiniciar tu mente.' },
  { hook: '¿Necesitas enfoque?', message: 'Un patrón de respiración constante ayuda a despejar el ruido mental.' },
  { hook: 'Antes de dormir', message: 'Respirar lento ayuda a tu cuerpo a entrar en modo descanso.' },
  { hook: '¿Mente acelerada?', message: 'Prueba inhalar 4, exhalar 6 para un ritmo mental más suave.' },
  { hook: '¿Baja energía?', message: 'Un ciclo corto de respiración activa despierta tu atención.' },
  { hook: '¿Día pesado?', message: 'Un minuto consciente basta para interrumpir la tensión.' },
  { hook: '¿Necesitas equilibrio?', message: 'La respiración constante crea estabilidad emocional con el tiempo.' },
  { hook: '¿Sobrepensando?', message: 'Vuelve a tu respiración y tus pensamientos se suavizan.' },
  { hook: 'Reinicio rápido', message: 'Inhala calma, exhala presión.' },
];

const MOOD_TITLE_ES: Record<string, string> = {
  'Anxiety Relief': 'Alivio de ansiedad',
  'Stress Reset': 'Reinicio del estrés',
  'Anger Release': 'Liberar enojo',
  'Overthinking Calm': 'Calma mental',
  'Deep Focus': 'Enfoque profundo',
  'Sleep Wind Down': 'Prepararte para dormir',
  'Sadness Support': 'Apoyo emocional',
  'Panic Reset': 'Reinicio del pánico',
  'Confidence Boost': 'Impulso de confianza',
  'Low Energy Reset': 'Reinicio de energía',
};

const TECHNIQUE_ES: Record<BreathTechnique, string> = {
  'Box Breathing': 'Respiración caja',
  '4-7-8 Breathing': 'Respiración 4-7-8',
  'Coherent Breathing': 'Respiración coherente',
  'Calm Reset': 'Reinicio de calma',
  'Wim Hof': 'Wim Hof',
};

const LAST_INSIGHT_INDEX_KEY = 'pf_last_insight_index_v1';
const SECTION_GAP = 12;

export default function HomeScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [streak, setStreak] = useState(0);
  const [week, setWeek] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [heroBgKey, setHeroBgKey] = useState<(typeof BREATH_BACKGROUNDS)[number]['key']>('mountain');
  const [insightIndex, setInsightIndex] = useState(0);
  const { t, language } = useI18n();
  const { height } = useWindowDimensions();
  const compact = height < 840;
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminder, setReminder] = useState<DailyReminder | null>(null);
  const [reminderHour, setReminderHour] = useState(9);
  const [reminderMinute, setReminderMinute] = useState(0);

  const rotateInsightOnOpen = async () => {
    const raw = await AsyncStorage.getItem(LAST_INSIGHT_INDEX_KEY);
    const last = Number.isFinite(Number(raw)) ? Number(raw) : -1;
    const next = (last + 1 + INSIGHTS.length) % INSIGHTS.length;
    setInsightIndex(next);
    await AsyncStorage.setItem(LAST_INSIGHT_INDEX_KEY, String(next));
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      const localName = await getProfileName();
      const googleName = auth.currentUser?.displayName?.trim() ?? '';
      setName(localName || googleName);
      setStreak(await getCurrentStreak());
      setWeek(await getWeekCompletion());
      setHeroBgKey(await getBreathBackgroundKey());
      const savedReminder = await getDailyReminder();
      setReminder(savedReminder);
      if (savedReminder) {
        setReminderHour(savedReminder.hour);
        setReminderMinute(savedReminder.minute);
      }
    });
    return unsub;
  }, [navigation]);

  useEffect(() => {
    // Rotate insight whenever app is opened/returned to foreground.
    void rotateInsightOnOpen();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void rotateInsightOnOpen();
      }
    });
    return () => sub.remove();
  }, []);

  const heroBg = BREATH_BACKGROUNDS.find((b) => b.key === heroBgKey) ?? BREATH_BACKGROUNDS[0];
  const weekDayLabels = language === 'es' ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const insights = language === 'es' ? INSIGHTS_ES : INSIGHTS;
  const jsDay = new Date().getDay(); // Sun=0..Sat=6
  const todayIndexMonFirst = (jsDay + 6) % 7;
  const openReminderModal = () => {
    if (reminder) {
      setReminderHour(reminder.hour);
      setReminderMinute(reminder.minute);
    }
    setShowReminderModal(true);
  };

  const saveReminder = async () => {
    try {
      const saved = await scheduleDailyReminder(reminderHour, reminderMinute, language);
      setReminder(saved);
      setShowReminderModal(false);
      Alert.alert(
        language === 'es' ? 'Recordatorio activado' : 'Reminder enabled',
        language === 'es'
          ? `Se programó todos los días a las ${formatReminderTime(saved.hour, saved.minute, language)}.`
          : `Scheduled daily at ${formatReminderTime(saved.hour, saved.minute, language)}.`
      );
    } catch (error: any) {
      if (String(error?.message).includes('NOTIFICATION_PERMISSION_DENIED')) {
        Alert.alert(
          language === 'es' ? 'Permiso requerido' : 'Permission required',
          language === 'es'
            ? 'Debes permitir notificaciones para activar recordatorios.'
            : 'You must allow notifications to enable reminders.'
        );
        return;
      }
      Alert.alert(language === 'es' ? 'Error' : 'Error', String(error?.message ?? error));
    }
  };

  const removeReminder = async () => {
    await clearDailyReminder();
    setReminder(null);
    setShowReminderModal(false);
    Alert.alert(language === 'es' ? 'Recordatorio desactivado' : 'Reminder disabled');
  };

  return (
    <ScreenBackground style={s.screenBg} backgroundKey={heroBgKey} syncOnFocus={false} blurRadius={3} blurIntensity={12}>
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(99,74,190,0.18)', 'rgba(68,43,150,0.13)', 'rgba(42,24,98,0.10)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={s.bgPurpleTint}
      />
      <ScrollView
        style={s.contentScroll}
        contentContainerStyle={[s.c, compact && s.cCompact]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.topRow}>
          <View style={s.greetWrap}>
            <Text style={s.greet}>{t('greeting')}</Text>
            <Text style={s.nameText} numberOfLines={1} ellipsizeMode='tail'>
              {name || 'PerfectFlow'}
            </Text>
            <Text style={s.helper}>{t('motivator')}</Text>
          </View>
          <TouchableOpacity style={[s.reminderIconBtn, compact && s.reminderIconBtnCompact, reminder && s.reminderIconBtnActive]} onPress={openReminderModal}>
            <Ionicons name='notifications' size={22} color={reminder ? '#B9A7FF' : '#EEF3FF'} />
            {reminder ? <View style={s.reminderDot} /> : null}
          </TouchableOpacity>
        </View>

        <Pressable style={[s.heroCard, compact && s.heroCardCompact]} onPress={() => navigation.navigate('breathing')}>
          <ImageBackground source={heroBg.src} style={[s.heroImage, compact && s.heroImageCompact]} imageStyle={s.heroImageStyle}>
            <LinearGradient
              colors={['rgba(4,14,48,0.94)', 'rgba(8,22,62,0.70)', 'rgba(20,34,80,0.20)']}
              locations={[0, 0.62, 1]}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={[s.heroOverlay, compact && s.heroOverlayCompact]}
            >
              <View style={s.heroContent}>
                <Text style={s.heroTitle}>{language === 'es' ? 'Respira y reinicia' : 'Breathe and Reset'}</Text>
                <Text style={s.heroDesc}>
                  {language === 'es' ? 'Toma una respiración consciente y reinicia tu estado.' : 'Take a mindful breath and reset your mood.'}
                </Text>
                <View style={s.heroBtn}>
                  <Text style={s.heroBtnText}>{t('startBreathing')}</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <Pressable style={[s.insightCard, compact && s.insightCardCompact]} onPress={() => navigation.navigate('insights')}>
          <ImageBackground source={require('../assets/images/daily-insight.png')} style={[s.insightGradient, compact && s.insightGradientCompact]}>
            <LinearGradient
              colors={['rgba(5,15,48,0.84)', 'rgba(5,15,48,0.62)', 'rgba(5,15,48,0.20)']}
              locations={[0, 0.58, 1]}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={s.insightOverlay}
            >
              <View style={[s.insightLeft, compact && s.insightLeftCompact]}>
                <Text style={s.insightTitle}>{t('dailyInsight')}</Text>
                <Text style={s.insightHook}>{insights[insightIndex].hook}</Text>
                <Text style={s.insightMsg}>{insights[insightIndex].message}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Pressable>
        
        <View style={[s.quickHeaderRow, compact && s.quickHeaderRowCompact]}>
          <Text style={s.quickTitle}>{language === 'es' ? 'Cambia tu estado' : 'Shift Your Mood'}</Text>
          <Text style={s.quickHint}>{language === 'es' ? 'Desliza' : 'Swipe'}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[s.quickRow, compact && s.quickRowCompact]} style={[s.quickRowScroll, compact && s.quickRowScrollCompact]}>
          {MOOD_SESSIONS.map((session) => (
            <Pressable
              key={session.title}
              style={[s.quickCard, compact && s.quickCardCompact]}
              onPress={() => navigation.navigate('breathing', { technique: session.technique })}
            >
              <LinearGradient
                colors={session.gradient}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={s.quickCardGradient}
              >
                <View style={s.quickTimeBadge}>
                  <Text style={s.quickTimeBadgeText}>{session.time.replace(/\s+/g, '')}</Text>
                </View>
                <View style={s.quickIconWrap}>
                  <Ionicons name={session.icon} size={26} color={session.tint} />
                </View>
                <Text style={s.quickCardTitle}>{language === 'es' ? (MOOD_TITLE_ES[session.title] ?? session.title) : session.title}</Text>
                <Text style={s.quickCardTechnique}>{language === 'es' ? TECHNIQUE_ES[session.technique] : session.technique}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </ScrollView>
        <View style={[s.streakCard, compact && s.streakCardCompact]}>
          <View style={s.streakHeaderRow}>
            <View style={s.streakHeaderLeft}>
              <Text style={s.streakTitle}>{language === 'es' ? 'Tu racha' : 'Your Streak'}</Text>
              {streak >= 2 ? (
                <Text style={s.streakDaysText}>
                  <Text style={s.streakDaysNumber}>{streak}</Text>
                  <Text style={s.streakDaysCopy}>{language === 'es' ? ' días seguidos' : ' days in a row'}</Text>
                </Text>
              ) : (
                <Text style={s.streakDaysCopyMuted}>
                  {language === 'es' ? 'Sigue así. Tu racha empieza en 2 días.' : 'Keep going. Your streak starts at 2 days.'}
                </Text>
              )}
            </View>

            <View style={s.streakRightWrap}>
              <View style={s.streakFlame}>
                <Ionicons name='flame' size={22} color='#A882FF' />
              </View>
            </View>
          </View>

          <View style={s.weekRow}>
            {weekDayLabels.map((d, idx) => {
              const done = !!week[idx];
              const isToday = idx === todayIndexMonFirst;
              return (
                <View key={`${d}-${idx}`} style={s.dayWrap}>
                  <View style={[s.dayCircle, done && s.dayCircleDone, !done && isToday && s.dayCircleToday]}>
                    {done ? <Ionicons name='checkmark' size={16} color='#95FFBF' /> : null}
                  </View>
                  <Text style={[s.dayLabel, isToday && s.dayLabelToday]}>{d}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <BottomNav active='home' navigate={(screen) => navigation.navigate(screen)} />

      <Modal visible={showReminderModal} transparent animationType='fade' onRequestClose={() => setShowReminderModal(false)}>
        <View style={s.modalBackdrop}>
          <BlurView intensity={60} tint='dark' style={s.modalCard} experimentalBlurMethod='dimezisBlurView'>
            <Text style={s.modalTitle}>{language === 'es' ? 'Configurar recordatorio de respiración' : 'Set breathing reminder'}</Text>
            <Text style={s.modalSub}>
              {language === 'es' ? 'Escoge una hora diaria para tu sesión.' : 'Choose a daily time for your session.'}
            </Text>

            <View style={s.timePickRow}>
              <View style={s.timeBlock}>
                <TouchableOpacity style={s.timeArrowBtn} onPress={() => setReminderHour((h) => (h + 23) % 24)}>
                  <Ionicons name='chevron-up' size={18} color='#D5DEFF' />
                </TouchableOpacity>
                <Text style={s.timeValue}>{String(reminderHour).padStart(2, '0')}</Text>
                <TouchableOpacity style={s.timeArrowBtn} onPress={() => setReminderHour((h) => (h + 1) % 24)}>
                  <Ionicons name='chevron-down' size={18} color='#D5DEFF' />
                </TouchableOpacity>
                <Text style={s.timeLabel}>{language === 'es' ? 'Hora' : 'Hour'}</Text>
              </View>

              <Text style={s.timeDivider}>:</Text>

              <View style={s.timeBlock}>
                <TouchableOpacity style={s.timeArrowBtn} onPress={() => setReminderMinute((m) => (m + 55) % 60)}>
                  <Ionicons name='chevron-up' size={18} color='#D5DEFF' />
                </TouchableOpacity>
                <Text style={s.timeValue}>{String(reminderMinute).padStart(2, '0')}</Text>
                <TouchableOpacity style={s.timeArrowBtn} onPress={() => setReminderMinute((m) => (m + 5) % 60)}>
                  <Ionicons name='chevron-down' size={18} color='#D5DEFF' />
                </TouchableOpacity>
                <Text style={s.timeLabel}>{language === 'es' ? 'Min' : 'Min'}</Text>
              </View>
            </View>

            <View style={s.modalActionRow}>
              <TouchableOpacity style={s.modalGhostBtn} onPress={() => setShowReminderModal(false)}>
                <Text style={s.modalGhostTxt}>{language === 'es' ? 'Cancelar' : 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalPrimaryBtn} onPress={saveReminder}>
                <Text style={s.modalPrimaryTxt}>{language === 'es' ? 'Guardar' : 'Save'}</Text>
              </TouchableOpacity>
            </View>

            {reminder ? (
              <TouchableOpacity style={s.modalRemoveBtn} onPress={removeReminder}>
                <Text style={s.modalRemoveTxt}>{language === 'es' ? 'Quitar recordatorio' : 'Remove reminder'}</Text>
              </TouchableOpacity>
            ) : null}
          </BlurView>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const s = StyleSheet.create({
  screenBg: { flex: 1 },
  bgPurpleTint: { ...StyleSheet.absoluteFillObject },
  contentScroll: { flex: 1 },
  c: { paddingHorizontal: 16, paddingTop: 46, paddingBottom: 10 },
  cCompact: { paddingTop: 36, paddingBottom: 8 },
  topRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greetWrap: { maxWidth: '80%', paddingRight: 8 },
  greet: { color: '#CEDBFF', fontSize: 15, fontWeight: '500', letterSpacing: 0.2 },
  nameText: { color: '#F7FAFF', fontSize: 24, lineHeight: 34, fontWeight: '800', marginTop: 3, letterSpacing: -0.3 },
  helper: { color: '#C2D1F7', fontSize: 14, marginTop: 2, fontWeight: '500' },
  reminderIconBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(175,170,255,0.7)',
    backgroundColor: 'rgba(83,77,157,0.32)',
    shadowColor: '#6E6AFF',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  reminderIconBtnCompact: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  reminderIconBtnActive: {
    borderColor: 'rgba(193,171,255,0.95)',
    backgroundColor: 'rgba(121,93,228,0.34)',
  },
  reminderDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#C0A9FF',
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(166,191,255,0.42)',
    backgroundColor: 'rgba(13,21,58,0.45)',
    marginBottom: SECTION_GAP,
    overflow: 'hidden',
    shadowColor: '#061034',
    shadowOpacity: 0.34,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 10 },
  },
  heroCardCompact: { marginBottom: 10 },
  heroImage: { minHeight: 184, justifyContent: 'flex-end' },
  heroImageCompact: { minHeight: 156 },
  heroImageStyle: { borderRadius: 28 },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
  },
  heroOverlayCompact: { padding: 12 },
  heroContent: { width: '78%', minHeight: 0 },
  heroTitle: { color: '#F5F8FF', fontSize: 20, fontWeight: '800', letterSpacing: -0.2 },
  heroDesc: { color: '#DCE7FF', marginTop: 8, fontSize: 14, lineHeight: 20, maxWidth: 300, fontWeight: '500' },
  heroBtn: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(186,170,255,0.92)',
    backgroundColor: 'rgba(104,95,232,0.92)',
    shadowColor: '#7A70FF',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  heroBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  insightCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(150,175,255,0.42)',
    backgroundColor: 'rgba(8,18,52,0.48)',
    marginBottom: SECTION_GAP,
    overflow: 'hidden',
    shadowColor: '#060E2C',
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  insightCardCompact: { marginBottom: 10 },
  insightGradient: {
    minHeight: 142,
    justifyContent: 'center',
  },
  insightGradientCompact: { minHeight: 128 },
  insightOverlay: {
    flex: 1,
    justifyContent: 'center',
  },
  insightLeft: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    paddingRight: 48,
    justifyContent: 'center',
  },
  insightLeftCompact: { paddingHorizontal: 16, paddingVertical: 12, paddingRight: 38 },
  insightTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 6, letterSpacing: -0.2 },
  insightHook: { color: '#9E8BFF', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  insightMsg: { color: '#D6E2FF', fontSize: 14, lineHeight: 20, maxWidth: 370, fontWeight: '500' },
  quickHeaderRow: {
    marginTop: 0,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickHeaderRowCompact: { marginBottom: 4 },
  quickTitle: { color: '#F5F8FF', fontSize: 17, fontWeight: '800', marginTop: 0, letterSpacing: -0.1, flexShrink: 1 },
  quickHint: { color: '#9A84FF', fontSize: 16, fontWeight: '700' },
  quickRowScroll: {
    minHeight: 142,
    marginBottom: SECTION_GAP,
    flexShrink: 0,
  },
  quickRowScrollCompact: { minHeight: 134, marginBottom: 8, flexShrink: 0 },
  quickRow: {
    paddingTop: 0,
    paddingBottom: 2,
    gap: 12,
    paddingRight: 8,
    alignItems: 'stretch',
  },
  quickRowCompact: { paddingBottom: 4 },
  quickCard: {
    width: 116,
    height: 136,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(155,178,255,0.44)',
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    overflow: 'hidden',
    shadowColor: '#050F30',
    shadowOpacity: 0.34,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  quickCardCompact: { width: 116, height: 126, borderRadius: 18 },
  quickCardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  quickIconWrap: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  quickTimeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(7,16,46,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(199,215,255,0.35)',
  },
  quickTimeBadgeText: { color: '#E7EFFF', fontSize: 11, fontWeight: '700' },
  quickCardTitle: { color: '#F6F8FF', fontSize: 14, fontWeight: '700', lineHeight: 17, marginTop: 4 },
  quickCardTechnique: { color: '#B7C7F8', marginTop: 2, fontSize: 12, lineHeight: 14, marginBottom: 0, fontWeight: '500' },
  streakCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(156,176,255,0.44)',
    backgroundColor: 'rgba(10,20,56,0.52)',
    marginTop: 0,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    shadowColor: '#08143A',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  streakCardCompact: { paddingTop: 10, paddingBottom: 8 },
  streakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  streakHeaderLeft: { flex: 1, paddingRight: 12 },
  streakTitle: { color: '#F5F8FF', fontSize: 20, fontWeight: '800', letterSpacing: -0.2 },
  streakDaysText: { marginTop: 2 },
  streakDaysNumber: { color: '#9C83FF', fontSize: 28, fontWeight: '800' },
  streakDaysCopy: { color: '#E2E9FF', fontSize: 15, fontWeight: '500' },
  streakDaysCopyMuted: { color: '#CBD7FB', fontSize: 14, lineHeight: 18, marginTop: 6, fontWeight: '500' },
  streakRightWrap: { alignItems: 'center', justifyContent: 'center' },
  streakFlame: {
    width: 42,
    height: 42,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(174,146,255,0.8)',
    backgroundColor: 'rgba(98,67,209,0.36)',
    shadowColor: '#8D74FF',
    shadowOpacity: 0.44,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  dayWrap: { alignItems: 'center', width: 34 },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(175,201,255,0.5)',
    backgroundColor: 'rgba(91,117,167,0.20)',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleDone: {
    borderColor: 'rgba(138,255,190,0.72)',
    backgroundColor: 'rgba(57,102,95,0.45)',
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: '#9A80FF',
    backgroundColor: 'rgba(110,76,209,0.25)',
  },
  dayLabel: { color: '#C8D4FA', fontSize: TYPE_SCALE.subtitle, marginTop: 1, fontWeight: '500' },
  dayLabelToday: { color: '#A690FF', fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(1,6,20,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    ...GLASS_CARD_BASE,
    width: '100%',
    maxWidth: 360,
    padding: 18,
    borderColor: 'rgba(188,202,255,0.52)',
    backgroundColor: 'rgba(12,19,52,0.36)',
    shadowColor: '#08143A',
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  modalSub: { color: '#C8D6FF', fontSize: 13, marginTop: 6 },
  timePickRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  timeBlock: { alignItems: 'center' },
  timeArrowBtn: {
    width: 34,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValue: { color: '#fff', fontSize: 30, fontWeight: '800', marginVertical: 6, minWidth: 52, textAlign: 'center' },
  timeLabel: { color: '#AFC0F2', fontSize: 12, marginTop: 2 },
  timeDivider: { color: '#fff', fontSize: 26, fontWeight: '700', marginTop: -14 },
  modalActionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, gap: 10 },
  modalGhostBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  modalGhostTxt: { color: '#D7E2FF', fontSize: 14, fontWeight: '700' },
  modalPrimaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(124,122,255,0.55)',
  },
  modalPrimaryTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  modalRemoveBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalRemoveTxt: { color: '#FFB9C6', fontSize: 13, fontWeight: '700' },
});
