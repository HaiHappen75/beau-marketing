import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import type { LayoutBlock } from '@/components/blocks/types'
import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'
import { stripEmphasis } from '@/lib/emphasis'
import {
  AGENCY_ID,
  areaServedFromNames,
  breadcrumbNode,
  faqPageNode,
  offerPageServiceNode,
  professionalServiceNode,
  type JsonLdNode,
  type PricedItem,
} from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { offerPage, offerPageAvailable, offerPageTrail, type OfferPageSlug } from '@/lib/offerPages'
import { getOfferPageLinks, getPageBySlug } from '@/lib/queries/content'
import { getSettings } from '@/lib/queries/getLayoutData'
import { SITE_URL, canonicalUrl } from '@/lib/seo'

// Shared render path of the offer pages (src/lib/offerPages.ts): each one is the
// CMS page of its slug under its own route. Outside its languages the route
// answers 404 instead of serving the German page under a foreign prefix.

/** What a page offers at a price: priced offer blocks and the rows of pricing blocks. */
export function pricedItemsOf(blocks: LayoutBlock[]): PricedItem[] {
  return blocks.flatMap((b): PricedItem[] => {
    if (b.blockType === 'offer') {
      return b.price != null ? [{ name: stripEmphasis(b.heading), price: b.price, priceIsFrom: b.priceIsFrom, unit: b.unit }] : []
    }
    if (b.blockType === 'pricing') {
      return (b.offers ?? []).flatMap((o) =>
        o.price != null && o.name ? [{ name: stripEmphasis(o.name), price: o.price, priceIsFrom: o.priceIsFrom, unit: o.unit }] : [],
      )
    }
    return []
  })
}

export const faqItemsOf = (blocks: LayoutBlock[]) =>
  blocks.flatMap((b) =>
    b.blockType === 'faq' ? (b.items ?? []).map((it) => ({ question: it.question, answer: it.answer })) : [],
  )

export async function offerPageMetadata(slug: OfferPageSlug, locale: string): Promise<Metadata> {
  if (!offerPageAvailable(slug, locale)) return {}
  const offer = offerPage(slug)
  return cmsPageMetadata(slug, offer.path, locale, offer.crumb)
}

export async function OfferPageRoute({ slug, locale }: { slug: OfferPageSlug; locale: string }) {
  if (!offerPageAvailable(slug, locale)) notFound()
  const offer = offerPage(slug)
  const [page, settings, t, linkable] = await Promise.all([
    getPageBySlug(slug, locale as Locale),
    getSettings(locale as Locale),
    getTranslations({ locale, namespace: 'Site' }),
    getOfferPageLinks(locale as Locale),
  ])
  if (!page) notFound()

  // JSON-LD only from what the page shows: priced blocks, the FAQ block, the trail.
  const blocks = page.layout ?? []
  const canonical = canonicalUrl(locale, offer.path)
  // A parent that is not published (yet) stays out of the trail — nothing links to
  // a 404, e.g. between a deploy and the seed run that creates the hub.
  const published = new Set<string>(linkable.map((o) => o.slug))
  const trail = offerPageTrail(slug).filter((p) => p.slug === slug || published.has(p.slug))
  const hero = blocks.find((b) => b.blockType === 'hero')

  const graph: JsonLdNode[] = [professionalServiceNode(settings)]
  if (offer.schema === 'service') {
    graph.push(
      offerPageServiceNode({
        canonical,
        name: offer.serviceName ?? stripEmphasis(hero?.heading || page.title),
        description: page.meta?.description,
        offers: pricedItemsOf(blocks),
        areaServed: areaServedFromNames(offer.areaServed),
        audience: offer.audience,
      }),
    )
  }
  const faq = faqPageNode(canonical, faqItemsOf(blocks))
  if (faq) graph.push(faq)
  graph.push(
    breadcrumbNode(canonical, [
      { name: t('home'), url: `${SITE_URL}/${locale}` },
      ...trail.map((p) => ({ name: p.crumb, url: canonicalUrl(locale, p.path) })),
    ]),
  )

  return (
    <CmsPage
      slug={slug}
      path={offer.path}
      locale={locale}
      extraGraph={graph}
      about={offer.schema === 'hub' ? AGENCY_ID : undefined}
      breadcrumb={[
        { label: t('home'), href: '/' },
        ...trail.map((p, i) => (i === trail.length - 1 ? { label: p.crumb } : { label: p.crumb, href: p.path })),
      ]}
    />
  )
}
