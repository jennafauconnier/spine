"""Itération 2 : consolidation de la direction retenue (« Les Pages ») après critique.

    python3 consolidate.py

Entrées : les sorties de l'itération 1 (out/<ts1>/). Sortie : out/<ts2>/00-DIRECTION_RETENUE.md
Applique les 3 corrections obligatoires de la critique + les 2 emprunts (A et C).
"""
import json
import sys
import time
from pathlib import Path

import llm

HERE = Path(__file__).parent
run_dirs = sorted(p for p in (HERE / "out").glob("*") if p.is_dir())
SRC = run_dirs[-1] if len(sys.argv) < 2 else Path(sys.argv[1])

PROMPT = """Tu es directeur artistique produit ET tech lead RN. On fusionne les 3 propositions en UNE direction retenue, prête à maquetter.

ENTRÉE 1 — direction retenue « Les Pages » (éditorial / papier) :
{b}

ENTRÉE 2 — critique (à appliquer impérativement) :
{c}

EMPRUNTS OBLIGATOIRES : de « Pellicule » le tap gauche = demi-étoile / tap droit = entière, et le badge « En attente de synchronisation » avec icône horloge dans le Journal. De « Sillage » le fallback de recherche pré-rempli et le motif de reco collé à la tuile.

CORRECTIONS À APPLIQUER :
1. Accent : donne un hex MESURÉ, contraste ≥ 4,5:1 sur #F4EFE6 (calcule-le vraiment, donne le ratio).
2. Recherche SANS onglets : icônes scan + photo dans la barre, état vide pré-rempli, fallback manuel immédiat.
3. reduceMotion, 44 pt vérifiés sur les demi-étoiles, jamais de rouge seul pour un état, pas d'italique hors citations.
4. Supprime tout ce qui n'est pas faisable en RN en 1 sprint.

LIVRABLE (FRANÇAIS, 110 lignes max, AUCUNE troncature, phrases complètes) :
# Direction retenue — « Les Pages »
## Thèse (3 phrases)
## Tokens complets (couleurs avec ratios réels | typographie | espacement | motion avec reduceMotion)
## Composant signature (5 lignes)
## Les 5 écrans — pour chacun : wireframe ASCII en 30 colonnes, zones, 3 interactions, microcopy EN
### 1 Découverte · 2 Recherche · 3 Fiche livre · 4 Feuille de notation · 5 Journal
## Ce que le dev doit savoir (5 puces max, dont la seule vraie difficulté)
"""


def main():
    b = (SRC / "03-DESIGN_B.md").read_text()
    c = (SRC / "07-CRITIQUE.md").read_text()
    out = HERE / "out" / time.strftime("%Y%m%d-%H%M%S")
    out.mkdir(parents=True)
    t0 = time.time()
    r = llm.call("z-ai/glm-5.2", PROMPT.format(b=b, c=c), max_tokens=7000)
    (out / "00-DIRECTION_RETENUE.md").write_text(r["text"])
    cost = r["cost"] or 0.0
    (out / "run.json").write_text(json.dumps({
        "iteration": 2, "role": "CONSOLIDATION", "model": r["model"], "source": str(SRC),
        "in": r["in"], "out": r["out"], "cost": round(cost, 6), "seconds": round(time.time() - t0),
    }, ensure_ascii=False, indent=1))
    print(f"${cost:.4f} · {r['in']} in / {r['out']} out · {out}")


if __name__ == "__main__":
    main()
