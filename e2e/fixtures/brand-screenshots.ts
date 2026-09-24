/**
 * E2E fixture for the brand cards: gives Tappi a landscape + portrait screenshot
 * and a logo, Huusbook only a portrait screenshot (the "contain" case). Images are
 * generated at runtime — no binaries in the repo. The previous screenshots/logo
 * are saved and restored on `down`. Usage:
 *   E2E_FIXTURES=1 FIXTURE_ACTION=up|down pnpm payload run e2e/fixtures/brand-screenshots.ts
 * Refuses to run against anything but a local database.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

const action = process.env.FIXTURE_ACTION
const uri = process.env.DATABASE_URI ?? ''
if (process.env.E2E_FIXTURES !== '1' || !/@(localhost|127\.0\.0\.1)[:/]/.test(uri)) {
  console.error('fixture: refused (needs E2E_FIXTURES=1 and a localhost DATABASE_URI)')
  process.exit(1)
}

const payload = await getPayload({ config })
const ALT_PREFIX = 'E2E-Markenbild'
const STATE = path.join(tmpdir(), 'bm-e2e-brand-screenshots.json')
const SLUGS = ['tappi', 'huusbook'] as const

type Saved = Record<string, { id: number; screenshots: { image: number }[]; logo: number | null }>

const idOf = (v: unknown) => (v && typeof v === 'object' ? (v as { id: number }).id : (v as number | null))

async function brand(slug: string) {
  const { docs } = await payload.find({ collection: 'brands', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  if (!docs[0]) throw new Error(`fixture: brands/${slug} missing — run pnpm seed first`)
  return docs[0]
}

async function image(name: string, width: number, height: number, alt: string) {
  const data = await sharp({ create: { width, height, channels: 3, background: { r: 227, g: 114, b: 27 } } })
    .composite([{ input: Buffer.from(`<svg width="${width}" height="${height}"><rect x="8%" y="8%" width="84%" height="84%" fill="#fff"/></svg>`) }])
    .png()
    .toBuffer()
  const doc = await payload.create({
    collection: 'media',
    file: { data, mimetype: 'image/png', name: `${name}.png`, size: data.length },
    data: { alt: `${ALT_PREFIX} ${alt}`, credit: { author: 'Beau Marketing', source: 'E2E', license: 'Test' } },
  })
  return doc.id
}

async function down() {
  if (existsSync(STATE)) {
    const saved = JSON.parse(readFileSync(STATE, 'utf8')) as Saved
    for (const s of Object.values(saved)) {
      await payload.update({ collection: 'brands', id: s.id, data: { screenshots: s.screenshots, logo: s.logo } })
    }
    rmSync(STATE)
  }
  await payload.delete({ collection: 'media', where: { alt: { like: ALT_PREFIX } } })
}

if (action === 'down') {
  await down()
} else if (action === 'up') {
  await down()
  const saved: Saved = {}
  for (const slug of SLUGS) {
    const b = await brand(slug)
    saved[slug] = {
      id: b.id,
      screenshots: (b.screenshots ?? []).map((s) => ({ image: idOf(s.image)! })),
      logo: idOf(b.logo),
    }
  }
  writeFileSync(STATE, JSON.stringify(saved))
  const landscape = await image('e2e-marke-quer', 1600, 1000, 'Querformat')
  const portrait = await image('e2e-marke-hoch', 1000, 2000, 'Hochformat')
  const logo = await image('e2e-marke-logo', 800, 300, 'Logo')
  await payload.update({
    collection: 'brands',
    id: saved.tappi.id,
    data: { screenshots: [{ image: landscape }, { image: portrait }], logo },
  })
  await payload.update({ collection: 'brands', id: saved.huusbook.id, data: { screenshots: [{ image: portrait }] } })
} else {
  console.error('fixture: FIXTURE_ACTION must be up or down')
  process.exit(1)
}
process.exit(0)
