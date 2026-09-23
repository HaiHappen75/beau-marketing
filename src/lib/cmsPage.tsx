import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { JsonLd } from '@/components/seo/JsonLd'
import { webPageNode, type JsonLdNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { cmsMetadata } from '@/lib/pageMeta'
import { getBlockContext } from '@/lib/queries/blockContext'
import { getPageBySlug } from '@/lib/queries/content'
import { canonicalUrl, localeAlternates } from '@/lib/seo'
import { translatedLocales } from '@/lib/translations'

// Shared render path for block-built CMS pages. Canonical/hreflang follow the
// fallback concept: an untranslated locale points its canonical at /de and marks
// the served German content with lang="de".

export async function cmsPageMetadata(
  slug: string,
  path: string,
  locale: string,
  fallback: string,
  opts: { absoluteTitle?: boolean } = {},
): Promise<Metadata> {
  const page = await getPageBySlug(slug, locale as Locale)
  const available = page ? await translatedLocales('pages', page.id) : undefined
  return cmsMetadata({
    locale,
    path,
    meta: page?.meta,
    fallbackTitle: page?.title ?? fallback,
    absoluteTitle: opts.absoluteTitle,
    available,
  })
}

export async function CmsPage({
  slug,
  path,
  locale,
  service,
  extraGraph = [],
}: {
  slug: string
  path: string
  locale: string
  /** ?leistung=<slug> (filter / preselection). */
  service?: string | null
  extraGraph?: JsonLdNode[]
}) {
  setRequestLocale(locale)
  const page = await getPageBySlug(slug, locale as Locale)
  if (!page) notFound()
  const [ctx, available] = await Promise.all([
    getBlockContext(locale as Locale, service ?? null),
    translatedLocales('pages', page.id),
  ])
  const { servedLang } = localeAlternates(path, available, locale)
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(servedLang, path),
            name: page.meta?.title || page.title,
            description: page.meta?.description ?? undefined,
            lang: servedLang as Locale,
          }),
          ...extraGraph,
        ]}
      />
      <div lang={servedLang !== locale ? servedLang : undefined}>
        <RenderBlocks blocks={page.layout} ctx={ctx} />
      </div>
    </>
  )
}
