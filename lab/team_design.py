"""Équipe d'agents pour la PHASE 0 (cadrage + propositions UI) de Spine.

    python3 team_design.py "refonte notation + découverte Goodreads" [budget_usd]

Pipeline de livrables (pas de discussion libre) :
    PM ─► PO ─┬─► TECH_LEAD ────┐
              ├─► DESIGN_A      │
              ├─► DESIGN_B      ├─► CRITIQUE (grille + recommandation)
              └─► DESIGN_C      ┘

Le Tech Lead et les 3 directions tournent en parallèle. Chaque rôle a son modèle (routage par
coût de l'erreur) ; chaque appel enregistre tokens et coût RÉEL. Sorties : out/<horodatage>/.
"""
import json
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import llm

MODELS = {
    "PM":        {"id": "deepseek/deepseek-v4.1-flash", "in": 0.14, "out": 0.42},
    "PO":        {"id": "deepseek/deepseek-v4.1-flash", "in": 0.14, "out": 0.42},
    "TECH_LEAD": {"id": "tencent/hy4", "in": 0.709, "out": 2.126},
    "DESIGN_A":  {"id": "z-ai/glm-5.2", "in": 0.62, "out": 2.42},
    "DESIGN_B":  {"id": "z-ai/glm-5.2", "in": 0.62, "out": 2.42},
    "DESIGN_C":  {"id": "z-ai/glm-5.2", "in": 0.62, "out": 2.42},
    "CRITIQUE":  {"id": "tencent/hy4", "in": 0.709, "out": 2.126},
}

PRODUIT = """PRODUIT : « Spine », refonte de Goodreads. App mobile React Native + Expo (iOS 16+/Android 10+), 390 pt de large.
CIBLE : lecteurs 20-40 ans qui notent et cherchent des livres sur leur téléphone. Concurrence : Goodreads (daté), StoryGraph, Letterboxd (référence de mécanique, pas de skin).
PROBLÈMES À RÉSOUDRE (mesurés dans l'app actuelle) :
1. Noter coûte cher : fiche → « Write a review » → formulaire web → 5 étoiles entières → 3 écrans. Aucune trace datée de la lecture.
2. Retrouver un livre est pénible : résultats en liste texte, livre/édition mélangés, pas de scan, pas de reprise de lecture, recommandations opaques.
PARCOURS REDESSINÉS (uniquement ces deux-là) :
A. NOTER — du contexte (fiche, fin de lecture, historique) à une entrée datée, en ≤ 2 gestes pour la note seule.
B. TROUVER — recherche à couverture première, scan du code-barres, reprise, suggestions explicables, ajout en un geste.
ÉCRANS OBLIGATOIRES : 1 Découverte · 2 Recherche/résultats · 3 Fiche livre · 4 Feuille de notation · 5 Journal / confirmation.
CONTRAINTES : composants RN natifs (pas d'effet web exotique), cibles tactiles ≥ 44 pt, actions principales dans le tiers bas,
contraste texte ≥ 4,5:1, fonctionne hors ligne (file d'attente des notes), et NE PAS copier l'identité visuelle de Letterboxd (vert/orange/noir) nor de Goodreads."""

