import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import ScreenBackground from '../components/ScreenBackground';
import { getLegalSection, LegalKind } from '../services/legalContent';
import { useI18n } from '../services/i18n';
import { GLASS_CARD_DARK } from '../services/uiStyles';

export default function LegalScreen({ navigation, route }: any) {
  const kind = (route.params?.kind ?? 'faq') as LegalKind;
  const { language } = useI18n();
  const section = getLegalSection(language, kind);
  const [expanded, setExpanded] = useState<string>(section.items[0]?.id ?? '');
  const viewMore = language === 'es' ? 'Ver más' : 'View More';
  const viewLess = language === 'es' ? 'Ver menos' : 'View Less';
  const isSingleCardMode = kind === 'terms' || kind === 'privacy';

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <Text style={s.title}>{section.title}</Text>
          <Pressable style={s.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name='close' size={26} color='#F4F6FF' />
          </Pressable>
        </View>

        {isSingleCardMode ? (
          <BlurView intensity={48} tint='dark' style={[s.card, s.cardOpen]}>
            <LinearGradient
              colors={['rgba(12,22,64,0.92)', 'rgba(10,19,56,0.84)', 'rgba(8,16,48,0.78)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.cardGradient}
            >
              <View style={s.singleCardTap}>
                <Text style={s.singleHeading}>{section.items[0]?.question ?? ''}</Text>
                <Text style={s.singleAnswer}>{section.items[0]?.answer ?? ''}</Text>
              </View>
            </LinearGradient>
          </BlurView>
        ) : (
          <View style={s.listWrap}>
            {section.items.map((item, index) => {
              const open = expanded === item.id;
              return (
                <BlurView key={item.id} intensity={48} tint='dark' style={[s.card, open && s.cardOpen]}>
                  <LinearGradient
                    colors={['rgba(12,22,64,0.92)', 'rgba(10,19,56,0.84)', 'rgba(8,16,48,0.78)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={s.cardGradient}
                  >
                    <Pressable onPress={() => setExpanded(open ? '' : item.id)} style={s.cardTap}>
                      <View style={s.rowTop}>
                        <View style={s.indexBubble}>
                          <Text style={s.indexText}>{index + 1}</Text>
                        </View>
                        <Text style={s.question}>{item.question}</Text>
                      </View>

                      {open ? (
                        <View style={s.answerWrap}>
                          <Text style={s.answer}>{item.answer}</Text>
                          <Text style={s.moreTxt}>{viewLess}</Text>
                        </View>
                      ) : (
                        <Text style={s.moreTxt}>{viewMore}</Text>
                      )}
                    </Pressable>
                  </LinearGradient>
                </BlurView>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const s = StyleSheet.create({
  content: { paddingTop: 56, paddingHorizontal: 18, paddingBottom: 36 },
  headerRow: {
    position: 'relative',
    minHeight: 52,
    justifyContent: 'center',
    paddingRight: 62,
    marginBottom: 14,
  },
  title: {
    color: '#F4F6FF',
    fontSize: 42,
    fontWeight: '300',
    lineHeight: 46,
    flexShrink: 1,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 2,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.66)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  listWrap: { gap: 14 },
  card: {
    ...GLASS_CARD_DARK,
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 18,
  },
  cardOpen: {
    borderColor: 'rgba(183,197,255,0.5)',
  },
  cardTap: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  singleCardTap: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  singleHeading: {
    color: '#F8FAFF',
    fontSize: 23,
    fontWeight: '700',
    marginBottom: 12,
  },
  singleAnswer: {
    color: '#E4ECFF',
    fontSize: 17,
    lineHeight: 27,
  },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  indexBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  indexText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  question: { color: '#F8FAFF', fontSize: 21, fontWeight: '600', flex: 1, lineHeight: 28 },
  answerWrap: { marginLeft: 36, marginTop: 10 },
  answer: { color: '#E4ECFF', fontSize: 17, lineHeight: 26 },
  moreTxt: { marginLeft: 36, marginTop: 8, color: '#97D660', fontSize: 17, fontWeight: '700' },
});
