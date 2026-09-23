import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    // Payload serves uploads under /api/media/file/… — the longer Allow rule wins
    // over Disallow /api, so CMS images stay crawlable.
    rules: { userAgent: '*', allow: ['/', '/api/media/'], disallow: ['/admin', '/api'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
