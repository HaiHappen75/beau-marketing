import type { Metadata } from 'next'

import { OfferPageRoute, offerPageMetadata } from '@/lib/offerPage'

// Offer page "Website für Ferienwohnung und Ferienhaus" — the CMS page with the
// slug below, German only (src/lib/offerPages.ts). Moved here from
// /website-ferienwohnung on 05.11.2026; the old path answers 301 (src/lib/legacyUrls.ts).

const SLUG = 'website-ferienwohnung'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return offerPageMetadata(SLUG, locale)
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  return <OfferPageRoute slug={SLUG} locale={locale} />
}
