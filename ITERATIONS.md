# Journal des itérations — Spine

Chaque itération consigne : ce qui a été produit, par quel agent/modèle, combien de tokens, combien ça a coûté.
Le coût est le **coût réel** renvoyé par OpenRouter (`usage.cost`), pas une estimation.
Temps humain non compté (hors périmètre de cette mesure).

**Total engagé à ce jour : 0,1135 $** (≈ 0,10 €) · 2 runs · 8 appels de modèles · ~2 min de calcul.

---

## Itération 1 — Cadrage et 3 directions artistiques

`2026-11-25 10:22` · run `lab/out/20261125-102206/` · 68 s · **0,0892 $**

Demande passée à l'équipe : « Refonte de la notation et de la découverte de livres dans Goodreads ».

| # | Rôle | Modèle | in | out | Coût $ | Durée |
|---|---|---|---|---|---|---|
| 1 | PM — cadrage (objectif, personas, KPI, risques) | `deepseek/deepseek-v4.1-flash` | 556 | 488 | 0,00075 | 2 s |
| 2 | PO — 6 stories Given/When/Then | `deepseek/deepseek-v4.1-flash` | 663 | 1 185 | 0,00162 | 4 s |
| 3 | Design A — « Pellicule » (cinématique, sombre) | `z-ai/glm-5.2` | 2 473 | 2 333 | 0,02059 | 14 s |
| 4 | Design B — « Les Pages » (éditorial, papier) | `z-ai/glm-5.2` | 2 478 | 2 827 | 0,02386 | 11 s |
| 5 | Design C — « Sillage » (moteur de goût) | `z-ai/glm-5.2` | 2 479 | 2 058 | 0,01879 | 13 s |
| 6 | Tech Lead — stack Expo, modèle de données, API | `tencent/hy4` | 1 919 | 3 753 | 0,01099 | 40 s |
| 7 | Critique — grille /30, forces/faiblesses, reco | `tencent/hy4` | 8 959 | 2 058 | 0,01262 | 22 s |

