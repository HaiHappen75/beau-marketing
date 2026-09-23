import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Check } from '@/components/brand/Check'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/locale'
import { telHref } from '@/lib/phone'
import { getNavigation, getPublishedServices, getSettings, getTrust } from '@/lib/queries/getLayoutData'
import type { Media } from '@/payload-types'

import { LanguageSwitcher } from './LanguageSwitcher'

const asMedia = (v: unknown): Media | null =>
  v && typeof v === 'object' && 'url' in v && (v as Media).url ? (v as Media) : null

/**
 * Badges: the original upload stays byte-identical in the media library; the
 * footer shows the 400 px rendition Payload derives from it (same mark, scaled
 * for display — the original is ~390 KB for a 58 px high slot).
 */
const badgeSource = (m: Media) => {
  const t = m.sizes?.thumbnail
  return t?.url && t.width && t.height
    ? { src: t.url, width: t.width, height: t.height }
    : { src: m.url as string, width: m.width ?? 200, height: m.height ?? 100 }
}

/**
 * Site footer (design: Footer.dc.html). Every value comes from Payload; a field
 * without a value removes its render spot — no placeholders, ever.
 */
export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Layout' })
  const [settings, services, navigation, trust] = await Promise.all([
    getSettings(locale),
    getPublishedServices(locale),
    getNavigation(locale),
    getTrust(locale),
  ])

  const c = settings.company ?? {}
  const phoneHref = telHref(c.phone)
  const linkedin = settings.profiles?.linkedin || null
  const badges = (trust.badges ?? [])
    .map((b) => ({ ...b, media: asMedia(b.image) }))
    .filter((b) => b.media)
  const shopify = asMedia(trust.shopifyBadge)
  const reviews = trust.googleReviews
  const showReviews = Boolean(reviews?.show && reviews.rating && reviews.count)
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-white text-text">
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] pt-16 pb-7">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-8 gap-y-10">
          <div>
            <Image
              src="/brand/beau-marketing-logo.png"
              width={1200}
              height={358}
              alt="beau marketing – success simplified"
              className="h-[52px] w-auto"
            />
            <p className="mt-[18px] max-w-[26ch] text-base leading-relaxed text-muted">{t('footerAbout')}</p>
          </div>

          <div>
            <h2 className="kicker mb-3 text-ink">{t('contact')}</h2>
            {(c.legalName || c.street || c.city) && (
              <address className="text-base leading-[1.7] not-italic">
                {c.legalName && (
                  <>
                    {c.legalName}
                    <br />
                  </>
                )}
                {c.street && (
                  <>
                    {c.street}
                    <br />
                  </>
                )}
                {(c.postalCode || c.city) && [c.postalCode, c.city].filter(Boolean).join(' ')}
              </address>
            )}
            {(phoneHref || c.email) && (
              <p className="mt-2.5 text-base leading-[1.8]">
                {phoneHref && c.phone && (
                  <>
                    <a href={phoneHref}>{c.phone}</a>
                    <br />
                  </>
                )}
                {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
              </p>
            )}
          </div>

          {services.length > 0 && (
            <div>
              <h2 className="kicker mb-3 text-ink">{t('services')}</h2>
              <ul className="grid gap-1.5 text-base">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/agentur/${s.slug}`} className="nav-link hover:underline">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="kicker mb-3 text-ink">{t('legal')}</h2>
            <ul className="grid gap-1.5 text-base">
              {(navigation.footerLegal ?? []).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="nav-link hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
              {linkedin && (
                <li className="mt-3">
                  <a href={linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {(badges.length > 0 || shopify || trust.serverNote || showReviews) && (
          <div className="mt-12 flex flex-wrap items-center gap-x-9 gap-y-5 border-t border-line pt-7">
            {badges.map((b) => {
              const m = b.media as Media
              const img = (
                <Image
                  {...badgeSource(m)}
                  alt={m.alt ?? b.name}
                  unoptimized // already a web rendition — no second re-encode by next/image
                  className={m.height && m.width && m.height > m.width ? 'h-20 w-auto' : 'h-[58px] w-auto'}
                />
              )
              return b.href ? (
                <a
                  key={b.id}
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${b.name} – ${b.href.replace(/^https?:\/\//, '')}`}
                  className="block leading-none"
                >
                  {img}
                </a>
              ) : (
                <span key={b.id} className="block leading-none">
                  {img}
                </span>
              )
            })}
            {shopify && (
              <Image
                {...badgeSource(shopify)}
                alt={shopify.alt ?? 'Shopify Partner'}
                unoptimized
                className="h-[58px] w-auto"
              />
            )}
            {showReviews && reviews && (
              <p className="m-0 text-[15px]">
                {settings.profiles?.googleReviewUrl ? (
                  <a href={settings.profiles.googleReviewUrl} target="_blank" rel="noopener noreferrer">
                    {t('reviews', { rating: reviews.rating as number, count: reviews.count as number })}
                  </a>
                ) : (
                  t('reviews', { rating: reviews.rating as number, count: reviews.count as number })
                )}
              </p>
            )}
            {trust.serverNote && (
              <p className="m-0 flex items-center gap-2.5 text-[15px]">
                <Check size={18} checked />
                {trust.serverNote}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p className="m-0">
            © {year} {c.legalName ?? settings.siteName} · {t('claim')}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  )
}
