import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 16,
    padding: 16,
    borderColor: 'rgba(255,255,255,0.49)',
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 4 },
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
