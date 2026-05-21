import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GLASS_CARD_BASE } from '../services/uiStyles';

export default function EmotionCard({
  title,
  description,
  emoji,
  onStart,
}: {
  title: string;
  description: string;
  emoji: string;
  onStart: () => void;
}) {
  return (
    <View style={s.card}>
      <Text style={s.e}>{emoji}</Text>
      <Text style={s.t}>{title}</Text>
      <Text style={s.d}>{description}</Text>
      <TouchableOpacity onPress={onStart} style={s.b}>
        <Text style={s.bt}>Start Session</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    ...GLASS_CARD_BASE,
    padding: 16,
    marginBottom: 12,
  },
  e: { fontSize: 30 },
  t: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 8 },
  d: { color: '#D6DEFF', marginTop: 6, fontSize: 14, lineHeight: 20 },
  b: {
    marginTop: 12,
    backgroundColor: 'rgba(124,122,255,0.95)',
    borderRadius: 22,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bt: { color: '#fff', fontWeight: '700' },
});