**Routing des modèles** (coût de l'erreur, pas prix au token) : cadrage et stories sur le modèle le
moins cher (DeepSeek flash, 0,14/0,42 $ par M) ; conception visuelle sur le modèle le plus « goût »
disponible sur le compte (GLM-5.2) ; architecture et critique sur un modèle différent du producteur,
pour éviter l'auto-complaisance (hy4).

**Livrables** → `docs/00-brief.md` … `docs/06-critique.md`.

**Ce que l'itération a produit de vraiment utile**
- Une recommandation nette (B « Les Pages ») argumentée sur l'identité et la faisabilité, pas sur le style.
- Une critique qui refuse de valider : elle relève des tokens manquants, des contrastes douteux, des
  onglets de recherche qui coûtent un geste de trop, un geste de validation qui entre en conflit avec
  le drag-to-dismiss.

**Ce qui a mal marché (et ce qu'on en retient)**
1. **Troncatures.** Les trois directions s'arrêtent en pleine phrase sur les derniers paragraphes, et la
   table de couleurs de B perd une cellule (« Accent — encre rouge » sans hex). Un modèle de 2 800
   tokens de sortie ne tient pas 150 lignes de specs : il faut demander **moins de lignes** ou découper.
2. **Les contrastes annoncés sont faux.** Les agents inventent des ratios (A annonce 4,8:1 pour un
   couple qui mesure **3,45:1** ; C annonce 4,7:1 pour un couple qui mesure **8,08:1**). Le calcul WCAG
   doit être fait par un script, jamais par un modèle. `lab/contrast.py` le fait désormais.
3. **La critique n'est pas infaillible non plus** : elle a « corrigé » des ratios faux par d'autres
   ratios faux. Elle reste excellente sur le **jugement** (quel écran coûte un geste de trop), pas sur
   la **mesure**.

---

## Itération 2 — Consolidation de la direction retenue

`2026-11-25 10:24` · run `lab/out/20261125-102408/` · 25 s · **0,0243 $**

Un seul appel (`z-ai/glm-5.2`, 5 247 in / 2 007 out) : fusionner B avec les 2 emprunts imposés
(demi-étoile au tap de A, fallback pré-rempli de C) et appliquer les 3 corrections obligatoires de la
critique. Sortie : `docs/07-direction-retenue.md`, format resserré (110 lignes) — **aucune troncature**.

**Corrections appliquées à la main après coup**
- Accent de B fixé à `#A8341E` : **5,78:1** sur le fond crème (mesuré, pas estimé).
- Accent de A corrigé en `#E0574F` : **4,66:1** (l'acajou d'origine `#C73E3A` tombait à 3,45:1).
- Deux phrases tronquées de A et une de B réécrites ; les deux caractères chinois parasites du plan
  technique (`首选`, `猜`) supprimés.

---

## Itération 3 — Maquettes de la v1

`2026-11-25` · **0 $ de modèle** (produites directement, sans agent)

`docs/mockups/v1-trois-directions.html` — 3 directions × 5 écrans, en CSS/HTML pur.
**Verdict utilisateur : rejeté.** « Je n'aime pas l'UI, je n'ai pas l'impression que ça change de Goodreads. »

**Pourquoi ça a échoué (et ce que ça coûte de ne pas le voir plus tôt)**
Les trois directions v1 partageaient les mêmes références (objet-livre, papier, couvertures, étoiles).
En changeant la palette on change la couleur, pas la grammaire : il restait une **grille de
couvertures** et une **rangée d'étoiles** — exactement ce que fait Goodreads. Le brief demandait
« moderne et inspiré de Letterboxd » sans interdire explicitement les motifs de Goodreads.
Leçon à reporter dans le prompt de design : imposer des **anti-références** (« pas de grille de
couvertures, pas d'étoiles, pas de fond clair ») et un **geste signature** par direction.

---

## Itération 4 — v2 : deux identités qui changent la grammaire

`2026-11-25` · **0 $ de modèle** (produites directement, sans agent)

`docs/mockups/index.html` (remplace la v1 à cette adresse, la v1 reste dans `v1-trois-directions.html`)
et `docs/08-pistes-d-e.md`.

- **D · « Tranche »** : l'étagère vue de face. Aucune grille de couvertures, aucune étoile — on tire
  une barre verticale pour noter, la tranche se remplit.
- **E · « Affiche »** : un livre plein écran, bandeau acide, échelle de 10 barres, écran de recherche
  en aplat acide sur texte noir.

Coût : temps de production uniquement (0,00 $ d'API). C'est le seul poste du projet où le coût
marginal est nul : le jugement visuel reste humain, et c'est lui qui a invalidé la v1.

---

## Itération 5 — Direction F « Clair » (réponse aux deux rejets)

`2026-11-25` · **0 $ de modèle**

Après « ne change pas assez de Goodreads » (v1) puis « je n'aime pas les tranches, il faut du simple
et du clair » (v2), retour à des composants standards : carte « en cours », barre d'onglets à trois
entrées, étoiles, une action principale par écran. L'identité tient à trois choses seulement : un
accent unique (cobalt), de gros titres (Space Grotesk 22 pt), et zéro décoration.
Livrables : `docs/09-direction-f-clair.md`, `docs/mockups/index.html` (la v2 reste dans
`v2-tranche-affiche.html`).

**Ce que ces trois rejets disent du brief initial** : « moderne + inspiré de Letterboxd » n'est pas un
brief exploitable. Il faut, dès le départ, trois contraintes mesurables — un niveau de familiarité
(« un utilisateur doit noter sans explication »), un niveau de rupture (« pas de grille de
couvertures »), et un test (« 5 personnes comprennent l'écran en 3 s »).

## Itération 6 — thème sombre

`2026-11-25` · **0 $ de modèle**

Les 5 écrans passent en jetons CSS (`--bg`, `--surf`, `--ink`, `--ink2`, `--ink3`, `--acc`, `--onacc`,
`--hero`, `--line`) et un bouton « Thème sombre » bascule la palette. Contrastes recalculés :
encre 16,83:1, accent 7,02:1, texte sur accent 7,27:1 en sombre.

Deux bugs de la bascule, corrigés : le texte du bouton principal restait blanc sur un bleu clair
(2,3:1 — illisible), et un fond `#fff` codé en dur dans la feuille de notation créait un panneau
gris au-dessus d'elle. C'est exactement le genre de défaut qui apparaît quand une couleur est écrite
en dur au lieu de passer par un jeton.

---

## Ce que la suite coûtera (ordre de grandeur)

| Étape | Modèle routé | Coût estimé |
|---|---|---|
| Choix de direction + design system (tokens → code) | 1 appel fort + retouches | < 0,05 $ |
| Scaffold Expo + composants des 5 écrans | 2–4 appels Dev Front | 0,10–0,30 $ |
| Boucle QA (tests + revue) ×2 | QA fort | 0,05–0,15 $ |
| **Phase 2 complète** | | **≈ 0,30–0,60 $** |

Le facteur limitant n'est pas le coût (quelques centimes) mais le **temps de recette** et le nombre
d'itérations visuelles, qui restent des décisions humaines.
