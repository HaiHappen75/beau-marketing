import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { MediaImage } from '@/components/site/MediaImage'
import { ButtonLink, EXTERNAL_LINK, H2, Kicker, Section, Wrap, isExternalHref } from '@/components/site/primitives'
import { QrCode } from '@/components/site/QrCode'
import { Link } from '@/i18n/navigation'
import { withEmphasis } from '@/lib/emphasis'
import { withInlineLinks } from '@/lib/inlineLinks'
import { canonicalUrl } from '@/lib/seo'

import type { BlockContext, BlockOf } from './types'

type Tile = NonNullable<BlockOf<'tiles'>['items']>[number]

const paragraphsOf = (text: string | null | undefined) => (text ?? '').split(/\n\s*\n/).filter((p) => p.trim())

/** A whole card as one link: internal paths through the locale-aware Link, other sites in a new tab. */
function CardLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} {...EXTERNAL_LINK}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

const CARD = 'h-full rounded-[4px] border border-line bg-white'

/** One card. With a link target the whole card is the link; without, its text may carry inline links. */
function Card({ item, wide }: { item: Tile; wide: boolean }) {
  const href = item.link?.href || null
  const paragraphs = paragraphsOf(item.text)
  const more = href ? (
    <span className="flex items-center gap-3 text-base font-extrabold text-ink">
      {item.link?.label}
      <span aria-hidden="true" className="text-[22px] leading-none">
        →
      </span>
    </span>
  ) : null

  // A single card without an image is a pointer: text left, the way on right.
  if (wide) {
    const body = (
      <>
        <span className="block min-w-0 flex-[1_1_320px]">
          {item.title && <span className="block text-[22px] leading-snug font-extrabold text-ink">{item.title}</span>}
          {paragraphs.map((p, i) => (
            <span key={i} className={`block text-[17px] text-text ${item.title || i > 0 ? 'mt-1.5' : ''}`}>
              {href ? p : withInlineLinks(p)}
            </span>
          ))}
        </span>
        {more}
      </>
    )
    const cls = `${CARD} flex flex-wrap items-center justify-between gap-x-10 gap-y-4 p-7`
    return href ? (
      <CardLink href={href} className={`${cls} no-underline hover:border-ink`}>
        {body}
      </CardLink>
    ) : (
      <div className={cls}>{body}</div>
    )
  }

  const body = (
    <>
      {item.image ? <MediaImage media={item.image} ratio="4/3" sizes="(min-width: 1024px) 580px, 100vw" /> : null}
      <span className="flex flex-1 flex-col p-7">
        {item.title && <span className="block text-2xl font-extrabold text-ink hyphens-auto">{item.title}</span>}
        <span className="block flex-1">
          {paragraphs.map((p, i) => (
            <span key={i} className={`block text-[17px] leading-[1.55] text-text ${item.title || i > 0 ? 'mt-2' : ''}`}>
              {href ? p : withInlineLinks(p)}
            </span>
          ))}
        </span>
        {more && <span className="mt-6 block">{more}</span>}
      </span>
    </>
  )
  const cls = `${CARD} flex flex-col overflow-hidden`
  return href ? (
    <CardLink href={href} className={`${cls} no-underline hover:border-ink`}>
      {body}
    </CardLink>
  ) : (
    <div className={cls}>{body}</div>
  )
}

/**
 * Free tiles. Two looks:
 *  - cards: cards side by side (optional image on top); a single card without an
 *           image becomes a slim pointer to another page
 *  - box:   one black-bordered box with a column per tile — text, optional QR code
 *           of the link target, button (e.g. "try the demo")
 */
export async function TilesBlock({ block, ctx }: { block: BlockOf<'tiles'>; ctx: BlockContext }) {
  const items = (block.items ?? []).filter((it) => it.title || it.text || it.image || it.link?.href)
  if (items.length === 0) return null
  const tone = block.tone === 'offwhite' ? 'offwhite' : 'white'
  const below = block.link?.href && block.link.label ? { href: block.link.href, label: block.link.label } : null
  const hasHead = Boolean(block.kicker || block.heading || block.intro)

  if (block.style === 'box') {
    const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
    return (
      <Section tone={tone}>
        <div className="rounded-[4px] border-2 border-ink bg-white p-[clamp(24px,4vw,48px)]">
          {block.kicker && <p className="text-sm font-extrabold tracking-[0.08em] uppercase">{block.kicker}</p>}
          {block.heading && (
            <h2 className="mt-2.5 text-[clamp(28px,3vw,40px)] leading-[1.1] font-extrabold tracking-[-0.02em]">
              {withEmphasis(block.heading)}
            </h2>
          )}
          {block.intro && <p className="mt-4 max-w-[40em] text-lg">{block.intro}</p>}
          <div
            className={`grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-14 gap-y-10 ${hasHead ? 'mt-9' : ''}`}
          >
            {items.map((item, i) => {
              const href = item.link?.href || null
              const label = item.link?.label || null
              // A path is turned into the full address — a phone camera needs the whole URL.
              const qrTarget = href ? (href.startsWith('/') ? canonicalUrl(ctx.locale, href) : href) : null
              return (
                <div key={item.id ?? i} className="flex flex-col items-start">
                  {item.title && <h3 className="text-[21px] font-extrabold">{item.title}</h3>}
                  {paragraphsOf(item.text).map((p, n) => (
                    <p key={n} className={`max-w-[32em] text-lg ${item.title || n > 0 ? 'mt-3' : ''}`}>
                      {withInlineLinks(p)}
                    </p>
                  ))}
                  {item.qr && qrTarget ? (
                    <QrCode value={qrTarget} label={t('qrCode', { label: label ?? qrTarget })} className="mt-6 border border-line" />
                  ) : item.image ? (
                    <div className="mt-6 w-full max-w-[360px]">
                      <MediaImage media={item.image} ratio="4/3" sizes="360px" />
                    </div>
                  ) : null}
                  {href && label && (
                    <ButtonLink href={href} variant={i === 0 ? 'primary' : 'secondary'} className="mt-6">
                      {label}
                    </ButtonLink>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        {below && (
          <p className="mt-7 text-[17px] font-bold">
            <Link href={below.href}>
              {below.label} <span aria-hidden="true">→</span>
            </Link>
          </p>
        )}
      </Section>
    )
  }

  const wide = items.length === 1 && !items[0].image
  const list = (
    <>
      <ul
        className={`grid gap-4 ${wide ? '' : 'grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]'} ${
          hasHead ? 'mt-10' : ''
        }`}
      >
        {items.map((item, i) => (
          <li key={item.id ?? i}>
            <Card item={item} wide={wide} />
          </li>
        ))}
      </ul>
      {below && (
        <p className="mt-7 text-[17px] font-bold">
          <Link href={below.href}>
            {below.label} <span aria-hidden="true">→</span>
          </Link>
        </p>
      )}
    </>
  )

  // A lone pointer card without a heading is a slim band, not a full section.
  if (wide && !hasHead) {
    return (
      <section className={`${tone === 'offwhite' ? 'bg-offwhite' : 'bg-white'} py-[clamp(32px,5vw,56px)]`}>
        <Wrap>{list}</Wrap>
      </section>
    )
  }

  return (
    <Section tone={tone}>
      <Kicker tone={tone}>{block.kicker}</Kicker>
      <H2 className="max-w-[20em]">{block.heading}</H2>
      {block.intro && <p className="mt-4 max-w-[42em] text-lg">{block.intro}</p>}
      {list}
    </Section>
  )
}
