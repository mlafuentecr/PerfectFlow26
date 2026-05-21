import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
import ScreenBackground from '../components/ScreenBackground';
import { BREATH_BACKGROUNDS, getBreathBackgroundKey } from '../services/breathingPrefs';
import { useI18n } from '../services/i18n';
import { GLASS_CARD_DARK } from '../services/uiStyles';

type HelpCard = {
  country: string;
  flag: any;
  numberLabel: string;
  phone: string;
};

const HELP_ITEMS_EN = [
  { icon: require('../images/icon-feeling.png'), text: 'Are not feeling yourself' },
  { icon: require('../images/icon-crisis.png'), text: 'Are experiencing a crisis' },
  { icon: require('../images/icon-pain.png'), text: 'Have emotional pain' },
  { icon: require('../images/icon-knoledge.png'), text: 'Know someone who needs help' },
];

const HELP_ITEMS_ES = [
  { icon: require('../images/icon-feeling.png'), text: 'No te sientes como tú' },
  { icon: require('../images/icon-crisis.png'), text: 'Estás pasando una crisis' },
  { icon: require('../images/icon-pain.png'), text: 'Tienes dolor emocional' },
  { icon: require('../images/icon-knoledge.png'), text: 'Conoces a alguien que necesita ayuda' },
];

const HELP_CARDS: HelpCard[] = [
  {
    country: 'CANADA',
    flag: require('../images/icon-flag-canda.png'),
    numberLabel: 'Toll free no:',
    phone: '+18883025608',
  },
  {
    country: 'USA',
    flag: require('../images/icon-flag-usa.png'),
    numberLabel: 'Toll free no:',
    phone: '+18883025608',
  },
];

export default function SessionsScreen({ navigation }: any) {
  const [bgKey, setBgKey] = useState<(typeof BREATH_BACKGROUNDS)[number]['key']>('mountain');
  const { language, t } = useI18n();

  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      setBgKey(await getBreathBackgroundKey());
    });
    return unsub;
  }, [navigation]);

  const helpItems = useMemo(() => (language === 'es' ? HELP_ITEMS_ES : HELP_ITEMS_EN), [language]);

  const onCall = async (phone: string) => {
    const formatted = phone.replace(/[^\d+]/g, '');
    const url = `tel:${formatted}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Call unavailable', 'This device cannot start calls right now.');
      return;
    }
    await Linking.openURL(url);
  };

  return (
    <View style={s.screen}>
      <ScreenBackground style={s.bgImage} backgroundKey={bgKey} syncOnFocus={false} />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <Text style={s.title}>{t('help')}</Text>
          <Pressable style={s.closeBtn} onPress={() => navigation.navigate('home')}>
            <Ionicons name='close' size={26} color='#F4F6FF' />
          </Pressable>
        </View>

        <Text style={s.subtitle}>
          {language === 'es' ? 'Si necesitas hablar y tú:' : 'If you need to talk and you:'}
        </Text>

        <View style={s.listWrap}>
          {helpItems.map((item) => (
            <View key={item.text} style={s.listItem}>
              <Image source={item.icon} style={s.listIcon} />
              <Text style={s.listText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={s.cardsWrap}>
          {HELP_CARDS.map((card) => (
            <BlurView key={card.country} intensity={26} tint='dark' style={s.helpCard}>
              <Pressable style={s.helpCardInner} onPress={() => onCall(card.phone)}>
                <View style={s.callIconWrap}>
                  <Ionicons name='call-outline' size={24} color='#DCE8FF' />
                </View>
                <View style={s.helpCardTextWrap}>
                  <View style={s.countryRow}>
                    <Image source={card.flag} style={s.flag} resizeMode='contain' />
                    <Text style={s.country}>{card.country}</Text>
                  </View>
                  <Text style={s.numberLabel}>{card.numberLabel}</Text>
                  <Text style={s.number}>{card.phone.replace('+1', '+1 ')}</Text>
                </View>
              </Pressable>
            </BlurView>
          ))}
        </View>
      </ScrollView>

      <BottomNav active='sessions' navigate={(screen) => navigation.navigate(screen)} />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#040B2A' },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#F4F6FF',
    fontSize: 44,
    fontWeight: '300',
    letterSpacing: 0.2,
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.66)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  subtitle: {
    color: 'rgba(244,246,255,0.95)',
    fontSize: 18,
    fontWeight: '300',
    lineHeight: 28,
    marginTop: 32,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  listWrap: { gap: 14 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  listIcon: { width: 22, height: 22, tintColor: '#8EDC64' },
  listText: {
    color: '#F3F5FF',
    fontSize: 17,
    fontWeight: '400',
    flexShrink: 1,
  },
  cardsWrap: {
    gap: 18,
    marginTop: 34,
  },
  helpCard: {
    ...GLASS_CARD_DARK,
    borderRadius: 20,
    overflow: 'hidden',
  },
  helpCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 14,
  },
  callIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(20,35,86,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpCardTextWrap: {
    flex: 1,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  flag: { width: 18, height: 14 },
  country: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  numberLabel: {
    color: 'rgba(222,232,255,0.82)',
    fontSize: 14,
  },
  number: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.2,
  },
});
