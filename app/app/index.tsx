import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as Application from 'expo-application';
import { RootStackParamList } from '../App';
import ScreenBackground from '../components/ScreenBackground';
import StartJourney from '../components/StartJourney';
import { signInWithGoogleNative, subscribeAuth } from '../services/auth';
import { useI18n } from '../services/i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'index'>;
const APP_VERSION = Application.nativeApplicationVersion ?? '1.1.2';
const APP_BUILD = Application.nativeBuildVersion ?? '-';

export default function IndexScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();
  const { width, height } = useWindowDimensions();
  const narrow = width < 390;
  const compactHeight = height < 820;

  useEffect(
    () =>
      subscribeAuth((u) => {
        if (u) navigation.replace('home');
      }),
    [navigation]
  );

  const onGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogleNative();
    } catch (e: any) {
      Alert.alert('Google Sign-In Error', e?.message ?? 'Unable to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <LinearGradient
        colors={['rgba(2,8,28,0)', 'rgba(2,8,28,0.08)', 'rgba(2,8,28,0.45)', 'rgba(2,8,28,0.82)']}
        locations={[0, 0.42, 0.78, 1]}
        style={[s.overlay, narrow && s.overlayNarrow, compactHeight && s.overlayCompact]}
      >
        <View style={[s.topBlock, compactHeight && s.topBlockCompact]}>
          <Image source={require('../assets/images/perfectFlow.png')} style={[s.logo, narrow && s.logoNarrow, compactHeight && s.logoCompact]} resizeMode="contain" />
        </View>

        <View style={[s.middleBlock, narrow && s.middleBlockNarrow, compactHeight && s.middleBlockCompact]}>
          <Text style={[s.title, narrow && s.titleNarrow]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
            {t('welcomeHeadline1')}
          </Text>
          <Text style={[s.title, narrow && s.titleNarrow]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
            {t('welcomeHeadline2')}
          </Text>
          <Text style={[s.subtitle, narrow && s.subtitleNarrow]} numberOfLines={4} adjustsFontSizeToFit minimumFontScale={0.84}>
            {t('welcomeBody')}
          </Text>
        </View>

        <View style={[s.bottomBlock, narrow && s.bottomBlockNarrow, compactHeight && s.bottomBlockCompact]}>
          <StartJourney
            title={loading ? 'Signing in...' : t('startJourney')}
            onPress={onGoogleLogin}
            disabled={loading}
            compact={narrow}
          />
          <TouchableOpacity onPress={onGoogleLogin} disabled={loading} accessibilityRole="button">
            <Text style={s.small} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>{t('haveAccount')}</Text>
          </TouchableOpacity>
          <Text style={s.versionText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
            v{APP_VERSION} ({t('buildLabel')} {APP_BUILD})
          </Text>
        </View>
      </LinearGradient>
    </ScreenBackground>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 72,
    paddingBottom: 30,
  },
  overlayNarrow: { paddingHorizontal: 20 },
  overlayCompact: { paddingTop: 48, paddingBottom: 18 },
  topBlock: { alignItems: 'center', justifyContent: 'flex-start' },
  topBlockCompact: { marginTop: 4 },
  logo: { width: 320, height: 150, maxWidth: '100%' },
  logoNarrow: { width: 280, height: 128 },
  logoCompact: { width: 260, height: 116 },
  middleBlock: { marginTop: 'auto', marginBottom: 28, maxWidth: 330, width: '100%', alignSelf: 'center' },
  middleBlockNarrow: { maxWidth: 310, marginBottom: 22 },
  middleBlockCompact: { marginBottom: 18 },
  title: { fontSize: 38, lineHeight: 44, color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
  titleNarrow: { fontSize: 34, lineHeight: 39 },
  subtitle: {
    fontSize: 16,
    lineHeight: 26,
    color: '#D3DDFD',
    marginTop: 16,
    maxWidth: 320,
    textAlign: 'center',
  },
  subtitleNarrow: { fontSize: 15, lineHeight: 23, maxWidth: 300, alignSelf: 'center' },
  bottomBlock: { marginTop: 0, marginBottom: 46, width: '100%', alignSelf: 'center' },
  bottomBlockNarrow: { marginBottom: 24 },
  bottomBlockCompact: { marginBottom: 16 },
  small: { textAlign: 'center', color: '#8F93FF', marginTop: 14, fontSize: 16 },
  versionText: {
    textAlign: 'center',
    color: 'rgba(211,221,253,0.7)',
    marginTop: 14,
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
