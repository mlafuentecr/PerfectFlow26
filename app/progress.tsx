import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import ScreenBackground from '../components/ScreenBackground';

export default function ProgressScreen({ navigation }: any) {
  return (
    <ScreenBackground>
      <View style={s.c}>
        <Header title='Weekly Progress' onBack={() => navigation.goBack()} />
        <Text style={s.big}>7 calm sessions this week</Text>
        <Text style={s.s}>Mon Tue Wed Thu Fri Sat Sun</Text>
      </View>
    </ScreenBackground>
  );
}

const s = StyleSheet.create({
  c: { padding: 20, paddingTop: 56 },
  big: { color: '#fff', fontSize: 32, fontWeight: '700', marginTop: 30 },
  s: { marginTop: 12, color: '#BAC9F7', fontSize: 18 },
});

