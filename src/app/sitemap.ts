import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { getWebsiteLegalText } from '@/lib/erecht24'
import { getPayloadClient } from '@/lib/getPayload'
import { CATEGORY_MIN_POSTS } from '@/lib/queries/content'
import { getAGB, getWiderruf, hasContent } from '@/lib/queries/getLegalDocs'
import { SITE_URL } from '@/lib/seo'

// Generated on request (reads Payload) — keeps the build free of any DB access.
// Interim state of the redesign: hreflang/fallback handling follows in Paket 5.
export const dynamic = 'force-dynamic'

const STATIC_PATHS = ['', '/agentur', '/referenzen', '/marken', '/ueber-uns', '/kontakt']

// The legal pages exist only in the languages eRecht24 delivers (German, plus
// English if maintained) — listing all three locales would advertise three
// languages for one German document. Handled separately below.
const LEGAL_PATHS = [
  { path: '/impressum', type: 'imprint' },
  { path: '/datenschutz', type: 'privacyPolicy' },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const published = { _status: { equals: 'published' } } as const
  // Guide: only live articles (published, date reached, not noindex); the hub
  // only with at least one of them; categories only once they are not thin.
  const now = new Date().toISOString()
  const [{ docs: posts }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { and: [published, { publishedAt: { less_than_equal: now } }, { noindex: { not_equals: true } }] },
      limit: 1000,
      depth: 0,
    }),
    payload.find({ collection: 'categories', where: { noindex: { not_equals: true } }, limit: 100, depth: 0 }),
  ])
  const indexableCategories = categories.filter(
    (c) => posts.filter((p) => p.category === c.id).length >= CATEGORY_MIN_POSTS,
  )
  const [{ docs: services }, { docs: cases }] = await Promise.all([
    payload.find({ collection: 'services', where: published, limit: 100, depth: 0 }),
    payload.find({
      collection: 'cases',
      where: { and: [published, { hasDetailPage: { equals: true } }] },
      limit: 100,
      depth: 0,
    }),
  ])

  // Widerruf and AGB are optional Payload globals — while empty the page 404s,
  // so it must not be announced. Localized with fallback, hence all locales.
  const [widerruf, agb] = await Promise.all([getWiderruf('de'), getAGB('de')])
  const optionalPaths = [
    ...(hasContent(widerruf) ? ['/widerrufsbelehrung'] : []),
    ...(hasContent(agb) ? ['/agb'] : []),
  ]

  // Brand detail pages are gone (301 to /marken#<slug> in Paket 5).
  const paths = [
    ...STATIC_PATHS,
    ...optionalPaths,
    ...services.map((s) => `/agentur/${s.slug}`),
    ...cases.map((c) => `/referenzen/${c.slug}`),
    ...(posts.length > 0 ? ['/ratgeber'] : []),
    ...indexableCategories.map((c) => `/ratgeber/kategorie/${c.slug}`),
  ]

  const entries: MetadataRoute.Sitemap = []
  for (const path of paths) {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    )
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        alternates: { languages },
      })
    }
  }

  // Articles with lastmod = last content update (blog standard).
  for (const post of posts) {
    const path = `/ratgeber/${post.slug}`
    const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]))
    const lastModified = post.contentUpdatedAt ?? post.publishedAt
    for (const locale of routing.locales) {
      entries.push({ url: `${SITE_URL}/${locale}${path}`, lastModified, alternates: { languages } })
    }
  }

  for (const { path, type } of LEGAL_PATHS) {
    // Cached fetch (tag erecht24:<type>) — the same call the pages make.
    const { availableLangs } = await getWebsiteLegalText(type, 'de')
    const languages = Object.fromEntries(
      availableLangs.map((lang) => [lang, `${SITE_URL}/${lang}${path}`]),
    )
    for (const lang of availableLangs) {
      entries.push({ url: `${SITE_URL}/${lang}${path}`, alternates: { languages } })
    }
  }

  return entries
}
