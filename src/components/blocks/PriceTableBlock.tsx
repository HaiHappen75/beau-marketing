import { getTranslations } from 'next-intl/server'

import { H2, Kicker, Section } from '@/components/site/primitives'
import { formatPackagePrice } from '@/lib/price'

import type { BlockContext, BlockOf } from './types'

/** All prices of all services in one table (style tile "Preistabelle"). */
export async function PriceTableBlock({ block, ctx }: { block: BlockOf<'priceTable'>; ctx: BlockContext }) {
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  if (ctx.services.length === 0) return null
  const rate = ctx.settings.company?.hourlyRate
  return (
    <Section id="preisliste" divider>
      <Kicker>{block.kicker}</Kicker>
      <H2>{block.heading}</H2>
      {block.intro && <p className="mt-4 max-w-[38em]">{block.intro}</p>}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-[17px]">
          <caption className="caption-bottom pt-4 text-left text-sm text-muted">{t('pricesNet')}</caption>
          <thead>
            <tr className="border-b-2 border-ink text-sm tracking-[0.06em] uppercase">
              <th scope="col" className="py-3 pr-4 font-extrabold">{t('table.service')}</th>
              <th scope="col" className="py-3 pr-4 font-extrabold">{t('table.package')}</th>
              <th scope="col" className="py-3 text-right font-extrabold">{t('table.price')}</th>
            </tr>
          </thead>
          <tbody>
            {ctx.services.map((s) => {
              const pkgs = s.packages ?? []
              if (pkgs.length === 0) {
                return (
                  <tr key={s.id} className="border-b border-line">
                    <th scope="row" className="py-3 pr-4 font-extrabold text-ink">{s.title}</th>
                    <td className="py-3 pr-4">–</td>
                    <td className="py-3 text-right font-bold">{formatPackagePrice({ price: null, priceIsFrom: false, unit: 'once' }, ctx.locale)}</td>
                  </tr>
                )
              }
              return pkgs.map((p, i) => (
                <tr key={`${s.id}-${p.id ?? i}`} className="border-b border-line">
                  {i === 0 ? (
                    <th scope="row" rowSpan={pkgs.length} className="py-3 pr-4 align-top font-extrabold text-ink">
                      {s.title}
                    </th>
                  ) : null}
                  <td className="py-3 pr-4">{p.name}</td>
                  <td className="py-3 text-right font-bold whitespace-nowrap">{formatPackagePrice(p, ctx.locale)}</td>
                </tr>
              ))
            })}
            {rate != null && (
              <tr className="border-b border-line">
                <th scope="row" className="py-3 pr-4 font-extrabold text-ink">{t('table.hourly')}</th>
                <td className="py-3 pr-4">{t('table.byEffort')}</td>
                <td className="py-3 text-right font-bold">{t('table.perHour', { rate })}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
