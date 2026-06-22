import type { Datenschutz, Impressum } from '@/payload-types'
import { getPayloadClient } from '@/lib/getPayload'
import { toPayloadLocale, type Locale } from '@/lib/locale'

export async function getImpressum(locale: Locale): Promise<Impressum> {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'impressum',
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    depth: 1,
  })
}

export async function getDatenschutz(locale: Locale): Promise<Datenschutz> {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'datenschutz',
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    depth: 1,
  })
}
