import { cache } from 'react'
import type { CollectionSlug, GlobalSlug } from 'payload'

import { routing } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/getPayload'
import { hasText, isLexical } from '@/lib/lexical'
import type { Locale } from '@/lib/locale'

// "Is this document translated?" (concept "Canonicals und hreflang bei
// Locale-Fallback"): a locale counts as translated when the collection's marker
// field holds its own value there — Payload's fallback does not count.

/** Marker field per collection: filled in a locale = a real translation. */
export const TRANSLATION_MARKER = {
  pages: 'title',
  services: 'promise',
  cases: 'summary',
  locations: 'intro',
  posts: 'title',
} as const satisfies Partial<Record<CollectionSlug, string>>

type MarkedCollection = keyof typeof TRANSLATION_MARKER

const filled = (v: unknown): boolean => {
  if (v === null || v === undefined) return false
  if (typeof v === 'string') return v.trim() !== ''
  if (isLexical(v)) return hasText(v)
  return typeof v !== 'object' || Object.keys(v as object).length > 0
}

/** Locales in routing order whose marker value is filled. */
export const localesOf = (value: unknown): Locale[] => {
  if (!value || typeof value !== 'object') return []
  return routing.locales.filter((l) => filled((value as Record<string, unknown>)[l]))
}

export const translatedLocales = cache(async (collection: MarkedCollection, id: number): Promise<Locale[]> => {
  const payload = await getPayloadClient()
  const marker = TRANSLATION_MARKER[collection]
  const { docs } = await payload.find({
    collection,
    where: { id: { equals: id } },
    locale: 'all',
    select: { [marker]: true },
    depth: 0,
    limit: 1,
  })
  return localesOf((docs[0] as unknown as Record<string, unknown> | undefined)?.[marker])
})

/** Bulk variant for the sitemap: slug → translated locales. */
export async function translatedLocalesBySlug(
  collection: MarkedCollection,
  where: Record<string, unknown>,
): Promise<{ slug: string; locales: Locale[]; doc: Record<string, unknown> }[]> {
  const payload = await getPayloadClient()
  const marker = TRANSLATION_MARKER[collection]
  const { docs } = await payload.find({
    collection,
    where: where as never,
    locale: 'all',
    depth: 0,
    limit: 1000,
    pagination: false,
  })
  return (docs as unknown as Record<string, unknown>[])
    .filter((d) => typeof d.slug === 'string')
    .map((d) => ({ slug: d.slug as string, locales: localesOf(d[marker]), doc: d }))
}

/** Globals with a localized content field (AGB, Widerruf). */
export async function translatedGlobalLocales(slug: GlobalSlug, field: string): Promise<Locale[]> {
  const payload = await getPayloadClient()
  const doc = (await payload.findGlobal({ slug, locale: 'all', depth: 0 })) as unknown as Record<string, unknown>
  return localesOf(doc[field])
}
