import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

/** Bouton de thème : icône seule, 32 pt, même gabarit partout. */
export function ThemeToggle({ size = 32 }: { size?: number }) {
  const { theme, mode, toggle } = useTheme();
  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={mode === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
      hitSlop={8}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: theme.line2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Ionicons name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={size * 0.5} color={theme.ink} />
    </Pressable>
  );
}
