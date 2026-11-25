# Direction F — « Clair »

> Après deux rejets : v1 « ne change pas assez de Goodreads », v2 (tranches) « pas instinctif ».
> Le brief de cette itération était donc explicite : **compréhensible en 3 secondes, sans geste inventé**.
> Maquettes : `mockups/index.html` (5 écrans).

## Ce qui rend l'app lisible

1. **Une carte « en cours » en cobalt** en haut de l'écran d'accueil : c'est le seul aplat de couleur de l'app, donc l'œil y va immédiatement. Elle contient une seule action, « Reprendre ».
2. **Une barre d'onglets à trois entrées**, avec icône **et** libellé : Découvrir, Chercher, Journal. Aucune navigation cachée, aucun geste à découvrir.
3. **Une action principale par écran** : « Noter ce livre » sur la fiche, « Enregistrer » dans la feuille de notation.
4. **La notation se lit** : 5 étoiles de 32 pt et le chiffre « 4,5 / 5 » en 40 pt à côté. La demi-étoile (moitié gauche d'une étoile) s'explique par une phrase, pas par une animation.
5. **Progressivité** : spoiler, privé, date et relecture sont repliés sous « Plus d'options ». Le parcours principal ne les voit jamais.

## Tokens

| Rôle | Valeur | Contraste |
|---|---|---|
| Fond | `#FFFFFF` | — |
| Surface secondaire | `#F4F4F2` | — |
| Encre | `#0B0B0C` | 19,7:1 |
| Texte secondaire | `#5A5A60` | 6,85:1 |
| Texte tertiaire | `#6E6E74` | 5,07:1 |
| Accent | `#1B4DFF` | 5,91:1 sur blanc · blanc sur cobalt 5,91:1 |

Typographie : Space Grotesk 700 pour les titres (22 / 17 / 15), Inter 400–600 pour l'interface
(13 / 12 / 11 / 10). Marges 16 pt, rayons 12 pt (boutons) et 6 pt (couvertures), **aucune ombre**
sauf la feuille modale.

## Thème sombre

Même structure, mêmes composants, seuls les jetons changent. Le thème clair reste le défaut ; le
sombre est un choix explicite dans les réglages (et suit `useColorScheme` au premier lancement).

| Rôle | Clair | Sombre | Contraste (sombre) |
|---|---|---|---|
| Fond | `#FFFFFF` | `#101013` | — |
| Surface (champs, cartes) | `#F4F4F2` | `#1A1A1E` | — |
| Encre | `#0B0B0C` | `#F3F1EC` | 16,83:1 |
| Secondaire | `#5A5A60` | `#A9A9B0` | 8,13:1 |
| Tertiaire | `#6E6E74` | `#8E8E96` | 5,84:1 |
| Accent | `#1B4DFF` | `#7E97FF` | 7,02:1 |
| Texte sur accent | `#FFFFFF` | `#0B0B0C` | 7,27:1 |
| Carte « en cours » | `#1B4DFF` | `#2233C9` (blanc dessus 8,81:1) | — |

**Point d'attention** : en sombre, le bouton principal passe en bleu clair — il faut donc que le
libellé soit **noir**, pas blanc. C'est le seul endroit où le thème inverse les rôles ; un design
system qui code `color: #fff` en dur sur les boutons se trompe ici.

## Écarts assumés avec Goodreads

| Goodreads | Spine |
|---|---|
| Vert et beige, petites graisses | Blanc, noir, un seul cobalt, titres en 22 pt |
| Fiche encombrée de métadonnées | 4 lignes d'information, une action |
| Notation = formulaire séparé en 3 écrans | Feuille unique, 2 gestes |
| Recherche = liste texte sans hiérarchie | Couverture + titre + statut « Déjà lu » / « Ajouter » |
| Pas de trace datée | Journal : chaque note est un événement daté |

## À faire avant l'implémentation

- Tester la demi-étoile sur 5 personnes : si le geste n'est pas compris, passer à un sélecteur 0,5 → 5 en 10 crans sous les étoiles.
- Décider du comportement hors ligne visible (bandeau « en attente » dans le Journal, déjà maquetté).
- Fournir un visuel de couverture de secours typographique (titre sur aplat) quand `cover_i` manque.
