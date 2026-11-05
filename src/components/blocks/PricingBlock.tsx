import { getTranslations } from 'next-intl/server'

import { ButtonLink, H2, Kicker, PriceNote, Section } from '@/components/site/primitives'
import { PackageCard, PriceLine, TermNote, type PriceLabels } from '@/components/service/PackageCard'

import type { BlockContext, BlockOf } from './types'

/**
 * Prices of an offer page (design: "Pakete & Preise" of the service pages):
 * package cards side by side, then single rows (set-up fee, check), a note and
 * the buttons. Prices come from the number fields and carry the net-price note —
 * the same rows feed the Offers in the page's JSON-LD (src/lib/offerPage.tsx).
 */
export async function PricingBlock({ block, ctx }: { block: BlockOf<'pricing'>; ctx: BlockContext }) {
  const offers = (block.offers ?? []).filter((o) => o.name && o.price != null)
  if (offers.length === 0) return null
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  const labels: PriceLabels = {
    from: t('from'),
    once: t('once'),
    perMonth: t('perMonth'),
    perHour: t('perHour'),
    onRequest: t('onRequest'),
    priceNote: t('priceNote'),
  }
  const cards = offers.filter((o) => o.display !== 'row')
  const rows = offers.filter((o) => o.display === 'row')
  const buttons = [block.primary, block.secondary].flatMap((b) => (b?.href && b.label ? [{ href: b.href, label: b.label }] : []))

  return (
    <Section tone="offwhite">
      <Kicker tone="offwhite">{block.kicker}</Kicker>
      <H2>{block.heading}</H2>
      {block.intro && <p className="mt-4 max-w-[40em] text-lg">{block.intro}</p>}

      {cards.length > 0 && (
        <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
          {cards.map((o, i) => (
            <PackageCard
              key={o.id ?? i}
              title={o.name as string}
              pkg={{ price: o.price, priceIsFrom: o.priceIsFrom, unit: o.unit, term: o.note }}
              description={o.text}
              items={(o.items ?? []).flatMap((it) => (it.item ? [it.item] : []))}
              locale={ctx.locale}
              labels={labels}
            />
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <ul className="mt-5 grid gap-5">
          {rows.map((o, i) => (
            <li
              key={o.id ?? i}
              className="grid gap-x-12 gap-y-4 rounded-[4px] border border-line bg-white p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
            >
              <div>
                <h3 className="text-[22px] font-extrabold">{o.name}</h3>
                <PriceLine pkg={o} locale={ctx.locale} labels={labels} />
                <PriceNote text={labels.priceNote} className="mt-2" />
                <TermNote term={o.note} />
              </div>
              {o.text && <p className="text-[17px] md:pt-1">{o.text}</p>}
            </li>
          ))}
        </ul>
      )}

      {block.footnote && <p className="mt-7 max-w-[52em] text-base text-muted">{block.footnote}</p>}

      {buttons.length > 0 && (
        <div className="mt-9 flex flex-wrap gap-3">
          {buttons.map((b, i) => (
            <ButtonLink key={b.href + b.label} href={b.href} variant={i === 0 ? 'primary' : 'secondary'}>
              {b.label}
            </ButtonLink>
          ))}
        </div>
      )}
    </Section>
  )
}
