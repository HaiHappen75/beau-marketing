import type { SiteSetting } from '@/payload-types'
import { getPayloadClient } from '@/lib/getPayload'
import { toPayloadLocale, type Locale } from '@/lib/locale'

export async function getSiteSettings(locale: Locale): Promise<SiteSetting> {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'site-settings',
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    depth: 1,
  })
}
