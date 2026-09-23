import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']

export default function robots(): MetadataRoute.Robots {
  return {
    // Payload serves uploads under /api/media/file/… — the longer Allow rule wins
    // over Disallow /api, so CMS images stay crawlable. AI crawlers are named
    // explicitly (house standard "SEO-Grundlagen 2026": being cited beats traffic
    // protection). A named group ignores the * group, so each repeats the rules.
    rules: ['*', ...AI_CRAWLERS].map((userAgent) => ({
      userAgent,
      allow: ['/', '/api/media/'],
      disallow: ['/admin', '/api'],
    })),
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
