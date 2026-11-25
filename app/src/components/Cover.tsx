import { Text, View, type ViewStyle } from 'react-native';

import type { Book } from '@/data/books';
import { fonts } from '@/theme/tokens';

type Props = {
  book: Book;
  width: number;
  height?: number;
  showText?: boolean;
  style?: ViewStyle;
};

/**
 * Couverture de secours : deux aplats, une diagonale, le titre.
 * Aucune dépendance, aucun réseau — remplacée par expo-image au sprint 2.
 */
export function Cover({ book, width, height, showText = true, style }: Props) {
  const h = height ?? Math.round(width * 1.5);
  const [a, b] = book.art;
  const fg = book.ink ?? '#FFFFFF';

  return (
    <View style={[{ width, height: h, borderRadius: 6, overflow: 'hidden', backgroundColor: a }, style]}>
      <View
        style={{
          position: 'absolute',
          left: -width * 0.4,
          right: -width * 0.4,
          top: h * 0.42,
          bottom: -h * 0.1,
          backgroundColor: b,
          transform: [{ rotate: '-14deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.12)',
          borderRadius: 6,
        }}
      />
      {showText ? (
        <View style={{ flex: 1, justifyContent: 'flex-end', padding: Math.max(5, width * 0.075) }}>
          <View
            style={{
              width: Math.max(10, width * 0.22),
              height: 1,
              backgroundColor: fg,
              opacity: 0.55,
              marginBottom: Math.max(3, width * 0.045),
            }}
          />
          <Text
            numberOfLines={3}
            style={{
              fontFamily: fonts.display,
              fontSize: Math.max(7, width * 0.095),
              lineHeight: Math.max(8, width * 0.104),
              letterSpacing: -0.2,
              color: fg,
            }}>
            {book.title}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
