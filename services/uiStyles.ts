export const GLASS_CARD_BASE = {
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.49)',
  backgroundColor: 'rgba(255,255,255,0.09)',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 30,
  shadowOffset: { width: 0, height: 4 } as const,
};

export const GLASS_CARD_SOFT = {
  ...GLASS_CARD_BASE,
  borderColor: 'rgba(255,255,255,0.35)',
  backgroundColor: 'rgba(255,255,255,0.08)',
};

export const GLASS_CARD_DARK = {
  ...GLASS_CARD_BASE,
  borderColor: 'rgba(183,197,255,0.40)',
  backgroundColor: 'rgba(6,12,38,0.55)',
  shadowOpacity: 0.18,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 10 } as const,
};
