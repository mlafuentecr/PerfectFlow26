import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GLASS_CARD_SOFT, TYPE_SCALE } from '../services/uiStyles';

type Props = {
  title?: string;
  subtitle?: string;
  enabled?: boolean;
  onPress: () => void;
};

export default function ReminderButton({
  title = 'Set Breathing Reminder',
  subtitle = 'Get a gentle nudge to breathe and reset.',
  enabled = false,
  onPress,
}: Props) {
  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={s.left}>
        <View style={s.iconWrap}>
          <Ionicons name='notifications-outline' size={20} color={enabled ? '#9DF3BD' : '#C9B8FF'} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{title}</Text>
          <Text style={s.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <Ionicons name='chevron-forward' size={18} color='#AFC0F4' />
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    ...GLASS_CARD_SOFT,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(190,169,255,0.65)',
    backgroundColor: 'rgba(96,70,183,0.24)',
  },
  title: { color: '#FFFFFF', fontSize: TYPE_SCALE.body + 2, fontWeight: '700' },
  subtitle: { color: '#CAD7FF', fontSize: TYPE_SCALE.subtitle, marginTop: 2 },
});
