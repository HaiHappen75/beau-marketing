import type { BlockContext } from '@/components/blocks/types'
import type { Locale } from '@/lib/locale'

import { getPublishedServices, getSettings, getTrust } from './getLayoutData'

/** Everything a page's blocks share, loaded once per request (cached queries). */
export async function getBlockContext(locale: Locale, preselectService?: string | null): Promise<BlockContext> {
  const [services, settings, trust] = await Promise.all([
    getPublishedServices(locale),
    getSettings(locale),
    getTrust(locale),
  ])
  return { locale, services, settings, trust, preselectService }
}
