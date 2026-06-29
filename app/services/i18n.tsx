import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'es';

const LANG_KEY = 'perfectflow_language';

const STRINGS = {
  en: {
    welcomeHeadline1: 'Find your calm.',
    welcomeHeadline2: 'Feel your best.',
    welcomeBody:
      'Guided breathing, relaxing sounds, and science-backed tools to reduce stress and boost well-being.',
    startJourney: 'Start Your Journey',
    haveAccount: 'I already have an account',
    greeting: 'Hello',
    motivator: 'Breathe in calm. Breathe out stress.',
    resetTitle: 'Reset Your Mood',
    resetBody: 'Start a guided breath and feel better in minutes.',
    startBreathing: 'Start Breathing',
    dailyInsight: 'Daily Insight',
    moodReset: 'Mood Reset',
    weeklyProgress: 'Weekly Progress',
    logout: 'Logout',
    logoutDesc: 'Sign out from your account.',
    dailyInsightDesc: 'A short Learn insight for today.',
    moodResetDesc: 'Choose how you feel and start a session.',
    weeklyProgressDesc: 'Track your breathing and calm moments.',
    profile: 'Profile',
    yourName: 'Your name',
    enterName: 'Enter your name',
    saveName: 'Save name',
    saved: 'Saved',
    savedMsg: 'Your name was updated.',
    language: 'Language',
    english: 'English',
    spanish: 'Español',
    home: 'Home',
    breathe: 'Breathe',
    tapping: 'Tapping',
    learn: 'Learn',
    help: 'Help',
    settings: 'Settings',
    rateUs: 'Rate us',
    contactUs: 'Contact us',
    faqs: 'FAQs',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    deviceSection: 'PerfectFlow Device',
    acknowledgments: 'Proven Benefits',
    legalSupport: 'Legal & Support',
  },
  es: {
    welcomeHeadline1: 'Encuentra tu calma.',
    welcomeHeadline2: 'Siéntete mejor.',
    welcomeBody:
      'Respiración guiada, sonidos relajantes y herramientas con base científica para reducir el estrés y mejorar tu bienestar.',
    startJourney: 'Comienza tu viaje',
    haveAccount: 'Ya tengo una cuenta',
    greeting: 'Hola',
    motivator: 'Inhala calma. Exhala estrés.',
    resetTitle: 'Reinicia tu estado',
    resetBody: 'Empieza una respiración guiada y siéntete mejor en minutos.',
    startBreathing: 'Comenzar respiración',
    dailyInsight: 'Reflexión diaria',
    moodReset: 'Reinicio emocional',
    weeklyProgress: 'Progreso semanal',
    logout: 'Cerrar sesión',
    logoutDesc: 'Cierra sesión de tu cuenta.',
    dailyInsightDesc: 'Una idea corta de Learn para hoy.',
    moodResetDesc: 'Elige cómo te sientes e inicia una sesión.',
    weeklyProgressDesc: 'Sigue tus respiraciones y momentos de calma.',
    profile: 'Perfil',
    yourName: 'Tu nombre',
    enterName: 'Escribe tu nombre',
    saveName: 'Guardar nombre',
    saved: 'Guardado',
    savedMsg: 'Tu nombre fue actualizado.',
    language: 'Idioma',
    english: 'English',
    spanish: 'Español',
    home: 'Inicio',
    breathe: 'Respira',
    tapping: 'Tapping',
    learn: 'Aprender',
    help: 'Ayuda',
    settings: 'Ajustes',
    rateUs: 'Califícanos',
    contactUs: 'Contáctanos',
    faqs: 'Preguntas frecuentes',
    terms: 'Términos y condiciones',
    privacy: 'Política de privacidad',
    deviceSection: 'Dispositivo PerfectFlow',
    acknowledgments: 'Beneficios comprobados',
    legalSupport: 'Legal y soporte',
  },
} as const;

type Ctx = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: keyof typeof STRINGS.en) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    (async () => {
      const saved = (await AsyncStorage.getItem(LANG_KEY)) as Language | null;
      if (saved === 'en' || saved === 'es') setLanguageState(saved);
    })();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(LANG_KEY, lang);
  };

  const value = useMemo<Ctx>(
    () => ({
      language,
      setLanguage,
      t: (key) => STRINGS[language][key],
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
