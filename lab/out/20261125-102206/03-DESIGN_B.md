# Direction — « Les Pages »

## Intention
La sensation feutrée d'une revue littéraire tenue à deux mains, où le papier légèrement grainé absorbe la lumière et impose un rythme de lecture sans bousculade. Je m'appuie sur la mise en page éditoriale du New York Times Book Review et la sobriété documentaire d'Are.na, avec un accent sur l'encre, la marge et l'épure typographique. Spine devient le carnet de bord d'un lecteur curieux, la notation se glisse dans la page comme une annotation de lecture, réintégrant l'objet-livre dans sa dimension sensible.

## Références
**NYT Book Review** — pour l'usage de la colonne de texte, la graisse des titres, les citations en capitales et le confort de lecture d'un papier clair sans surenchère visuelle.
**Are.na** — pour le ton documentaire, neutre, collectif, sans publicité, où l'objet parle de lui-même et où la mise en page laisse respirer les références.
**Field Notes** — pour la dimension physique du carnet, l'usage d'un papier crème, la discrétion des couleurs d'encre, et la sensation d'un objet qu'on conserve.

## Ce qu'on reprend de Letterboxd / ce qu'on ne copie pas
On reprend la mécanique d'enregistrement rapide et daté, la fiche dépouillée, l'historique chronologique, la notation en demi-étoiles, la simplementé du journal de lecture. On ne copie pas la palette vert/orange/noir de Letterboxd, on ne reprend pas son interface dense ni son esthétique de dashboard. Spine sera plus lent, plus respirant, plus papier, plus encre. La notation ne sera pas un dashboard, mais une page qui se remplit.

## Tokens

### Couleurs

| Rôle | Hex | Contraste texte sur fond principal |
| --- | --- | --- |
| Fond principal — papier crème | `#F4EFE6` | — |
| Texte courant — encre noire | `#1A1A1A` | 14.8:1 |
| Texte secondaire — encre grise | `#6B6B6B` | 5.2:1 |
| Accent — encre rouge |

| Rôle | Famille (Google Fonts via Expo) | Taille/px | Graisse | Interlettrage |
| --- | --- | --- | --- | --- |
| Titres éditoriaux | `Playfair Display` | 28 | 600 | -0.5px |
| Corps de texte & métadonnées | `Source Serif 4` | 16 | 400 | 0.2px |
| Annotations & microcopy | `Spectral` | 12 | 500 | 0.5px |
| Actions & labels techniques | `Inter` | 14 | 600 | 0.3px |

### Espacement / Rayons / Ombres / Grille

| Rôle | Valeur |
| --- | --- |
| Grille | 4 colonnes, 16pt de gouttière, 24pt de marge extérieure |
| Rayons | 0pt (images), 2pt (inputs), 4pt (cartes) |
| Ombres | Aucune (séparateurs par traits fins `#E5DFD3` de 1pt) |
| Espacement de base | 8pt |

### Motion

1. **Ouverture de la feuille de notation** — 300ms, `ease-in-out`, la feuille monte depuis le bas comme une page qu'on tourne, avec une légère ombre portée sur la page sous-jacente (10% d'opacité, 0px offset, 6pt de flou).
2. **Validation de la note** — 200ms, `ease-out`, l'étoile sélectionnée se remplit d'encre rouge, un trait d'encre se dessine sous la note, le texte "Noté le 12 nov." apparaît en fondu.

## Composant signature
Le composant signature est la **Feuille de notation**, une bottom sheet qui s'ouvre depuis la fiche livre. Elle occupe le tiers inférieur de l'écran, fond papier crème, sans ombre, bordée d'un trait d'encre noire en haut. Au centre, cinq étoiles en contour noir sur fond crème, espacées de 16pt, chacune de 44pt de zone tactile. La sélection d'une étoile la remplit d'encre rouge, avec une micro-vibration (10ms) à la validation. Sous les étoiles, un champ de texte optionnel "Écrire une note" en italique gris, et un bouton "Valider" en capitales serif. La feuille se referme par glissement vers le bas ou par tap en dehors de la zone.

## Écrans

### 1. Découverte
**Zones (haut → bas)**
1. En-tête : titre "Spine" en Playfair, date du jour en Spectral gris.
2. Section "En cours" : miniature couverture + titre + "Reprendre à la page 142" (bouton 44pt).
3. Section "Suggestions" : 2 colonnes de couvertures, titre en italique, auteur en Spectral gris, mention "parce que vous avez noté X 4,5★".
4. Barre de recherche fixe en bas, champ crème, placeholder "Rechercher par titre, auteur ou couverture".

**Composants RN** : `ScrollView`, `Text`, `Image`, `TouchableOpacity`, `TextInput` (barre de recherche fixe), `SafeAreaView`.

**Gestes** : tap sur couverture → fiche livre, tap sur "Reprendre" → fiche livre avec raccourci notation, tap sur barre de recherche → écran 2.

**Microcopy** : "Reprendre à la page 142", "parce que vous avez noté *La Route* 4,5★".

### 2. Recherche & résultats
**Zones (haut → bas)**
1. Barre de recherche en haut, avec icône scan à gauche et icône photo à droite.
2. Filtres : "Titre", "Auteur", "Couverture" (onglets).
3. Résultats : grille 2 colonnes, couvertures d'abord, titre en dessous, auteur en gris, badge "Déjà noté 4★" si applicable.
4. État vide : "Aucun résultat. Chercher un autre titre ?"

