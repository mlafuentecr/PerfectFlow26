import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../App';
import ScreenBackground from '../components/ScreenBackground';
import StartJourney from '../components/StartJourney';
import { signInWithGoogleNative, subscribeAuth } from '../services/auth';
import { useI18n } from '../services/i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'index'>;

export default function IndexScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

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
        style={s.overlay}
      >
        <View style={s.topBlock}>
          <Image source={require('../images/logo/perfectFlow.png')} style={s.logo} resizeMode="contain" />
        </View>

        <View style={s.middleBlock}>
          <Text style={s.title}>{t('welcomeHeadline1')}</Text>
          <Text style={s.title}>{t('welcomeHeadline2')}</Text>
          <Text style={s.subtitle}>{t('welcomeBody')}</Text>
        </View>

        <View style={s.bottomBlock}>
          <StartJourney title={loading ? 'Signing in...' : t('startJourney')} onPress={onGoogleLogin} />
          <TouchableOpacity disabled>
            <Text style={s.small}>{t('haveAccount')}</Text>
          </TouchableOpacity>
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
    paddingBottom: 44,
  },
  topBlock: { alignItems: 'center' },
  logo: { width: 390, height: 182 },
  middleBlock: { marginTop: 'auto', marginBottom: 44, maxWidth: 330, alignSelf: 'center' },
  title: { fontSize: 38, lineHeight: 44, color: '#FFFFFF', fontWeight: '800', textAlign: 'center' },
  subtitle: {
    fontSize: 16,
    lineHeight: 30,
    color: '#D3DDFD',
    marginTop: 16,
    maxWidth: 320,
    textAlign: 'center',
  },
  bottomBlock: { marginTop: 0 },
  small: { textAlign: 'center', color: '#8F93FF', marginTop: 18, fontSize: 16 },
});
