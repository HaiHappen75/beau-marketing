import { cache } from 'react'

import type { Navigation, Service, SiteSetting, Trust } from '@/payload-types'
import { getPayloadClient } from '@/lib/getPayload'
import { toPayloadLocale, type Locale } from '@/lib/locale'

// Header and footer both read these per request — cache() dedupes the calls.

export const getPublishedServices = cache(async (locale: Locale): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    // Local API bypasses access control — filter drafts explicitly.
    where: { _status: { equals: 'published' } },
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    sort: 'order',
    depth: 0,
    limit: 50,
  })
  return docs
})

export const getNavigation = cache(async (locale: Locale): Promise<Navigation> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'navigation',
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    depth: 0,
  })
})

export const getTrust = cache(async (locale: Locale): Promise<Trust> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'trust',
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    depth: 1,
  })
})

export const getSettings = cache(async (locale: Locale): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'site-settings',
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    depth: 1,
  })
})
