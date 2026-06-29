import React from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import ScreenBackground from '../components/ScreenBackground';
import { LEARN_ITEMS, getLearnCardCopy, getLearnItemImage, getWordCount } from '../services/learnContent';
import { useI18n } from '../services/i18n';
import { GLASS_CARD_BASE } from '../services/uiStyles';

export default function InsightsScreen({ navigation }: any) {
  const { t, language } = useI18n();

  return (
    <ScreenBackground>
      <View style={s.overlay}>
        <Header title={t('learn')} onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>
          {LEARN_ITEMS.map((item) => {
            const cardCopy = getLearnCardCopy(item, language);
            const words = getWordCount(item.content);
            return (
              <View key={item.id} style={s.card}>
                <ImageBackground source={getLearnItemImage(item.backgroundKey)} style={s.cardImage} imageStyle={s.cardImageStyle}>
                  <View style={s.cardImageOverlay} />
                </ImageBackground>

                <View style={s.cardBody}>
                  <Text style={s.cardTitle}>{cardCopy.title}</Text>
                  <Text style={s.cardMeta}>{words} {language === 'es' ? 'palabras' : 'words'}</Text>
                  <Text style={s.cardExcerpt}>{cardCopy.excerpt}</Text>
                  <Pressable
                    style={s.readMoreBtn}
                    onPress={() => navigation.navigate('learnDetail', { itemId: item.id })}
                  >
                    <Text style={s.readMoreTxt}>{language === 'es' ? 'Leer más' : 'Read more'}</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ScreenBackground>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  listContent: { paddingBottom: 90 },
  card: {
    ...GLASS_CARD_BASE,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardImage: { height: 70, justifyContent: 'flex-end' },
  cardImageStyle: { resizeMode: 'cover' },
  cardImageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(4,14,45,0.35)' },
  cardBody: { padding: 14 },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  cardMeta: { color: '#B4C5FF', fontSize: 12, marginTop: 3 },
  cardExcerpt: { color: '#E1E9FF', fontSize: 14, lineHeight: 20, marginTop: 8 },
  readMoreBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(129,112,255,0.45)',
    borderColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  readMoreTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
