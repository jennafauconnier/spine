# Spine — refonte de l'expérience de notation et de découverte (Goodreads)

> Codename **Spine**. Amélioration produit de Goodreads : une app React Native / Expo moderne,
> avec deux parcours refaits de zéro — **noter un livre** et **retrouver un livre** — inspirés des
> mécaniques de Letterboxd (demi-étoiles, journal, listes, feed social) sans en copier l'habillage.

## Pourquoi ce repo

Goodreads remplit une fonction (catalogue, étagères, avis) mais l'expérience est datée : navigation
lourde, fiches encombrées, notation rigide (1 à 5 étoiles entières, formulaire d'avis séparé),
recherche qui privilégie le texte et l'édition plutôt que la couverture et l'intention de lecture.

Ce repo contient la démarche complète : cadrage, stories, choix techniques, **3 directions
artistiques**, specs d'écrans, puis implémentation Expo. Chaque itération (ce qui a été produit,
par quel agent/modèle, pour quel coût) est journalisée dans [ITERATIONS.md](ITERATIONS.md).

## Étude de cas

`docs/ETUDE-DE-CAS.md` (markdown) et `docs/etude-de-cas.html` (page prête pour le portfolio) :
chaque écran, le problème Goodreads qu'il résout, le design system, le process et son coût réel.

## Statut

| Phase | Contenu | État |
|---|---|---|
| 0 — Cadrage & propositions | brief PM, stories PO, plan technique, 3 directions UI + critique | **livré** (voir `docs/`) |
| 1 — Choix & design system | direction F « Clair », thèmes clair et sombre | **validée** · reste le scaffold Expo |
| 2 — Implémentation | app Expo : 5 écrans, thèmes clair/sombre, notation | **sprint 1 livré** · reste API, persistance, scan |
| 3 — QA & mesure | a11y, perf, tests, événements analytics | à faire |

## Arborescence

```
docs/                     livrables de la phase 0
  00-brief.md             cadrage PM (objectif, périmètre, KPI, risques)
  01-stories.md           stories PO avec critères Given/When/Then
  02-tech-plan.md         stack Expo, navigation, modèle de données, API
  03-direction-a.md       « Cinéma du livre »  — cinématique, sombre, social
  04-direction-b.md       « Papier & marge »   — éditorial, chaud, annotations
  05-direction-c.md       « Moteur de goût »   — dense, rapide, recommandations expliquées
  06-critique.md          grille de notation des 3 directions + recommandation
  08-pistes-d-e.md        pistes D (Tranche) et E (Affiche), rejetées
  09-direction-f-clair.md direction retenue : « Clair », simple et lisible
  mockups/index.html      maquettes de la direction F (5 écrans)
  mockups/v2-tranche-affiche.html    v2 (Tranche / Affiche), conservée pour l'historique
  mockups/v1-trois-directions.html   v1 (Pellicule / Les Pages / Sillage)
lab/
  team_design.py          harnais d'équipe d'agents (PM → PO → TL ‖ Design ×3 → Critique)
  llm.py                  appel OpenRouter + coût réel par appel
  out/<horodatage>/       sorties brutes d'un run + run.json (tokens et coût par rôle)
app/                      application Expo (phase 2)
ITERATIONS.md             journal des itérations et des coûts
```

## Les deux parcours cibles

**Noter un livre** — aujourd'hui : fiche → « Write a review » → formulaire web → étoiles entières.
Cible : un seul geste contextuel, note en demi-étoiles au pouce, avis optionnel, date de fin,
relecture, tags d'humeur, visibilité. La note crée une **entrée de journal** datée (modèle Letterboxd).

**Retrouver un livre** — aujourd'hui : recherche texte, résultats en liste, confusion livre/édition.
Cible : recherche à couverture première, scan du code-barres, « reprendre », suggestions issues des
étagères et de l'historique, filtres par intention (format, longueur, humeur), ajout en un geste.

## Lancer le harnais d'équipe

```bash
cd lab
set -a && . ~/.hermes/.env && set +a        # OPENROUTER_API_KEY
python3 team_design.py "refonte notation + découverte Goodreads" 1.00
```

Chaque run écrit ses livrables dans `lab/out/<horodatage>/` et son coût dans `run.json`.
