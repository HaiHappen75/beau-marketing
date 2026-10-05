import type { Locale } from '@/lib/locale'

// Offer pages: CMS pages (collection "pages") with their own route, made for one
// target group — not a service of the "services" collection, so they stay out of
// mega menu, service tiles, price table and the contact dropdown.
//
// `locales` is a business decision, not a translation state: the page exists in
// these languages only. Elsewhere the route answers 404 (never the German page
// under a foreign prefix), the sitemap and footer leave it out and the language
// switcher points to the start page of the other language.
// Pure data — imported by the client-side language switcher as well.

export type OfferPage = {
  path: string
  locales: readonly Locale[]
  /** areaServed of the offer's Service node (place names as in site-settings). */
  areaServed: readonly string[]
}

export const OFFER_PAGES = {
  'website-ferienwohnung': { path: '/website-ferienwohnung', locales: ['de'], areaServed: ['Schleswig-Holstein'] },
} as const satisfies Record<string, OfferPage>

export type OfferPageSlug = keyof typeof OFFER_PAGES

export const isOfferPageSlug = (slug: string | null | undefined): slug is OfferPageSlug =>
  Boolean(slug && Object.hasOwn(OFFER_PAGES, slug))

export const offerPageAvailable = (slug: OfferPageSlug, locale: string): boolean =>
  (OFFER_PAGES[slug].locales as readonly string[]).includes(locale)

/** The offer page behind a locale-less pathname (e.g. "/website-ferienwohnung"), if any. */
export const offerPageAt = (pathname: string): OfferPage | undefined =>
  Object.values(OFFER_PAGES).find((o) => o.path === pathname)
