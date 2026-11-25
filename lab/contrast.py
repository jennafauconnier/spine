"""Vérifie les contrastes WCAG d'une palette. Un LLM ne sait pas calculer un ratio : ce script, si.

    python3 contrast.py                      # palettes des 3 directions
    python3 contrast.py '#A8341E' '#F4EFE6'  # un couple à la demande
"""
import sys


def luminance(hex_color):
    h = hex_color.lstrip("#")
    channels = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def ratio(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


PALETTES = {
    "A — Pellicule": [("#F5F0E8", "#1A1A1E"), ("#9A9A9E", "#1A1A1E"), ("#E0574F", "#1A1A1E"),
                      ("#F5F0E8", "#2C2C30")],
    "B — Les Pages": [("#1A1A1A", "#F4EFE6"), ("#6B6B6B", "#F4EFE6"), ("#A8341E", "#F4EFE6"),
                      ("#F4EFE6", "#A8341E"), ("#1A1A1A", "#FFFFFF")],
    "C — Sillage": [("#F4F1EA", "#141118"), ("#9B94A6", "#141118"), ("#FF8A65", "#141118"),
                    ("#F4F1EA", "#221B2A")],
}


def verdict(r):
    if r >= 7:
        return "AAA"
    if r >= 4.5:
        return "AA"
    if r >= 3:
        return "AA gros texte seulement"
    return "ÉCHOUE"


if __name__ == "__main__":
    if len(sys.argv) == 3:
        print(f"{sys.argv[1]} sur {sys.argv[2]} : {ratio(sys.argv[1], sys.argv[2]):.2f}:1")
        sys.exit()
    for name, pairs in PALETTES.items():
        print(f"\n{name}")
        for fg, bg in pairs:
            r = ratio(fg, bg)
            print(f"  {fg} sur {bg}  {r:5.2f}:1  {verdict(r)}")
