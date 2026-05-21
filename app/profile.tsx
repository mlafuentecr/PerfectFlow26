import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { logout } from '../services/auth';
import { auth } from '../services/firebase';
import { useI18n } from '../services/i18n';
import { getProfileName, setProfileName } from '../services/profile';

export default function ProfileScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    (async () => {
      const localName = await getProfileName();
      const googleName = auth.currentUser?.displayName?.trim() ?? '';
      setName(localName || googleName);
    })();
  }, []);

  const save = async () => {
    await setProfileName(name);
    Alert.alert(t('saved'), t('savedMsg'));
  };

  const links = [
    { key: 'rate', label: t('rateUs'), icon: 'star-outline', onPress: () => Alert.alert(t('rateUs'), 'Coming soon.') },
    { key: 'faq', label: t('faqs'), icon: 'help-circle-outline', onPress: () => Linking.openURL('https://perfecten.store/perfectflow-faq') },
    { key: 'terms', label: t('terms'), icon: 'document-text-outline', onPress: () => Linking.openURL('https://perfecten.store/terms-and-conditions') },
    { key: 'privacy', label: t('privacy'), icon: 'shield-checkmark-outline', onPress: () => Linking.openURL('https://perfecten.store/perfectflow-privacy-policy') },
    { key: 'ack', label: t('acknowledgments'), icon: 'heart-outline', onPress: () => Linking.openURL('https://perfecten.store/acknowledgments') },
  ] as const;

  return (
    <LinearGradient colors={['#020D35', '#041A5E']} style={s.bg}>
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
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  langBtnActive: {
    borderColor: '#8D7BFF',
    backgroundColor: 'rgba(124,122,255,0.35)',
  },
  langTxt: { color: '#D9E4FF', fontWeight: '600' },
  langTxtActive: { color: '#fff' },
  menuWrap: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
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
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.49)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
