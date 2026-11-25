import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  value: number;
  size?: number;
  /** fourni => les étoiles sont tactiles (moitié gauche = demi-étoile) */
  onChange?: (value: number) => void;
};

function Star({ fill, size, color, empty }: { fill: number; size: number; color: string; empty: string }) {
  return (
    <View style={{ width: size * 1.02, height: size * 1.1 }}>
      <Text style={{ position: 'absolute', fontSize: size, lineHeight: size * 1.1, color: empty }}>★</Text>
      {fill > 0 ? (
        <View style={{ position: 'absolute', width: fill * size, overflow: 'hidden' }}>
          <Text style={{ fontSize: size, lineHeight: size * 1.1, color }}>★</Text>
        </View>
      ) : null}
    </View>
  );
}

export function Stars({ value, size = 14, onChange }: Props) {
  const { theme } = useTheme();
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={{ flexDirection: 'row' }} accessibilityRole={onChange ? 'adjustable' : 'image'}
      accessibilityLabel={`${value} étoiles sur 5`}
      accessibilityValue={{ min: 0.5, max: 5, now: value, text: `${value} sur 5` }}>
      {stars.map((i) => {
        const fill = value >= i ? 1 : value >= i - 0.5 ? 0.5 : 0;
        const star = <Star fill={fill} size={size} color={theme.acc} empty={theme.starEmpty} />;
        if (!onChange) return <View key={i}>{star}</View>;
        return (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`${i} étoile${i > 1 ? 's' : ''}`}
            hitSlop={4}
            onPress={(e) => {
              const half = e.nativeEvent.locationX < size / 2;
              onChange(i - 0.5 + (half ? 0 : 0.5));
            }}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}
