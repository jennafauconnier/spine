import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { palettes, type Mode, type Theme } from './tokens';

type ThemeCtx = {
  theme: Theme;
  mode: Mode;
  /** null = suit le système */
  setMode: (m: Mode | null) => void;
  toggle: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system: Mode = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [override, setOverride] = useState<Mode | null>(null);
  const mode = override ?? system;
  const theme = palettes[mode];

  const toggle = useCallback(() => setOverride(mode === 'dark' ? 'light' : 'dark'), [mode]);

  const value = useMemo(() => ({ theme, mode, setMode: setOverride, toggle }), [theme, mode, toggle]);
  return (
    <Ctx.Provider value={value}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme doit être utilisé dans <ThemeProvider>');
  return ctx;
}
