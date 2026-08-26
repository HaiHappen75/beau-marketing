import type { Locale } from '@/lib/locale'
import { SITE_URL } from '@/lib/seo'
import type { Brand } from '@/payload-types'

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
//   - `logo`            → there is no clean asset for the GmbH. public/brand/logo.png
//                         is 0 bytes; the logo project is parked.
//   - `sameAs`          → the footer carries no social profile link
//   - `vatID`           → the VAT ID has not been issued
//   - `Brand.logo`      → the brand assets are Payload uploads without a stable URL
//   - `potentialAction` → the site has no search, so there is no `target`

export type JsonLdNode = Record<string, unknown>
type Ref = { '@id': string }

const ref = (id: string): Ref => ({ '@id': id })

export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const brandId = (slug: string) => `${SITE_URL}/#brand-${slug}`
export const webPageId = (canonical: string) => `${canonical}#webpage`

/**
 * BCP-47 tag per language. Fed by the language actually RENDERED, not by the URL
 * prefix: eRecht24 has no Danish, so /da/impressum serves the English text.
 */
const BCP47: Record<Locale, string> = { de: 'de-DE', en: 'en', da: 'da' }

// Address and telephone come from the imprint. That is fetched from eRecht24 at
// runtime and therefore not machine-readable here — the values sit as constants.
// If the imprint changes, this place has to be pulled along.
// Quelle: Impressum, Stand 26.08.2026
const ORGANIZATION_NAME = 'Beau Marketing GmbH' // the company, not the site brand "Beau-Marketing"
const ORGANIZATION_EMAIL = 's.beau@beau-marketing.de'
const ORGANIZATION_PHONE = '+49 4633 2029925'
const ORGANIZATION_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Buschlück 7',
  postalCode: '24986',
  addressLocality: 'Mittelangeln',
  addressCountry: 'DE',
} as const

/** Brands that can be anchored — a Payload brand without a slug has no stable @id. */
const anchorable = (brands: Brand[]) =>
  brands.filter((b): b is Brand & { slug: string } => Boolean(b.slug))

/**
 * The GmbH. Same NAP values as the gettappi.de graph — that identity is the whole
 * point: both sites have to resolve to one and the same entity.
 */
export function organizationNode(brands: Brand[]): JsonLdNode {
  const named = anchorable(brands)
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: ORGANIZATION_NAME,
    url: `${SITE_URL}/`,
    email: ORGANIZATION_EMAIL,
    telephone: ORGANIZATION_PHONE,
    address: ORGANIZATION_ADDRESS,
    // `brand` is only valid on Organization / Person / Product / Service.
    // Omitted entirely while there is no brand to point at, rather than an empty array.
    ...(named.length ? { brand: named.map((b) => ref(brandId(b.slug))) } : {}),
  }
}

/**
 * One node per brand, kept deliberately thin: name only.
 * No `url` — the detail page is locale-prefixed, and hardcoding /de/ into the graph
 * of every language would be wrong. `name` is not localized in Payload, so these
 * nodes are identical across all three locales and the @id stays free of contradictions.
 */
export function brandNodes(brands: Brand[]): JsonLdNode[] {
  return anchorable(brands).map((b) => ({
    '@type': 'Brand',
    '@id': brandId(b.slug),
    name: b.name,
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
    name: 'Beau-Marketing',
    url: `${SITE_URL}/`,
    publisher: ref(ORGANIZATION_ID),
  }
}

/** The sitewide block, emitted by the frontend layout on every public page. */
export function siteGraph(brands: Brand[]): JsonLdNode[] {
  return [organizationNode(brands), ...brandNodes(brands), webSiteNode()]
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
