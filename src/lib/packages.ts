import type { Service } from '@/payload-types'
import type { Locale } from '@/lib/locale'
import { formatPackagePrice, serviceTeaserPrice } from '@/lib/price'

// The three packages that build on each other (Repositionierung, section 3):
// Auftritt → Betrieb → Sichtbarkeit. Their prices always come from the services.
export const PACKAGE_DEFS = [
  { key: 'appearance', slugs: ['websites', 'shopify-shops'] },
  { key: 'operation', slugs: ['betreuung-pflege'] },
  { key: 'visibility', slugs: ['lokale-sichtbarkeit'] },
] as const

export type PackageKey = (typeof PACKAGE_DEFS)[number]['key']

type Pkg = NonNullable<Service['packages']>[number]

const priced = (p: Pkg | undefined) => p && p.price !== null && p.price !== undefined

/** Entry service of a package: the one whose first package is cheapest. */
export function entryService(services: Service[], slugs: readonly string[]): Service | null {
  const found = slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s && priced(s.packages?.[0])))
    .sort((a, b) => (a.packages?.[0]?.price ?? 0) - (b.packages?.[0]?.price ?? 0))
  return found[0] ?? null
}

/** Teaser price of a package ("ab 1.900 €") or null when no service carries a price. */
export function packagePrice(services: Service[], slugs: readonly string[], locale: Locale): string | null {
  const s = entryService(services, slugs)
  return s ? serviceTeaserPrice(s, locale) : null
}

/**
 * "Weitere Pakete" line: the remaining card packages of the entry service plus
 * the entry prices of the other services, e.g. "Website Standard ab 4.900 € ·
 * Shop Start ab 3.900 €". Derived, so it can never drift from the prices.
 */
export function packageMore(services: Service[], slugs: readonly string[], locale: Locale): string | null {
  const entry = entryService(services, slugs)
  if (!entry) return null
  const rest = (entry.packages ?? []).slice(1).filter((p) => p.display !== 'box' && priced(p))
  const others = slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s && s.id !== entry.id && priced(s.packages?.[0])))
    .map((s) => s.packages![0])
  const parts = [...rest, ...others].map((p) => `${p.name} ${formatPackagePrice(p, locale)}`)
  return parts.length > 0 ? parts.join(' · ') : null
}
