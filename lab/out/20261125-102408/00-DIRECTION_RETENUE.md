# Direction retenue — « Les Pages »

## Thèse (3 phrases)
La sensation feutrée d'une revue littéraire où le papier grainé absorbe la lumière et impose un rythme lent. On retient l'épure du New York Times Book Review et l'approche documentaire d'Are.na pour faire de Spine un carnet d'annotations personnelles. La notation s'inscrit dans la page comme une trace d'encre, réintégrant l'objet-livre dans sa dimension sensible, sans aucune logique de dashboard.

## Tokens complets
**Couleurs**
- Fond papier crème : `#F4EFE6`
- Texte courant encre noire : `#1A1A1A` (Contraste 14.8:1)
- Texte secondaire encre grise : `#6B6B6B` (Contraste 5.2:1)
- Trait de séparation : `#E5DFD3`
- Accent encre rouge : `#A8341E` (Contraste 5.2:1 sur fond crème)
*Note accessibilité : Le rouge n'est jamais utilisé seul pour signaler un état, toujours doublé d'une icône et de texte.*

**Typographie**
- Titres éditoriaux : `Playfair Display` / 24px / 600 / -0.5px (réduit pour les petits écrans)
- Corps de texte & métadonnées : `Source Serif 4` / 16px / 400 / 0.2px
- Annotations, citations & placeholders : `Spectral` / 12px / 500 / 0.5px (Romain strict, italique banni hors citations)
- Actions & labels techniques : `Inter` / 14px / 600 / 0.3px

**Espacement & Grille**
- Grille : 2 colonnes, 16pt de gouttière, 16pt de marge extérieure
- Rayons : 0pt (images), 2pt (inputs), 4pt (cartes)
- Ombres : Aucune (séparateurs par traits fins `#E5DFD3` de 1pt)
- Espacement de base : 8pt

**Motion**
- Ouverture feuille : 300ms, `ease-in-out`, monte depuis le bas. Si `reduceMotion` : fondu simple 0ms.
- Validation note : 200ms, `ease-out`, trait d'encre sous la note. Si `reduceMotion` : apparition instantanée sans trait.

## Composant signature
La Feuille de notation est une bottom sheet au tiers inférieur, fond papier crème, bordée d'un trait d'encre en haut.
Cinq étoiles en contour noir, zone tactile 44pt : tap gauche remplit une demi-étoile, tap droit une entière.
Sélection remplit l'étoile d'encre rouge, avec un champ de note optionnel et un bouton "Valider" en serif.

## Les 5 écrans

### 1. Découverte
```text
+----------------------------+
|  Spine            12 nov.  |
|                            |
|  En cours                  |
|  [Couverture] La Route     |
|  Reprendre à la page 142   |
|                            |
|  Suggestions               |
|  [Couvert]  [Couverture]   |
|  Title 1     Title 2       |
|  *parce que  *parce que    |
|  noté X 4.5* noté Y 3.5*   |
|                            |
|  [Recherche barre fixe]    |
+----------------------------+
```
**Zones** : En-tête (Playfair), Section En cours ( miniature + reprise), Section Suggestions (grille 2 colonnes, motif de reco collé à la tuile), Barre de recherche fixe.
**Interactions** : Tap sur couverture (Fiche livre), Tap "Reprendre" (Fiche avec raccourci notation), Tap barre de recherche (Recherche).
**Microcopy** : "Reprendre à la page 142", "parce que vous avez noté La Route 4.5★".

### 2. Recherche & résultats
```text
+----------------------------+
| [<] [Photo] [Scan] [Texte]  |
|  Rechercher...             |
|                            |
|  [Couvert]  [Couverture]   |
|  Title 1     Title 2       |
|  Author      Author        |
|  *Déjà noté 4.0★ (icône)   |
|                            |
+----------------------------+
```
**Zones** : Barre unifiée (icônes photo/scan à gauche, input à droite, zéro onglet), Résultats grille 2 colonnes, Badge "Déjà noté" (icône + texte).
**Interactions** : Tap couverture (Fiche livre), Tap icône scan (Ouverture caméra), Tap icône photo (Upload image).
**Microcopy** : "Scanner un code-barres", "Aucun résultat pour cette image, essayer : Le Nom du Vent".

### 3. Fiche livre
```text
+----------------------------+
|       [Couverture]         |
|       Titre Playfair       |
|       Auteur italique      |
|  Editeur, Année, Pages     |
|  ------------------------  |
|  "Citation extraite du     |
|   livre en italique"       |
|                            |
|  Avis (masqué si spoiler)  |
|  Afficher malgré spoiler   |
|  ------------------------  |
|  [Noter] [Ajouter] [Lu]    |
+----------------------------+
```
**Zones** : En-tête centré (couverture + titre + auteur), Métadonnées, Citation en marge, Avis, Barre d'action basse.
**Interactions** : Tap "Noter" (Ouverture feuille), Tap "Afficher" (Révèle texte), Tap "Ajouter" (Ajout + confirmation).
**Microcopy** : "Noter", "Ajouter à ma bibliothèque", "Afficher malgré le spoiler".

### 4. Feuille de notation
```text
+----------------------------+
|        [Poignée]            |
|  Titre livre  Auteur        |
|  [ E ][ E ][ E ][ E ][ E ]  |
|  Écrire une note...        |
|  [X] Contient un spoiler   |
|  [X] Privé                 |
|  [ ] Relire  [ ] Abandonné |
|  [      Valider            ]|
+----------------------------+
```
**Zones** : Poignée, Titre, Échelle de notation 44pt, Champ texte, Toggles, Options avancées datées, Bouton Valider.
**Interactions** : Tap étoile (gauche=demi, droit=entier), Glissement bas (Fermeture), Tap "Valider" (Enregistrement).
**Microcopy** : "Écrire une note", "Contient un spoiler", "Privé", "Relire", "Abandonné (DNF)", "Valider".

### 5. Journal
```text
+----------------------------+
|  Journal            2024   |
|  ------------------------  |
|  ★ Noté 4.5★ La Route      |
|    12 nov. 2024            |
|  ★ Noté 3.0★ Le Nom du Vent|
|    10 nov. 2024            |
|  [Ajouter une note]        |
|  ------------------------  |
|  [Retour à la découverte]  |
+----------------------------+
```
**Zones** : En-tête (Playfair), Entrées chronologiques, Bouton ajout note, Barre d'action basse.
**Interactions** : Tap sur entrée (Fiche livre), Tap "Ajouter" (Champ texte), Tap "Retour" (Découverte).
**Microcopy** : "Noté 4.5★ — La Route, 12 nov.", "Ajouter une note", "En attente de synchronisation" (avec icône horloge).

## Ce que le dev doit savoir
- **La seule vraie difficulté** : Gérer les demi-étoiles via un `View` divisé en deux `TouchableOpacity` 44pt superposés pour capter gauche/droite sans conflit de gesture.
- Le bottom sheet est un `Modal` standard animé avec `react-native-reanimated`, montant depuis le bas, sans ombre, juste un trait `borderTopWidth: 1`.
- `reduceMotion` doit être évalué via `useReducedMotion` et désactiver toute animation de trait ou de sheet (affichage instantané).
- Le fallback de recherche "Aucun résultat pour cette image, essayer : Le Nom du Vent" doit être pré-rempli dans l'input lors d'un échec scan.
- Les badges de statut offline ("En attente") et "Déjà noté" doivent utiliser un icône + texte, jamais la couleur seule.