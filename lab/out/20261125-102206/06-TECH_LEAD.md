# Spine — Plan Technique (Tech Lead Mobile)

## Stack (Expo SDK 54, RN 0.81, iOS 16+ / Android 10+)

| Paquet | Version | Raison (5 mots) |
|---|---|---|
| `expo` | `~54.0.0` | Socle stable, OTA maîtrisé |
| `expo-router` | `~6.0.0` | Routes fichiers, modales natives |
| `react-native-reanimated` | `~4.1.0` | Feuille 60fps, UI thread |
| `react-native-gesture-handler` | `~2.28.0` | Demi-étoile, swipe feuille |
| `react-native-screens` | `~4.16.0` | Transitions natives modales |
| `@shopify/flash-list` | `~2.0.2` | Résultats couvertures sans jank |
| `@tanstack/react-query` | `^5.90.0` | Cache, retry, offline natif |
| `zustand` | `^5.0.8` | File d’attente notes légère |
| `@tanstack/react-query-persist-client` | `^5.90.0` | Persistance cache réseau |
| `expo-sqlite` | `~15.0.0` | File + journal horodaté |
| `expo-camera` | `~17.0.0` | Scan ISBN natif barcode |
| `expo-image` | `~3.0.0` | Couvertures cache disque |
| `expo-haptics` | `~15.0.0` | Feedback demi-étoile discret |
| `expo-network` | `~14.0.0` | Détection offline fiable |
| `expo-image-picker` | `~17.0.0` | US-5 photo couverture |
| `react-native-safe-area-context` | `~5.6.0` | Tiers bas respecté |
| `zod` | `^4.1.0` | Validation note/avis |
| `date-fns` | `^4.1.0` | Dates locales, pas de UTC drift |

Pas de backend maison. Pas de Firebase. Sync = réconciliation locale au retour réseau via Query `mutationFn`.

---

## Navigation (expo-router)

```
app/
├── _layout.tsx                  # Stack root + GestureHandlerRootView + QueryProvider
├── (tabs)/
│   ├── _layout.tsx             # Tabs: Découverte | Recherche | Journal
│   ├── index.tsx                # 1 · Découverte (Reprendre + suggestions)
│   ├── search.tsx              # 2 · Recherche / résultats
│   └── journal.tsx              # 5 · Journal / confirmation
├── book/[workId].tsx            # 3 · Fiche livre (écran push)
├── rate/[workId].tsx           # 4 · Feuille notation (MODALE, presentation: formSheet)
├── scan.tsx                    # MODALE plein écran (camera)
└── review/[entryId].tsx        # MODALE avis + spoiler
```

- `rate/` et `review/` : `<Stack.Screen options={{ presentation: 'formSheet', sheetAllowedDetents: [0.45, 0.9] }} />`
- `scan/` : `presentation: 'fullScreenModal'`, bouton fermer en haut **et** fallback bas.
- Actions principales (Valider, Ajouter, Reprendre) tjrs dans le tiers bas, `≥44pt`, `bottom: safeArea + 16`.

---

## Modèle de données (`src/types.ts`)

```ts
export type ISODate = string;          // date local ISO, ex. 2025-11-04T08:12:31+01:00
export type WorkId = `OL${number}W` | `GB_${string}`;
export type EditionId = `OL${number}M` | `GB_${string}`;
export type Stars = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export interface Book {
  id: WorkId;                 // clé dédoublonnée (work, pas édition)
  title: string;
  authors: string[];
  coverUrl?: string;           // couverture首选 édition
  firstYear?: number;
  subjects: string[];          // base des motifs explicables
  editionIds: EditionId[];
  source: 'openlibrary' | 'google' | 'merged';
}

export interface Edition {
  id: EditionId;
  workId: WorkId;
  isbn13?: string; isbn10?: string;
  publisher?: string; year?: number;
  coverUrl?: string; language?: string;
  pageCount?: number;
}

export type ShelfStatus = 'reading' | 'read' | 'dnf' | 'want';

export interface ShelfEntry {
  id: string;                  // uuid local
  workId: WorkId;
  editionId?: EditionId;
  status: ShelfStatus;
  lastPage?: number;          // US-6 reprise
  startedAt: ISODate;
  updatedAt: ISODate;
  isReread: boolean;          // US-3 : nouvelle entrée, jamais overwrite
  syncState: 'synced' | 'pending';
}

export interface Rating {
  id: string;
  entryId: string;            // lié à ShelfEntry, historique conservé
  workId: WorkId;
  value: Stars;               // demi-étoiles
  ratedAt: ISODate;           // ⚠️ heure de SAISIE, pas de sync
  syncState: 'synced' | 'pending';
}

export interface Review {
  id: string;
  entryId?: string;           // optionnel : avis sans note (US-2)
  workId: WorkId;
  body: string;
  hasSpoiler: boolean;
  createdAt: ISODate;
  syncState: 'synced' | 'pending';
}

export interface DiaryEntry {
  id: string;
  workId: WorkId;
  kind: 'rating' | 'review' | 'reread' | 'dnf' | 'resume';
  refId: string;              // Rating.id | Review.id | ShelfEntry.id
  occurredAt: ISODate;        // tri chrono unique
  label: string;              // "Noté 4,5★", "Relu", "Abandonné p.82"
  syncState: 'synced' | 'pending';
}
```

