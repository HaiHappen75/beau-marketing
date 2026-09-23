import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { JsonLd } from '@/components/seo/JsonLd'
import { webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { cmsMetadata } from '@/lib/pageMeta'
import { getBlockContext } from '@/lib/queries/blockContext'
import { getPageBySlug } from '@/lib/queries/content'
import { canonicalUrl } from '@/lib/seo'

// Start page = CMS page "start" (hero A, packages, services, references, brands,
// region, trust, guides, CTA).
export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  const page = await getPageBySlug('start', locale as Locale)
  return cmsMetadata({
    locale,
    path: '',
    meta: page?.meta,
    fallbackTitle: page?.title ?? 'Beau Marketing',
    absoluteTitle: true,
  })
}

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const page = await getPageBySlug('start', locale as Locale)
  if (!page) notFound()
  const ctx = await getBlockContext(locale as Locale)
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(locale, ''),
            name: page.meta?.title || page.title,
            description: page.meta?.description ?? undefined,
            lang: locale as Locale,
          }),
        ]}
      />
      <RenderBlocks blocks={page.layout} ctx={ctx} />
    </>
  )
}
