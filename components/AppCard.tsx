import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

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
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.49)',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 4 },
  },
  t: { color: '#fff', fontSize: 22, fontWeight: '700' },
  d: { color: '#D6DEFF', fontSize: 15, marginTop: 8, lineHeight: 22 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#B2A8FF', marginTop: 12 },
});
