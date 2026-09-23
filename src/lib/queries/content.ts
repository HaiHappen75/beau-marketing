import { cache } from 'react'

import type { Case, Engagement, Page, Post, Service } from '@/payload-types'
import { getPayloadClient } from '@/lib/getPayload'
import { toPayloadLocale, type Locale } from '@/lib/locale'

// Page/section data. The Local API bypasses access control, so every query
// filters on published state itself — drafts never reach the frontend.

const opts = (locale: Locale) => ({
  locale: toPayloadLocale(locale),
  fallbackLocale: toPayloadLocale('de'),
})

const published = { _status: { equals: 'published' } } as const

export const getPageBySlug = cache(async (slug: string, locale: Locale): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: slug } }, published] },
    depth: 1,
    limit: 1,
    ...opts(locale),
  })
  return docs[0] ?? null
})

export const getServiceBySlug = cache(async (slug: string, locale: Locale): Promise<Service | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { and: [{ slug: { equals: slug } }, published] },
    depth: 1,
    limit: 1,
    ...opts(locale),
  })
  return docs[0] ?? null
})

export const getFeaturedCases = cache(async (locale: Locale): Promise<Case[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'cases',
    where: { and: [{ featuredOnHome: { equals: true } }, published] },
    sort: 'order',
    depth: 1,
    limit: 12,
    ...opts(locale),
  })
  return docs
})

export const getCasesByIds = cache(async (ids: number[], locale: Locale): Promise<Case[]> => {
  if (ids.length === 0) return []
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'cases',
    where: { and: [{ id: { in: ids } }, published] },
    sort: 'order',
    depth: 1,
    limit: ids.length,
    ...opts(locale),
  })
  return docs
})

export const getCasesForService = cache(async (serviceId: number, locale: Locale): Promise<Case[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'cases',
    where: { and: [{ services: { contains: serviceId } }, published] },
    sort: 'order',
    depth: 1,
    limit: 12,
    ...opts(locale),
  })
  return docs
})

export const getVisibleEngagements = cache(async (locale: Locale): Promise<Engagement[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'engagements',
    where: { visible: { equals: true } },
    sort: 'order',
    depth: 1,
    limit: 20,
    ...opts(locale),
  })
  return docs
})

/** Published guide articles whose publication date has arrived (future date = scheduled). */
export const getLatestPosts = cache(async (locale: Locale, limit = 3): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [published, { publishedAt: { less_than_equal: new Date().toISOString() } }] },
    sort: '-publishedAt',
    depth: 1,
    limit,
    ...opts(locale),
  })
  return docs
})

export const getPostsByIds = cache(async (ids: number[], locale: Locale): Promise<Post[]> => {
  if (ids.length === 0) return []
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [{ id: { in: ids } }, published, { publishedAt: { less_than_equal: new Date().toISOString() } }],
    },
    depth: 1,
    limit: ids.length,
    ...opts(locale),
  })
  return docs
})

/** Relationship values arrive as id or populated doc depending on depth. */
export const idOf = (v: unknown): number | null =>
  typeof v === 'number' ? v : v && typeof v === 'object' && 'id' in v ? Number((v as { id: unknown }).id) : null
