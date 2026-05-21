import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../services/i18n';
import { GLASS_CARD_BASE } from '../services/uiStyles';

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
            <Text style={[s.label, isActive && s.labelActive]}>{item.label}</Text>
            {isActive ? <View style={s.dot} /> : null}
          </TouchableOpacity>
        );
      })}
    </BlurView>
  );
}

const s = StyleSheet.create({
  wrap: {
    ...GLASS_CARD_BASE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    marginHorizontal: 10,
    marginBottom: 8,
    overflow: 'hidden',
  },
  item: { alignItems: 'center', width: 64 },
  label: { color: '#D9E2FF', fontSize: 12, marginTop: 4 },
  labelActive: { color: '#8D7BFF' },
  dot: { width: 6, height: 6, borderRadius: 6, backgroundColor: '#8D7BFF', marginTop: 4 },
});
