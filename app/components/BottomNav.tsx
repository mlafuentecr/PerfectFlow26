import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../services/i18n';
import { GLASS_CARD_BASE, TYPE_SCALE } from '../services/uiStyles';

type Tab = 'home' | 'breathing' | 'insights' | 'sessions' | 'profile';
type TabScreen = Tab;

export default function BottomNav({
  active,
  navigate,
}: {
  active: Tab;
  navigate: (screen: TabScreen) => void;
}) {
  const { t } = useI18n();

  const items: { key: Tab; label: string; icon: keyof typeof Ionicons.glyphMap; screen: TabScreen }[] = [
    { key: 'home', label: t('home'), icon: 'home-outline', screen: 'home' },
    { key: 'breathing', label: t('breathe'), icon: 'refresh-circle-outline', screen: 'breathing' },
    { key: 'insights', label: t('learn'), icon: 'book-outline', screen: 'insights' },
    { key: 'sessions', label: t('help'), icon: 'headset-outline', screen: 'sessions' },
    { key: 'profile', label: t('settings'), icon: 'settings-outline', screen: 'profile' },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={s.safeArea}>
      <BlurView intensity={38} tint='dark' style={s.wrap}>
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <TouchableOpacity key={item.key} style={s.item} onPress={() => navigate(item.screen)}>
              <Ionicons
                name={isActive ? (item.icon.replace('-outline', '') as any) : item.icon}
                size={22}
                color={isActive ? '#8D7BFF' : '#D9E2FF'}
              />
              <Text style={[s.label, isActive && s.labelActive]} numberOfLines={1} adjustsFontSizeToFit>
                {item.label}
              </Text>
              {isActive ? <View style={s.dot} /> : null}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: {
    width: '100%',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 6,
  },
  wrap: {
    ...GLASS_CARD_BASE,
    borderRadius: 20,
    borderColor: 'rgba(171,191,255,0.38)',
    backgroundColor: 'rgba(11,22,58,0.60)',
    shadowColor: '#07143B',
    shadowOpacity: 0.34,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  item: { alignItems: 'center', flex: 1, minWidth: 0 },
  label: { color: '#D9E2FF', fontSize: TYPE_SCALE.caption, marginTop: 5, fontWeight: '500', maxWidth: '100%' },
  labelActive: { color: '#A78EFF', fontWeight: '700' },
  dot: { width: 7, height: 7, borderRadius: 6, backgroundColor: '#A78EFF', marginTop: 4 },
});
