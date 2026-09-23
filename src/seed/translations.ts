import type { CollectionSlug, Payload, Where } from 'payload'

import { isEmpty, newSummary } from './fill'
import { isRichText, paragraphsOf, rt } from './richtext'
import data from './translations.json'
import type { SeedLocale, SeedSummary } from './types'

// Danish (complete) and English (core pages + what they show) — machine-translated,
// to be proofread (list in the SecondBrain, Paket 5). Same fill-only rules as
// the rest of the seed, plus one guard: a field is only translated while its
// German text is still exactly the one the translation was made from. Arrays and
// blocks are not localized here — only their leaves are — so rows are sent back
// whole, with their ids, and nothing but the empty leaves changes.

type Entry = {
  de: string
  da?: string
  en?: string
  richText?: boolean
  /** Earlier translations of this field: they count as empty and are replaced (reported). */
  legacy?: Partial<Record<'da' | 'en', string[]>>
}
type DocTranslation = { collection: string; match: Record<string, string>; fields: Record<string, Entry> }

type Obj = Record<string, unknown>

const TRANSLATIONS = data as unknown as DocTranslation[]
const TARGETS = ['da', 'en'] as const satisfies readonly SeedLocale[]

const getPath = (obj: unknown, path: string[]): unknown =>
  path.reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Obj)[k] : undefined), obj)

function setPath(obj: Obj, path: string[], value: unknown) {
  let o: Obj = obj
  for (const k of path.slice(0, -1)) {
    if (!o[k] || typeof o[k] !== 'object') o[k] = {}
    o = o[k] as Obj
  }
  o[path[path.length - 1]] = value
}

const sameGerman = (value: unknown, e: Entry) =>
  e.richText
    ? isRichText(value) && paragraphsOf(value).filter(Boolean).join('\n\n') === e.de
    : typeof value === 'string' && value === e.de

export async function fillTranslations(payload: Payload, summary: SeedSummary): Promise<void> {
  for (const t of TRANSLATIONS) {
    const collection = t.collection as CollectionSlug
    const s = (summary[`${collection} (Übersetzung)`] ??= newSummary())
    const key = Object.values(t.match)[0]
    const where: Where = Object.fromEntries(Object.entries(t.match).map(([k, v]) => [k, { equals: v }]))
    const { docs } = await payload.find({ collection, where, locale: 'de', fallbackLocale: false, depth: 0, limit: 1, draft: true })
    const de = docs[0] as unknown as Obj | undefined
    if (!de) {
      s.skipped.push(`${key} (Dokument fehlt)`)
      continue
    }
    let changed = false
    for (const locale of TARGETS) {
      const fields = Object.entries(t.fields).filter(([, e]) => e[locale])
      if (fields.length === 0) continue
      const current = (await payload.findByID({
        collection,
        id: de.id as number,
        locale,
        fallbackLocale: false,
        depth: 0,
        draft: true,
      })) as unknown as Obj
      const next = structuredClone(current)
      const touched = new Set<string>()
      for (const [path, e] of fields) {
        const parts = path.split('.')
        if (!sameGerman(getPath(de, parts), e)) {
          s.skipped.push(`${key} · ${path} (${locale}): deutscher Text geändert`)
          continue
        }
        const have = getPath(current, parts)
        const text = e[locale]!
        const legacy = typeof have === 'string' && (e.legacy?.[locale] ?? []).includes(have)
        if (!isEmpty(have) && !legacy) continue
        setPath(next, parts, e.richText ? rt(text.split('\n\n')) : text)
        touched.add(parts[0])
        if (legacy) s.legacyReplaced.push({ doc: key, field: path, locale, from: have as string, to: text })
        else s.filledFields.push(`${key} · ${path} (${locale})`)
      }
      if (touched.size === 0) continue
      await payload.update({
        collection,
        id: de.id as number,
        locale,
        draft: current._status === 'draft',
        depth: 0,
        data: Object.fromEntries([...touched].map((k) => [k, next[k]])) as never,
      })
      changed = true
    }
    if (changed) s.filled.push(key)
    else if (!s.skipped.some((x) => x.startsWith(`${key} `))) s.skipped.push(key)
  }
}
