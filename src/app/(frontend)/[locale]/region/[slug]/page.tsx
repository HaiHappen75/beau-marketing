import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Check } from '@/components/brand/Check'
import { CaseCard } from '@/components/blocks/CasesBlock'
import { Faq } from '@/components/site/Faq'
import { MediaImage } from '@/components/site/MediaImage'
import { ButtonLink, H2, Kicker, Section, Wrap } from '@/components/site/primitives'
import { JsonLd } from '@/components/seo/JsonLd'
import { Link } from '@/i18n/navigation'
import { stripEmphasis, withEmphasis } from '@/lib/emphasis'
import { breadcrumbNode, faqPageNode, webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { cmsMetadata } from '@/lib/pageMeta'
import { telHref } from '@/lib/phone'
import { serviceTeaserPrice } from '@/lib/price'
import { getBlockContext } from '@/lib/queries/blockContext'
import { getLocationBySlug } from '@/lib/queries/content'
import { findRedirect } from '@/lib/redirects'
import { SITE_URL, canonicalUrl, localeAlternates } from '@/lib/seo'
import { translatedLocales } from '@/lib/translations'
import type { Case } from '@/payload-types'

// Local landing page (design: Landingpage Flensburg.dc.html). Only published
// locations exist here — the publish lock in the collection guarantees real local
// content (doorway guard). Every section renders only with content.

export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await props.params
  const loc = await getLocationBySlug(slug, locale as Locale)
  if (!loc) return {}
  return cmsMetadata({
    locale,
    path: `/region/${slug}`,
    meta: loc.meta,
    fallbackTitle: loc.title,
    fallbackDescription: loc.lead,
    available: await translatedLocales('locations', loc.id),
  })
}

