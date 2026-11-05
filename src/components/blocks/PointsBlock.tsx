import { getTranslations } from 'next-intl/server'

import { Icon } from '@/components/brand/Icon'
import { ButtonLink, H2, Kicker, Section } from '@/components/site/primitives'
import { Steps } from '@/components/site/Steps'

import type { BlockContext, BlockOf } from './types'

/**
 * Points of a page. Two looks:
 *  - icons: cards with an icon, a bold line and a short text (three in a row,
 *           four when the count divides by four)
 *  - steps: numbered steps side by side — the "Ablauf" of the service pages
 */
export async function PointsBlock({ block, ctx }: { block: BlockOf<'points'>; ctx: BlockContext }) {
  const items = (block.items ?? []).filter((it) => it.title || it.text)
  if (items.length === 0) return null
  const tone = block.tone === 'offwhite' ? 'offwhite' : 'white'
  const link = block.link?.href && block.link.label ? { href: block.link.href, label: block.link.label } : null
  const head = (
    <>
      <Kicker tone={tone}>{block.kicker}</Kicker>
      <H2 className="max-w-[20em]">{block.heading}</H2>
      {block.intro && <p className="mt-4 max-w-[40em] text-lg">{block.intro}</p>}
    </>
  )

  if (block.style === 'steps') {
    const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
    return (
      <Section tone={tone}>
        {head}
        <Steps items={items} label={(n) => t('service.step', { n })} surface={tone} />
        {link && (
          <ButtonLink href={link.href} className="mt-11">
            {link.label}
          </ButtonLink>
        )}
      </Section>
    )
  }

  return (
    <Section tone={tone}>
      {head}
      <ul className={`mt-12 grid gap-4 sm:grid-cols-2 ${items.length % 4 === 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {items.map((item, i) => (
          <li key={item.id ?? i} className="rounded-[4px] border border-line bg-white p-7">
            <Icon name={item.icon} surface="white" />
            {item.title && <h3 className={`text-[21px] leading-snug font-extrabold ${item.icon ? 'mt-5' : ''}`}>{item.title}</h3>}
            {item.text && <p className="mt-2 text-[17px] leading-[1.55]">{item.text}</p>}
          </li>
        ))}
      </ul>
      {link && (
        <ButtonLink href={link.href} className="mt-11">
          {link.label}
        </ButtonLink>
      )}
    </Section>
  )
}
