## Objectif
Réduire le temps médian pour noter un livre de 45 s à ≤ 8 s (2 gestes max) et augmenter les sessions de recherche aboutissant à un ajout de +30 % en 3 mois.

## Utilisateurs
- **Léa, 28 ans, lit dans le métro** : termine un chapitre, veut noter vite d'une main, pouce bas de l'écran, réseau instable.
- **Marc, 34 ans, en librairie** : scanne un code-barres pour vérifier s'il l'a déjà lu/noté, compare avec sa liste, réseau correct.

## Périmètre
Refonte des 5 écrans obligatoires : Découverte, Recherche/résultats, Fiche livre, Feuille de notation, Journal/confirmation. Nouveau moteur de recherche (couvertures d'abord, scan code-barres, reprise de lecture, suggestions explicables). Nouvelle mécanique de notation (entière + demi-étoiles, datée, ≤ 2 gestes, file d'attente hors ligne).

## Hors-périmètre
Réseau social (amis, fils d'activité, commentaires), achat/livraison, bibliothèques publiques, import Goodreads, messagerie, clubs de lecture, statistiques annuelles, recommandations par LLM.

## KPI
1. Temps médian note seule ≤ 8 s (mesuré en télémétrie, p75 ≤ 12 s).
2. Taux de sessions recherche → ajout bibliothèque ≥ 35 %.
3. Taux d'échec du scan code-barres < 10 % (couverture catalogue).

## Risques
- **Migration données Goodreads** : perte d'historique → import en lecture seule dès J1, aucune écriture avant J+30.
- **Scan code-barres peu fiable** (éditions, ISBN multiples) → fallback saisie manuelle + matching titre/auteur, cache local des ISBN scannés.
- **Confusion visuelle avec Letterboxd/Goodreads** → palette et typo propres, revue design avant dev, tests A/B sur 200 utilisateurs.