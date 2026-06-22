import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/getPayload'
import { SITE_URL } from '@/lib/seo'

// Generated on request (reads brands from Payload) — keeps the build free of any DB access.
export const dynamic = 'force-dynamic'

const STATIC_PATHS = ['', '/marken', '/studio', '/ueber-uns', '/kontakt', '/impressum', '/datenschutz']

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
  return entries
}
