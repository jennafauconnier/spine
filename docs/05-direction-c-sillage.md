# Direction — « Sillage »

## Intention
Une sensation de bibliothèque personnelle fluide et chaleureuse, où l'on glisse entre les couvertures sans frottement.
Spotify pour la découverte, Linear pour la rigueur des interactions, Apple Books pour la mise en valeur visuelle.
L'utilisateur retrouve un livre en un regard et note son parcours de lecture en deux gestes, sans jamais ressentir le poids de la machine.

## Références
- **Spotify** : les modules de recommandation explicables ("parce que vous avez écouté...") et la rapidité de l'enregistrement d'un like en arrière-plan.
- **Linear** : la précision des feuilles modales (bottom-sheet), la hiérarchie typographique stricte, et l'absence de décor superflu.
- **Apple Books** : la grille de couvertures plein cadre qui devient le sujet principal, le grain de papier subtil en fond de l'interface.

## Ce qu'on reprend de Letterboxd / ce qu'on ne copie pas
On reprend la mécanique de journal de lecture datée, les tags personnels et la densité d'information sur la fiche d'un media.
On ne copie pas l'identité visuelle (vert/orange/noir), ni les étoiles génériques, ni le côté encyclopédique et surchargé des fiches.

## Tokens
- Couleurs :
  | Rôle | Hex | Contraste texte sur fond principal |
  |---|---|---|
  | Fond principal | `#141118` | - |
  | Surface (cartes/sheets) | `#221B2A` | 11.2:1 |
  | Texte principal | `#F4F1EA` | 14.5:1 sur `#141118` |
  | Texte secondaire | `#9B94A6` | 5.8:1 sur `#141118` |
  | Accent (Action) | `#FF8A65` | 4.7:1 sur `#141118` |

- Typographie :
  | Rôle | Famille (Google Fonts) | Taille/px | Graisse | Interlettrage |
  |---|---|---|---|---|
  | Titres | Manrope | 24 | 800 | -0.5px |
  | Corps | Inter | 15 | 500 | 0px |
  | Métadonnées | Inter | 13 | 600 | 0.5px |
  | Notes/Chiffres | JetBrainsMono | 12 | 700 | 0px |

- Espacement / rayons / ombres / grille :
  | Rôle | Valeurs |
  |---|---|
  | Grille | 2 colonnes, gouttière 12pt, marges 16pt |
  | Rayons | Cartes 12pt, Bottom-sheets 24pt (haut), Couvertures 4pt |
  | Ombres | `0 4px 16px rgba(0,0,0,0.4)` pour les sheets flottants |
  | Espacement | Échelle base 4pt (4, 8, 12, 16, 24, 32) |

- Motion :
  | Transition | Durée | Easing |
  |---|---|---|
  | Ouverture bottom-sheet notation | 250ms | `cubic-bezier(0.32, 0.72, 0, 1)` |
  | Apparition couvertures (Découverte) | 350ms | `ease-out` avec opacité 0 à 1 et translateY 10 à 0 |

## Composant signature
La "Sonde de goût" : un module horizontal de tuiles couvertures avec un titre contextuel.
Au lieu d'un simple carrousel, la tuile centrale est légèrement agrandie (1.2x) et accompagnée de son motif de recommandation.
En RN, implémenté via un `FlatList` horizontal avec `snapToInterval` et un `View` parent en `scale` au `onViewableItemsChanged`.

## Écrans

### 1. Découverte
- **Zones** : En-tête compact > Raccourci "Reprendre" > Sonde de goût (Recommandations) > Grille "Humeurs" > Nouveautés.
- **Composants RN** : `SafeAreaView`, `Text`, `FlatList` (horizontal), `TouchableOpacity` (grille 2x2).
- **Gestes** : Scroll vertical, Tap sur couverture, Long-press pour aperçu fiche.
- **Microcopy** : `"Reprendre à la page 142"`, `"Parce que vous avez aimé L'Étranger, 4.5★"`, `"Explorer par humeurs : Melancolique, Trépidant..."`

