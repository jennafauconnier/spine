import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Cover } from '@/components/Cover';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Stars } from '@/components/Stars';
import { bookById, CURRENT, SUGGESTIONS, WISHLIST, type Book } from '@/data/books';
import { fonts, radius, space } from '@/theme/tokens';
import { useStore } from '@/store/StoreProvider';
import { useTheme } from '@/theme/ThemeProvider';

function Suggestion({ book, width }: { book: Book; width: number }) {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <Pressable
      style={{ width }}
      accessibilityRole="button"
      accessibilityLabel={`${book.title} de ${book.author}`}
      onPress={() => router.push({ pathname: '/book/[id]', params: { id: book.id } })}>
      <Cover book={book} width={width} />
      <Text numberOfLines={2} style={{ fontFamily: fonts.uiSemi, fontSize: 12, color: theme.ink, marginTop: 8 }}>
        {book.title}
      </Text>
      <Text style={{ fontFamily: fonts.ui, fontSize: 10, color: theme.ink2, marginTop: 2 }}>
        {book.author}
      </Text>
      <Text style={{ fontFamily: fonts.ui, fontSize: 9.5, color: theme.ink3, marginTop: 5 }}>
        Parce que vous avez aimé {book.why}
      </Text>
    </Pressable>
  );
}

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { entries } = useStore();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 4, paddingBottom: space.xxl }}
      showsVerticalScrollIndicator={false}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: space.lg,
          paddingBottom: space.md,
        }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 20, color: theme.ink, letterSpacing: -0.5 }}>
          Spine
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: theme.acc }} />
        </View>
      </View>

      {/* carte « en cours » : le seul aplat de couleur de l'app */}
      <Pressable
        onPress={() => router.push({ pathname: '/book/[id]', params: { id: CURRENT.id } })}
        accessibilityRole="button"
        accessibilityLabel={`Reprendre ${CURRENT.title}, page 142 sur 312`}
        style={{
          marginHorizontal: space.lg,
          backgroundColor: theme.hero,
          borderRadius: radius.md + 4,
          padding: 14,
          flexDirection: 'row',
          gap: space.md,
        }}>
        <Cover book={CURRENT} width={56} showText={false} style={{ borderRadius: 5 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.ui, fontSize: 8.5, letterSpacing: 0.8, color: 'rgba(255,255,255,0.82)', textTransform: 'uppercase' }}>
            En cours · p. 142 sur 312
          </Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 16, color: theme.onHero, marginTop: 4 }}>
            {CURRENT.title}
          </Text>
          <Text style={{ fontFamily: fonts.ui, fontSize: 10.5, color: 'rgba(255,255,255,0.85)', marginTop: 1 }}>
            {CURRENT.author}
          </Text>
          <View style={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.28)', marginTop: 10 }}>
            <View style={{ width: '46%', height: 4, borderRadius: 2, backgroundColor: '#fff' }} />
          </View>
          <View
            style={{
              marginTop: 10,
              alignSelf: 'flex-start',
              backgroundColor: '#fff',
              borderRadius: radius.pill,
              height: 30,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}>
            <Text style={{ fontFamily: fonts.uiSemi, fontSize: 10.5, color: theme.hero }}>Reprendre</Text>
            <Text style={{ fontSize: 11, color: theme.hero, marginTop: -1 }}>›</Text>
          </View>
        </View>
      </Pressable>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: space.lg, paddingTop: space.lg, paddingBottom: space.sm }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 13, color: theme.ink }}>Je veux lire</Text>
        <Text style={{ fontFamily: fonts.uiSemi, fontSize: 10, color: theme.acc }}>{WISHLIST.length} livres</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: space.lg }}>
        {WISHLIST.map((b) => (
          <Pressable
            key={b.id}
            style={{ width: 62 }}
            accessibilityRole="button"
            accessibilityLabel={`${b.title}, dans votre liste`}
            onPress={() => router.push({ pathname: '/book/[id]', params: { id: b.id } })}>
            <Cover book={b} width={62} height={92} showText={false} />
            <Text numberOfLines={2} style={{ fontFamily: fonts.ui, fontSize: 9, lineHeight: 12, color: theme.ink2, marginTop: 5 }}>
              {b.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: space.lg, paddingTop: space.xl, paddingBottom: space.sm }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 13, color: theme.ink }}>Lus récemment</Text>
        <Text style={{ fontFamily: fonts.uiSemi, fontSize: 10, color: theme.acc }}>Journal</Text>
      </View>

      {entries.slice(0, 2).map((entry) => {
        const b = bookById(entry.bookId);
        return (
          <Pressable
            key={entry.id}
            accessibilityRole="button"
            accessibilityLabel={`${b.title}, noté ${entry.value} sur 5`}
            onPress={() => router.push({ pathname: '/book/[id]', params: { id: b.id } })}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: space.lg, paddingVertical: 7 }}>
            <Cover book={b} width={30} height={44} showText={false} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={{ fontFamily: fonts.uiSemi, fontSize: 11.5, color: theme.ink }}>
                {b.title}
              </Text>
              <View style={{ marginTop: 3 }}>
                <Stars value={entry.value} size={9} />
              </View>
            </View>
            <Text style={{ fontFamily: fonts.ui, fontSize: 9.5, color: theme.ink3 }}>
              {new Date(entry.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </Text>
          </Pressable>
        );
      })}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: space.lg, paddingTop: space.xl, paddingBottom: space.sm }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 13, color: theme.ink }}>Suggestions</Text>
        <Text style={{ fontFamily: fonts.uiSemi, fontSize: 10, color: theme.acc }}>Tout voir</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: space.md, paddingHorizontal: space.lg }}>
        {SUGGESTIONS.map((b) => (
          <Suggestion key={b.id} book={b} width={140} />
        ))}
      </View>

    </ScrollView>
  );
}
