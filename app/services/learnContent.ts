import { BREATH_BACKGROUNDS } from './breathingPrefs';
import { Language } from './i18n';

export type LearnItem = {
  id: string;
  title: string;
  backgroundKey: (typeof BREATH_BACKGROUNDS)[number]['key'];
  content: string;
};

type LearnJson = { items: LearnItem[] };

const data = require('../assets/data/learn.json') as LearnJson;

export const LEARN_ITEMS: LearnItem[] = data.items;

export const getLearnItemById = (id: string) => LEARN_ITEMS.find((item) => item.id === id);

export const getLearnItemImage = (backgroundKey: LearnItem['backgroundKey']) => {
  return BREATH_BACKGROUNDS.find((b) => b.key === backgroundKey)?.src ?? BREATH_BACKGROUNDS[0].src;
};

export const getWordCount = (text: string) => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const getExcerpt = (text: string, max = 120) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
};

const LEARN_COPY_ES: Record<string, { title: string; excerpt: string }> = {
  'understanding-stress': {
    title: 'Entender el estrés',
    excerpt: 'El estrés es una alarma natural del cuerpo. Si se mantiene activo por mucho tiempo, agota mente y cuerpo.',
  },
  'what-is-anxiety': {
    title: '¿Qué es la ansiedad?',
    excerpt: 'La ansiedad anticipa peligro antes de que ocurra. Respirar lento ayuda a recuperar control y presencia.',
  },
  'power-of-breath': {
    title: 'El poder de la respiración',
    excerpt: 'Tu respiración es el puente más rápido entre mente y cuerpo. Un ritmo estable mejora claridad y equilibrio emocional.',
  },
  'sleep-and-nervous-system': {
    title: 'Sueño y sistema nervioso',
    excerpt: 'Si tu mente sigue en alerta por la noche, una respiración suave puede ayudarte a pasar de activación a descanso.',
  },
  'focus-with-breath': {
    title: 'Enfoque con respiración',
    excerpt: 'Antes de estudiar o trabajar, unos minutos de respiración estructurada reducen ruido mental y mejoran concentración.',
  },
  'anger-regulation': {
    title: 'Regulación del enojo',
    excerpt: 'Cuando hay enojo, primero regula el cuerpo. Respirar con ritmo crea espacio entre impulso y acción.',
  },
  'panic-reset': {
    title: 'Reinicio del pánico',
    excerpt: 'En pánico, menos es más: exhala más largo que inhalas y usa señales simples de seguridad para estabilizarte.',
  },
  'confidence-state': {
    title: 'Respiración y confianza',
    excerpt: 'La confianza también es un estado corporal. Respirar con estructura antes de un reto mejora calma y presencia.',
  },
  'sadness-support': {
    title: 'Apoyo para la tristeza',
    excerpt: 'En tristeza, elige ritmos suaves. La respiración coherente puede darte contención sin bloquear la emoción.',
  },
  'low-energy-reset': {
    title: 'Reinicio de energía baja',
    excerpt: 'Cuando falta energía, una secuencia corta y controlada puede aumentar alerta sin perder estabilidad.',
  },
};

export const getLearnCardCopy = (item: LearnItem, language: Language) => {
  if (language !== 'es') {
    return { title: item.title, excerpt: getExcerpt(item.content, 120) };
  }

  const localized = LEARN_COPY_ES[item.id];
  if (!localized) {
    return { title: item.title, excerpt: getExcerpt(item.content, 120) };
  }

  return localized;
};
