import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Cover } from '@/components/Cover';
import { Stars } from '@/components/Stars';
import { ThemeToggle } from '@/components/ThemeToggle';
import { bookById } from '@/data/books';
import { useStore, type Entry } from '@/store/StoreProvider';
import { fonts, space } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

function fullDate(ts: number) {
  const d = new Date(ts);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

type Group = { key: string; label: string; items: Entry[] };

function groupByMonth(entries: Entry[]): Group[] {
  const groups = new Map<string, Group>();
  for (const entry of entries) {
    const d = new Date(entry.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!groups.has(key)) {
      groups.set(key, { key, label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, items: [] });
    }
    groups.get(key)!.items.push(entry);
  }
  return Array.from(groups.values());
}

export default function JournalScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { entries } = useStore();
  const pending = entries.some((e) => e.pending);
  const groups = useMemo(() => groupByMonth(entries), [entries]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 2, paddingBottom: space.xxl }}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingBottom: space.md }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 20, color: theme.ink, letterSpacing: -0.5 }}>
          Journal
        </Text>
        <ThemeToggle />
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

      {groups.map((group) => (
        <View key={group.key}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingHorizontal: space.lg,
              paddingTop: space.xl,
              paddingBottom: 4,
            }}>
            <Text
              style={{
                fontFamily: fonts.uiSemi,
                fontSize: 10,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                color: theme.ink3,
              }}>
              {group.label}
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.line }} />
            <Text style={{ fontFamily: fonts.ui, fontSize: 9.5, color: theme.ink3 }}>
              {group.items.length} {group.items.length > 1 ? 'notes' : 'note'}
            </Text>
          </View>

          {group.items.map((entry) => {
            const book = bookById(entry.bookId);
            const d = new Date(entry.createdAt);
            return (
              <View
                key={entry.id}
                accessible
                accessibilityLabel={`${book.title}, noté ${entry.value} sur 5, le ${DAYS[d.getDay()]} ${fullDate(entry.createdAt)}`}
                style={{
                  flexDirection: 'row',
                  gap: 11,
                  paddingHorizontal: space.lg,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.line,
                }}>
                <View style={{ width: 38 }}>
                  <Text style={{ fontFamily: fonts.display, fontSize: 19, lineHeight: 21, color: theme.ink }}>
                    {String(d.getDate()).padStart(2, '0')}
                  </Text>
                  <Text style={{ fontFamily: fonts.ui, fontSize: 9, color: theme.ink3, marginTop: 1 }}>
                    {DAYS[d.getDay()].slice(0, 3)}.
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
                  <Text
                    style={{
                      fontFamily: fonts.uiSemi,
                      fontSize: 8,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      color: entry.status === 'dnf' ? theme.ink2 : theme.acc,
                      marginTop: 5,
                    }}>
                    {entry.status === 'dnf' ? 'Abandonné' : entry.status === 'reread' ? 'Relecture' : 'Lu'}
                    {entry.pending ? ' · en attente' : ''}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}

      {entries.length === 0 ? (
        <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: theme.ink3, textAlign: 'center', marginTop: space.xxl }}>
          Aucune lecture notée pour l’instant.
        </Text>
      ) : null}
    </ScrollView>
  );
}
