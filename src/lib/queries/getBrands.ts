import type { Brand } from '@/payload-types'
import { getPayloadClient } from '@/lib/getPayload'
import { toPayloadLocale, type Locale } from '@/lib/locale'

export async function getBrands(locale: Locale): Promise<Brand[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'brands',
    // „ausgeblendet“ appears nowhere on the site.
    where: { status: { not_equals: 'hidden' } },
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    sort: 'order',
    depth: 1,
    limit: 100,
  })
  return docs
}
