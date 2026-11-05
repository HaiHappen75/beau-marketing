import type { Metadata } from 'next'

import { OfferPageRoute, offerPageMetadata } from '@/lib/offerPage'

// Landing page "Website, Speisekarte und Reservierung für dein Restaurant"
// (Deckplan) — the CMS page with the slug below, German only (src/lib/offerPages.ts).

const SLUG = 'gastgeber-gastronomie'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return offerPageMetadata(SLUG, locale)
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  return <OfferPageRoute slug={SLUG} locale={locale} />
}
