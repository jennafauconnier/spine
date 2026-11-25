import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Cover } from '@/components/Cover';
import { Stars } from '@/components/Stars';
import { BOOKS, type Book } from '@/data/books';
import { useStore } from '@/store/StoreProvider';
import { fonts, radius, space } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

type Filter = 'all' | 'read' | 'unread';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'read', label: 'Déjà lus' },
  { key: 'unread', label: 'À lire' },
];

export default function SearchScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { ratingOf } = useStore();
  const [q, setQ] = useState('le nom du vent');
  const [filter, setFilter] = useState<Filter>('all');

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return BOOKS.filter((b) => {
      const match = !needle || b.title.toLowerCase().includes(needle) || b.author.toLowerCase().includes(needle);
      const rated = !!ratingOf(b.id);
      return match && (filter === 'all' || (filter === 'read' ? rated : !rated));
    });
  }, [q, filter, ratingOf]);

  const open = (b: Book) => router.push({ pathname: '/book/[id]', params: { id: b.id } });

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top + 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingBottom: space.md }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 18, color: theme.ink, letterSpacing: -0.4 }}>
          Chercher
        </Text>
        <View style={{ borderWidth: 1.5, borderColor: theme.line2, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Text style={{ fontFamily: fonts.uiSemi, fontSize: 10, color: theme.ink }}>Scanner</Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: space.lg,
          height: 44,
          borderRadius: radius.md,
          backgroundColor: theme.surf,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 12,
        }}>
        <Ionicons name="search" size={16} color={theme.ink3} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Titre, auteur, ISBN"
          placeholderTextColor={theme.ink3}
          returnKeyType="search"
          autoCorrect={false}
          style={{ flex: 1, fontFamily: fonts.ui, fontSize: 12.5, color: theme.ink, paddingVertical: 0 }}
        />
        {q ? (
          <Pressable onPress={() => setQ('')} accessibilityRole="button" accessibilityLabel="Effacer la recherche">
            <Ionicons name="close" size={16} color={theme.ink3} />
          </Pressable>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: space.lg, paddingTop: 10 }}>
        {FILTERS.map((f) => {
          const on = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={{
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: on ? theme.ink : theme.line2,
                backgroundColor: on ? theme.ink : 'transparent',
                paddingHorizontal: 11,
                paddingVertical: 7,
              }}>
              <Text style={{ fontFamily: fonts.uiMedium, fontSize: 10.5, color: on ? theme.bg : theme.ink2 }}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ fontFamily: fonts.ui, fontSize: 9, letterSpacing: 0.9, textTransform: 'uppercase', color: theme.ink3, paddingHorizontal: space.lg, paddingTop: space.lg, paddingBottom: 6 }}>
        {results.length} résultat{results.length > 1 ? 's' : ''}
      </Text>

      <FlatList
        data={results}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ paddingBottom: space.xxl }}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: theme.line, marginLeft: space.lg + 53 }} />}
        renderItem={({ item }) => {
          const entry = ratingOf(item.id);
          return (
            <Pressable
              onPress={() => open(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${item.author}`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: space.lg, paddingVertical: 10 }}>
              <Cover book={item} width={42} height={62} showText={false} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.uiSemi, fontSize: 12.5, color: theme.ink }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={{ fontFamily: fonts.ui, fontSize: 9.5, color: theme.ink2, marginTop: 2 }} numberOfLines={1}>
                  {item.author} · {item.year}
                </Text>
                {entry ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
                    <Stars value={entry.value} size={9} />
                    <Text style={{ fontFamily: fonts.uiSemi, fontSize: 9, color: theme.ink2 }}>
                      {entry.value.toFixed(1).replace('.', ',')}
                    </Text>
                  </View>
                ) : null}
              </View>
              {entry ? (
                <Text style={{ fontFamily: fonts.uiSemi, fontSize: 9, color: theme.ink2 }}>Déjà lu</Text>
              ) : (
                <View style={{ borderWidth: 1.5, borderColor: theme.accLine, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ fontFamily: fonts.uiSemi, fontSize: 9.5, color: theme.acc }}>Ajouter</Text>
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}
