import { cache } from 'react'

import type { Case, Category, Engagement, Location, Page, Post, Service } from '@/payload-types'
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

export const getPublishedCases = cache(async (locale: Locale): Promise<Case[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'cases',
    where: published,
    sort: 'order',
    depth: 1,
    limit: 100,
    ...opts(locale),
  })
  return docs
})

/** Detail pages exist only for published cases flagged hasDetailPage. */
export const getCaseDetail = cache(async (slug: string, locale: Locale): Promise<Case | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'cases',
    where: { and: [{ slug: { equals: slug } }, { hasDetailPage: { equals: true } }, published] },
    depth: 1,
    limit: 1,
    ...opts(locale),
  })
  return docs[0] ?? null
})

// ── Guide (Ratgeber) ─────────────────────────────────────────────────────────
// "Live" = published AND publishedAt reached (future date = scheduled).
const livePost = () => ({ and: [published, { publishedAt: { less_than_equal: new Date().toISOString() } }] })

/** Drives the guide's visibility: menu items, teaser, sitemap entry, indexing. */
export const hasPublishedPosts = cache(async (): Promise<boolean> => {
  const payload = await getPayloadClient()
  const { totalDocs } = await payload.count({ collection: 'posts', where: livePost() })
  return totalDocs > 0
})

export const getPostBySlug = cache(async (slug: string, locale: Locale): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, ...livePost().and] },
    depth: 2,
    limit: 1,
    ...opts(locale),
  })
  return docs[0] ?? null
})

export const getLivePosts = cache(async (locale: Locale, categoryId?: number): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [...livePost().and, ...(categoryId ? [{ category: { equals: categoryId } }] : [])] },
    sort: '-publishedAt',
    depth: 1,
    limit: 200,
    ...opts(locale),
  })
  return docs
})

export const getCategoryBySlug = cache(async (slug: string, locale: Locale): Promise<Category | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
    ...opts(locale),
  })
  return docs[0] ?? null
})

export const getCategories = cache(async (locale: Locale): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'categories', sort: 'order', depth: 0, limit: 50, ...opts(locale) })
  return docs
})

/** Blog standard: category pages stay noindex,follow while thin (< 3 articles). */
export const CATEGORY_MIN_POSTS = 3
export const categoryIndexable = (c: Category, postCount: number) => !c.noindex && postCount >= CATEGORY_MIN_POSTS

export const getLocationBySlug = cache(async (slug: string, locale: Locale): Promise<Location | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'locations',
    where: { and: [{ slug: { equals: slug } }, published] },
    depth: 2,
    limit: 1,
    ...opts(locale),
  })
  return docs[0] ?? null
})
