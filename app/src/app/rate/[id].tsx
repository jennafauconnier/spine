import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Cover } from '@/components/Cover';
import { Stars } from '@/components/Stars';
import { bookById } from '@/data/books';
import { useStore, type Status } from '@/store/StoreProvider';
import { fonts, radius, space } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

export default function RateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = bookById(id);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { rate, ratingOf } = useStore();
  const existing = ratingOf(book.id);

  const [value, setValue] = useState(existing?.value ?? 0);
  const [review, setReview] = useState(existing?.review ?? '');
  const [status, setStatus] = useState<Status>(existing?.status ?? 'read');
  const [advanced, setAdvanced] = useState(false);
  const [spoiler, setSpoiler] = useState(false);
  const [priv, setPriv] = useState(false);

  const [slide] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(slide, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide]);

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [560, 0] });

  const close = () => router.back();

  const save = () => {
    if (value <= 0) return;
    rate({ bookId: book.id, value, review, status });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, justifyContent: 'flex-end' }}>
      {/* Voile : assombrit la fiche livre restée visible derrière */}
      <Pressable
        accessible={false}
        onPress={close}
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(11, 11, 12, 0.45)' }]}
      />

      <Animated.View
        style={{
          backgroundColor: theme.bg,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: space.lg,
          paddingTop: 8,
          paddingBottom: insets.bottom + 12,
          transform: [{ translateY }],
        }}>
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.line2,
            alignSelf: 'center',
            marginBottom: 14,
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Cover book={book} width={34} showText={false} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.uiSemi, fontSize: 12, color: theme.ink }} numberOfLines={1}>
              {book.title}
            </Text>
            <Text style={{ fontFamily: fonts.ui, fontSize: 10, color: theme.ink2 }} numberOfLines={1}>
              {book.author}
            </Text>
          </View>
          <Text style={{ fontFamily: fonts.display, fontSize: 38, color: theme.ink, letterSpacing: -1 }}>
            {value > 0 ? value.toFixed(1).replace('.', ',') : '—'}
            <Text style={{ fontFamily: fonts.ui, fontSize: 13, color: theme.ink3 }}> /5</Text>
          </Text>
        </View>

        <View style={{ marginTop: 14 }} accessibilityLabel="Note sur 5">
          <Stars value={value} size={32} onChange={setValue} />
        </View>
        <Text style={{ fontFamily: fonts.ui, fontSize: 9.5, color: theme.ink3, marginTop: 8 }}>
          Touchez la moitié gauche d’une étoile pour une demi-note.
        </Text>

        <TextInput
          value={review}
          onChangeText={setReview}
          placeholder="Ajouter un avis (facultatif)"
          placeholderTextColor={theme.ink3}
          multiline
          style={{
            marginTop: 14,
            minHeight: 62,
            borderWidth: 1,
            borderColor: theme.line2,
            borderRadius: radius.md,
            padding: 10,
            fontFamily: fonts.ui,
            fontSize: 11.5,
            lineHeight: 17,
            color: theme.ink,
            textAlignVertical: 'top',
          }}
        />

        <Pressable
          onPress={() => setAdvanced((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded: advanced }}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
          <Text style={{ fontFamily: fonts.uiMedium, fontSize: 11.5, color: theme.ink }}>Plus d’options</Text>
          <Text style={{ fontFamily: fonts.ui, fontSize: 10, color: theme.ink3 }}>
            {advanced ? 'masquer' : 'spoiler · privé · statut'}
          </Text>
        </Pressable>

        {advanced ? (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
              <Text style={{ fontFamily: fonts.ui, fontSize: 11, color: theme.ink2 }}>Contient un spoiler</Text>
              <Switch value={spoiler} onValueChange={setSpoiler} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
              <Text style={{ fontFamily: fonts.ui, fontSize: 11, color: theme.ink2 }}>Privé</Text>
              <Switch value={priv} onValueChange={setPriv} />
            </View>
            <View style={{ flexDirection: 'row', gap: 6, paddingTop: 6 }}>
              {(['read', 'reread', 'dnf'] as Status[]).map((s) => {
                const on = status === s;
                const label = s === 'read' ? 'Lu' : s === 'reread' ? 'Relire' : 'Abandonné';
                return (
                  <Pressable
                    key={s}
                    onPress={() => setStatus(s)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    style={{
                      borderRadius: radius.pill,
                      borderWidth: 1,
                      borderColor: on ? theme.ink : theme.line2,
                      backgroundColor: on ? theme.ink : 'transparent',
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                    }}>
                    <Text style={{ fontFamily: fonts.uiMedium, fontSize: 10, color: on ? theme.bg : theme.ink2 }}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            marginTop: advanced ? 8 : 2,
            borderTopWidth: 1,
            borderTopColor: theme.line,
            marginBottom: 12,
          }}>
          <Text style={{ fontFamily: fonts.uiMedium, fontSize: 10.5, color: theme.ink2 }}>
            Lu le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
          <Text style={{ fontFamily: fonts.uiSemi, fontSize: 10.5, color: theme.acc }}>Modifier</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button label="Annuler" variant="outline" style={{ width: 108 }} onPress={close} />
          <Button label="Enregistrer" style={{ flex: 1 }} disabled={value <= 0} onPress={save} />
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
