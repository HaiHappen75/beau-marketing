import type { CollectionSlug, GlobalSlug, Payload, Where } from 'payload'

import { isRichText, paragraphsOf } from './richtext'
import type { CollectionSummary, LegacyEvent, SeedLocale, SeedSummary } from './types'

// Fill-only seed engine. Rules (decision Stephan, 23.09.2026):
//   1. Missing documents are created.
//   2. Existing documents only get EMPTY fields filled — nothing is overwritten.
//   3. Exception: a field holding a known legacy value (src/seed/legacy.ts) counts
//      as empty; every such replacement is reported individually.
//   4. Blocks of an existing page (05.11.2026): a block list is atomic for rule 2,
//      so a new block never reaches a page that already has a layout. A seed block
//      marked with `_insert` counts as an empty field as long as the page has NO
//      block of its type — then it is inserted at its anchor (insertBlocks). Like
//      any emptied field, a block deleted in the admin comes back with the next run.
// Localized fields are read per locale WITHOUT fallback, otherwise a German
// fallback would make an empty Danish field look filled.

export const LOCALES: SeedLocale[] = ['de', 'en', 'da']

type Obj = Record<string, unknown>

export type LegacyCheck = (field: string, current: unknown, locale: SeedLocale) => boolean

export type Plan = { patch: Obj; filled: string[]; legacy: Omit<LegacyEvent, 'doc' | 'locale'>[] }

const isPlainObject = (v: unknown): v is Obj =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v) && !isRichText(v) && !(v instanceof Date)

export const isEmpty = (v: unknown): boolean =>
  v === null ||
  v === undefined ||
  (typeof v === 'string' && v.trim() === '') ||
  (Array.isArray(v) && v.length === 0) ||
  (isRichText(v) && paragraphsOf(v).every((p) => p === ''))

