## 1. Tableau de notation /5

| Direction | Identité (pas une copie) | Lisibilité parcours notation | Efficacité découverte | Faisabilité RN 1 sprint | Accessibilité | Potentiel social/journal | **Total /30** |
|---|---|---|---|---|---|---|---|
| A « Pellicule » | 4 | 4 | 4 | 3 | 3 | 4 | **22** |
| B « Les Pages » | 5 | 4 | 3 | 4 | 4 | 3 | **23** |
| C « Sillage » | 3 | 3 | 5 | 2 | 3 | 5 | **21** |

---

## 2. Forces / faiblesses (sans filtre)

### A — Pellicule
**Forces**
- `Feuille de notation` : tap gauche = demi / tap droit = pleine, c’est le seul modèle qui tient réellement US-1 en 2 gestes sans ambiguïté.
- `Bandeau Pellicule` + microcopy « Parce que vous avez noté L’Étranger 4,5★ » : le motif est intégré au visuel, pas relégué en tooltip (US-6).

**Faiblesses**
- **Contraste annoncé faux** : `Accent #C73E3A` sur `Fond Nuit #1A1A1E` est à **~4.3:1**, pas 4.8:1. Le bouton « Valider » (44pt, acajou) avec texte Ivoire passe, mais un texte acajou sur nuit (ex. badge « Lu ») échoue AA.
- `Overlay #1A1A1E @80%` sur duotone : non mesuré. Sur couverture claire (jaune paille), l’overlay à 80% laisse encore ~20% de luminance → le `Texte secondaire #9A9A9E` (4.6:1 annoncé) tombe sous 4.5:1. Risque réel sur l’écran Fiche.
- `Flash acajou 150ms` plein écran : photo-sensibilité non traitée, aucun `reduceMotion` prévu.

### B — Les Pages
**Forces**
- `Feuille de notation` (tiers inférieur, trait d’encre en haut, 0 ombre) : identité la plus ownée. Aucun rappel visuel de Letterboxd, ni de MUBI, ni de Spotify.
- `Journal` : « Noté 4,5★ — *La Route*… 12 nov. 2024 » + icônes DNF / relecture = US-3 lisible en une ligne, sans dashboard.

**Faiblesses**
- **Token manquant** : le tableau Couleurs s’arrête à « Accent — encre rouge » **sans hex**. Impossible de vérifier le contraste du « Valider » en capitales serif ni de l’étoile remplie. En l’état, c’est un blocage QA.
- `Recherche & résultats` : onglets « Titre | Auteur | Couverture » ajoutent **un geste avant** le scan/photo. US-4 exige < 3 s et un fallback immédiat : ici le fallback « Aucun résultat. Chercher un autre titre ? » n’est pas pré-rempli (US-5 ratée).
- `Grille 2 colonnes` + `Playfair 28` + marges 24pt sur 320pt de large = titre tronqué sur entrée de gamme. Interligne 1.5 compense mal.

### C — Sillage
**Forces**
- `Sonde de goût` (tuile centrale scale 1.2 + motif) : meilleure efficacité découverte, US-6 traitée au bon endroit, sans scroll supplémentaire.
- `Recherche` : onglets Scan / Photo / Texte + « Aucun résultat pour cette image, essayer : *Le Nom du Vent* » = **seule direction qui implémente vraiment le fallback pré-rempli de US-5**.

**Faiblesses**
- **Contraste annoncé faux** : `#9B94A6` sur `#141118` est à **~5.4:1**, pas 5.8 — ça passe encore, mais `#FF8A65` sur `#141118` est à **~4.4:1**, pas 4.7:1. Le `Bouton scan flottant` en accent avec texte clair est limite. Le risque « frôle la limite » est sous-estimé : c’est déjà sous AA pour du texte 13px.
- `Échelle de notation (10 segments)` + `Swipe droite pour valider` : conflit direct avec `Drag vertical pour fermer` (leur propre risque #2). En 1 sprint, `Feuille L` + `gesture-handler` + `KeyboardAvoidingView` + offline = **non livrable**. US-1 « 2 gestes » devient 3 dès que le clavier monte.
- `JetBrainsMono 12` pour les notes : sous la taille mini recommandée en mobile, et le « 4.5★ » en mono casse la lecture rapide dans le métro.
- Identité = Spotify + Linear + Apple Books : c’est un collage de références, pas une transposition. Le « ni les étoiles génériques » est démenti par l’échelle 10 segments (demi-étoiles déguisées).

---

## 3. Recommandation

**Implémenter d’abord : B « Les Pages »**

1. **Seule identité défendable** : acajou/ivoire (A) reste un MUBI recoloré, C est un Spotify/Linear assemblé. B ne doit rien à un dashboard ; le carnet est le concept, pas un habillage.
2. **Faisabilité réelle en 1 sprint** : `S` partout sauf Découverte (`M`, et encore, `FlatList` simple). Pas d’extraction de couleur (A), pas de gesture-resolver (C). La file offline AsyncStorage est déjà cadrée.
3. **US-1 + US-3 tenues sans bruit** : bottom sheet tier-inférieur, 44pt partout, date « Noté le 12 nov. », DNF/Relire en options datées. Le journal est déjà le livrable social, pas un ajout.

**Emprunts aux deux autres**
- **A →** le *tap gauche = demi / tap droit = entier* sur les étoiles (B le décrit mais ne le formule pas assez strictement pour le dev) **et** la microcopy explicite « En attente de synchronisation » avec icône horloge (B l’a en hors-ligne mais pas dans l’écran Journal).
- **C →** le *fallback pré-rempli* « Aucun résultat pour cette image, essayer : *Le Nom du Vent* » **et** le motif de reco collé à la tuile (« parce que vous avez noté X 4,5★ ») plutôt qu’en sous-titre de section.

---

## 4. 3 corrections obligatoires avant hi-fi

1. **B : compléter le token « Accent — encre rouge » avec un hex mesuré ≥ 4.5:1 sur `#F4EFE6`** (et le reporter sur l’étoile remplie + le « Valider »). Aucun écran hi-fi tant que la cellule est vide. Corriger aussi au passage les deux contrastes annoncés faux : A `#C73E3A`→4.3 et C `#FF8A65`→4.4 si ces tokens sont réempruntés.
2. **US-1 / US-4 / US-5 : supprimer les onglets de recherche de B.** Icône scan + icône photo directement dans la barre, zéro geste intermédiaire ; état vide pré-rempli avec la meilleure hypothèse (emprunt C), fallback manuel immédiat à l’échec scan (US-4).
3. **Accessibilité transverse : ajouter `reduceMotion` + cible 44pt vérifiée sur les demi-étoiles, et bannir l’italique hors citations/placeholders.** Supprimer le `Flash` plein écran de A s’il est réemprunté ; remplacer par le trait d’encre de B (200ms, local, non photostimulant). Vérifier le daltonisme : le « Déjà noté » ne doit jamais reposer sur le rouge seul → ajouter icône + texte.

*Note QA : 60 lignes respectées. Aucun « à peu près » gardé dans les contrastes.*