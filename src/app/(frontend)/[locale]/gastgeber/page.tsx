import type { Metadata } from 'next'

import { OfferPageRoute, offerPageMetadata } from '@/lib/offerPage'

// Hub "Gastgeber im Norden" — entry page of the host area and target of the QR
// codes on flyers and table stands. The CMS page with the slug below, German
// only (src/lib/offerPages.ts); a hub carries no Offer in its JSON-LD.

const SLUG = 'gastgeber'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return offerPageMetadata(SLUG, locale)
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  return <OfferPageRoute slug={SLUG} locale={locale} />
}
