import { getTranslations } from 'next-intl/server'

import { Check } from '@/components/brand/Check'
import { H2, Kicker, PriceNote, Section } from '@/components/site/primitives'
import { Link } from '@/i18n/navigation'
import { PACKAGE_DEFS, entryService, packageMore } from '@/lib/packages'

import type { BlockContext, BlockOf } from './types'

/**
 * "Drei Pakete" (#preise). Card copy is structural microcopy (messages); every
 * price and the "weitere Pakete" line derive from the services.
 */
export async function PackagesBlock({ block, ctx }: { block: BlockOf<'packages'>; ctx: BlockContext }) {
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  const rate = ctx.settings.company?.hourlyRate

  const cards = PACKAGE_DEFS.map((def, i) => {
    const entry = entryService(ctx.services, def.slugs)
    const first = entry?.packages?.[0]
    if (!entry || !first || first.price == null) return null
    return {
      key: def.key,
      n: i + 1,
      service: entry,
      price: new Intl.NumberFormat(ctx.locale === 'en' ? 'en-GB' : `${ctx.locale}-DE`).format(first.price),
      unit: first.unit === 'month' ? t('perMonth') : t('once'),
      more: packageMore(ctx.services, def.slugs, ctx.locale),
      items: t.raw(`packages.${def.key}.items`) as string[],
    }
  }).filter((c): c is NonNullable<typeof c> => c !== null)

  if (cards.length === 0) return null

  return (
    <Section id="preise" divider>
      <Kicker>{block.kicker}</Kicker>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <H2 className="max-w-[18em]">{block.heading}</H2>
        {rate != null && <p className="max-w-[30ch] text-[15px] text-muted">{t('hourlyShort', { rate })}</p>}
      </div>
      <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
        {cards.map((c) => (
          <article key={c.key} className="flex flex-col rounded-[4px] border border-line bg-white p-8">
            <p className="text-sm font-bold text-muted">{t('package', { n: c.n })}</p>
            <h3 className="text-[30px] font-black tracking-[-0.01em] italic">{t(`packages.${c.key}.title`)}</h3>
            <p className="text-base text-muted">{t(`packages.${c.key}.sub`)}</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-[17px] font-bold">{t('from')}</span>
              <span className="text-[42px] leading-none font-black text-ink">{c.price} €</span>
              <span className="text-base font-bold">{c.unit}</span>
            </p>
            <PriceNote text={t('priceNote')} className="mt-2" />
            <ul className="mt-6 grid gap-3 border-t border-line pt-6 text-[17px]">
              {c.items.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={22} index={i} className="mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex-1 text-[15px] text-muted">
              {c.key === 'visibility' ? t('packages.visibility.note') : c.more}
            </p>
            <p className="mt-5 text-[17px] font-bold">
              <Link href={`/agentur/${c.service.slug}`}>{t('moreAbout', { title: t(`packages.${c.key}.title`) })}</Link>
            </p>
          </article>
        ))}
      </div>
    </Section>
  )
}
