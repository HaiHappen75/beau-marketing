import { Check } from '@/components/brand/Check'
import { ButtonLink, PriceNote } from '@/components/site/primitives'
import type { Locale } from '@/lib/locale'
import type { Service } from '@/payload-types'

export type Pkg = NonNullable<Service['packages']>[number]

const num = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === 'en' ? 'en-GB' : `${locale}-DE`, { maximumFractionDigits: 0 }).format(value)

export type PriceLabels = {
  from: string
  once: string
  perMonth: string
  perHour: string
  onRequest: string
  priceNote: string
}

/** Price line of the design: small "ab", big amount, unit. */
export function PriceLine({ pkg, locale, labels }: { pkg: Pkg; locale: Locale; labels: PriceLabels }) {
  if (pkg.price == null) return <p className="mt-5 text-[26px] font-black text-ink">{labels.onRequest}</p>
  const unit = pkg.unit === 'month' ? labels.perMonth : pkg.unit === 'hour' ? labels.perHour : labels.once
  return (
    <p className="mt-5 flex flex-wrap items-baseline gap-2">
      {pkg.priceIsFrom && <span className="text-[17px] font-bold">{labels.from}</span>}
      <span className="text-[40px] leading-none font-black tracking-[-0.02em] text-ink">{num(pkg.price, locale)} €</span>
      <span className="text-base font-bold">{unit}</span>
    </p>
  )
}

export function PackageCard({
  kicker,
  title,
  pkg,
  description,
  items,
  highlighted = false,
  cta,
  locale,
  labels,
}: {
  kicker?: string | null
  title: string
  pkg: Pkg
  description?: string | null
  items: string[]
  highlighted?: boolean
  cta: { href: string; label: string }
  locale: Locale
  labels: PriceLabels
}) {
  return (
    <article className={`flex flex-col rounded-[4px] border bg-white p-8 ${highlighted ? 'border-ink' : 'border-line'}`}>
      {kicker && <p className="text-sm font-bold text-muted">{kicker}</p>}
      <h3 className="mt-1 text-[26px] font-black italic">{title}</h3>
      <PriceLine pkg={pkg} locale={locale} labels={labels} />
      {pkg.price != null && <PriceNote text={labels.priceNote} className="mt-2" />}
      {description && <p className="mt-[18px] text-[17px]">{description}</p>}
      {items.length > 0 && (
        <ul className="mt-5 grid flex-1 content-start gap-3 border-t border-line pt-5 text-[17px]">
          {items.map((item, i) => (
            <li key={item} className="flex items-start gap-3">
              <Check size={22} index={i} className="mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      )}
      <ButtonLink href={cta.href} variant="secondary" className="mt-7 text-base">
        {cta.label}
      </ButtonLink>
    </article>
  )
}
