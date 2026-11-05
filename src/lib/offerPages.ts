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
//
// The key is the CMS slug and stays put when a page moves: the seed finds the
// page by it. Only `path` changes (and the old path goes to src/lib/legacyUrls.ts).

export type OfferPage = {
  path: string
  locales: readonly Locale[]
  /** areaServed of the offer's Service node (place names as in site-settings). */
  areaServed: readonly string[]
  /** Breadcrumb item of this page. */
  crumb: string
  /** Parent page (CMS slug): breadcrumb trail and the grouping of the host menu. */
  parent?: string
  /** Entry in the header menu of the parent page; `note` is the line below the label. */
  menu: { label: string; note?: string }
  /**
   * JSON-LD of the page: a `hub` offers nothing itself (WebPage about the agency),
   * a `service` page becomes a Service with one Offer per priced block.
   */
  schema: 'hub' | 'service'
  /** Service name in the JSON-LD. Default: the hero heading. */
  serviceName?: string
  /** audienceType of the Service node. */
  audience?: string
}

export const OFFER_PAGES = {
  gastgeber: {
    path: '/gastgeber',
    locales: ['de'],
    areaServed: ['Schleswig-Holstein'],
    crumb: 'Gastgeber',
    menu: { label: 'Alle Gastgeber-Angebote' },
    schema: 'hub',
  },
  'gastgeber-gastronomie': {
    path: '/gastgeber/gastronomie',
    locales: ['de'],
    areaServed: ['Schleswig-Holstein'],
    crumb: 'Gastronomie',
    parent: 'gastgeber',
    menu: { label: 'Gastronomie', note: 'Website, Speisekarte per QR, Reservierung und Veranstaltungen aus einer Hand' },
    schema: 'service',
    serviceName: 'Deckplan – Website und Werkzeuge für Gastronomie',
    audience: 'Restaurants und Gastronomie',
  },
  // Moved from /website-ferienwohnung on 05.11.2026 — the slug stays.
  'website-ferienwohnung': {
    path: '/gastgeber/ferienwohnung',
    locales: ['de'],
    areaServed: ['Schleswig-Holstein'],
    crumb: 'Ferienwohnung',
    parent: 'gastgeber',
    menu: { label: 'Ferienwohnung & Ferienhaus', note: 'Eigene Website statt nur Portal – Festpreis, fertig in vier Wochen' },
    schema: 'service',
  },
} as const satisfies Record<string, OfferPage>

export type OfferPageSlug = keyof typeof OFFER_PAGES

export const OFFER_PAGE_SLUGS = Object.keys(OFFER_PAGES) as OfferPageSlug[]

export const isOfferPageSlug = (slug: string | null | undefined): slug is OfferPageSlug =>
  Boolean(slug && Object.hasOwn(OFFER_PAGES, slug))

/** The entry with every optional field readable (the literal union hides them). */
export const offerPage = (slug: OfferPageSlug): OfferPage => OFFER_PAGES[slug]

export const offerPageAvailable = (slug: OfferPageSlug, locale: string): boolean =>
  (OFFER_PAGES[slug].locales as readonly string[]).includes(locale)

/** The offer page behind a locale-less pathname (e.g. "/gastgeber/gastronomie"), if any. */
export const offerPageAt = (pathname: string): OfferPage | undefined =>
  Object.values(OFFER_PAGES).find((o) => o.path === pathname)

/** Breadcrumb trail below the start page: the parents first, the page itself last. */
export function offerPageTrail(slug: OfferPageSlug): { slug: OfferPageSlug; crumb: string; path: string }[] {
  const trail: { slug: OfferPageSlug; crumb: string; path: string }[] = []
  let current: string | undefined = slug
  // A parent chain is at most a few pages long; the guard only stops a typo loop.
  while (isOfferPageSlug(current) && trail.length < 5) {
    const page = offerPage(current)
    trail.unshift({ slug: current, crumb: page.crumb, path: page.path })
    current = page.parent
  }
  return trail
}
