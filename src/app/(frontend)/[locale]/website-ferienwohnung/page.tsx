import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'
import { stripEmphasis } from '@/lib/emphasis'
import {
  areaServedFromNames,
  faqPageNode,
  offerPageServiceNode,
  professionalServiceNode,
  type PricedItem,
} from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { OFFER_PAGES, offerPageAvailable } from '@/lib/offerPages'
import { getPageBySlug } from '@/lib/queries/content'
import { getSettings } from '@/lib/queries/getLayoutData'
import { canonicalUrl } from '@/lib/seo'

// Offer page "Website für Ferienwohnung und Ferienhaus" = CMS page of the same
// slug. German only (src/lib/offerPages.ts): any other locale answers 404 instead
// of serving the German page under a foreign prefix.

const SLUG = 'website-ferienwohnung'
const OFFER = OFFER_PAGES[SLUG]

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  if (!offerPageAvailable(SLUG, locale)) return {}
  return cmsPageMetadata(SLUG, OFFER.path, locale, 'Website für Ferienwohnung und Ferienhaus', { absoluteTitle: true })
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  if (!offerPageAvailable(SLUG, locale)) notFound()
  const [page, settings] = await Promise.all([getPageBySlug(SLUG, locale as Locale), getSettings(locale as Locale)])
  if (!page) notFound()

  // JSON-LD only from what the page shows: priced offer blocks and the FAQ block.
  const blocks = page.layout ?? []
  const offers: PricedItem[] = blocks.flatMap((b) =>
    b.blockType === 'offer' && b.price != null
      ? [{ name: stripEmphasis(b.heading), price: b.price, priceIsFrom: b.priceIsFrom, unit: b.unit }]
      : [],
  )
  const faq = blocks.flatMap((b) =>
    b.blockType === 'faq' ? (b.items ?? []).map((it) => ({ question: it.question, answer: it.answer })) : [],
  )
  const hero = blocks.find((b) => b.blockType === 'hero')
  const canonical = canonicalUrl(locale, OFFER.path)

  return (
    <CmsPage
      slug={SLUG}
      path={OFFER.path}
      locale={locale}
      extraGraph={[
        professionalServiceNode(settings),
        offerPageServiceNode({
          canonical,
          name: stripEmphasis(hero?.heading || page.title),
          description: page.meta?.description,
          offers,
          areaServed: areaServedFromNames(OFFER.areaServed),
        }),
        ...[faqPageNode(canonical, faq)].filter((n) => n !== null),
      ]}
    />
  )
}
