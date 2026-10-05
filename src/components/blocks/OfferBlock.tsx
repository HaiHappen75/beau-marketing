import { getTranslations } from 'next-intl/server'

import { ButtonLink, H2, Kicker, PriceNote, Section, Wrap } from '@/components/site/primitives'
import { CheckList, OfferBox } from '@/components/service/OfferBox'
import { PriceLine, type PriceLabels } from '@/components/service/PackageCard'
import { Link } from '@/i18n/navigation'
import { withEmphasis } from '@/lib/emphasis'

import type { BlockContext, BlockOf } from './types'

const paragraphs = (text: string | null | undefined, first = 'text-lg', rest = 'mt-4 text-lg') =>
  (text ?? '')
    .split(/\n\s*\n/)
    .filter((p) => p.trim())
    .map((para, i) => (
      <p key={i} className={i === 0 ? first : rest}>
        {para}
      </p>
    ))

/**
 * Offer pages (design: the service page sections). Three looks:
 *  - box:     the black-bordered box — price left, text, checks and button right
 *  - columns: like "Das bekommst du" — heading, price and text left, check list right
 *  - plain:   heading, text, checks and a text link
 * The price comes from the number fields (PriceLine), never from the text.
 */
export async function OfferBlock({ block, ctx }: { block: BlockOf<'offer'>; ctx: BlockContext }) {
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  const labels: PriceLabels = {
    from: t('from'),
    once: t('once'),
    perMonth: t('perMonth'),
    perHour: t('perHour'),
    onRequest: t('onRequest'),
    priceNote: t('priceNote'),
  }
  const items = (block.items ?? []).map((i) => i.item).filter(Boolean)
  const link = block.link?.href && block.link.label ? { href: block.link.href, label: block.link.label } : null
  const price =
    block.price != null ? (
      <>
        <PriceLine pkg={block} locale={ctx.locale} labels={labels} />
        <PriceNote text={labels.priceNote} className="mt-2" />
      </>
    ) : null

  if (block.style === 'columns') {
    return (
      <Section divider>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-[72px] gap-y-8">
          <div>
            <Kicker>{block.kicker}</Kicker>
            <H2>{block.heading}</H2>
            {price}
            {block.text && <div className="mt-[18px] max-w-[30em]">{paragraphs(block.text)}</div>}
            {link && (
              <ButtonLink href={link.href} variant="secondary" className="mt-7 text-base">
                {link.label}
              </ButtonLink>
            )}
          </div>
          <CheckList
            items={items}
            className="grid content-start gap-y-1 text-[17px]"
            itemClassName="flex items-start gap-3.5 border-b border-line py-3.5"
          />
        </div>
      </Section>
    )
  }

  if (block.style === 'plain') {
    return (
      <Section divider>
        <Kicker>{block.kicker}</Kicker>
        <H2>{block.heading}</H2>
        {block.text && <div className="mt-[18px] max-w-[38em]">{paragraphs(block.text)}</div>}
        {price}
        <CheckList items={items} className="mt-6 grid max-w-[46em] gap-3.5 text-[17px]" />
        {link && (
          <p className="mt-7 text-[17px] font-bold">
            <Link href={link.href}>
              {link.label} <span aria-hidden="true">→</span>
            </Link>
          </p>
        )}
      </Section>
    )
  }

  // box (default)
  return (
    <section className="bg-white pb-[clamp(56px,8vw,104px)]">
      <Wrap>
        <OfferBox
          kicker={block.kicker}
          title={withEmphasis(block.heading)}
          aside={
            block.text || items.length > 0 ? (
              <>
                {paragraphs(block.text)}
                <CheckList items={items} className={block.text ? 'mt-5 grid gap-3.5 text-[17px]' : undefined} />
              </>
            ) : undefined
          }
          cta={link ?? undefined}
        >
          {price}
        </OfferBox>
      </Wrap>
    </section>
  )
}