export const display = (v: unknown): string => {
  if (v === null || v === undefined) return '—'
  if (isRichText(v)) return paragraphsOf(v).filter(Boolean).join(' / ')
  if (Array.isArray(v)) {
    // Lists of single-text rows (items, chips, labels, FAQ questions): readable, without row ids.
    const texts = v.map((r) =>
      r && typeof r === 'object' ? ((r as Obj).item ?? (r as Obj).label ?? (r as Obj).name ?? (r as Obj).question) : r,
    )
    if (texts.every((t) => typeof t === 'string')) return texts.join(' / ')
    return JSON.stringify(v)
  }
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

export const emptyPlan = (): Plan => ({ patch: {}, filled: [], legacy: [] })

/** Compares desired against current and returns the minimal patch. Groups recurse. */
export function planFill(
  current: Obj | undefined | null,
  desired: Obj,
  locale: SeedLocale,
  isLegacy: LegacyCheck = () => false,
  prefix = '',
): Plan {
  const plan = emptyPlan()
  for (const [key, want] of Object.entries(desired)) {
    if (want === undefined) continue
    const field = prefix ? `${prefix}.${key}` : key
    const have = current?.[key]
    if (isPlainObject(want)) {
      const sub = planFill(isPlainObject(have) ? have : undefined, want, locale, isLegacy, field)
      if (Object.keys(sub.patch).length > 0) plan.patch[key] = sub.patch
      plan.filled.push(...sub.filled)
      plan.legacy.push(...sub.legacy)
      continue
    }
    if (isEmpty(have)) {
      if (!isEmpty(want)) {
        plan.patch[key] = want
        plan.filled.push(field)
      }
      continue
    }
    if (isLegacy(field, have, locale)) {
      plan.patch[key] = isEmpty(want) ? null : want
      plan.legacy.push({ field, from: display(have), to: isEmpty(want) ? null : display(want) })
    }
  }
  return plan
}

export const mergePlans = (a: Plan, b: Plan): Plan => ({
  patch: { ...a.patch, ...b.patch },
  filled: [...a.filled, ...b.filled],
  legacy: [...a.legacy, ...b.legacy],
})

/**
 * Localized labels inside a non-localized array (e.g. navigation): fills the
 * label of every row whose label is empty in this locale. Whole rows are sent
 * back with their ids so nothing else in the row changes.
 */
export function fillRowLabels(
  rows: unknown,
  labels: string[] | undefined,
  field: string,
  labelKey = 'label',
): Plan {
  const plan = emptyPlan()
  if (!labels || !Array.isArray(rows) || rows.length === 0) return plan
  let touched = false
  const next = (rows as Obj[]).map((row, i) => {
    if (isEmpty(row[labelKey]) && labels[i]) {
      touched = true
      plan.filled.push(`${field}[${i}].${labelKey}`)
      return { ...row, [labelKey]: labels[i] }
    }
    return row
  })
  if (touched) plan.patch[field] = next
  return plan
}

/**
 * Where a block goes in an existing layout: before/after the first (or last)
 * block of a type, or at one end. A list of anchors is a fallback chain — the
 * admin may have removed or reordered blocks since the seed created the page.
 */
export type Anchor =
  | { after: string; pick?: 'first' | 'last' }
  | { before: string; pick?: 'first' | 'last' }
  | 'start'
  | 'end'

export type BlockInsert = { block: Obj; at: Anchor[] }

/** Position for the first anchor the layout offers; without any of them: the end. */
export function resolveAnchor(rows: Obj[], at: Anchor[]): { index: number; label: string } {
  for (const anchor of at) {
    if (anchor === 'start') return { index: 0, label: 'am Anfang' }
    if (anchor === 'end') return { index: rows.length, label: 'am Ende' }
    const type = 'after' in anchor ? anchor.after : anchor.before
    const hits = rows.flatMap((row, i) => (row.blockType === type ? [i] : []))
    if (hits.length === 0) continue
    const i = anchor.pick === 'last' ? hits[hits.length - 1] : hits[0]
    return 'after' in anchor ? { index: i + 1, label: `nach ${type}` } : { index: i, label: `vor ${type}` }
  }
  return { index: rows.length, label: 'am Ende' }
}

/**
 * Rule 4: inserts every block whose type the layout does not hold yet. The rows
 * that exist go back untouched — the same objects, with their ids, so their
 * order, their nested rows and their texts in the other languages stay as they
 * are. An empty layout is left to planFill, which writes the whole page.
 */
export function insertBlocks(rows: unknown, inserts: BlockInsert[], field = 'layout', note = ''): Plan {
  const plan = emptyPlan()
  if (!Array.isArray(rows) || rows.length === 0) return plan
  let next = rows as Obj[]
  for (const insert of inserts) {
    const type = insert.block.blockType
    if (next.some((row) => row.blockType === type)) continue
    const { index, label } = resolveAnchor(next, insert.at)
    next = [...next.slice(0, index), insert.block, ...next.slice(index)]
    plan.filled.push(`${field} +${String(type)} (${label}${note})`)
  }
  if (next !== rows) plan.patch[field] = next
  return plan
}

/**
 * A field path with blocks addressed by type: `layout.@packages.kicker` is the
 * kicker of the FIRST block of type "packages", wherever it stands. Plain
 * positions (`layout.2.kicker`) break as soon as a block is inserted above —
 * which rule 4 does and the admin may do any time. Resolved against the German
 * document; the block list is the same in every language. null when the page has
 * no block of that type. Used by the translations (src/seed/translations.ts).
 */
export function resolvePath(doc: unknown, path: string): string[] | null {
  const parts: string[] = []
  let node: unknown = doc
  for (const part of path.split('.')) {
    let key = part
    if (part.startsWith('@')) {
      const index = Array.isArray(node) ? node.findIndex((row) => (row as Obj | null)?.blockType === part.slice(1)) : -1
      if (index < 0) return null
      key = String(index)
    }
    parts.push(key)
    node = node && typeof node === 'object' ? (node as Obj)[key] : undefined
  }
  return parts
}

export const newSummary = (): CollectionSummary => ({
  created: [],
  filled: [],
  skipped: [],
  filledFields: [],
  legacyReplaced: [],
})

const record = (s: CollectionSummary, doc: string, locale: SeedLocale, plan: Plan) => {
  s.filledFields.push(...plan.filled.map((f) => `${doc} · ${f} (${locale})`))
  s.legacyReplaced.push(...plan.legacy.map((l) => ({ ...l, doc, locale })))
}

export type DocSpec = {
  /** Display key in the summary. */
  key: string
  where: Where
  /** false: only touch the document if it already exists (e.g. retired brands). */
  createIfMissing?: boolean
  status?: 'published' | 'draft'
  /** `de` holds the full create data; `en`/`da` only localized fields. */
  data: Partial<Record<SeedLocale, Obj>>
  legacy?: LegacyCheck
  /** Collection-specific rules on top of planFill (array rows, rich text). */
  custom?: (current: Obj, locale: SeedLocale) => Plan
}

export async function upsertDoc(
  payload: Payload,
  collection: CollectionSlug,
  spec: DocSpec,
  summary: SeedSummary,
  /** Upload collections: the file to create the document from. */
  filePath?: string,
): Promise<Obj | null> {
  const s = (summary[collection] ??= newSummary())
  const { docs } = await payload.find({
    collection,
    where: spec.where,
    locale: 'de',
    fallbackLocale: false,
    depth: 0,
    limit: 1,
    draft: true,
    pagination: false,
  })
  const existing = docs[0] as unknown as Obj | undefined
  const isDraft = spec.status === 'draft'

  if (!existing) {
    if (spec.createIfMissing === false) return null
    const created = (await payload.create({
      collection,
      locale: 'de',
      draft: isDraft,
      depth: 0,
      ...(filePath ? { filePath } : {}),
      data: { ...spec.data.de, ...(spec.status ? { _status: spec.status } : {}) } as never,
    })) as unknown as Obj
    for (const locale of ['en', 'da'] as const) {
      const data = spec.data[locale]
      if (!data) continue
      await payload.update({ collection, id: created.id as number, locale, draft: isDraft, depth: 0, data: data as never })
    }
    s.created.push(spec.key)
    return created
  }

  let changed = false
  for (const locale of LOCALES) {
    const desired = spec.data[locale]
    if (!desired && !spec.custom) continue
    const current =
      locale === 'de'
        ? existing
        : ((await payload.findByID({
            collection,
            id: existing.id as number,
            locale,
            fallbackLocale: false,
            depth: 0,
            draft: true,
          })) as unknown as Obj)
    let plan = planFill(current, desired ?? {}, locale, spec.legacy)
    if (spec.custom) plan = mergePlans(plan, spec.custom(current, locale))
    if (Object.keys(plan.patch).length === 0) continue
    await payload.update({
      collection,
      id: existing.id as number,
      locale,
      draft: current._status === 'draft',
      depth: 0,
      data: plan.patch as never,
    })
    record(s, spec.key, locale, plan)
    changed = true
  }
  ;(changed ? s.filled : s.skipped).push(spec.key)
  return existing
}

export type GlobalSpec = {
  slug: GlobalSlug
  data: Partial<Record<SeedLocale, Obj>>
  legacy?: LegacyCheck
  custom?: (current: Obj, locale: SeedLocale) => Plan
}

export async function fillGlobal(payload: Payload, spec: GlobalSpec, summary: SeedSummary): Promise<void> {
  const s = (summary[spec.slug] ??= newSummary())
  let changed = false
  for (const locale of LOCALES) {
    const desired = spec.data[locale]
    if (!desired && !spec.custom) continue
    const current = (await payload.findGlobal({
      slug: spec.slug,
      locale,
      fallbackLocale: false,
      depth: 0,
    })) as unknown as Obj
    let plan = planFill(current, desired ?? {}, locale, spec.legacy)
    if (spec.custom) plan = mergePlans(plan, spec.custom(current, locale))
    if (Object.keys(plan.patch).length === 0) continue
    await payload.updateGlobal({ slug: spec.slug, locale, depth: 0, data: plan.patch as never })
    record(s, spec.slug, locale, plan)
    changed = true
  }
  ;(changed ? s.filled : s.skipped).push(spec.slug)
}

export type MediaSpec = {
  filename: string
  filePath: string
  alt: Partial<Record<SeedLocale, string>>
  credit: { author: string; source: string; license: string }
}

/**
 * Uploads a file once and fills alt text / credit if empty. Matched by filename —
 * including Payload's collision suffix (`name-1.webp`), which it appends when the
 * file already exists on disk; otherwise every run would upload a new copy.
 */
export async function ensureMedia(payload: Payload, spec: MediaSpec, summary: SeedSummary): Promise<number> {
  const dot = spec.filename.lastIndexOf('.')
  const base = spec.filename.slice(0, dot)
  const ext = spec.filename.slice(dot)
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const sameFile = new RegExp(`^${escape(base)}(-\\d+)?${escape(ext)}$`)
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: base } },
    depth: 0,
    limit: 50,
    pagination: false,
    sort: 'createdAt',
  })
  const match = docs.find((d) => typeof d.filename === 'string' && sameFile.test(d.filename))
  const doc = await upsertDoc(
    payload,
    'media',
    {
      key: spec.filename,
      where: match ? { id: { equals: match.id } } : { filename: { equals: spec.filename } },
      data: {
        de: { alt: spec.alt.de, credit: spec.credit },
        ...(spec.alt.en ? { en: { alt: spec.alt.en } } : {}),
        ...(spec.alt.da ? { da: { alt: spec.alt.da } } : {}),
      },
    },
    summary,
    spec.filePath,
  )
  return doc?.id as number
}

