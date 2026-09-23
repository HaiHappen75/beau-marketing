import type { Service } from '@/payload-types'
import type { Locale } from '@/lib/locale'

type Package = NonNullable<Service['packages']>[number]

const WORDS: Record<Locale, { from: string; onRequest: string; month: string; hour: string }> = {
  de: { from: 'ab', onRequest: 'auf Anfrage', month: '/ Monat', hour: '/ Stunde' },
  da: { from: 'fra', onRequest: 'efter aftale', month: '/ måned', hour: '/ time' },
  en: { from: 'from', onRequest: 'on request', month: '/ month', hour: '/ hour' },
}

const euro = (value: number, locale: Locale) =>
  `${new Intl.NumberFormat(locale === 'en' ? 'en-GB' : `${locale}-DE`, { maximumFractionDigits: 0 }).format(value)} €`

/** "ab 1.900 €", "49 € / Monat", "auf Anfrage". Net prices — the note is rendered separately. */
export function formatPackagePrice(pkg: Pick<Package, 'price' | 'priceIsFrom' | 'unit'>, locale: Locale): string {
  const w = WORDS[locale]
  if (pkg.price === null || pkg.price === undefined) return w.onRequest
  const unit = pkg.unit === 'month' ? ` ${w.month}` : pkg.unit === 'hour' ? ` ${w.hour}` : ''
  return `${pkg.priceIsFrom ? `${w.from} ` : ''}${euro(pkg.price, locale)}${unit}`
}

/**
 * Teaser price of a service = its first package, always as "ab" (it is the entry
 * price of the service). No packages or no price → "auf Anfrage".
 */
export function serviceTeaserPrice(service: Pick<Service, 'packages'>, locale: Locale): string {
  const first = service.packages?.[0]
  if (!first || first.price === null || first.price === undefined) return WORDS[locale].onRequest
  return formatPackagePrice({ ...first, priceIsFrom: true }, locale)
}
