import type { Locale } from '@/lib/locale'
import { SITE_URL } from '@/lib/seo'
import type { Brand, Service, SiteSetting } from '@/payload-types'

// Building blocks for the JSON-LD of the public pages.
//
// House pattern: the sitewide nodes (Organization, Brand, WebSite) are defined in
// full exactly once — in the frontend layout — and every page-level node only
// references them via {'@id': …}. Search engines merge all ld+json blocks of one
// page into a single graph, so a reference resolves as long as its definition sits
// on the SAME page. The layout wraps every public route, so it always does.
// Everything comes out of this one module: an identical @id carrying differing
// properties on different pages would be contradictory once merged.
//
// Guard rail throughout: no markup without coverage in the visible content.
// Deliberately NOT included, and why:
//   - `sameAs`          → the footer carries no social profile link
//   - `vatID`           → the VAT ID has not been issued
//   - `Brand.logo`      → the brand assets are Payload uploads without a stable URL
//   - `potentialAction` → the site has no search, so there is no `target`

export type JsonLdNode = Record<string, unknown>
type Ref = { '@id': string }

const ref = (id: string): Ref => ({ '@id': id })

export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
/** Brand anchor on the brand house page (the old /marken/<slug> pages 308 there). */
export const brandId = (slug: string) => `${SITE_URL}/de/marken#${slug}`
export const webPageId = (canonical: string) => `${canonical}#webpage`

/**
 * BCP-47 tag per language. Fed by the language actually RENDERED, not by the URL
 * prefix: eRecht24 has no Danish, so /da/impressum serves the English text.
 */
const BCP47: Record<Locale, string> = { de: 'de-DE', en: 'en', da: 'da' }

// NAP data comes from site-settings (tab "Firma") — the one source the footer,
// contact page and landing pages use as well. The imprint itself comes from
// eRecht24; the admin hint on those fields asks to change both together.

/** schema.org place type for an area name (countries vs. German states/cities). */
const COUNTRIES = new Set(['Dänemark', 'Deutschland', 'Danmark', 'Denmark'])
export const areaServedOf = (settings: SiteSetting | null | undefined) =>
  (settings?.company?.areaServed ?? [])
    .map((a) => a.name)
    .filter(Boolean)
    .map((name) => ({ '@type': COUNTRIES.has(name) ? 'Country' : 'AdministrativeArea', name }))

/** Brands that can be anchored — a Payload brand without a slug has no stable @id. */
const anchorable = (brands: Brand[]) =>
  brands.filter((b): b is Brand & { slug: string } => Boolean(b.slug))

/**
 * The GmbH. Same NAP values as the gettappi.de graph — that identity is the whole
 * point: both sites have to resolve to one and the same entity.
 */
