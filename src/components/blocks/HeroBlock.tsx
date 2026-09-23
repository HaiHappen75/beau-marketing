import { getTranslations } from 'next-intl/server'

import { Check } from '@/components/brand/Check'
import { ButtonLink, Wrap } from '@/components/site/primitives'
import { MediaImage } from '@/components/site/MediaImage'
import { withEmphasis } from '@/lib/emphasis'
import { serviceTeaserPrice } from '@/lib/price'
import { idOf } from '@/lib/queries/content'

import type { BlockContext, BlockOf } from './types'

/**
 * Start page hero, variant A (portrait dominant). No portrait → outline square.
 * A hero with neither image nor caption (e.g. the agency overview) has no figure.
 */
export async function HeroBlock({ block, ctx }: { block: BlockOf<'hero'>; ctx: BlockContext }) {
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })

  // Price checks always derive from the service — never a price typed as text.
  const checks = (block.checks ?? [])
    .map((c) => {
      if (c.kind === 'text') return c.text ?? null
      const service = ctx.services.find((s) => s.id === idOf(c.service))
      if (!service) return null
      return `${service.shortLabel ?? service.title} ${serviceTeaserPrice(service, ctx.locale)}`
    })
    .filter((c): c is string => Boolean(c))

  return (
    <section className="bg-white pt-[clamp(40px,7vw,96px)] pb-[clamp(56px,8vw,112px)]">
      <Wrap className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(40px,5vw,72px)]">
        <div>
          {block.kicker && <p className="mb-5 text-[15px] font-bold text-muted">{block.kicker}</p>}
          <h1 className="text-[clamp(38px,5.2vw,64px)] leading-[1.04] font-extrabold tracking-[-0.025em] text-balance">
            {withEmphasis(block.heading)}
          </h1>
          {block.text?.split(/\n\s*\n/).map((para, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? 'mt-6 max-w-[34em] text-[clamp(18px,1.5vw,21px)] leading-[1.55]'
                  : 'mt-4 max-w-[34em] text-lg'
              }
            >
              {para}
            </p>
          ))}
          {(block.primary?.href || block.secondary?.href) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {block.primary?.href && block.primary.label && (
                <ButtonLink href={block.primary.href}>{block.primary.label}</ButtonLink>
              )}
              {block.secondary?.href && block.secondary.label && (
                <ButtonLink href={block.secondary.href} variant="secondary">
                  {block.secondary.label}
                </ButtonLink>
              )}
            </div>
          )}
          {checks.length > 0 && (
            <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-2.5 text-base font-bold text-ink">
              {checks.map((c, i) => (
                <li key={c} className="flex items-center gap-2.5">
                  <Check size={20} index={i} />
                  {c}
                </li>
              ))}
            </ul>
          )}
          {checks.length > 0 && <p className="mt-3 text-sm text-muted">{block.note || t('pricesNet')}</p>}
        </div>
        {(block.image || block.captionName || block.captionText) && (
        <figure className="w-full max-w-[520px] justify-self-end">
          <MediaImage
            media={block.image}
            ratio="4/5"
            sizes="(min-width: 1024px) 520px, 100vw"
            priority
          />
          {(block.captionName || block.captionText) && (
            <figcaption className="mt-3.5 flex flex-wrap items-baseline gap-3 text-base">
              {block.captionName && <strong className="text-ink">{block.captionName}</strong>}
              {block.captionText && <span className="text-muted">{block.captionText}</span>}
            </figcaption>
          )}
        </figure>
        )}
      </Wrap>
    </section>
  )
}
