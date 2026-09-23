import type { Metadata } from 'next'

import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'
import { getPayloadClient } from '@/lib/getPayload'
import { personNode } from '@/lib/json-ld'
import { canonicalUrl } from '@/lib/seo'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return cmsPageMetadata('ueber-uns', '/ueber-uns', locale, 'Über uns')
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  // The page is about Stephan — the same Person node the guide articles use.
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'authors',
    where: { slug: { equals: 'stephan-beau' } },
    locale: locale as 'de',
    depth: 0,
    limit: 1,
  })
  const a = docs[0]
  const person = a
    ? [
        personNode({
          slug: a.slug ?? 'stephan-beau',
          name: a.name,
          jobTitle: a.role,
          url: canonicalUrl('de', '/ueber-uns'),
          sameAs: (a.sameAs ?? []).map((s) => s.url),
        }),
      ]
    : []
  return <CmsPage slug="ueber-uns" path="/ueber-uns" locale={locale} extraGraph={person} />
}
