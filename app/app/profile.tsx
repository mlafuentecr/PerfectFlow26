import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ScreenBackground from '../components/ScreenBackground';
import { logout } from '../services/auth';
import { auth } from '../services/firebase';
import { useI18n } from '../services/i18n';
import { getProfileName, setProfileName } from '../services/profile';
import { GLASS_CARD_BASE, GLASS_CARD_SOFT } from '../services/uiStyles';

const RATE_US_STORAGE_KEY = 'perfectflow_rate_us_local';
const GOOGLE_PLAY_RATE_URL = 'https://play.google.com/store/apps/details?id=com.perfecten.perfectflow';
const SUPPORT_EMAIL = 'support@perfecten.store';

export default function ProfileScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [showRateModal, setShowRateModal] = useState(false);
  const [savedRating, setSavedRating] = useState<number>(0);
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    (async () => {
      const localName = await getProfileName();
      const googleName = auth.currentUser?.displayName?.trim() ?? '';
      setName(localName || googleName);

      const raw = await AsyncStorage.getItem(RATE_US_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { rating?: number };
          if (typeof parsed.rating === 'number') setSavedRating(parsed.rating);
        } catch {
          // Ignore malformed local rating payload.
        }
      }
    })();
  }, []);
  const save = async () => {
    await setProfileName(name);
    Alert.alert(t('saved'), t('savedMsg'));
  };

  const onRateSelect = async (rating: number) => {
    setSavedRating(rating);
    const payload = { rating, createdAt: Date.now() };
    await AsyncStorage.setItem(RATE_US_STORAGE_KEY, JSON.stringify(payload));
    setShowRateModal(false);

    if (rating >= 4) {
      try {
        await Linking.openURL(GOOGLE_PLAY_RATE_URL);
      } catch {
        Alert.alert('Rate us', 'Could not open Google Play right now.');
      }
      return;
    }

    Alert.alert(language === 'es' ? 'Gracias' : 'Thanks', language === 'es' ? '¡Gracias por tu feedback!' : 'Thanks for your feedback!');
  };

  const onContactUs = async () => {
    try {
      await Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
    } catch {
      Alert.alert(
        language === 'es' ? 'Contáctanos' : 'Contact us',
        language === 'es' ? `No se pudo abrir el correo para ${SUPPORT_EMAIL}.` : `Could not open email for ${SUPPORT_EMAIL}.`
      );
    }
  };

  const links = [
    { key: 'rate', label: t('rateUs'), icon: 'star-outline', onPress: () => setShowRateModal(true) },
    { key: 'contact', label: t('contactUs'), icon: 'mail-outline', onPress: onContactUs },
    { key: 'device', label: t('deviceSection'), icon: 'hardware-chip-outline', onPress: () => navigation.navigate('legal', { kind: 'device' }) },
    { key: 'faq', label: t('faqs'), icon: 'help-circle-outline', onPress: () => navigation.navigate('legal', { kind: 'faq' }) },
    { key: 'terms', label: t('terms'), icon: 'document-text-outline', onPress: () => navigation.navigate('legal', { kind: 'terms' }) },
    { key: 'privacy', label: t('privacy'), icon: 'shield-checkmark-outline', onPress: () => navigation.navigate('legal', { kind: 'privacy' }) },
    { key: 'ack', label: t('acknowledgments'), icon: 'heart-outline', onPress: () => navigation.navigate('legal', { kind: 'benefits' }) },
  ] as const;

  return (
    <ScreenBackground>
      <View style={s.overlay}>
        <ScrollView style={s.c} contentContainerStyle={{ paddingBottom: 120 }}>
          <Header title={t('settings')} />
          <Text style={s.label}>{t('yourName')}</Text>
          <TextInput value={name} onChangeText={setName} placeholder={t('enterName')} placeholderTextColor='#8FA1D8' style={s.input} />
          <TouchableOpacity style={s.btn} onPress={save}>
            <Text style={s.btnText}>{t('saveName')}</Text>
          </TouchableOpacity>

          <Text style={s.labelLang}>{t('language')}</Text>
          <View style={s.langRow}>
            <TouchableOpacity style={[s.langBtn, language === 'en' && s.langBtnActive]} onPress={() => setLanguage('en')}>
              <Text style={[s.langTxt, language === 'en' && s.langTxtActive]}>{t('english')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.langBtn, language === 'es' && s.langBtnActive]} onPress={() => setLanguage('es')}>
              <Text style={[s.langTxt, language === 'es' && s.langTxtActive]}>{t('spanish')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.labelLang}>{t('legalSupport')}</Text>
          <View style={s.menuWrap}>
            {links.map((item) => (
              <TouchableOpacity key={item.key} style={s.menuItem} onPress={item.onPress}>
                <View style={s.menuLeft}>
                  <Ionicons name={item.icon as any} size={18} color='#D9E4FF' />
                  <Text style={s.menuText}>{item.label}</Text>
                </View>
                <Ionicons name='chevron-forward' size={16} color='#AFC0F2' />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={s.logoutBtn}
            onPress={async () => {
              await logout();
              navigation.replace('index');
            }}
          >
            <Text style={s.logoutTxt}>{t('logout')}</Text>
          </TouchableOpacity>
        </ScrollView>
        <BottomNav active='profile' navigate={(screen) => navigation.navigate(screen)} />
      </View>

      <Modal visible={showRateModal} transparent animationType='fade' onRequestClose={() => setShowRateModal(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>{t('rateUs')}</Text>
            <Text style={s.modalSub}>
              {language === 'es' ? '¿Cómo calificarías tu experiencia?' : 'How would you rate your experience?'}
            </Text>

            <View style={s.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => onRateSelect(star)} hitSlop={10} style={s.starBtn}>
                  <Ionicons
                    name='star'
                    size={34}
                    color={star <= savedRating ? '#A992FF' : '#DDE3F7'}
                    style={star <= savedRating ? s.starOn : s.starOff}
                  />
                </Pressable>
              ))}
            </View>

            <TouchableOpacity style={s.modalCancelBtn} onPress={() => setShowRateModal(false)}>
              <Text style={s.modalCancelTxt}>{language === 'es' ? 'Cancelar' : 'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'transparent' },
  c: { flex: 1, padding: 20, paddingTop: 56 },
  label: { color: '#D9E4FF', fontSize: 16, marginTop: 16 },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(130,150,255,0.3)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    backgroundColor: 'rgba(8,19,54,0.8)',
  },
  btn: { marginTop: 16, backgroundColor: '#6E74FF', borderRadius: 24, paddingVertical: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  labelLang: { color: '#D9E4FF', fontSize: 16, marginTop: 24 },
  langRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  langBtn: {
    ...GLASS_CARD_SOFT,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  langBtnActive: {
    borderColor: '#8D7BFF',
    backgroundColor: 'rgba(124,122,255,0.35)',
  },
  langTxt: { color: '#D9E4FF', fontWeight: '600' },
  langTxtActive: { color: '#fff' },
  menuWrap: {
    ...GLASS_CARD_SOFT,
    marginTop: 10,
    borderRadius: 14,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuText: { color: '#EEF3FF', fontSize: 15, fontWeight: '600' },
  logoutBtn: {
    ...GLASS_CARD_BASE,
    marginTop: 24,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(1,5,18,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
    backgroundColor: 'rgba(12,24,68,0.95)',
    padding: 18,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  modalSub: {
    color: '#D9E4FF',
    fontSize: 14,
    marginTop: 8,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  starBtn: { paddingHorizontal: 2, paddingVertical: 2 },
  starOn: { opacity: 1 },
  starOff: { opacity: 0.6 },
  modalCancelBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  modalCancelTxt: {
    color: '#BFD0FF',
    fontSize: 14,
    fontWeight: '600',
  },
});
