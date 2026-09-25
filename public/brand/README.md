# Brand-Assets

- `beau-marketing-logo.png` / `beau-marketing-logo-invers.png` — Firmenlogo „beau marketing – success simplified“, unverändert aus `SecondBrain/sources/assets/beau-marketing-logo/original/`, nur auf 1200 px Breite verkleinert (verlustfrei). Das Bild selbst wird nicht verändert.
- `trust/` — Partner-Siegel. eRecht24: byte-identisch zum Original. SH-Partner „Der echte Norden“: verlustfreies PNG, pixelgleich zum gelieferten WebP — Payload kodiert jeden WebP-Upload per sharp verlustbehaftet neu, PNG bleibt byte-identisch. Besser wäre die Original-SVG aus dem Partnerportal. Der Seed lädt die Dateien von hier in die Medien; der Footer zeigt die 400-px-Fassung, die Payload aus dem unveränderten Original erzeugt.
- Favicon: `src/app/icon.svg` — Kontur-Quadrat mit Haken, Geometrie der Checkbox-Komponente (`src/components/brand/Check.tsx`) mit kräftigeren Linien; der Haken wird im Dark Mode weiß. `src/app/favicon.ico` (16/32/48 px) und `src/app/apple-icon.png` (180 px, deckend weiß) erzeugt `pnpm generate:icons` aus der SVG — nach jeder Änderung an `icon.svg` neu laufen lassen.
- Schrift: Nunito Sans, selbst gehostet unter `src/app/fonts/` (SIL Open Font License, `OFL.txt`).
