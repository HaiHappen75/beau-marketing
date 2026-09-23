import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { getWebsiteLegalText } from '@/lib/erecht24'
import { getPayloadClient } from '@/lib/getPayload'
import { CATEGORY_MIN_POSTS } from '@/lib/queries/content'
import { canonicalUrl } from '@/lib/seo'
import { translatedGlobalLocales, translatedLocalesBySlug } from '@/lib/translations'

// Generated on request (reads Payload) — keeps the build free of any DB access.
// Only self-canonical URLs (concept "Canonicals und hreflang bei Locale-Fallback"):
// a document is listed in the locales it is translated into, never with a
// fallback URL whose canonical points elsewhere. The root "/" is a redirect.
export const dynamic = 'force-dynamic'

// CMS page slug → path.
const PAGE_PATHS: Record<string, string> = {
  start: '',
  agentur: '/agentur',
  referenzen: '/referenzen',
  marken: '/marken',
  'ueber-uns': '/ueber-uns',
  kontakt: '/kontakt',
}

// The legal pages exist only in the languages eRecht24 delivers (German, plus
// English if maintained) — listing all three locales would advertise three
// languages for one German document. Handled separately below.
const LEGAL_PATHS = [
  { path: '/impressum', type: 'imprint' },
  { path: '/datenschutz', type: 'privacyPolicy' },
] as const

type Entry = MetadataRoute.Sitemap[number]

/** One entry per translated locale; hreflang only with at least two of them. */
function localized(path: string, locales: readonly string[], lastModified?: string | null): Entry[] {
  const langs = locales.length > 0 ? locales : [routing.defaultLocale]
  const languages =
    langs.length > 1
      ? {
          ...Object.fromEntries(langs.map((l) => [l, canonicalUrl(l, path)])),
          'x-default': canonicalUrl(routing.defaultLocale, path),
        }
      : undefined
  return langs.map((l) => ({
    url: canonicalUrl(l, path),
    ...(lastModified ? { lastModified } : {}),
    ...(languages ? { alternates: { languages } } : {}),
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const published = { _status: { equals: 'published' } } as const
  // Guide: only live articles (published, date reached, not noindex); the hub
  // only with at least one of them; categories only once they are not thin.
  const now = new Date().toISOString()
  const [posts, { docs: categories }, pages, services, cases, locations] = await Promise.all([
    translatedLocalesBySlug('posts', {
      and: [published, { publishedAt: { less_than_equal: now } }, { noindex: { not_equals: true } }],
    }),
    payload.find({ collection: 'categories', where: { noindex: { not_equals: true } }, limit: 100, depth: 0 }),
    translatedLocalesBySlug('pages', published),
    translatedLocalesBySlug('services', published),
    translatedLocalesBySlug('cases', { and: [published, { hasDetailPage: { equals: true } }] }),
    translatedLocalesBySlug('locations', published),
  ])
  const indexableCategories = categories.filter(
    (c) => posts.filter((p) => p.doc.category === c.id).length >= CATEGORY_MIN_POSTS,
  )

  const entries: MetadataRoute.Sitemap = []
  for (const p of pages) if (p.slug in PAGE_PATHS) entries.push(...localized(PAGE_PATHS[p.slug], p.locales))
  for (const s of services) entries.push(...localized(`/agentur/${s.slug}`, s.locales))
  for (const c of cases) entries.push(...localized(`/referenzen/${c.slug}`, c.locales))
  for (const l of locations) entries.push(...localized(`/region/${l.slug}`, l.locales))

  // Guide hub and categories are list pages: self-canonical in every locale.
  if (posts.length > 0) entries.push(...localized('/ratgeber', routing.locales))
  for (const c of indexableCategories) entries.push(...localized(`/ratgeber/kategorie/${c.slug}`, routing.locales))
  // Articles with lastmod = last content update (blog standard).
  for (const post of posts) {
    const lastModified = (post.doc.contentUpdatedAt ?? post.doc.publishedAt) as string | null
    entries.push(...localized(`/ratgeber/${post.slug}`, post.locales, lastModified))
  }

  // Widerruf and AGB are optional globals — while empty the page 404s, so it
  // must not be announced; otherwise only in the locales they are written in.
  const [widerruf, agb] = await Promise.all([
    translatedGlobalLocales('widerruf', 'content'),
    translatedGlobalLocales('agb', 'content'),
  ])
  if (widerruf.length > 0) entries.push(...localized('/widerrufsbelehrung', widerruf))
  if (agb.length > 0) entries.push(...localized('/agb', agb))

  for (const { path, type } of LEGAL_PATHS) {
    // Cached fetch (tag erecht24:<type>) — the same call the pages make.
    const { availableLangs } = await getWebsiteLegalText(type, 'de')
    entries.push(...localized(path, availableLangs))
  }

  return entries
}
