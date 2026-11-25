### US-1 — Noter un livre en deux gestes
**En tant que** lectrice pressée dans le métro **je veux** noter un livre avec une note entière ou en demi-étoiles en deux gestes maximum **afin de** garder une trace immédiate sans interrompre ma lecture.

- Given j'ouvre la feuille de notation depuis la fiche livre, When je sélectionne une note (étoile entière ou demi-étoile) puis je valide, Then la note est enregistrée en ≤ 2 gestes et horodatée.
- Given je suis hors ligne, When je valide ma note, Then elle est placée dans la file d'attente locale et confirmée visuellement comme "en attente de synchronisation".
- Given la note est enregistrée, When la synchronisation aboutit, Then la date de notation affichée correspond à l'instant de saisie, pas de synchronisation.

- Priorité : Must

### US-2 — Rédiger un avis avec indication de spoiler
**En tant que** lecteur ayant terminé un livre **je veux** rédiger un avis et le marquer comme contenant un spoiler **afin de** partager mon ressenti sans gâcher l'intrigue des autres.

- Given je rédige un avis sur la fiche livre, When j'active l'option "Contient un spoiler" et je publie, Then l'avis est enregistré et masqué par défaut côté consultation.
- Given un avis est marqué spoiler, When un utilisateur clique sur "Afficher malgré le spoiler", Then le texte complet devient visible et l'action est tracée.
- Given je publie un avis sans note, When je valide, Then l'avis est accepté indépendamment de la notation.

- Priorité : Must

### US-3 — Marquer une relecture ou un abandon (DNF)
**En tant que** lecteur au parcours de lecture varié **je veux** déclarer une relecture ou un abandon (DNF) avec une date **afin de** refléter fidèlement mon historique sans perdre les notes précédentes.

- Given un livre déjà noté, When je choisis "Relire", Then une nouvelle entrée datée est créée et l'historique antérieur est conservé.
- Given je choisis "Abandonné (DNF)", When je confirme, Then le statut passe à DNF avec date, sans supprimer la note existante si présente.
- Given je consulte le journal, When la relecture ou le DNF existe, Then l'événement apparaît dans l'ordre chronologique.

- Priorité : Must

### US-4 — Trouver un livre par scan de code-barres
**En tant que** lecteur en librairie **je veux** scanner un code-barres pour identifier un livre et savoir si je l'ai déjà lu ou noté **afin de** éviter un doublon d'achat ou de lecture.

- Given j'ouvre le scan, When je cadre un ISBN, Then le livre s'affiche avec mon statut (déjà lu/noté ou non) en < 3 s si réseau correct.
- Given le scan échoue, When l'erreur survient, Then un fallback de saisie manuelle (titre/auteur) est proposé immédiatement.
- Given un ISBN a déjà été scanné, When je rescanne le même code, Then le résultat est servi depuis le cache local sans appel réseau.

- Priorité : Must

### US-5 — Rechercher un livre par sa couverture
**En tant que** lecteur se rappelant d'un visuel plus que d'un titre **je veux** rechercher un livre à partir de sa couverture **afin de** le retrouver rapidement sans connaître les métadonnées exactes.

- Given j'ouvre la recherche, When je saisis une photo de couverture, Then des résultats classés par similarité s'affichent avec titre et auteur.
- Given les résultats s'affichent, When je sélectionne un résultat, Then j'accède à la fiche livre correspondante.
- Given l'image ne donne aucun résultat exploitable, When la recherche échoue, Then je suis redirigé vers la recherche textuelle avec la meilleure hypothèse pré-remplie.

- Priorité : Should

### US-6 — Reprendre une lecture et recevoir des recommandations explicables
**En tant que** lecteur interrompant souvent mes lectures **je veux** reprendre un livre là où je m'étais arrêté et comprendre pourquoi un livre m'est recommandé **afin de** gagner du temps et faire confiance aux suggestions.

- Given un livre en cours, When j'ouvre l'écran Découverte, Then un raccourci "Reprendre" affiche le livre et la dernière position/page connue.
- Given une recommandation est affichée, When je consulte son détail, Then au moins un motif explicite est visible (ex. "parce que vous avez noté X 4,5★").
- Given je reprends une lecture, When je valide la reprise, Then la position est synchronisée à travers mes appareils.

- Priorité : Should