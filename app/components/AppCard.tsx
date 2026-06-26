import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { GLASS_CARD_BASE } from '../services/uiStyles';

export default function AppCard({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={s.card}>
      <Text style={s.t}>{title}</Text>
      <Text style={s.d}>{description}</Text>
      <View style={s.dot} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    ...GLASS_CARD_BASE,
    padding: 18,
    marginBottom: 14,
  },
  t: { color: '#fff', fontSize: 22, fontWeight: '700' },
  d: { color: '#D6DEFF', fontSize: 15, marginTop: 8, lineHeight: 22 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#B2A8FF', marginTop: 12 },
});
