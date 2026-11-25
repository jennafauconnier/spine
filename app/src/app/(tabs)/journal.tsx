import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Cover } from '@/components/Cover';
import { Stars } from '@/components/Stars';
import { bookById } from '@/data/books';
import { useStore } from '@/store/StoreProvider';
import { fonts, radius, space } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export default function JournalScreen() {
  const { theme, mode, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const { entries } = useStore();
  const pending = entries.some((e) => e.pending);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 2, paddingBottom: space.xxl }}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingBottom: space.md }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 20, color: theme.ink, letterSpacing: -0.5 }}>
          Journal
        </Text>
        <Pressable
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={mode === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
          style={{ borderWidth: 1.5, borderColor: theme.line2, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 7 }}>
          <Text style={{ fontFamily: fonts.uiSemi, fontSize: 9.5, color: theme.ink }}>
            {mode === 'dark' ? 'Thème clair' : 'Thème sombre'}
          </Text>
        </Pressable>
      </View>

      {pending ? (
        <View
          style={{
            marginHorizontal: space.lg,
            marginBottom: space.sm,
            backgroundColor: theme.accWeak,
            borderColor: theme.accLine,
            borderWidth: 1,
            borderRadius: 10,
            padding: 9,
            flexDirection: 'row',
            gap: 7,
            alignItems: 'center',
          }}>
          <Ionicons name="cloud-offline-outline" size={13} color={theme.acc} />
          <Text style={{ fontFamily: fonts.uiMedium, fontSize: 9.5, color: theme.acc, flex: 1 }}>
            Une note attend le réseau. Elle partira toute seule.
          </Text>
        </View>
      ) : null}

      {entries.map((entry) => {
        const book = bookById(entry.bookId);
        const d = new Date(entry.createdAt);
        return (
          <View
            key={entry.id}
            style={{ flexDirection: 'row', gap: 11, paddingHorizontal: space.lg, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.line }}>
            <View style={{ width: 36 }}>
              <Text style={{ fontFamily: fonts.uiSemi, fontSize: 8.5, letterSpacing: 0.6, textTransform: 'uppercase', color: theme.ink3 }}>
                {d.getDate()}
                {'\n'}
                {MONTHS[d.getMonth()].slice(0, 3).toUpperCase()}
              </Text>
            </View>
            <Cover book={book} width={32} height={48} showText={false} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.uiSemi, fontSize: 12, color: theme.ink }} numberOfLines={1}>
                {book.title}
              </Text>
              <View style={{ marginTop: 3 }}>
                <Stars value={entry.value} size={10} />
              </View>
              {entry.review ? (
                <Text style={{ fontFamily: fonts.ui, fontSize: 9.5, color: theme.ink2, marginTop: 4, lineHeight: 14 }}>
                  « {entry.review} »
                </Text>
              ) : null}
              <Text style={{ fontFamily: fonts.uiSemi, fontSize: 8, letterSpacing: 0.5, textTransform: 'uppercase', color: entry.status === 'dnf' ? theme.ink2 : theme.acc, marginTop: 5 }}>
                {entry.status === 'dnf' ? 'Abandonné' : entry.status === 'reread' ? 'Relecture' : 'Lu'}
                {entry.pending ? ' · en attente' : ''}
              </Text>
            </View>
          </View>
        );
      })}

      {entries.length === 0 ? (
        <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: theme.ink3, textAlign: 'center', marginTop: space.xxl }}>
          Aucune lecture notée pour l’instant.
        </Text>
      ) : null}
    </ScrollView>
  );
}
