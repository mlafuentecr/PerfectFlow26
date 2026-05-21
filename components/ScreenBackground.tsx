import React, { useCallback, useState } from 'react';
import { ImageBackground, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import {
  BREATH_BACKGROUNDS,
  BreathBackgroundKey,
  getBreathBackgroundKey,
} from '../services/breathingPrefs';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundKey?: BreathBackgroundKey;
  syncOnFocus?: boolean;
  blurRadius?: number;
};

export default function ScreenBackground({
  children,
  style,
  backgroundKey,
  syncOnFocus = true,
  blurRadius = 8,
}: Props) {
  const [bgKey, setBgKey] = useState<BreathBackgroundKey>(backgroundKey ?? 'mountain');

  useFocusEffect(
    useCallback(() => {
      if (!syncOnFocus || backgroundKey) return undefined;
      let mounted = true;
      (async () => {
        const saved = await getBreathBackgroundKey();
        if (mounted) setBgKey(saved);
      })();
      return () => {
        mounted = false;
      };
    }, [syncOnFocus, backgroundKey])
  );

  const activeKey = backgroundKey ?? bgKey;
  const bg = BREATH_BACKGROUNDS.find((b) => b.key === activeKey) ?? BREATH_BACKGROUNDS[0];

  return (
    <ImageBackground source={bg.src} style={[s.bg, style]} imageStyle={s.bgImage} blurRadius={blurRadius}>
      <LinearGradient
        colors={['rgba(2,8,35,0.68)', 'rgba(3,12,48,0.82)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={s.tint}
      />
      {children}
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: 'cover' },
  tint: { ...StyleSheet.absoluteFillObject },
});
