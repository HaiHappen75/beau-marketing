import { H2, Kicker, Section } from '@/components/site/primitives'
import { Link } from '@/i18n/navigation'
import { serviceTeaserPrice } from '@/lib/price'

import type { BlockContext, BlockOf } from './types'

/** "Sechs Leistungen": one tile per published service, numbered by order. */
export function ServiceTilesBlock({ block, ctx }: { block: BlockOf<'serviceTiles'>; ctx: BlockContext }) {
  if (ctx.services.length === 0) return null
  return (
    <Section tone="offwhite">
      <Kicker tone="offwhite">{block.kicker}</Kicker>
      <H2 className="max-w-[18em]">{block.heading}</H2>
      {block.intro && <p className="mt-4 max-w-[38em] text-lg">{block.intro}</p>}
      <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
        {ctx.services.map((s, i) => (
          <li key={s.id}>
            <Link
              href={`/agentur/${s.slug}`}
              className="flex h-full flex-col rounded-[4px] border border-line bg-white p-7 no-underline hover:border-ink"
            >
              <span className="text-sm font-extrabold text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="mt-2.5 text-2xl font-extrabold text-ink hyphens-auto">{s.title}</span>
              <span className="mt-2 flex-1 text-[17px] leading-[1.55] text-text">{s.teaser ?? s.shortDescription}</span>
              <span className="mt-6 flex items-center justify-between text-base font-extrabold text-ink">
                {serviceTeaserPrice(s, ctx.locale)}
                <span aria-hidden="true" className="text-[22px]">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
