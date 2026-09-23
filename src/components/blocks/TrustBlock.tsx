import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Check } from '@/components/brand/Check'
import { asMedia } from '@/components/site/MediaImage'
import { Wrap } from '@/components/site/primitives'
import type { Media } from '@/payload-types'

import type { BlockContext, BlockOf } from './types'

const rendition = (m: Media) => {
  const t = m.sizes?.thumbnail
  return t?.url && t.width && t.height
    ? { src: t.url, width: t.width, height: t.height }
    : { src: m.url as string, width: m.width ?? 200, height: m.height ?? 100 }
}

/**
 * Trust bar. SH partner badge is mandatory, unchanged and linked to partner-sh.de.
 * Shopify badge and Google reviews only render with real values.
 */
export async function TrustBlock({ block, ctx }: { block: BlockOf<'trustBar'>; ctx: BlockContext }) {
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  const { trust } = ctx
  const badges = (trust.badges ?? []).map((b) => ({ ...b, media: asMedia(b.image) })).filter((b) => b.media)
  const shopify = asMedia(trust.shopifyBadge)
  const r = trust.googleReviews
  const reviews = r?.show && r.rating && r.count ? { rating: r.rating, count: r.count } : null
  if (badges.length === 0 && !shopify && !trust.serverNote && !reviews) return null
  const rating = reviews ? new Intl.NumberFormat(`${ctx.locale === 'en' ? 'en-GB' : `${ctx.locale}-DE`}`, { minimumFractionDigits: 1 }).format(reviews.rating) : ''

  const tile = 'flex min-h-[120px] items-center justify-center gap-3 border border-line bg-white px-4 py-3'
  return (
    <section aria-label={block.heading || t('trustLabel')} className="bg-offwhite py-10">
      <Wrap>
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
          {badges.map((b) => {
            const m = b.media as Media
            const tall = (m.height ?? 0) > (m.width ?? 0)
            const img = (
              <Image {...rendition(m)} alt={m.alt ?? b.name} unoptimized className={tall ? 'h-[92px] w-auto' : 'h-[72px] w-auto'} />
            )
            return (
              <li key={b.id} className={tile}>
                {b.href ? (
                  <a href={b.href} target="_blank" rel="noopener noreferrer" aria-label={`${b.name} – ${b.href.replace(/^https?:\/\//, '')}`} className="leading-none">
                    {img}
                  </a>
                ) : (
                  img
                )}
                {b.caption && <span className="max-w-[13ch] text-sm">{b.caption}</span>}
              </li>
            )
          })}
          {shopify && (
            <li className={tile}>
              <Image {...rendition(shopify)} alt={shopify.alt ?? 'Shopify Partner'} unoptimized className="h-[72px] w-auto" />
            </li>
          )}
          {trust.serverNote && (
            <li className={`${tile} text-base font-bold text-ink`}>
              <Check size={24} checked />
              {trust.serverNote}
            </li>
          )}
          {reviews && (
            <li className={`${tile} flex-col`}>
              <span role="img" aria-label={t('reviewsAria', { rating })} className="text-[22px] tracking-[3px] text-ink">
                ★★★★★
              </span>
              <span className="text-base">{t('reviews', { rating, count: reviews.count })}</span>
            </li>
          )}
        </ul>
      </Wrap>
    </section>
  )
}
