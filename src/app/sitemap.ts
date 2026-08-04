import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { getWebsiteLegalText } from '@/lib/erecht24'
import { getPayloadClient } from '@/lib/getPayload'
import { SITE_URL } from '@/lib/seo'

// Generated on request (reads brands from Payload) — keeps the build free of any DB access.
export const dynamic = 'force-dynamic'

const STATIC_PATHS = ['', '/marken', '/studio', '/ueber-uns', '/kontakt']

// The legal pages exist only in the languages eRecht24 delivers (German, plus
// English if maintained) — listing all three locales would advertise three
// languages for one German document. Handled separately below.
const LEGAL_PATHS = [
  { path: '/impressum', type: 'imprint' },
  { path: '/datenschutz', type: 'privacyPolicy' },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'brands', limit: 100, depth: 0 })
  const paths = [...STATIC_PATHS, ...docs.map((b) => `/marken/${b.slug}`)]

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
