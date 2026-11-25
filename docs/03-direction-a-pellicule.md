# Direction — « Pellicule »

## Intention
Sensation d'entrer dans une salle obscure où seule la couverture du livre est éclairée : les détails s'estompent pour laisser l'œuvre respirer.
Référence l'affiche de cinéma et l'interface de MUBI, transposée au livre : la couverture est l'unique star, la critique se saisit en un geste.
Pour l'utilisateur, cela change tout : noter devient un réflexe tactile (≤ 2 gestes) et retrouver un livre se fait par son image, pas par une liste texte indigeste.

## Références
1. **MUBI** : la mise en avant plein cadre des affiches, le fond qui épouse la couleur dominante de l'image (duotone subtil), le minimalisme des fiches.
2. **Letterboxd** : la mécanique de notation rapide, le journal de lecture comme chronologie, le marquage spoiler.
3. **Plex** : le gestionnaire de bibliothèque sobre, le grain de l'arrière-plan, la navigation par couvertures (rail horizontal).

## Ce qu'on reprend de Letterboxd / ce qu'on ne copie pas
**On reprend (mécanique)** : la notation par étoiles (entières + demi), le journal daté, le tag spoiler, les listes explicables.
**On ne copie pas (visuel)** : le triptyque vert/orange/noir de Letterboxd. On remplace par une palette acajou/ivoire/nuit. La typo condensée n'est pas l'Anton de Letterboxd, mais une sans-serif plus neutre (Archivo Narrow) pour la distinguer. Le fond n'est pas noir absolu, c'est un gris nuit (#1A1A1E) pour adoucir le contraste en lecture mobile.

## Tokens

**Couleurs**
| Rôle | Hex | Contraste texte sur fond principal |
|---|---|---|
| Fond principal (Nuit) | #1A1A1E | — |
| Surface (Grise) | #2C2C30 | 11.2:1 (Texte Ivoire) |
| Texte principal (Ivoire) | #F5F0E8 | 14.8:1 sur Fond Nuit |
| Texte secondaire (Gris) | #9A9A9E | 4.6:1 sur Fond Nuit |
| Accent (Acajou) | `#E0574F` | 4,66:1 sur Fond Nuit — l'acajou `#C73E3A` d'origine ne fait que 3,45:1 |
| Succès (Ivoire) | #F5F0E8 | 14.8:1 sur Accent Acajou |

**Typographie**
| Rôle | Famille | Taille/px | Graisse | Interlettrage |
|---|---|---|---|---|
| Titre | Archivo Narrow | 28 | 700 | -0.5px |
| Sous-titre | Archivo Narrow | 17 | 500 | 0px |
| Corps | Inter | 15 | 400 | 0px |
| Microcopy | Inter | 13 | 400 | 0.5px |
| Numéro (Note) | Archivo Narrow | 48 | 700 | -1px |

**Espacement / rayons / ombres / grille**
- Grille : 4 colonnes, 16pt gouttière, marges 16pt
- Rayons : 8pt (cartes), 4pt (boutons), 0pt (couvertures)
- Ombres : 0pt Y 12pt blur, #00000040
- Grille couverture : ratio 2:3

**Motion**
1. **"Pellicule"** : les couvertures glissent horizontalement (240ms, ease-out) comme un film.
2. **"Flash"** : la validation de note fait un flash acajou sur l'écran (150ms, ease-in-out).

## Composant signature
**"Le Bandeau Pellicule"** : une frise horizontale de couvertures plein cadre qui défile au scroll. Chaque couverture occupe 60% de la largeur (234pt), avec le titre en superposition en bas. Le fond de la frise adopte une teinte moyenne extraite de la couverture (duotone). L'effet "pellicule" vient du défilement : les couvertures latérales sont légèrement floutées et assombries, guidant l'œil vers le centre.

## Écrans

### 1. Découverte
- **Haut** : Header minimal "Spine" (Archivo Narrow 17, Ivoire), icône profil droite.
- **Milieu** : Bandeau "Reprendre" : couverture du livre en cours, titre, "page 142 sur 312", bouton "Reprendre".
- **Bas** : Bandeau Pellicule "Pour vous" : frise horizontale de couvertures.
- **Geste** : scroll horizontal sur le bandeau, tap sur couverture.
- **Microcopy** : "Reprendre La Peste, page 142" · "Pourquoi ? Parce que vous avez noté L'Étranger 4,5★".

### 2. Recherche & résultats
- **Haut** : Barre de recherche avec icône appareil photo (scan), champ texte "Titre, auteur".
- **Milieu** : Grille 2 colonnes de couvertures (plein cadre, pas de texte superposé), titre/auteur en dessous (Inter 13). Badge "Lu" en coin si déjà noté.
- **Bas** : Tab bar : "Grille" | "Liste".
- **Geste** : tap sur icône photo → ouverture scan code-barres. Long-press sur couverture → aperçu rapide.
- **Microcopy** : "Rechercher par titre, auteur ou couverture" · "Scanner un code-barres" · "Aucun résultat ? Essayez la saisie manuelle".

### 3. Fiche livre
- **Haut** : Couverture plein cadre (centrée, 240pt de haut), fond duotone dérivé de la couverture. Titre (Archivo Narrow 28), auteur (Inter 15, Gris). Bouton retour.
- **Milieu** : Note moyenne communautaire (étoiles + chiffre), nombre de votes. Extrait de l'avis le plus populaire.
- **Bas** : Bouton "Noter" (Acajou, 44pt, plein largeur, tiers bas).
- **Geste** : scroll vertical. Tap "Noter" → ouverture Feuille de notation.
- **Microcopy** : "Noté 4,2 par 1 204 lecteurs" · "Lire la critique de Marie" · "Noter ce livre".

### 4. Feuille de notation
- **Haut** : Modal plein écran, fond Nuit. Miniature couverture + titre. Bouton fermer (X) haut droite.
- **Milieu** : Échelle d'étoiles géante (5 étoiles, 48pt, tactiles 44pt). Le tap sur l'étoile de droite (ex: 4ème) valide 3,5 ou 4,0 : tap gauche = demi, tap droite = pleine. Numéro de note géant (48pt) s'affiche en temps réel. Champ texte "Votre avis" (multiline, 120pt). Toggle "Contient un spoiler". Toggle "Privé".
- **Bas** : Sélecteur de statut : "Lu" | "En cours" | "Abandonné" | "Relire". Date affichée (jour). Bouton "Valider" (Acajou, 44pt).
- **Geste** : tap sur étoile (1 geste) → tap "Valider" (2ème geste). Tap sur champ texte pour rédiger.
- **Microcopy** : "Votre note" · "Votre avis (optionnel)" · "Contient un spoiler" · "Privé : visible par moi seul" · "Lu le 12 nov." · "Valider".

### 5. Journal / confirmation
- **Haut** : Animation "Flash" acajou. Texte "Note enregistrée" (Archivo Narrow 28, Ivoire). Sous-texte : "Synchronisée" ou "En attente de réseau".
- **Milieu** : Récit de l'événement : couverture miniature + titre + note en étoiles + date. Si "En attente", icône horloge et texte "Sera synchronisée au retour du réseau".
- **Bas** : Bouton "Voir mon journal" (contour Ivoire). Bouton "Ajouter un avis" (texte simple, Gris).
- **Geste** : tap "Voir mon journal" → timeline des lectures (couverture + note + date).
- **Microcopy** : "Note enregistrée" · "En attente de synchronisation" · "12 nov. 2024, 18:42" · "Voir mon journal".

## Faisabilité React Native
- **Découverte** : M · Le duotone dérivé de la couverture nécessite une extraction de couleur (palette) en RN, à approximer avec une librairie simple.
- **Recherche** : S · Grille standard. Le scan code-barres nécessite expo-camera.
- **Fiche livre** : M · Duotone via palette, mais la fiche est un layout standard.
- **Feuille de notation** : S · Modal standard, composants tactiles natifs. Gestion offline via AsyncStorage.
- **Journal** : S · Layout timeline standard.
- **Point risqué** : l'extraction de la couleur dominante pour le fond duotone des couvertures (Découverte et Fiche). Repli : fond `#1A1A1E` fixe + voile dégradé, sans extraction.
## Risques
1. **Accessibilité** : le duotone de fond peut nuire au contraste. On s'assure que le texte est toujours sur un overlay sombre (#1A1A1E @ 80%) pour garantir le 4.5:1.
2. **Confusion Letterboxd** : la mécanique ressemble, mais la palette acajou/ivoire/nuit et la typo Archivo Narrow (vs Anton) doivent être testées sur 5 utilisateurs avant tout développement.
3. **Performance du scan** : l'ouverture de la caméra (expo-camera) peut être lente sur Android 10 entry-level. Précharger les permissions dès l'app launch.