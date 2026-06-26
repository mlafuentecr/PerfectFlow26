import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function StartJourney({ title, onPress, disabled = false }: Props) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} accessibilityRole="button">
      <LinearGradient colors={['#9D6BFF', '#5A7CFF']} style={styles.btn}>
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({ btn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' }, text: { color: '#fff', fontSize: 22, fontWeight: '700' } });
