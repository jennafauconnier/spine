# Spine — application Expo

Expo SDK 58 · React Native 0.88 · expo-router · TypeScript strict.

```bash
bun install          # ou npm install
bun run ios          # simulateur iOS
bun run android
bun run web          # aperçu navigateur (vérifié)
```

## Ce qui est implémenté (sprint 1)

| Écran | Route | État |
|---|---|---|
| Mes livres | `src/app/(tabs)/index.tsx` | en cours, liste d'envies, lus récemment, suggestions |
| Chercher | `src/app/(tabs)/search.tsx` | recherche locale, filtres, statut « déjà lu » |
| Journal | `src/app/(tabs)/journal.tsx` | timeline datée, bandeau hors ligne, bascule de thème |
| Fiche livre | `src/app/book/[id].tsx` | couverture, note communautaire, résumé, CTA |
| Notation | `src/app/rate/[id].tsx` | 5 étoiles avec demi-étoile au tap, avis, options repliées |

Design system dans `src/theme/tokens.ts` (thèmes clair et sombre), composants dans `src/components/`
(`Button`, `Stars`, `Cover`), état en mémoire dans `src/store/StoreProvider.tsx`.

## Ce qui n'est pas encore là (sprint 2)

- Aucune API : les livres viennent de `src/data/books.ts` (7 entrées de démonstration).
- Aucune persistance : les notes vivent en mémoire, elles disparaissent au redémarrage.
- Le scan ISBN et les couvertures distantes (`expo-image`) ne sont pas branchés.
- Pas de tests automatisés ; `bunx tsc --noEmit` et `bunx eslint .` passent.

## Vérifications faites

- `bunx tsc --noEmit` — 0 erreur.
- `bunx eslint .` — 0 erreur.
- `bun run web` — les 5 écrans s'affichent, thèmes clair et sombre, notation fonctionnelle.