PROMPTS = {
    "PM": """Tu es PM produit. Cadre la demande en FRANÇAIS, 25 lignes max, sections :
## Objectif (1 phrase avec un chiffre)
## Utilisateurs (2 personas, 1 ligne chacun, avec leur contexte de lecture)
## Périmètre (ce qu'on refait)
## Hors-périmètre (explicite : social, achat, bibliothèques, Goodreads import…)
## KPI (3 max, mesurables)
## Risques (3 max, avec parade)
Sois concret et court. Pas d'introduction.""" + "\n\n" + PRODUIT,

    "PO": """Tu es PO. Écris les user stories en FRANÇAIS, 6 MAXIMUM, format strict :
### US-n — titre
**En tant que** … **je veux** … **afin de** …
- Given … When … Then … (2 à 3 critères, testables)
- Priorité : Must / Should / Could
Couvre : noter en ≤2 gestes, demi-étoiles, avis + spoiler, relecture/DNF, trouver par couverture/scan, reprendre une lecture, recommandations explicables.
Aucune fonctionnalité hors périmètre. Pas de doublon. Pas d'introduction.""",

    "TECH_LEAD": """Tu es Tech Lead mobile. Produis le plan technique en FRANÇAIS (120 lignes max) :
## Stack (versions et paquets Expo exacts : expo-router, reanimated, gesture-handler, flash-list, tanstack-query, zustand…, avec la raison en 5 mots)
## Navigation (arbre des routes expo-router, modales vs écrans)
## Modèle de données (TypeScript : Book, Edition, ShelfEntry, Rating, Review, DiaryEntry — champs et types)
## API & cache (Open Library + Google Books : endpoints réels, mapping, fusion des deux, cache et mode hors ligne avec file d'attente des notes)
## Notation (machine à états de la feuille, validation, optimistic update, retry)
## Recherche (debounce, tri, dédoublonnage livre/édition, scan ISBN via expo-camera)
## Performance & accessibilité (FlashList, images, dynamic type, VoiceOver/TalkBack)
## Découpage en 3 sprints (S/M/L par ticket, ordre de livraison)
## Événements analytics (5 events nommés + propriétés)
Reste implémentable : pas de sur-ingénierie, pas de backend maison.""" + "\n\n" + PRODUIT,

    # Les 3 directions partagent le même format ; seule la LENTILLE change.
    "DESIGN": """Tu es directeur artistique produit. Conçois UNE direction artistique complète pour Spine, en FRANÇAIS (150 lignes max).

LENTILLE : {lens}

Format STRICT :
# Direction — « Nom »
## Intention (3 phrases : sensation, référence, ce que ça change pour l'utilisateur)
## Références (3 apps/produits, et ce qu'on en prend précisément)
## Ce qu'on reprend de Letterboxd / ce qu'on ne copie pas
## Tokens (tableaux markdown)
- Couleurs : rôle | hex | contraste texte calculé sur le fond principal
- Typographie : rôle | famille (Google Fonts dispo via expo-font) | taille/px | graisse | interlettrage
- Espacement / rayons / ombres / grille (colonnes, gouttières)
- Motion : 2 transitions signature (durée ms, easing)
## Composant signature (1 élément reconnaissable, décrit en 5 lignes, faisable en RN)
## Écrans — pour CHACUN des 5 : zones de haut en bas, composants RN, gestes, et la microcopy EN entre guillemets
### 1. Découverte
### 2. Recherche & résultats
### 3. Fiche livre
### 4. Feuille de notation (le cœur : échelle, geste, feedback, avis, spoiler, date, relecture/DNF, privé)
### 5. Journal / confirmation
## Faisabilité React Native (S/M/L par écran + le seul point risqué)
## Risques (3, dont un sur l'accessibilité)
Pas d'introduction, pas de conclusion, pas de code.""" + "\n\n" + PRODUIT,

    "CRITIQUE": """Tu es lead design + QA. On te donne 3 directions et le cadrage. Note-les en FRANÇAIS, sans complaisance.

1. Tableau de notation /5 : Identité (pas une copie) · Lisibilité du parcours notation · Efficacité du parcours découverte · Faisabilité RN en 1 sprint · Accessibilité (contraste, taille, daltonisme) · Potentiel social/journal. Une ligne par direction, colonne « Total /30 ».
2. Pour chaque direction : 2 forces, 2 faiblesses concrètes (cite un token ou un écran précis). Si un contraste annoncé paraît faux, dis-le.
3. Recommandation : UNE direction à implémenter d'abord, avec 3 arguments, ET les 2 emprunts à faire aux deux autres.
4. 3 corrections obligatoires avant maquettage hi-fi.
Sois bref : 60 lignes max.""",
}
LENS = {
    "DESIGN_A": "CINÉMATIQUE & SOCIAL — le livre comme affiche de film. Sombre, couvertures plein cadre, typographie condensée, feed et journal très présents, gestes. Références : Letterboxd, MUBI, Plex. Risque à gérer : paraître une copie de Letterboxd.",
    "DESIGN_B": "ÉDITORIAL & PAPIER — le livre comme objet imprimé. Fond crème, serif éditorial, marges généreuses, annotations en marge, citations, calme. Références : NYT Book Review, Are.na, revues littéraires. Risque à gérer : froideur sociale et lenteur perçue.",
    "DESIGN_C": "MOTEUR DE GOÛT — la lecture comme profil de goût. Dense mais rapide, couvertures plein cadre, humeurs, recommandations expliquées (« parce que vous avez aimé… »), filtres puissants. Références : Spotify, Linear, Apple Books. Risque à gérer : surcharge cognitive et sensation d'algorithme.",
}


