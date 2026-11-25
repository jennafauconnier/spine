import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Cover } from '@/components/Cover';
import { Stars } from '@/components/Stars';
import { bookById } from '@/data/books';
import { useStore } from '@/store/StoreProvider';
import { fonts, radius, space } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = bookById(id);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { ratingOf } = useStore();
  const entry = ratingOf(book.id);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 4, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.lg }}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={10}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Ionicons name="chevron-back" size={20} color={theme.acc} />
            <Text style={{ fontFamily: fonts.uiSemi, fontSize: 12, color: theme.acc }}>Retour</Text>
          </Pressable>
          <Ionicons name="ellipsis-horizontal" size={18} color={theme.ink2} />
        </View>

        <View style={{ alignSelf: 'center', marginTop: space.md }}>
          <Cover book={book} width={132} />
        </View>

        <Text style={{ fontFamily: fonts.display, fontSize: 21, color: theme.ink, textAlign: 'center', marginTop: space.lg, marginHorizontal: 24, letterSpacing: -0.4 }}>
          {book.title}
        </Text>
        <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: theme.ink2, textAlign: 'center', marginTop: 3 }}>
          {book.author}
        </Text>
        <Text style={{ fontFamily: fonts.ui, fontSize: 10.5, color: theme.ink3, textAlign: 'center', marginTop: 8 }}>
          {book.publisher} · {book.year} · {book.pages} pages
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: space.lg, paddingVertical: 14, paddingHorizontal: space.lg, borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme.line }}>
          <Stars value={book.average} size={13} />
          <Text style={{ fontFamily: fonts.display, fontSize: 15, color: theme.ink }}>
            {book.average.toFixed(1).replace('.', ',')}
          </Text>
          <Text style={{ fontFamily: fonts.ui, fontSize: 9.5, color: theme.ink3 }}>
            {book.readers.toLocaleString('fr-FR')} lecteurs
          </Text>
        </View>

        {entry ? (
          <View style={{ paddingHorizontal: space.lg, paddingTop: space.lg }}>
            <Text style={{ fontFamily: fonts.ui, fontSize: 9, letterSpacing: 0.9, textTransform: 'uppercase', color: theme.ink3 }}>
              Votre note
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <Stars value={entry.value} size={14} />
              <Text style={{ fontFamily: fonts.uiSemi, fontSize: 11, color: theme.ink2 }}>
                {entry.value.toFixed(1).replace('.', ',')} sur 5
              </Text>
            </View>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 20, paddingTop: space.lg }}>
          <Text style={{ fontFamily: fonts.ui, fontSize: 11.5, lineHeight: 18, color: theme.ink2 }}>
            « Un récit d’apprentissage qui prend son temps, et c’est exactement ce qu’on lui demande. »
          </Text>
          <Text style={{ fontFamily: fonts.ui, fontSize: 9.5, color: theme.ink3, marginTop: 6 }}>
            {entry ? "Votre avis n’est pas encore écrit." : 'Aucun avis pour le moment.'}
          </Text>
        </View>

        <View style={{ paddingHorizontal: space.lg, paddingTop: space.lg }}>
          <Text style={{ fontFamily: fonts.ui, fontSize: 9, letterSpacing: 0.9, textTransform: 'uppercase', color: theme.ink3 }}>
            L’histoire
          </Text>
          <Text style={{ fontFamily: fonts.ui, fontSize: 11, lineHeight: 17, color: theme.ink2, marginTop: 5 }}>
            Kvothe raconte sa vie en trois jours : l’enfance chez les ménestrels, l’université, le nom du vent.
            Un livre qui prend son temps — et le vôtre.
          </Text>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: space.lg,
          paddingTop: 10,
          paddingBottom: insets.bottom + 10,
          backgroundColor: theme.bg,
          borderTopWidth: 1,
          borderTopColor: theme.line,
          flexDirection: 'row',
          gap: 8,
        }}>
        <Button
          label={entry ? 'Modifier ma note' : 'Noter ce livre'}
          wide
          style={{ flex: 1 }}
          onPress={() => router.push({ pathname: '/rate/[id]', params: { id: book.id } })}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ajouter à ma bibliothèque"
          style={{
            width: 52,
            height: 52,
            borderRadius: radius.pill,
            borderWidth: 1.5,
            borderColor: theme.line2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="add" size={22} color={theme.ink} />
        </Pressable>
      </View>
    </View>
  );
}
