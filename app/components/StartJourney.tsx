import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  compact?: boolean;
};

export default function StartJourney({ title, onPress, disabled = false, compact = false }: Props) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} accessibilityRole="button">
      <LinearGradient colors={['#9D6BFF', '#5A7CFF']} style={[styles.btn, compact && styles.btnCompact]}>
        <Text style={[styles.text, compact && styles.textCompact]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn: {
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 18,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCompact: {
    paddingVertical: 14,
    minHeight: 56,
  },
  text: { color: '#fff', fontSize: 22, fontWeight: '700' },
  textCompact: { fontSize: 19 },
});
