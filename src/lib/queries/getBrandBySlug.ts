import type { Brand } from '@/payload-types'
import { getPayloadClient } from '@/lib/getPayload'
import { toPayloadLocale, type Locale } from '@/lib/locale'

export async function getBrandBySlug(slug: string, locale: Locale): Promise<Brand | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'brands',
    where: { slug: { equals: slug } },
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
}
