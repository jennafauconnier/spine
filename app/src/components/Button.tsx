import { useCallback, useState } from 'react';
import { Animated, Pressable, Text, View, type ViewStyle } from 'react-native';

import { fonts, radius, space } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

type Variant = 'primary' | 'outline';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  /** libellé à gauche, flèche ronde à droite (bouton pleine largeur) */
  wide?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
};

/** Bouton capsule — 52 pt, libellé Space Grotesk, flèche optionnelle. */
export function Button({ label, onPress, variant = 'primary', wide, disabled, style, testID }: Props) {
  const { theme } = useTheme();
  const [scale] = useState(() => new Animated.Value(1));
  const press = useCallback(
    (to: number) =>
      Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 0 }).start(),
    [scale],
  );

  const primary = variant === 'primary';
  const bg = primary ? theme.acc : 'transparent';
  const fg = primary ? theme.onAcc : theme.ink;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => press(0.975)}
        onPressOut={() => press(1)}
        style={{
          height: 52,
          borderRadius: radius.pill,
          backgroundColor: bg,
          borderWidth: primary ? 0 : 1.5,
          borderColor: theme.line2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: wide ? 'space-between' : 'center',
          paddingLeft: wide ? 22 : space.lg,
          paddingRight: wide ? 9 : space.lg,
          opacity: disabled ? 0.4 : 1,
        }}>
        <Text
          style={{
            fontFamily: fonts.uiSemi,
            fontSize: 14,
            letterSpacing: 0.1,
            color: fg,
          }}>
          {label}
        </Text>
        {wide ? (
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: primary ? theme.onAccSoft : theme.surf,
            }}>
            <Text style={{ color: fg, fontSize: 15, marginTop: -1 }}>→</Text>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}
