// Renders the raster favicons from src/app/icon.svg (the single source):
//   src/app/favicon.ico    48/32/16 px, transparent outside the square
//   src/app/apple-icon.png 180 × 180, opaque white (iOS turns transparency black)
// Run after every change to icon.svg: pnpm generate:icons — the outputs are
// committed, the build does not run this script.
//
// A raster cannot follow prefers-color-scheme, so the dark-mode <style> is
// dropped (the tick stays #111111) and the inside of the square is filled
// white — that keeps the tick readable on light and dark tabs alike.
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const appDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'app')

const ICO_SIZES = [48, 32, 16] // largest first: Next announces the first entry as `sizes`
const APPLE_SIZE = 180
const APPLE_MOTIF = 118 // 31 px margin = 17 % per side

// Replaces `from` exactly once — anything else means icon.svg changed shape
// and the raster version would silently drift from it.
const replaceOnce = (text, from, to) => {
  const count = text.split(from).length - 1
  if (count !== 1) throw new Error(`icon.svg: „${from}“ ${count}× gefunden, erwartet 1×`)
  return text.replace(from, to)
}

const source = await readFile(path.join(appDir, 'icon.svg'), 'utf8')
const style = source.match(/<style>[\s\S]*?<\/style>\s*/g) ?? []
if (style.length !== 1) throw new Error(`icon.svg: ${style.length} <style>-Blöcke, erwartet 1`)

let raster = source.replace(style[0], '')
raster = replaceOnce(raster, 'fill="none" stroke="#E3721B"', 'fill="#FFFFFF" stroke="#E3721B"')

// Width/height on the root element make librsvg draw the vectors at the
// target size instead of scaling a larger bitmap down.
const render = async (size) => {
  const svg = replaceOnce(raster, '<svg ', `<svg width="${size}" height="${size}" `)
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  const { width, height } = await sharp(png).metadata()
  if (width !== size || height !== size) throw new Error(`Render ${size}px ergab ${width}×${height}`)
  return png
}

// ICO container with PNG entries (Windows Vista+, every current browser).
const toIco = (entries) => {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(entries.length, 4)
  let offset = 6 + 16 * entries.length
  const directory = entries.map(({ size, png }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size, 0) // width (< 256)
    entry.writeUInt8(size, 1) // height
    entry.writeUInt8(0, 2) // no palette
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += png.length
    return entry
  })
  return Buffer.concat([header, ...directory, ...entries.map((e) => e.png)])
}

const icoEntries = await Promise.all(ICO_SIZES.map(async (size) => ({ size, png: await render(size) })))
await writeFile(path.join(appDir, 'favicon.ico'), toIco(icoEntries))

const margin = (APPLE_SIZE - APPLE_MOTIF) / 2
const composed = await sharp({
  create: { width: APPLE_SIZE, height: APPLE_SIZE, channels: 3, background: '#FFFFFF' },
})
  .composite([{ input: await render(APPLE_MOTIF), left: margin, top: margin }])
  .png()
  .toBuffer()
// composite() adds an alpha channel even onto an opaque base — flatten drops it.
const apple = await sharp(composed).flatten({ background: '#FFFFFF' }).png().toBuffer()
const appleMeta = await sharp(apple).metadata()
if (appleMeta.width !== APPLE_SIZE || appleMeta.height !== APPLE_SIZE || appleMeta.hasAlpha) {
  throw new Error(`apple-icon.png: ${appleMeta.width}×${appleMeta.height}, Alpha ${appleMeta.hasAlpha}`)
}
await writeFile(path.join(appDir, 'apple-icon.png'), apple)

console.log(`[favicons] ✓ favicon.ico (${ICO_SIZES.join('/')} px), apple-icon.png (${APPLE_SIZE} px, Motiv ${APPLE_MOTIF} px)`)