/**
 * Arrays of existing documents (e.g. packages, trust badges) are atomic for
 * planFill. This fills empty sub-fields of rows matched by a key (e.g. the
 * package name) and replaces legacy sub-values — the row itself, its id and
 * every other value stay as they are. Rows that do not match stay untouched.
 */
export function fillRowsByKey(
  rows: unknown,
  desired: Obj[],
  field: string,
  key: string,
  locale: SeedLocale,
  isLegacy: LegacyCheck = () => false,
  transform?: (row: Obj, want: Obj, plan: Plan, path: string) => Obj,
): Plan {
  const plan = emptyPlan()
  if (!Array.isArray(rows) || rows.length === 0) return plan
  let touched = false
  const next = (rows as Obj[]).map((row) => {
    const want = desired.find((d) => d[key] === row[key])
    if (!want) return row
    const path = `${field}[${row[key]}]`
    const sub = planFill(row, Object.fromEntries(Object.entries(want).filter(([k]) => k !== key)), locale, isLegacy, path)
    let out = Object.keys(sub.patch).length > 0 ? { ...row, ...sub.patch } : row
    plan.filled.push(...sub.filled)
    plan.legacy.push(...sub.legacy)
    if (transform) out = transform(out, want, plan, path)
    if (out !== row) touched = true
    return out
  })
  if (touched) plan.patch[field] = next
  return plan
}