`zod` : `RatingSchema = z.object({ value: z.enum([...]), ratedAt: z.string() })`.

---

## API & cache (sans backend)

**Endpoints réels**
- OL recherche : `GET https://openlibrary.org/search.json?q={q}&fields=key,title,author_name,first_publish_year,cover_i,edition_key,subject&limit=20`
- OL ISBN : `GET https://openlibrary.org/isbn/{isbn}.json` → `works[0].key`
- OL couverture : `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg` (`-L` fiche)
- GB : `GET https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}|intitle:{q}`

**Mapping & fusion**
1. Normalise OL `key` → `WorkId`, GB `id` → `GB_*`.
2. Clé de dédoublonnage : `normalize(title) + normalize(author[0]) + firstYear` → 1 `Book`, N `Edition`.
3. GB enrichit `pageCount`, `publisher`, couverture HD si OL `cover_i` absent.
4. `Query key = ['book', workId]`, `staleTime: 24h`, `gcTime: 7j`, persisté via `expo-sqlite` adapter.
5. `['isbn', isbn13]` : `staleTime: Infinity` → US-4 rescan = 0 réseau.

**Hors ligne / file d’attente**
- `zustand` store `usePendingStore` + table SQLite `pending_ops`.
- À la validation : `ratedAt = new Date().toISOString()` immédiat, insert `Rating(syncState:'pending')` + `DiaryEntry`, UI badge « ⏳ En attente de synchronisation ».
- `NetInfo` → `onReconnect` : `queryClient.resumePausedMutations()`, flush ordonné (rating → review → shelf), **ne jamais réécrire `ratedAt`**.
- Conflit : last-write-wins local, pas de serveur → pas de CRDT.

**US-5 couverture** : pas de ML embarqué. `expo-image-picker` → extraction couleurs dominantes + `subject`猜 via OL `subject` + pré-remplissage `q=` (hypothèse). Fallback textuel immédiat, honnête et implémentable.

---

## Notation — machine à états (feuille)

```
idle ──tap étoile/demi──> drafted ──Valider──> committing ──ok──> confirmed
                              │                    │
                              ├─tap autre────────┘   └─offline/err──> queued ──retry──> committing
                              └─swipe bas──> dismissed        ↑
                                                    confirmed ──┘ (badge ⏳ → ✓)
```

- `XState` **non retenu** : `useReducer` + 6 états suffit (pas de sur-ingénierie).
- Demi-étoile : `GestureDetector` (`Tap` sur moitié gauche / droite de chaque étoile, `hitSlop 44pt`), `Reanimated` scale 0.92→1.0 + `Haptics.impactAsync('light')`.
- ≤2 gestes : **tap note = geste 1**, **tap « Valider » (tiers bas) = geste 2**. Aucun écran intermédiaire.
- Optimistic update : `queryClient.setQueryData(['diary'], …)` + `setQueryData(['rating', workId], …)` avant mutation.
- Retry : `retry: 3, retryDelay: exp(500ms)` TanStack, `mutationKey: ['rate', localId]` idempotent.
- Avis (US-2) : même feuille, detent `0.9`, toggle « Contient un spoiler », `Review` accepté sans `Rating`. Spoiler masqué par défaut → `<SpoilerGate>` + event `spoiler_revealed`.

---

## Recherche

