import { Language } from './i18n';

type LegalKind = 'faq' | 'terms' | 'privacy' | 'benefits' | 'device';

export type LegalItem = {
  id: string;
  question: string;
  answer: string;
};

export type LegalSection = {
  title: string;
  items: LegalItem[];
};

type LegalByKind = Record<LegalKind, LegalSection>;
type LegalContentShape = Record<Language, LegalByKind>;
type TermsJsonShape = Record<
  Language,
  {
    title: string;
    heading: string;
    content: string;
  }
>;
type PrivacyJsonShape = Record<
  Language,
  {
    title: string;
    heading: string;
    content: string;
  }
>;

const LEGAL_CONTENT = require('../assets/data/legal-content.json') as LegalContentShape;
const TERMS_CONTENT = require('../assets/data/terms.json') as TermsJsonShape;
const PRIVACY_CONTENT = require('../assets/data/privacy.json') as PrivacyJsonShape;

export function getLegalSection(language: Language, kind: LegalKind): LegalSection {
  const lang: Language = LEGAL_CONTENT[language] ? language : 'en';

  if (kind === 'terms') {
    const terms = TERMS_CONTENT[lang] ?? TERMS_CONTENT.en;
    return {
      title: terms.title,
      items: [
        {
          id: 'terms-main',
          question: terms.heading,
          answer: terms.content,
        },
      ],
    };
  }

  if (kind === 'privacy') {
    const privacy = PRIVACY_CONTENT[lang] ?? PRIVACY_CONTENT.en;
    return {
      title: privacy.title,
      items: [
        {
          id: 'privacy-main',
          question: privacy.heading,
          answer: privacy.content,
        },
      ],
    };
  }

  return LEGAL_CONTENT[lang][kind];
}

export type { LegalKind };
