import { getTranslations } from 'next-intl/server'

import { H2, Kicker, Section } from '@/components/site/primitives'
import { getBrands } from '@/lib/queries/getBrands'

import type { BlockContext, BlockOf } from './types'

/** Brand house band (dark). Hidden brands never appear; links only for live brands. */
export async function BrandsBlock({ block, ctx }: { block: BlockOf<'brandShowcase'>; ctx: BlockContext }) {
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  const brands = (await getBrands(ctx.locale)).filter((b) => b.status && b.status !== 'hidden')
  if (brands.length === 0) return null
  return (
    <Section tone="dark" id="marken">
      <Kicker tone="dark">{block.kicker}</Kicker>
      <H2 light className="max-w-[16em] text-[clamp(30px,3.6vw,48px)]">
        {block.heading}
      </H2>
      {block.intro && <p className="mt-[18px] max-w-[38em] text-[19px] text-[#D6D6D6]">{block.intro}</p>}
      <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-4">
        {brands.map((b) => {
          const live = b.status === 'live'
          const link = live ? b.links?.find((l) => l.url)?.url : null
          return (
            <li key={b.id} className="flex flex-col gap-3.5 rounded-[4px] border border-[#3A3A3A] p-6">
              <p className="flex h-14 items-center border-b border-text text-[26px] font-black text-white italic">{b.name}</p>
              <p className="flex items-center gap-2 text-[13px] font-extrabold tracking-[0.06em] uppercase">
                <span
                  aria-hidden="true"
                  className={`inline-block h-2.5 w-2.5 ${live ? 'bg-accent' : 'border-[1.5px] border-[#D6D6D6]'}`}
                />
                <span className={live ? 'text-white' : 'text-[#D6D6D6]'}>{t(`brandStatus.${b.status}`)}</span>
              </p>
              {b.tagline && <p className="flex-1 text-base text-[#D6D6D6]">{b.tagline}</p>}
              {link && (
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-base font-bold text-white">
                  {t('brandVisit', { name: b.name })} <span aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
