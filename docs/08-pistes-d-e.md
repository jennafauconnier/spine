# Pistes D et E — deux identités qui rompent avec Goodreads

> Ajout après retour utilisateur sur la v1 : « je n'aime pas l'UI, je n'ai pas l'impression que ça change de Goodreads ».
> Diagnostic : les trois directions v1 étaient toutes construites sur les mêmes références (objet-livre, papier, couverture, étoiles).
> Même en changeant la palette, elles restaient dans la grammaire de Goodreads : **une grille de couvertures + une rangée d'étoiles**.
> Les deux pistes ci-dessous changent la grammaire, pas seulement la couleur. Maquettes : `mockups/index.html`.

---

## D — « Tranche »

**Thèse.** L'étagère vue de face. Un livre n'est plus une vignette de couverture mais une tranche debout, colorée, d'épaisseur réelle. On tire une tranche vers soi pour l'ouvrir. Le nom du produit devient le principe de l'interface.

**Ce qui rompt avec Goodreads**
- Zéro grille de couvertures, zéro vignette : la découverte est un **mur d'étagères** à trois rangées, fait de rectangles verticaux typographiés.
- Zéro étoile : on **tire une barre verticale vers le haut**, la tranche se remplit de couleur. 4,5/5 = 90 % de hauteur. Le chiffre est affiché en 62 px.
- Les résultats de recherche ne sont pas des cartes mais une **liste numérotée** en capitales condensées + métadonnées monospace.

**Tokens**

| Rôle | Valeur |
|---|---|
| Mur | `#0F1011` |
| Encre | `#F2F0EA` (15,9:1) |
| Accent acide | `#D8FF3E` (sur noir : 15,6:1) |
| Tranches | vermillon `#FF4A1C`, cobalt `#2B4CFF`, acide `#D8FF3E`, lilas `#C6A8FF`, sable `#F3EDE0`, ambre `#FF9E2C` |
| Typo | Archivo Narrow 700 (titres, capitales), JetBrains Mono (métadonnées) |
| Rythme | 3 rangées de 152 pt, gouttière 3 pt, filet de 1 pt sous chaque rangée |

**Faisabilité RN** : bonne. `ScrollView` verticale + lignes en `flex`, tranches en `View` avec `transform: rotate`, texte en `writing-mode` simulé par rotation (attention : le texte vertical ne se fait pas nativement, on tourne chaque `Text` de 90°). Le geste de notation est un `PanGestureHandler` vertical avec snap aux 10 demi-points.

**Risque principal** : la lisibilité des titres verticaux. Il faut accepter que seuls 10–14 caractères tiennent sur une tranche : le mur est un index, pas une fiche. Alternative : afficher le titre à l'horizontale sur les tranches larges (> 40 pt).

---

## E — « Affiche »

**Thèse.** Un livre par écran, plein cadre, comme une affiche de film. Grandes capitales par-dessus la couverture, bandeau ticker, aplats. On avance au swipe vertical, on note sur une échelle de 10 barres.

**Ce qui rompt avec Goodreads**
- Un seul livre à la fois, en plein écran : pas de liste, pas de grille, pas de densité.
- L'écran de recherche est un **aplat acide avec du texte noir et des filets de 2 pt** — l'inverse chromatique complet de la fiche Goodreads (blanc, vert, gris).
- La notation est une **échelle de 10 barres de 42 pt** qu'on tape au pouce, avec un chiffre de 80 px. Pas d'étoiles.
- Le bandeau ticker en haut donne le pouls du produit (nouveautés, amis, notations) sans feed.

**Tokens**

| Rôle | Valeur |
|---|---|
| Fond | `#0B0B0B` |
| Encre | `#F4F1E8` (17,4:1) |
| Acide | `#E4FF3A` — texte noir dessus : 17,1:1 |
| Typo | Space Grotesk 700 (titres), JetBrains Mono (métadonnées) |
| Rayons | 0 pt partout |
| Grille | marges 14 pt, filets 2 pt |

**Faisabilité RN** : bonne, mais tout repose sur l'image : il faut des couvertures haute résolution (`expo-image`, `contentFit: cover`) et un fallback typographique propre quand `cover_i` est absent. Le swipe vertical est un `FlatList` `pagingEnabled` + `snapToInterval`.

**Risque principal** : un livre par écran = une recommandation par écran. Si l'algorithme se trompe, l'utilisateur le voit tout de suite. À compenser par un motif de reco toujours visible (`PARCE QUE DUNE 5.0`).

---

## Ce qu'il faut trancher

| Question | D · Tranche | E · Affiche |
|---|---|---|
| Où vit le livre ? | dans une étagère collective | seul, plein écran |
| Geste signature | tirer une tranche | swiper une affiche |
| Ton | inventaire, précis, nocturne | éditorial, affirmé, pop |
| Risque produit | lisibilité des titres verticaux | dépendance à la qualité des couvertures |
| Effet « waouh » en démo | fort (le mur) | fort (les aplats acides) |
