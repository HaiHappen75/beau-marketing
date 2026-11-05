// Renders the placeholder images of the host area ("Gastgeber im Norden") into
// public/brand/platzhalter/ — one PNG per entry `placeholder('Beschreibung',
// 'Breite × Höhe')` in src/seed/data.ts (SEED_MEDIA), the single source for file
// name, text and size. The seed uploads the files as media entries; Stephan
// later replaces them in the admin with real photos and screenshots.
//
// Run after changing the list: pnpm generate:placeholders — the outputs are
// committed, neither the build nor the seed runs this script (the production
// image has no fonts to draw the text with).
//
// Look: the outline square of the logo on white, as the site shows wherever a
// photo is missing (SquareGraphic) — plus what belongs here and in which size.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'brand', 'platzhalter')

const INK = '#111111'
const MUTED = '#5e5e5e'
const LINE = '#e4e2dd'
const ACCENT = '#e3721b'
// System fonts: Nunito Sans is only shipped as a web font. Any clean sans will do here.
const FONT = "'Nunito Sans', 'Segoe UI', Arial, Helvetica, sans-serif"

const source = await readFile(path.join(root, 'src', 'seed', 'data.ts'), 'utf8')
const entries = [...source.matchAll(/'(platzhalter-[a-z-]+\.png)':\s*placeholder\(\s*'([^']+)',\s*'(\d+) × (\d+)',?\s*\)/g)].map(
  ([, file, description, width, height]) => ({ file, description, width: Number(width), height: Number(height) }),
)
if (entries.length === 0) throw new Error('src/seed/data.ts: keine placeholder(…)-Einträge gefunden')

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Greedy word wrap by character count — good enough for a handful of words. */
const wrap = (text, max) => {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    if (line && `${line} ${word}`.length > max) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  if (line) lines.push(line)
  return lines
}

const svgFor = ({ description, width, height }) => {
  const unit = Math.min(width, height) / 100 // 1 % of the short side
  const square = unit * 18
  const stroke = unit * 1.6
  const title = unit * 5
  const small = unit * 2.6
  const lines = wrap(description, Math.round((width * 0.78) / (title * 0.56)))
  const blockHeight = square + unit * 9 + small + unit * 4 + lines.length * title * 1.25 + unit * 4 + small
  let y = (height - blockHeight) / 2
  const cx = width / 2
  const parts = []
  parts.push(`<rect width="${width}" height="${height}" fill="#ffffff"/>`)
  parts.push(
    `<rect x="${unit}" y="${unit}" width="${width - unit * 2}" height="${height - unit * 2}" fill="none" stroke="${LINE}" stroke-width="${unit * 0.4}"/>`,
  )
  parts.push(
    `<rect x="${cx - square / 2}" y="${y}" width="${square}" height="${square}" fill="none" stroke="${ACCENT}" stroke-width="${stroke}"/>`,
  )
  y += square + unit * 9 + small
  parts.push(
    `<text x="${cx}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${small}" font-weight="800" letter-spacing="${small * 0.12}" fill="${MUTED}">PLATZHALTER</text>`,
  )
  y += unit * 4
  for (const line of lines) {
    y += title * 1.25
    parts.push(
      `<text x="${cx}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${title}" font-weight="800" fill="${INK}">${escapeXml(line)}</text>`,
    )
  }
  y += unit * 4 + small
  parts.push(
    `<text x="${cx}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${small}" font-weight="600" fill="${MUTED}">Soll-Maß ${width} × ${height} px</text>`,
  )
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts.join('')}</svg>`
}

await mkdir(outDir, { recursive: true })
for (const entry of entries) {
  // Palette PNG: a handful of flat colours, so the files stay small.
  const png = await sharp(Buffer.from(svgFor(entry))).png({ palette: true, colours: 32, compressionLevel: 9 }).toBuffer()
  const meta = await sharp(png).metadata()
  if (meta.width !== entry.width || meta.height !== entry.height) {
    throw new Error(`${entry.file}: ${meta.width}×${meta.height}, erwartet ${entry.width}×${entry.height}`)
  }
  await writeFile(path.join(outDir, entry.file), png)
  console.log(`[platzhalter] ✓ ${entry.file} (${entry.width} × ${entry.height}, ${Math.round(png.length / 1024)} KB)`)
}
