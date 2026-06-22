# Brand-Assets

Lege hier die Logo-Dateien von Beau-Marketing ab.

- **`logo.svg`** — Haupt-Logo (ersetzt die Platzhalter-Datei). Am besten zusätzlich eine helle Variante für dunkle Flächen:
  - `logo.svg` für helle Hintergründe
  - `logo-light.svg` für dunkle Hintergründe (Hero, Footer)
- **`logo-mark.svg`** — optionales reines Bildzeichen (z. B. fürs Favicon).
- **Fonts:** Die Effra-Schriftdateien (woff2) gehören nach `public/fonts/` (siehe `src/app/(frontend)/[locale]/layout.tsx`).

Aktuell rendert die Website eine Text-Wortmarke („beau."). Sobald die Dateien hier liegen, wird das Header-Logo darauf umgestellt (eine Zeile in `src/components/ui/Logo.tsx`).
