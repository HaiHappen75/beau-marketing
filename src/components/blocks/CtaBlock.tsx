import { getTranslations } from 'next-intl/server'

import { ButtonLink, Wrap } from '@/components/site/primitives'
import { withEmphasis } from '@/lib/emphasis'
import { telHref } from '@/lib/phone'

import type { BlockContext, BlockOf } from './types'

/** Closing call to action (dark). Phone and e-mail from the settings — no values, no lines. */
export async function CtaBlock({ block, ctx }: { block: BlockOf<'cta'>; ctx: BlockContext }) {
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  const c = ctx.settings.company ?? {}
  const phoneHref = telHref(c.phone)
  return (
    <section className="bg-ink py-[clamp(64px,9vw,120px)] text-[#D6D6D6]">
      <Wrap className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-10">
        <div>
          <h2 className="text-[clamp(34px,4.4vw,56px)] leading-[1.05] font-extrabold tracking-[-0.025em] text-white">
            {withEmphasis(block.heading)}
          </h2>
          {block.text && <p className="mt-5 max-w-[32em] text-[19px]">{block.text}</p>}
          {block.button?.href && block.button.label && (
            <ButtonLink href={block.button.href} onDark className="mt-8">
              {block.button.label}
            </ButtonLink>
          )}
        </div>
        <div className="grid gap-[18px]">
          {phoneHref && c.phone && (
            <div>
              <p className="text-[15px] text-[#BDBDBD]">{t('phone')}</p>
              <a href={phoneHref} className="text-[clamp(28px,3vw,40px)] font-extrabold text-white">
                {c.phone}
              </a>
            </div>
          )}
          {c.email && (
            <div>
              <p className="text-[15px] text-[#BDBDBD]">{t('email')}</p>
              <a href={`mailto:${c.email}`} className="text-[clamp(22px,2.2vw,28px)] font-bold break-words text-white">
                {c.email}
              </a>
            </div>
          )}
        </div>
      </Wrap>
    </section>
  )
}