### 2. Recherche & résultats
- **Zones** : Barre de recherche > Onglets (Scan, Photo, Texte) > Grille de résultats couvertures > Bouton scan flottant.
- **Composants RN** : `TextInput`, `TouchableOpacity` (onglets), `FlatList` (grid), `Pressable` (scan), `ActivityIndicator`.
- **Gestes** : Tap pour focus clavier, swipe horizontal entre onglets, tap sur couverture pour ouvrir fiche.
- **Microcopy** : `"Rechercher par titre, auteur, ou photo..."`, `"Scannez le code-barres"`, `"Aucun résultat pour cette image, essayer : Le Nom du Vent"`

### 3. Fiche livre
- **Zones** : Visuel couverture grand format > Titre/Auteur > Vos stats (note, statut) > Motifs de recommandation > Vos tags > Bloc Avis (spoiler masqué).
- **Composants RN** : `Image`, `Text`, `View` (carte glassmorphism légère), `Switch` (spoiler), `ScrollView`.
- **Gestes** : Scroll vertical, Tap sur bouton "Noter" (déclenche feuille), Tap sur spoiler.
- **Microcopy** : `"Noter ce livre"`, `"Contient un spoiler - Afficher malgré tout"`, `"Ajouter à ma bibliothèque"`, `"Déjà lu le 12/03, note : 4.5★"`

### 4. Feuille de notation (le cœur)
- **Zones** : Poignée de préhension > Vignette livre > Échelle de notation (10 segments) > Toggle Statut (Relire/DNF) > Toggle Spoiler > Zone Avis > Bouton Valider.
- **Composants RN** : `Modal` (Bottom-sheet), `Pressable` (segments), `TextInput` (multiline), `Switch` (spoiler), `Text` (date horodatée).
- **Gestes** : Drag vertical pour fermer, Tap sur 1 segment pour note entière/demi, Swipe droite pour valider.
- **Microcopy** : `"Noté le 24 Oct. 14:02"`, `"Contient un spoiler"`, `"Marquer comme abandonné (DNF)"`, `"Synchronisation en attente..."`

### 5. Journal / confirmation
- **Zones** : Confirmation visuelle (check + couverture) > Timeline du jour > Raccourcis profil.
- **Composants RN** : `View` (carte succès), `Text`, `FlatList` (timeline).
- **Gestes** : Tap pour fermer la feuille de confirmation, scroll pour naviguer dans l'historique.
- **Microcopy** : `"Ajouté à votre journal"`, `"Aujourd'hui : 2 lectures notées"`, `"Il y a 3 jours : Relu - Dune"`

## Faisabilité React Native
- **1. Découverte** : M. Les `FlatList` horizontaux imbriqués demandent une gestion stricte de la hauteur des cellules.
- **2. Recherche** : M. Le matching par image nécessite un wrapper natif (ex: Firebase ML), l'UI RN est triviale.
- **3. Fiche livre** : S. Layout classique sous `ScrollView`.
- **4. Feuille de notation** : L. **Point risqué** : La feuille modale avec drag-to-dismiss + gestion du clavier multitouch qui ne doit pas masquer le bouton valider. Nécessite `react-native-gesture-handler` et `KeyboardAvoidingView` natifs.
- **5. Journal** : M. Gestion du cache et du merge file d'attente (offline) avec timeline serveur via `AsyncStorage`.

## Risques
1. **Surcharge cognitive** : Multiplier les "Sondes de goût" explicatives peut saturer l'œil. Limiter à 3 modules maximum par écran.
2. **Faisabilité (Drag & Swipe)** : Le swipe de validation couplé au drag-to-dismiss peut générer des conflits de Gesture Responder sur Android.
3. **Accessibilité (Contraste)** : Le texte secondaire `#9B94A6` sur `#141118` frôle la limite du 4.5:1. À surveiller sur les petits téléphones en plein soleil.