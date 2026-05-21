import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import { getLearnItemById, getWordCount } from '../services/learnContent';
import ScreenBackground from '../components/ScreenBackground';

export default function LearnDetailScreen({ navigation, route }: any) {
  const itemId = route.params?.itemId as string | undefined;
  const item = itemId ? getLearnItemById(itemId) : undefined;

  if (!item) {
    return (
      <ScreenBackground>
        <View style={s.overlay}>
          <Header title='Learn' onBack={() => navigation.goBack()} />
          <Text style={s.notFound}>Content not found.</Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={s.overlay}>
        <Header title='Learn' onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={s.contentWrap} showsVerticalScrollIndicator={false}>
          <Text style={s.title}>{item.title}</Text>
          <Text style={s.meta}>{getWordCount(item.content)} words</Text>
          <Text style={s.body}>{item.content}</Text>
        </ScrollView>
      </View>
    </ScreenBackground>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  contentWrap: {
    paddingBottom: 44,
  },
  title: { color: '#fff', fontSize: 30, fontWeight: '700', marginTop: 6 },
  meta: { color: '#B8C7FF', fontSize: 13, marginTop: 6, marginBottom: 16 },
  body: { color: '#E8EEFF', fontSize: 17, lineHeight: 29 },
  notFound: { color: '#fff', fontSize: 18, marginTop: 24 },
});
