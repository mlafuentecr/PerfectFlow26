import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function StartJourney({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient colors={['#9D6BFF', '#5A7CFF']} style={styles.btn}>
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({ btn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' }, text: { color: '#fff', fontSize: 22, fontWeight: '700' } });
