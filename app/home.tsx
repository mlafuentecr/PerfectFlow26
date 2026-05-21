import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import AppCard from '../components/AppCard';
import BottomNav from '../components/BottomNav';
import { auth } from '../services/firebase';
import { useI18n } from '../services/i18n';
import { getProfileName } from '../services/profile';
import { getCurrentStreak, getWeekCompletion } from '../services/streak';
import { BREATH_BACKGROUNDS, getBreathBackgroundKey } from '../services/breathingPrefs';

type Props = NativeStackScreenProps<RootStackParamList, 'home'>;

export default function HomeScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [streak, setStreak] = useState(0);
  const [week, setWeek] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [heroBgKey, setHeroBgKey] = useState<(typeof BREATH_BACKGROUNDS)[number]['key']>('mountain');
  const { t } = useI18n();

  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      const localName = await getProfileName();
      const googleName = auth.currentUser?.displayName?.trim() ?? '';
      setName(localName || googleName);
      setStreak(await getCurrentStreak());
      setWeek(await getWeekCompletion());
      setHeroBgKey(await getBreathBackgroundKey());
    });
    return unsub;
  }, [navigation]);

  const heroBg = BREATH_BACKGROUNDS.find((b) => b.key === heroBgKey) ?? BREATH_BACKGROUNDS[0];

  return (
    <LinearGradient colors={['#020D35', '#041A5E', '#041746']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.c}>
        <View style={s.greetWrap}>
          <Text style={s.greet}>{t('greeting')}{name ? `, ${name}` : ''}</Text>
          <Text style={s.helper}>{t('motivator')}</Text>
        </View>

        <Pressable style={s.heroCard} onPress={() => navigation.navigate('breathing')}>
          <ImageBackground source={heroBg.src} style={s.heroImage} imageStyle={s.heroImageStyle}>
            <LinearGradient
              colors={['rgba(5,15,48,0.92)', 'rgba(8,22,62,0.72)', 'rgba(8,22,62,0.15)']}
              locations={[0, 0.62, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={s.heroOverlay}
            >
              <View style={s.heroContent}>
                <Text style={s.heroTitle}>Breathe and Reset</Text>
                <Text style={s.heroDesc}>Take a mindful breath and reset your mood.</Text>
                <View style={s.heroBtn}>
                  <Text style={s.heroBtnText}>{t('startBreathing')}</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        <AppCard title={t('dailyInsight')} description={t('dailyInsightDesc')} onPress={() => navigation.navigate('insights')} />
        <View style={s.quickHeaderRow}>
          <Text style={s.quickTitle}>Quick Sessions</Text>
          <Pressable onPress={() => navigation.navigate('sessions')}>
            <Text style={s.quickViewAll}>View all</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.quickRow}>
          <Pressable style={[s.quickCard, s.quickCardStress]} onPress={() => navigation.navigate('sessions')}>
            <View style={s.quickIconWrap}>
              <Ionicons name='cloudy-night-outline' size={26} color='#B6B7FF' />
            </View>
            <Text style={s.quickCardTitle}>Stress</Text>
            <Text style={s.quickCardTime}>5 min</Text>
          </Pressable>

          <Pressable style={[s.quickCard, s.quickCardAnxiety]} onPress={() => navigation.navigate('sessions')}>
            <View style={s.quickIconWrap}>
              <Ionicons name='water-outline' size={26} color='#8DE2E8' />
            </View>
            <Text style={s.quickCardTitle}>Anxiety</Text>
            <Text style={s.quickCardTime}>5 min</Text>
          </Pressable>

          <Pressable style={[s.quickCard, s.quickCardFocus]} onPress={() => navigation.navigate('breathing', { technique: 'Box Breathing' })}>
            <View style={s.quickIconWrap}>
              <Ionicons name='radio-button-on-outline' size={26} color='#C8B3FF' />
            </View>
            <Text style={s.quickCardTitle}>Focus</Text>
            <Text style={s.quickCardTime}>10 min</Text>
          </Pressable>

          <Pressable style={[s.quickCard, s.quickCardSleep]} onPress={() => navigation.navigate('sessions')}>
            <View style={s.quickIconWrap}>
              <Ionicons name='moon-outline' size={26} color='#D9CCFF' />
            </View>
            <Text style={s.quickCardTitle}>Sleep</Text>
            <Text style={s.quickCardTime}>15 min</Text>
          </Pressable>
        </ScrollView>
        <View style={s.streakCard}>
          <View style={s.streakHeaderRow}>
            <Text style={s.streakTitle}>Your streak</Text>
            {streak >= 2 ? (
              <Text style={s.streakCountInline}>
                {streak} days in a row
              </Text>
            ) : null}
          </View>
          <View style={s.weekRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
              <View key={`${d}-${idx}`} style={s.dayWrap}>
                <View style={[s.dayDot, week[idx] && s.dayDotDone]} />
                <Text style={s.dayLabel}>{d}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNav active='home' navigate={(screen) => navigation.navigate(screen)} />
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  c: { padding: 20, paddingTop: 56, paddingBottom: 24 },
  greetWrap: { marginBottom: 16 },
  greet: { color: '#fff', fontSize: 26, fontWeight: '700' },
  helper: { color: '#D6DEFF', fontSize: 16, marginTop: 6 },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.49)',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  heroImage: { minHeight: 220, justifyContent: 'flex-end' },
  heroImageStyle: { borderRadius: 16 },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  heroContent: { width: '60%' },
  heroTitle: { color: '#fff', fontSize: 30, fontWeight: '700' },
  heroDesc: { color: '#D6DEFF', marginTop: 8, fontSize: 17, lineHeight: 24, maxWidth: 290 },
  heroBtn: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(118,109,255,0.55)',
    shadowColor: '#6E74FF',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  heroBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  quickHeaderRow: {
    marginTop: 2,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  quickViewAll: { color: '#8D7BFF', fontSize: 16, fontWeight: '500' },
  quickRow: { paddingBottom: 14, gap: 10 },
  quickCard: {
    width: 106,
    minHeight: 168,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(135,154,255,0.45)',
    backgroundColor: 'rgba(20,45,110,0.45)',
    paddingHorizontal: 12,
    paddingBottom: 14,
    marginRight: 10,
    justifyContent: 'flex-end'
  },
  quickCardStress: { backgroundColor: 'rgba(42,72,153,0.43)' },
  quickCardAnxiety: { backgroundColor: 'rgba(20,95,126,0.38)' },
  quickCardFocus: { backgroundColor: 'rgba(58,43,124,0.45)' },
  quickCardSleep: { backgroundColor: 'rgba(55,39,120,0.42)' },
  quickIconWrap: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  quickCardTitle: { color: '#fff', fontSize: 17, fontWeight: '500' },
  quickCardTime: { color: '#C7D3FB', marginTop: 4, fontSize: 12 },
  streakCard: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.49)',
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  streakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  streakTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  streakCountInline: { color: '#D9E2FF', fontSize: 14, fontWeight: '600' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayWrap: { alignItems: 'center', width: 30 },
  dayDot: {
    width: 16,
    height: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 5,
  },
  dayDotDone: { backgroundColor: '#81FFB6', borderColor: '#81FFB6' },
  dayLabel: { color: '#C8D4FA', fontSize: 11 },
});
