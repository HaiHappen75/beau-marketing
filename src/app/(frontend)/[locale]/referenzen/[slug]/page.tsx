import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Check } from '@/components/brand/Check'
import { RichText } from '@/components/richtext/RichText'
import { DeviceFrame, MediaImage, asMedia } from '@/components/site/MediaImage'
import { ButtonLink, Wrap } from '@/components/site/primitives'
import { JsonLd } from '@/components/seo/JsonLd'
import { Link } from '@/i18n/navigation'
import { webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { cmsMetadata } from '@/lib/pageMeta'
import { getCaseDetail, getPublishedCases } from '@/lib/queries/content'
import { isRichText, paragraphsOf } from '@/seed/richtext'
import { canonicalUrl } from '@/lib/seo'

// Case detail (design: Referenz Detail.dc.html). Truthful by construction: every
// section renders only when the CMS holds content for it — no invented stories,
// no quote without text AND name, no "online since" the CMS does not know.

const filled = (v: unknown) => isRichText(v) && paragraphsOf(v).some((p) => p !== '')

const externalUrl = (url: string) => (/^https?:\/\//.test(url) ? url : `https://${url}`)

export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await props.params
  const c = await getCaseDetail(slug, locale as Locale)
  if (!c) return {}
  return cmsMetadata({
    locale,
    path: `/referenzen/${slug}`,
    meta: c.meta,
    fallbackTitle: c.client,
    fallbackDescription: c.summary,
  })
}

export default async function CasePage(props: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await props.params
  setRequestLocale(locale)
  const loc = locale as Locale
  const c = await getCaseDetail(slug, loc)
  if (!c) notFound()
  const [t, tl, all] = await Promise.all([
    getTranslations({ locale, namespace: 'Site' }),
    getTranslations({ locale, namespace: 'Layout' }),
    getPublishedCases(loc),
  ])

  // Previous/next among the cases that have a detail page.
  const details = all.filter((x) => x.hasDetailPage)
  const idx = details.findIndex((x) => x.id === c.id)
  const prev = details.length > 1 ? details[(idx - 1 + details.length) % details.length] : null
  const next = details.length > 1 ? details[(idx + 1) % details.length] : null

  const chips = (c.chips ?? []).map((x) => x.label).filter(Boolean)
  const shots = (c.screenshots ?? []).map(asMedia).filter(Boolean)
  const story = [
    { key: 'challenge', title: t('case.challenge'), body: c.challenge },
    { key: 'solution', title: t('case.solution'), body: c.solution },
    { key: 'result', title: t('case.result'), body: c.result },
  ].filter((s) => filled(s.body))
  const quote = c.quote?.text && c.quote?.name ? c.quote : null
  const facts: [string, string | null | undefined][] = [
    [t('case.client'), c.client],
    [t('case.industry'), c.industry],
    [t('case.place'), c.place],
  ]

  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(locale, `/referenzen/${slug}`),
            name: c.meta?.title || c.client,
            description: c.meta?.description ?? c.summary ?? undefined,
            lang: loc,
          }),
        ]}
      />

      {/* Case header */}
      <section aria-labelledby="case-h" className="bg-white pt-7 pb-[clamp(48px,6vw,80px)]">
        <Wrap>
          <nav aria-label={t('breadcrumb')}>
            <ol className="flex flex-wrap gap-2 text-[15px] text-muted">
              <li>
                <Link href="/" className="text-muted">
                  {t('home')}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/referenzen" className="text-muted">
                  {t('references')}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-bold text-ink">
                {c.client}
              </li>
            </ol>
          </nav>
          <div className="mt-[clamp(32px,5vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-x-16 gap-y-8">
            <div>
              <p className="text-[15px] font-extrabold text-muted">{t('case.kicker')}</p>
              <h1
                id="case-h"
                className="mt-2.5 text-[clamp(36px,4.8vw,60px)] leading-[1.04] font-extrabold tracking-[-0.025em] text-balance"
              >
                {c.client}
              </h1>
              {c.summary && <p className="mt-[18px] max-w-[32em] text-[clamp(18px,1.5vw,21px)]">{c.summary}</p>}
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 border-t-2 border-ink pt-[18px] text-[17px]">
              {facts
                .filter(([, v]) => Boolean(v))
                .map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-bold text-ink">{v}</dd>
                  </div>
                ))}
              {chips.length > 0 && (
                <div className="contents">
                  <dt className="text-muted">{t('case.services')}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1.5">
                      {chips.map((chip) => (
                        <li key={chip} className="rounded-[3px] border border-line px-2.5 py-[3px] text-sm font-bold text-ink">
                          {chip}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </Wrap>
      </section>

      {/* Main screenshot — only a real one */}
      {shots[0] && (
        <section aria-label={t('case.screenshot')} className="bg-offwhite py-[clamp(40px,6vw,80px)]">
          <div className="mx-auto max-w-[980px] px-[clamp(20px,4vw,40px)]">
            <div className="bg-white p-[clamp(16px,3vw,40px)]">
              <DeviceFrame media={shots[0]} sizes="(min-width: 1024px) 900px, 100vw" />
            </div>
          </div>
        </section>
      )}

      {/* Story — only filled columns */}
      {story.length > 0 && (
        <section aria-label={t('case.story')} className="bg-white py-[clamp(56px,8vw,104px)]">
          <Wrap className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-10">
            {story.map((s, i) => (
              <div key={s.key} className="border-t-2 border-ink pt-5">
                <h2 className="flex items-center gap-3 text-2xl font-extrabold">
                  <Check size={24} index={i} />
                  {s.title}
                </h2>
                <div className="rich mt-3.5 text-lg">
                  <RichText data={s.body as never} />
                </div>
              </div>
            ))}
          </Wrap>
        </section>
      )}

      {/* Further screenshots */}
      {shots.length > 1 && (
        <section aria-label={t('case.moreScreenshots')} className="bg-white pb-[clamp(56px,8vw,104px)]">
          <Wrap className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
            {shots.slice(1).map((m) => (
              <MediaImage key={m!.id} media={m} ratio="4/3" sizes="(min-width: 1024px) 380px, 100vw" />
            ))}
          </Wrap>
        </section>
      )}

      {/* Quote — only with a released statement (text and name) */}
      {quote && (
        <section aria-label={t('case.quote')} className="bg-ink py-[clamp(56px,8vw,104px)]">
          <Wrap>
            <figure className="max-w-[900px]">
              <span aria-hidden="true" className="block h-5 w-5 border-2 border-accent" />
              <blockquote className="mt-6 text-[clamp(24px,2.8vw,36px)] leading-[1.3] font-bold text-white italic">
                „{quote.text}“
              </blockquote>
              <figcaption className="mt-6 text-[17px] text-[#D6D6D6]">
                <strong className="text-white">{quote.name}</strong>
                {quote.role ? ` · ${quote.role}` : ''}
              </figcaption>
            </figure>
          </Wrap>
        </section>
      )}

      {/* Link and prev/next */}
      {(c.url || prev) && (
        <section aria-label={t('case.nav')} className="bg-white py-[clamp(48px,6vw,80px)]">
          <Wrap className="flex flex-wrap items-center justify-between gap-6">
            {c.url ? (
              <a
                href={externalUrl(c.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-[3px] border-2 border-ink px-[22px] py-[13px] text-[17px] font-extrabold text-ink no-underline hover:bg-ink hover:text-white"
              >
                {t('case.visit', { name: c.client })} <span aria-hidden="true">&nbsp;↗</span>
              </a>
            ) : (
              <span />
            )}
            {prev && next && (
              <p className="flex flex-wrap gap-6 text-[17px]">
                <Link href={`/referenzen/${prev.slug}`}>← {prev.client}</Link>
                {next.id !== prev.id && <Link href={`/referenzen/${next.slug}`}>{next.client} →</Link>}
              </p>
            )}
          </Wrap>
        </section>
      )}

      {/* CTA */}
      <section aria-labelledby="cta-h" className="bg-offwhite py-[clamp(56px,8vw,96px)]">
        <Wrap className="flex flex-wrap items-center justify-between gap-7">
          <h2 id="cta-h" className="max-w-[18em] text-[clamp(28px,3.2vw,42px)] leading-[1.1] font-extrabold">
            {t('case.ctaHeading')}
          </h2>
          <ButtonLink href="/kontakt">{tl('cta')}</ButtonLink>
        </Wrap>
      </section>
    </>
  )
}
