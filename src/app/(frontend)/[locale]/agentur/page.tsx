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

// Agency overview = CMS page "agentur" (services, packages, price table).
export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  const page = await getPageBySlug('agentur', locale as Locale)
  return cmsMetadata({ locale, path: '/agentur', meta: page?.meta, fallbackTitle: page?.title ?? 'Agentur' })
}

export default async function AgencyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const page = await getPageBySlug('agentur', locale as Locale)
  if (!page) notFound()
  const ctx = await getBlockContext(locale as Locale)
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(locale, '/agentur'),
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
