import { BREATH_BACKGROUNDS } from './breathingPrefs';

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