export function organizationNode(brands: Brand[], settings?: SiteSetting | null): JsonLdNode {
  const named = anchorable(brands)
  const c = settings?.company ?? {}
  const address =
    c.street && c.postalCode && c.city
      ? {
          '@type': 'PostalAddress',
          streetAddress: c.street,
          postalCode: c.postalCode,
          addressLocality: c.city,
          addressCountry: 'DE',
        }
      : null
  const phone = c.phone ? c.phone.replace(/\s+/g, ' ').replace(/^0/, '+49 ') : null
  const areaServed = areaServedOf(settings)
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: c.legalName || 'Beau Marketing GmbH',
    url: `${SITE_URL}/`,
    // The company logo shown in the header (public/brand, 1200 × 358).
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand/beau-marketing-logo.png`, width: 1200, height: 358 },
    ...(c.email ? { email: c.email } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(address ? { address } : {}),
    ...(areaServed.length ? { areaServed } : {}),
    // `brand` is only valid on Organization / Person / Product / Service.
    // Omitted entirely while there is no brand to point at, rather than an empty array.
    ...(named.length ? { brand: named.map((b) => ref(brandId(b.slug))) } : {}),
  }
}

/**
 * One node per brand. `@id` is the brand's anchor on /de/marken (x-default);
 * `url` is the brand's own website when it has one, otherwise that anchor.
 * `name` is not localized, so the nodes are identical in every locale.
 */
export function brandNodes(brands: Brand[]): JsonLdNode[] {
  return anchorable(brands).map((b) => ({
    '@type': 'Brand',
    '@id': brandId(b.slug),
    name: b.name,
    url: b.links?.find((l) => l.type === 'website' && l.url)?.url ?? brandId(b.slug),
  }))
}

/**
 * No `inLanguage`: a single sitewide node cannot honestly claim one of three
 * languages, and a value differing per locale under an identical @id is exactly the
 * contradiction the @id pattern exists to avoid. The per-page WebPage carries it.
 */
export function webSiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Beau Marketing',
    url: `${SITE_URL}/`,
    publisher: ref(ORGANIZATION_ID),
  }
}

/** The sitewide block, emitted by the frontend layout on every public page. */
export function siteGraph(brands: Brand[], settings?: SiteSetting | null): JsonLdNode[] {
  return [organizationNode(brands, settings), ...brandNodes(brands), webSiteNode()]
}

/**
 * The page-level node. `isPartOf`, `publisher` and `inLanguage` are all defined on
 * CreativeWork descendants, so they are correct on WebPage.
 */
export function webPageNode(input: {
  /** Absolute canonical of this page — the same value <link rel="canonical"> carries. */
  canonical: string
  name: string
  description?: string
  /** Language actually rendered here, not necessarily the URL locale. */
  lang: Locale
}): JsonLdNode {
  const { canonical, name, description, lang } = input
  return {
    '@type': 'WebPage',
    '@id': webPageId(canonical),
    url: canonical,
    name,
    ...(description ? { description } : {}),
    isPartOf: ref(WEBSITE_ID),
    inLanguage: BCP47[lang],
  }
}

// ── Guide articles ───────────────────────────────────────────────────────────

export const personId = (slug: string) => `${SITE_URL}/#person-${slug}`

/** Author of guide articles (E-E-A-T). Only fields the visible author box backs. */
export function personNode(p: { slug: string; name: string; jobTitle?: string | null; url?: string | null; sameAs?: string[] }): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': personId(p.slug),
    name: p.name,
    ...(p.jobTitle ? { jobTitle: p.jobTitle } : {}),
    ...(p.url ? { url: p.url } : {}),
    ...(p.sameAs && p.sameAs.length > 0 ? { sameAs: p.sameAs } : {}),
    worksFor: ref(ORGANIZATION_ID),
  }
}

export function blogPostingNode(a: {
  canonical: string
  headline: string
  description?: string | null
  image?: string | null
  datePublished: string
  dateModified: string
  authorSlug: string
  lang: Locale
}): JsonLdNode {
  return {
    '@type': 'BlogPosting',
    '@id': `${a.canonical}#article`,
    headline: a.headline,
    ...(a.description ? { description: a.description } : {}),
    ...(a.image ? { image: a.image } : {}),
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: ref(personId(a.authorSlug)),
    publisher: ref(ORGANIZATION_ID),
    mainEntityOfPage: ref(webPageId(a.canonical)),
    isPartOf: ref(WEBSITE_ID),
    inLanguage: BCP47[a.lang],
  }
}

/** Breadcrumb trail; the last item is the page itself. */
export function breadcrumbNode(canonical: string, items: { name: string; url: string }[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  }
}

/** FAQPage — only for a filled FAQ that is visible on the page. */
export function faqPageNode(canonical: string, items: { question: string; answer: string }[]): JsonLdNode | null {
  if (items.length === 0) return null
  return {
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

// ── Services with offers ─────────────────────────────────────────────────────

const UNIT_CODE = { month: 'MON', hour: 'HUR' } as const

/**
 * A service page's offer: one Offer per priced package. Net prices
 * (valueAddedTaxIncluded: false, B2B); "ab" prices as minPrice; monthly and
 * hourly prices as UnitPriceSpecification. "Auf Anfrage" = no Offer.
 */
export function serviceNode(s: Service, canonical: string, settings?: SiteSetting | null): JsonLdNode {
  const offers = (s.packages ?? [])
    .filter((p) => p.price !== null && p.price !== undefined)
    .map((p) => {
      const unit = p.unit === 'month' || p.unit === 'hour' ? UNIT_CODE[p.unit] : null
      return {
        '@type': 'Offer',
        name: p.name,
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': unit ? 'UnitPriceSpecification' : 'PriceSpecification',
          ...(p.priceIsFrom ? { minPrice: p.price } : { price: p.price }),
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
          ...(unit ? { unitCode: unit } : {}),
        },
      }
    })
  const areaServed = areaServedOf(settings)
  return {
    '@type': 'Service',
    '@id': `${canonical}#service`,
    name: s.title,
    ...(s.promise || s.shortDescription ? { description: s.promise || s.shortDescription } : {}),
    serviceType: s.title,
    provider: ref(ORGANIZATION_ID),
    url: canonical,
    ...(areaServed.length ? { areaServed } : {}),
    ...(offers.length ? { offers } : {}),
  }
}
