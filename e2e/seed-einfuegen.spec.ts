import { expect, test } from '@playwright/test'

import { insertBlocks, resolveAnchor, resolvePath, type Anchor } from '../src/seed/fill'
import { isInsertedBlock } from '../src/seed/types'

// Seed rule 4 (05.11.2026): new blocks for pages that already exist. Pure
// functions, no browser, no database — the runs against real databases are
// documented in the PR (fresh database and one on the state of `main`).

type Row = Record<string, unknown>
const row = (blockType: string, id: string, extra: Row = {}): Row => ({ id, blockType, ...extra })
const types = (rows: unknown) => (rows as Row[]).map((r) => r.blockType)

const START: Row[] = [
  row('hero', 'h1', { checks: [{ id: 'c1', text: 'Server in Deutschland' }] }),
  row('packages', 'p1'),
  row('brandShowcase', 'b1'),
  row('engagementBand', 'e1'),
  row('trustBar', 't1'),
  row('cta', 'x1'),
]
const TILES = { blockType: 'tiles', heading: 'Spezialisiert auf Gastgeber im Norden' }
const PROSE = { blockType: 'prose', heading: 'Webdesign-Agentur aus Satrup' }
const HOME: { block: Row; at: Anchor[] }[] = [
  { block: TILES, at: [{ after: 'hero' }, { before: 'packages' }, 'start'] },
  { block: PROSE, at: [{ before: 'engagementBand' }, { before: 'trustBar' }, { before: 'cta', pick: 'last' }, 'end'] },
]

test('Einfügen: Blöcke landen am Anker, Bestandszeilen bleiben dieselben Objekte', () => {
  const plan = insertBlocks(START, HOME)
  const next = plan.patch.layout as Row[]
  expect(types(next)).toEqual(['hero', 'tiles', 'packages', 'brandShowcase', 'prose', 'engagementBand', 'trustBar', 'cta'])
  // Identity, not just equality: ids, nested rows and everything else go back untouched.
  for (const old of START) expect(next).toContain(old)
  expect(next.filter((r) => !START.includes(r))).toEqual([TILES, PROSE])
  expect(plan.filled).toEqual(['layout +tiles (nach hero)', 'layout +prose (vor engagementBand)'])
  expect(plan.legacy).toEqual([])
  // The source list is not touched.
  expect(types(START)).toEqual(['hero', 'packages', 'brandShowcase', 'engagementBand', 'trustBar', 'cta'])
})

test('Einfügen: zweiter Lauf ohne Delta, auch wenn der Block verschoben oder umbenannt wurde', () => {
  const once = insertBlocks(START, HOME).patch.layout as Row[]
  expect(insertBlocks(once, HOME)).toEqual({ patch: {}, filled: [], legacy: [] })
  // Moved to the end and reworded in the admin: still "the page has a block of this type".
  const moved = [...once.filter((r) => r.blockType !== 'tiles'), { ...TILES, id: 'n1', heading: 'Im Admin geändert' }]
  expect(insertBlocks(moved, HOME).patch).toEqual({})
  // Only the missing one is added.
  const withoutProse = once.filter((r) => r.blockType !== 'prose')
  const again = insertBlocks(withoutProse, HOME)
  expect(again.filled).toEqual(['layout +prose (vor engagementBand)'])
})

test('Einfügen: Rückfallkette, wenn der Anker im Bestand fehlt', () => {
  // No hero: before "packages".
  const noHero = START.filter((r) => r.blockType !== 'hero')
  expect(types(insertBlocks(noHero, [HOME[0]]).patch.layout)[0]).toBe('tiles')
  expect(insertBlocks(noHero, [HOME[0]]).filled).toEqual(['layout +tiles (vor packages)'])
  // Neither hero nor packages: at the start.
  const bare = START.filter((r) => !['hero', 'packages'].includes(r.blockType as string))
  expect(insertBlocks(bare, [HOME[0]]).filled).toEqual(['layout +tiles (am Anfang)'])
  // No region band: before the trust bar; without that before the LAST cta; without any: the end.
  const noBand = START.filter((r) => r.blockType !== 'engagementBand')
  expect(insertBlocks(noBand, [HOME[1]]).filled).toEqual(['layout +prose (vor trustBar)'])
  const twoCtas = [row('hero', 'h'), row('cta', 'a'), row('faq', 'f'), row('cta', 'b')]
  expect(types(insertBlocks(twoCtas, [HOME[1]]).patch.layout)).toEqual(['hero', 'cta', 'faq', 'prose', 'cta'])
  expect(insertBlocks([row('faq', 'f')], [HOME[1]]).filled).toEqual(['layout +prose (am Ende)'])
  expect(resolveAnchor([row('faq', 'f')], [])).toEqual({ index: 1, label: 'am Ende' })
  expect(resolveAnchor(twoCtas, [{ after: 'cta' }])).toEqual({ index: 2, label: 'nach cta' })
  expect(resolveAnchor(twoCtas, [{ after: 'cta', pick: 'last' }])).toEqual({ index: 4, label: 'nach cta' })
})

test('Einfügen: leeres Layout bleibt der Regel „leeres Feld füllen“ überlassen, Hinweis für Entwürfe', () => {
  expect(insertBlocks([], HOME)).toEqual({ patch: {}, filled: [], legacy: [] })
  expect(insertBlocks(null, HOME).patch).toEqual({})
  expect(insertBlocks(START, [HOME[0]], 'layout', ', nur im Entwurf').filled).toEqual(['layout +tiles (nach hero, nur im Entwurf)'])
})

test('Zusammenfassung: eingefügte Blöcke sind erkennbar, gefüllte Felder nicht', () => {
  expect(isInsertedBlock('start · layout +tiles (nach hero) (de)')).toBe(true)
  expect(isInsertedBlock('website-ferienwohnung · layout +tiles (vor cta) (de)')).toBe(true)
  expect(isInsertedBlock('start · meta.title (de)')).toBe(false)
  expect(isInsertedBlock('websites · packages[Start].kicker (de)')).toBe(false)
})

test('Übersetzungen: Blöcke nach Typ adressiert, unabhängig von der Position', () => {
  const doc = { title: 'Startseite', layout: [row('hero', 'h', { checks: [{}, {}, { text: 'x' }] }), row('tiles', 'n'), row('packages', 'p')] }
  expect(resolvePath(doc, 'title')).toEqual(['title'])
  expect(resolvePath(doc, 'layout.@packages.kicker')).toEqual(['layout', '2', 'kicker'])
  expect(resolvePath(doc, 'layout.@hero.checks.2.text')).toEqual(['layout', '0', 'checks', '2', 'text'])
  // Positions keep working (other pages still use them).
  expect(resolvePath(doc, 'layout.1.heading')).toEqual(['layout', '1', 'heading'])
  // A block the page no longer has: reported, never guessed.
  expect(resolvePath(doc, 'layout.@trustBar.heading')).toBeNull()
})
