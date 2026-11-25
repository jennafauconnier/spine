import { useColorScheme } from 'react-native';

/**
 * Jetons de la direction F « Clair » (docs/09-direction-f-clair.md).
 * Contrastes vérifiés : encre 19,7:1 · secondaire 6,85:1 · tertiaire 5,07:1 · accent 5,91:1.
 * En sombre : encre 16,8:1 · accent 7,0:1 · texte sur accent 7,3:1.
 */
export type Mode = 'light' | 'dark';

export type Theme = {
  mode: Mode;
  bg: string;
  surf: string;
  ink: string;
  ink2: string;
  ink3: string;
  line: string;
  line2: string;
  acc: string;
  onAcc: string;
  onAccSoft: string;
  hero: string;
  onHero: string;
  accWeak: string;
  accLine: string;
  starEmpty: string;
};

const light: Theme = {
  mode: 'light',
  bg: '#FFFFFF',
  surf: '#F4F4F2',
  ink: '#0B0B0C',
  ink2: '#5A5A60',
  ink3: '#6E6E74',
  line: '#EDEDEA',
  line2: '#DCDCD7',
  acc: '#1B4DFF',
  onAcc: '#FFFFFF',
  onAccSoft: 'rgba(255,255,255,0.22)',
  hero: '#1B4DFF',
  onHero: '#FFFFFF',
  accWeak: '#F3F5FF',
  accLine: '#DDE3FF',
  starEmpty: '#E4E4DF',
};

const dark: Theme = {
  mode: 'dark',
  bg: '#101013',
  surf: '#1A1A1E',
  ink: '#F3F1EC',
  ink2: '#A9A9B0',
  ink3: '#8E8E96',
  line: '#26262B',
  line2: '#34343A',
  acc: '#7E97FF',
  onAcc: '#0B0B0C',
  onAccSoft: 'rgba(11,11,12,0.14)',
  hero: '#2233C9',
  onHero: '#FFFFFF',
  accWeak: '#171C33',
  accLine: '#2A3560',
  starEmpty: '#55555F',
};

export const palettes = { light, dark } as const;

export function useSystemMode(): Mode {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}

export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiSemi: 'Inter_600SemiBold',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 6, md: 12, pill: 999 } as const;