export default async function LocationPage(props: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await props.params
  setRequestLocale(locale)
  const lang = locale as Locale
  const loc = await getLocationBySlug(slug, lang)
  if (!loc) {
    const target = await findRedirect(`/${locale}/region/${slug}`)
    if (target) permanentRedirect(target)
    notFound()
  }

  const [ctx, t, ts, tl, available] = await Promise.all([
    getBlockContext(lang),
    getTranslations({ locale, namespace: 'Region' }),
    getTranslations({ locale, namespace: 'Site' }),
    getTranslations({ locale, namespace: 'Layout' }),
    translatedLocales('locations', loc.id),
  ])
  const path = `/region/${slug}`
  const { servedLang } = localeAlternates(path, available, locale)
  const canonical = canonicalUrl(servedLang, path)
  const place = loc.place
  const origin = ctx.settings.company?.district || ctx.settings.company?.city || ''
  const c = ctx.settings.company ?? {}
  const phoneHref = telHref(c.phone)
  const highlights = (loc.highlights ?? []).map((h) => h.item).filter(Boolean)
  const cases = (loc.cases ?? []).filter((x): x is Case => typeof x === 'object' && x?._status === 'published')
  const faq = (loc.faq ?? []).map((f) => ({ question: f.question, answer: f.answer }))
  const steps = t.raw('steps') as [string, string][]

  return (
    <>
      <JsonLd
        graph={[
          webPageNode({ canonical, name: stripEmphasis(loc.meta?.title || loc.title), description: loc.meta?.description || loc.lead || undefined, lang: servedLang as Locale }),
          breadcrumbNode(canonical, [
            { name: ts('home'), url: `${SITE_URL}/${servedLang}` },
            { name: place, url: canonical },
          ]),
          ...[faqPageNode(canonical, faq)].filter((n): n is NonNullable<typeof n> => n !== null),
        ]}
      />
      <div lang={servedLang !== locale ? servedLang : undefined}>
        {/* Hero */}
        <section className="bg-white pt-7">
          <Wrap>
            <nav aria-label={ts('breadcrumb')}>
              <ol className="flex flex-wrap gap-2 text-[15px] text-muted">
                <li>
                  <Link href="/" className="text-muted">
                    {ts('home')}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>{t('breadcrumb')}</li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-bold text-ink">
                  {place}
                </li>
              </ol>
            </nav>
            <div className="mt-[clamp(32px,5vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-8">
              <h1 className="text-[clamp(36px,5vw,62px)] leading-[1.04] font-extrabold tracking-[-0.025em] text-balance">
                {withEmphasis(loc.headline || loc.title)}
              </h1>
              <div>
                {loc.lead && <p className="text-[clamp(18px,1.5vw,20px)]">{loc.lead}</p>}
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/kontakt">{tl('cta')}</ButtonLink>
                  {loc.visitInfo && (
                    <ButtonLink href="#vorbei" variant="secondary">
                      {t('visitButton')}
                    </ButtonLink>
                  )}
                </div>
              </div>
            </div>
          </Wrap>
          <div className="mx-auto mt-[clamp(32px,5vw,56px)] max-w-[1280px]">
            <MediaImage media={null} ratio="21/8" sizes="100vw" />
          </div>
        </section>

        {/* Local introduction */}
        {loc.intro && (
          <Section>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-[72px] gap-y-8">
              <div>
                <Kicker>{place}</Kicker>
                <H2 className="text-[clamp(28px,3vw,38px)]">{loc.introHeading}</H2>
              </div>
              <div>
                {loc.intro.split(/\n\s*\n/).map((para, i) => (
                  <p key={i} className={i === 0 ? 'text-lg' : 'mt-4 text-lg'}>
                    {para}
                  </p>
                ))}
                {highlights.length > 0 && (
                  <ul className="mt-6 grid gap-3 text-[17px]">
                    {highlights.map((h, i) => (
                      <li key={h} className="flex items-start gap-3">
                        <Check size={22} index={i} className="mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* References from the region */}
        {cases.length > 0 && (
          <Section tone="offwhite">
            <Kicker tone="offwhite">{t('regionKicker')}</Kicker>
            <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,420px),1fr))] gap-10">
              {cases.map((cs) => (
                <div key={cs.id} className="rounded-[4px] border border-line bg-white p-6">
                  <CaseCard c={cs} referenceAria={ts('referenceAria', { name: cs.client })} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Services, compact */}
        {ctx.services.length > 0 && (
          <Section>
            <H2>{t('servicesHeading', { place })}</H2>
            <ul className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-10">
              {ctx.services.map((s) => (
                <li key={s.id} className="flex items-baseline justify-between gap-4 border-t border-line py-5">
                  <span>
                    <Link href={`/agentur/${s.slug}`} className="block text-xl font-extrabold no-underline hover:underline">
                      {s.title}
                    </Link>
                    <span className="text-base text-muted">{s.shortDescription}</span>
                  </span>
                  <span className="text-base font-extrabold whitespace-nowrap text-ink">{serviceTeaserPrice(s, lang)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{ts('pricesNet')}</p>
          </Section>
        )}

        {/* We come to you */}
        {loc.visitInfo && (
          <section id="vorbei" className="scroll-mt-24 bg-ink py-[clamp(56px,8vw,104px)] text-[#D6D6D6]">
            <Wrap className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-x-16 gap-y-10">
              <div>
                <Kicker tone="dark">{t('visitKicker')}</Kicker>
                <h2 className="text-[clamp(30px,3.4vw,44px)] leading-[1.08] font-extrabold text-white">
                  {withEmphasis(t('visitHeading', { origin, place }))}
                </h2>
                <p className="mt-5 max-w-[34em] text-lg">{loc.visitInfo}</p>
                <ol className="mt-6 grid gap-3 text-[17px]">
                  {steps.map(([bold, rest], i) => (
                    <li key={bold} className="flex items-start gap-3">
                      <Check size={22} index={i} surface="dark" className="mt-0.5" />
                      <span>
                        <strong className="text-white">{bold}</strong> {rest}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <figure>
                <MediaImage media={null} ratio="4/3" sizes="(min-width: 1024px) 520px, 100vw" dark />
                <figcaption className="mt-3 text-[15px] text-[#BDBDBD]">
                  {loc.distance && origin ? `${t('distance', { origin, place, distance: loc.distance })} ` : ''}
                  {t('surroundings')}
                </figcaption>
              </figure>
            </Wrap>
          </section>
        )}

        <Faq heading={t('faqHeading', { place })} items={faq} />

        {/* Contact */}
        <section className="bg-offwhite py-[clamp(56px,8vw,96px)]">
          <Wrap className="flex flex-wrap items-center justify-between gap-7">
            <div>
              <h2 className="text-[clamp(28px,3.2vw,42px)] leading-[1.1] font-extrabold">{t('contactHeading', { place })}</h2>
              <p className="mt-3 text-lg">
                {phoneHref && c.phone && (
                  <a href={phoneHref} className="text-2xl font-extrabold">
                    {c.phone}
                  </a>
                )}
                {phoneHref && c.email && ' · '}
                {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
              </p>
            </div>
            <ButtonLink href="/kontakt">{tl('cta')}</ButtonLink>
          </Wrap>
        </section>
      </div>
    </>
  )
}