def main():
    request = sys.argv[1] if len(sys.argv) > 1 else "refonte notation + découverte Goodreads"
    budget = float(sys.argv[2]) if len(sys.argv) > 2 else 1.00
    out = Path(__file__).parent / "out" / time.strftime("%Y%m%d-%H%M%S")
    out.mkdir(parents=True)
    docs, calls, cost, lock = {}, [], 0.0, threading.Lock()

    def ask(role, context, prompt_key=None, lens=None):
        nonlocal cost
        p = PROMPTS[prompt_key or role]
        if lens:
            p = p.replace("{lens}", lens)
        m = MODELS[role]
        t0 = time.time()
        r = llm.call(m["id"], p + "\n\n---\n" + context)
        spent = r["cost"] or (r["in"] * m["in"] + r["out"] * m["out"]) / 1e6
        with lock:
            cost += spent
            docs[role] = r["text"]
            calls.append({"role": role, "model": r["model"], "in": r["in"], "out": r["out"],
                          "cost": round(spent, 6), "seconds": round(time.time() - t0)})
            (out / f"{len(calls):02d}-{role}.md").write_text(r["text"])
            print(f"[{role:9}] {r['model']:32} {r['in']:>6} in {r['out']:>5} out "
                  f"${spent:.4f}  cumul ${cost:.4f}  ({time.time()-t0:.0f}s)", flush=True)
        if cost > budget:
            raise RuntimeError(f"Budget dépassé après {role} : ${cost:.4f} > ${budget}")
        return r["text"]

    t0 = time.time()
    pm = ask("PM", f"Demande : {request}")
    po = ask("PO", f"Demande : {request}\n\nCadrage PM :\n{pm}")

    # Tech Lead et les 3 directions en parallèle : mêmes entrées, aucun ne dépend d'un autre.
    jobs = {"TECH_LEAD": lambda: ask("TECH_LEAD", f"Stories PO :\n{po}")}
    for role, lens in LENS.items():
        jobs[role] = (lambda r=role, l=lens: ask(r, f"Stories PO :\n{po}\n\nCadrage PM :\n{pm}", "DESIGN", l))
    with ThreadPoolExecutor(4) as ex:
        futs = {k: ex.submit(f) for k, f in jobs.items()}
        for k, f in futs.items():
            f.result()

    critique = ask("CRITIQUE", f"Stories PO :\n{po}\n\n### DIRECTION A\n{docs['DESIGN_A']}\n\n"
                               f"### DIRECTION B\n{docs['DESIGN_B']}\n\n### DIRECTION C\n{docs['DESIGN_C']}")

    (out / "run.json").write_text(json.dumps({
        "request": request, "budget": budget, "total_cost": round(cost, 6),
        "seconds": round(time.time() - t0), "calls": calls,
        "deliverables": [f"{i+1:02d}-{c['role']}.md" for i, c in enumerate(calls)],
    }, ensure_ascii=False, indent=1))
    print(f"\nCoût total ${cost:.4f} ({(time.time()-t0)/60:.1f} min) → {out}")
    return out


if __name__ == "__main__":
    main()
