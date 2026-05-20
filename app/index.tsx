import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import StartJourney from '../components/StartJourney';
import {
  getGoogleDebugSnapshot,
  GoogleDebugSnapshot,
  signInWithGoogleNative,
  subscribeAuth,
} from '../services/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'index'>;

export default function IndexScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState<GoogleDebugSnapshot | null>(null);
  const [lastError, setLastError] = useState<string>('');

  useEffect(
    () =>
      subscribeAuth((u) => {
        if (u) navigation.replace('home');
      }),
    [navigation]
  );

  useEffect(() => {
    if (!__DEV__) return;
    void refreshDebug();
  }, []);

  const refreshDebug = async () => {
    const snapshot = await getGoogleDebugSnapshot();
    setDebug(snapshot);
  };

  const onGoogleLogin = async () => {
    try {
      setLastError('');
      setLoading(true);
      await signInWithGoogleNative();
    } catch (e: any) {
      const message = e?.message ?? 'Unable to sign in with Google.';
      setLastError(message);
      Alert.alert('Google Sign-In Error', message);
    } finally {
      if (__DEV__) {
        void refreshDebug();
      }
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../images/bg.png')} style={s.bg}>
      <View style={s.overlay}>
        <Text style={s.title}>PerfectFlow</Text>
        <Text style={s.subtitle}>Breathe better. Feel better.</Text>
        <StartJourney title={loading ? 'Signing in...' : 'Sign in with Google'} onPress={onGoogleLogin} />
        <TouchableOpacity disabled>
          <Text style={s.small}>Secure Firebase Authentication</Text>
        </TouchableOpacity>
        {__DEV__ && (
          <View style={s.debugCard}>
            <Text style={s.debugTitle}>Debug OAuth (DEV)</Text>
            <Text style={s.debugText}>
              Play Services: {debug?.playServices ?? 'checking...'}
              {debug?.playServicesError ? ` | ${debug.playServicesError}` : ''}
            </Text>
            <Text style={s.debugText}>Has User: {String(debug?.hasCurrentUser ?? false)}</Text>
            <Text style={s.debugText}>Web Client: {debug?.webClientId ?? '-'}</Text>
            <Text style={s.debugText}>Android Client: {debug?.androidClientId ?? '-'}</Text>
            <Text style={s.debugText}>Last Error: {lastError || '-'}</Text>
            <TouchableOpacity onPress={refreshDebug} style={s.refreshBtn}>
              <Text style={s.refreshTxt}>Refresh Debug</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'flex-end' },
  overlay: { padding: 24, paddingBottom: 48, backgroundColor: 'rgba(4,10,38,0.45)' },
  title: { fontSize: 48, color: '#fff', fontWeight: '800' },
  subtitle: { fontSize: 22, color: '#D1DEFF', marginTop: 8, marginBottom: 26 },
  small: { textAlign: 'center', color: '#A7B6E8', marginTop: 16 },
  debugCard: {
    marginTop: 18,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(2,8,28,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(124,160,255,0.35)',
  },
  debugTitle: { color: '#E3EEFF', fontWeight: '700', marginBottom: 8 },
  debugText: { color: '#C2D2FF', fontSize: 12, marginBottom: 4 },
  refreshBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#4E6CFF',
  },
  refreshTxt: { color: '#fff', fontWeight: '600', fontSize: 12 },
});
