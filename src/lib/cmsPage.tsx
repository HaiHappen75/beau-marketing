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

// Shared render path for block-built CMS pages (referenzen, marken, ueber-uns).

export async function cmsPageMetadata(slug: string, path: string, locale: string, fallback: string): Promise<Metadata> {
  const page = await getPageBySlug(slug, locale as Locale)
  return cmsMetadata({ locale, path, meta: page?.meta, fallbackTitle: page?.title ?? fallback })
}

export async function CmsPage({
  slug,
  path,
  locale,
  service,
}: {
  slug: string
  path: string
  locale: string
  /** ?leistung=<slug> (filter / preselection). */
  service?: string | null
}) {
  setRequestLocale(locale)
  const page = await getPageBySlug(slug, locale as Locale)
  if (!page) notFound()
  const ctx = await getBlockContext(locale as Locale, service ?? null)
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(locale, path),
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
