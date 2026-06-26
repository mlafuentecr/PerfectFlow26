import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TYPE_SCALE } from '../services/uiStyles';

export default function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={s.wrap}>
      {onBack ? (
        <TouchableOpacity onPress={onBack}>
          <Ionicons name='chevron-back' size={26} color='white' />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 26 }} />
      )}
      <Text style={s.t}>{title}</Text>
      <View style={{ width: 26 }} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  t: { color: '#fff', fontSize: TYPE_SCALE.title + 6, fontWeight: '700' },
});