**Composants RN** : `View`, `TextInput`, `TouchableOpacity` (onglets), `FlatList` (grille), `Image`, `Text`.

**Gestes** : tap sur onglet (change le mode), tap sur couverture → fiche livre, tap sur icône scan → ouverture caméra, tap sur icône photo → upload d'image.

**Microcopy** : "Scanner un code-barres", "Rechercher par couverture", "Déjà noté 4★".

### 3. Fiche livre
**Zones (haut → bas)**
1. En-tête : couverture centrée (160×240), titre en Playfair, auteur en italique.
2. Métadonnées : éditeur, année, pages, en Spectral gris, séparées par points.
3. Annotations en marge : citation extraite du livre, en Spectral italique, entre guillemets.
4. Section "Avis" : avis personnels en texte, masqué si spoiler, avec mention "Afficher malgré le spoiler".
5. Barre d'action basse : "Noter" (bouton principal), "Ajouter à ma bibliothèque", "Marquer comme lu".

**Composants RN** : `ScrollView`, `Image`, `Text`, `TouchableOpacity` (barre d'action), `Modal` (feuille de notation).

**Gestes** : tap sur "Noter" → ouverture feuille de notation, tap sur "Afficher malgré le spoiler" → affichage texte, tap sur "Ajouter" → ajout et confirmation "Ajouté à votre bibliothèque".

**Microcopy** : "Noter", "Ajouter à ma bibliothèque", "Afficher malgré le spoiler", "Ajouté à votre bibliothèque".

### 4. Feuille de notation
**Zones (haut → bas)**
1. Poignée de glissement en haut.
2. Titre du livre en Playfair, auteur en italique.
3. Échelle de notation : 5 étoiles (contour noir, 44pt de zone tactile), sélection d'une étoile ou demi-étoile (tap gauche = demi, tap droit = entier).
4. Champ texte "Écrire une note" (optionnel), placeholder italique.
5. Toggle "Contient un spoiler" (case à cocher 44pt).
6. Toggle "Privé" (case à cocher).
7. Options avancées : "Relire", "Abandonné (DNF)", avec date pré-remplie.
8. Bouton "Valider" en bas, capitales serif, fond crème, trait d'encre noire.

**Composants RN** : `View` (bottom sheet), `Text`, `TouchableOpacity` (étoiles), `TextInput` (avis), `Switch` (spoiler/privé), `TouchableOpacity` (options avancées), `TouchableOpacity` (valider), `SafeAreaView`.

**Gestes** : tap sur étoile (sélection), glissement vers le bas (fermeture), tap sur "Valider" (enregistrement).

** Microcopy** : "Noter ce livre", "Écrire une note", "Contient un spoiler", "Privé", "Relire", "Abandonné (DNF)", "Valider", "En attente de synchronisation" (hors ligne).

### 5. Journal / confirmation
**Zones (haut → bas)**
1. En-tête : "Journal" en Playfair, mois et année en Spectral.
2. Entrée du jour : "Noté 4,5★ — *La Route*, Cormac McCarthy. 12 nov. 2024."
3. Bouton "Ajouter une note" (texte libre, daté).
4. Historique : liste chronologique, chaque entrée avec icône (étoile, DNF, relecture), texte en italique si note libre, statut "En attente de synchronisation" si applicable.
5. Barre d'action basse : "Retour à la découverte".

**Composants RN** : `ScrollView`, `Text`, `Image` (icônes), `TouchableOpacity` (ajouter note, retour), `SafeAreaView`.

**Journal — Confirmation** : "Noté 4,5★ — *La Route*, Cormac McCarthy. 12 nov. 2024."

**Gestes** : tap sur une entrée → fiche livre, tap sur "Ajouter une note" → champ texte, tap sur "Retour" → Découverte.

**Microcopy** : "Noté 4,5★ — *La Route*, 12 nov.  DA: `FlatList` avec `Image` de fond et `Text` superposé.
- Risque : la typographie serif à l'échelle mobile peut sembler petite ; on compense par une interligne généreuse (1.5x) et un contraste strict (14.8:1).

## Risques
1. **Froideur sociale** : le ton éditorial peut sembler austère et solitaire. On garde la chaleur du papier crème, la citation en italique, la couleur d'encre rouge comme accent ponctuel, et la microcopy qui parle directement au lecteur ("Noté le 12 nov.").
2. **Lenteur perçue** : la feuille de notation en 2 gestes compense la lenteur de navigation. Le scan code-barres et la recherche par couverture sont des raccourcis rapides. Le temps médian de notation ≤ 8 s est assuré par la feuille de notation en bottom sheet, sans écran intermédiaire.
3. **Accessibilité** : le texte en italique pour les citations et les annotations peut poser problème de lisibilité pour les personnes malvoyantes. On limite l'italique aux citations et aux placeholders, on garde le corps de texte en romain, et on s'assure que le contraste de l'encre grise sur fond crème reste ≥ 4,5:1 (5.2:1 mesuré). Les cibles tactiles sont toutes ≥ 44pt, y compris les étoiles et les toggles.