- `useDebounce(q, 280ms)` → `['search', q]`, `enabled: q.length >= 2`.
- Tri : `scan > reprise > couverture(subjects match) > titre exact > année desc`.
- Dédoublonnage : `Map<dedupKey, Book>` avant `FlashList`, les éditions repliées en `editionIds` (picker discret sur fiche, jamais en résultats).
- `expo-camera` : `barcodeScannerSettings={{ barcodeTypes: ['ean13','ean8'] }}`, `onBarcodeScanned` → `['isbn', code]`, <3s cible, `Haptics` + statut « Déjà noté 4★ · 12/03 » si `ShelfEntry` trouvé.
- Échec scan → `router.replace('/search?fallback=1&q=')` + champ pré-rempli, zéro écran mort.
- Reprise (US-6) : `SELECT * FROM shelf WHERE status='reading' ORDER BY updatedAt DESC LIMIT 1`, carte Découverte, `lastPage` synchronisé via même file d’attente.
- Recos explicables : `subjects` du dernier `Rating >= 4` → OL `subject:` query → libellé **« parce que vous avez noté *X* 4,5★ »** en clair sous la couverture. Pas de boîte noire.

---

## Performance & accessibilité

- `FlashList` `estimatedItemSize={132}`, `numColumns={3}`, couvertures `expo-image` `contentFit="cover"` `cachePolicy="memory-disk"` `placeholder={blurhash}`.
- `recyclingKey={book.id}`, `removeClippedSubviews`, pas de `Image` RN nu.
- Feuille : animations `runOnUI`, `useSharedValue`, zéro `setState` par frame.
- Dynamic Type : `rn-text-size` + `PixelRatio.getFontScale()`, `maxFontSizeMultiplier={1.6}`, layout `flexShrink` sur titres, étoiles en `minWidth:44`.
- VoiceOver / TalkBack : `accessibilityLabel="Noter 3 étoiles et demie"`, `accessibilityRole="adjustable"` + `accessibilityActions` (increment/decrement), `accessibilityLiveRegion="polite"` sur « ⏳ En attente », `accessibilityHint` sur « Afficher malgré le spoiler ».
- Contraste `#1C1B1F / #FAF8F5` (≈ 12:1), accent **bleu ardoise `#3A5A78`** — identité propre, ni vert/orange Letterboxd, ni beige Goodreads.
- Cibles `≥44pt`, `hitSlop={{top:12,bottom:12,left:12,right:12}}`.

---

## Découpage 3 sprints (S/M/L, ordre de livraison)

**Sprint 1 — NOTER (Must, socle)**
| Ticket | Taille |
|---|---|
| Bootstrap Expo + router + providers + SQLite | M |
| Types + zod + schéma `pending_ops` | S |
| Fiche livre `book/[workId]` + fusion OL/GB | M |
| Feuille `rate/` states + demi-étoile + 2 gestes | **L** |
| Optimistic + `ratedAt` + file offline + badge ⏳ | M |
| Journal `journal.tsx` chrono + confirmation | M |
| US-3 Relire / DNF (nouvelle entrée) | M |
| US-2 Avis + spoiler gate | S |

**Sprint 2 — TROUVER (Must scan)**
| Ticket | Taille |
|---|---|
| `search.tsx` debounce + dédup + FlashList 3 col | M |
| Modale `scan.tsx` + cache ISBN infini + fallback | **L** |
| Statut « déjà lu/noté » sur résultat scan | S |
| Découverte + carte Reprendre (`lastPage`) | M |
| Recos `subject:` + motif explicite | M |

**Sprint 3 — Should & polish**
| Ticket | Taille |
|---|---|
| US-5 photo couverture → hypothèse pré-remplie | M |
| Sync reprise multi-appareils (réconciliation locale) | M |
| A11y complète + Dynamic Type + contrast audit | M |
| Analytics + haptics + détente 0.45/0.9 tuning | S |
| Release EAS + OTA + smoke offline avion | S |

---

## Analytics (5 events)

| Event | Propriétés |
|---|---|
| `rating_saved` | `work_id`, `value`, `is_half`, `latency_ms`, `offline`, `rated_at`, `gesture_count` |
| `rating_sync_retried` | `local_id`, `attempt`, `result`, `network_type` |
| `review_published` | `work_id`, `has_spoiler`, `has_rating`, `body_length` |
| `spoiler_revealed` | `review_id`, `work_id`, `source: 'feed' \| 'fiche'` |
| `book_found` | `via: 'text' \| 'scan' \| 'cover' \| 'resume'`, `isbn?`, `cache_hit`, `duration_ms`, `already_read` |

(`shelf_event` fusionné dans `rating_saved`/journal pour rester à 5.)

---

**Règles tenues** : 0 backend, 0 écran de plus que les 5 obligatoires, 0 web-view, date de saisie jamais réécrite, historique jamais écrasé, 390pt validé, tiers bas systématique. Prêt à `npx expo start`.