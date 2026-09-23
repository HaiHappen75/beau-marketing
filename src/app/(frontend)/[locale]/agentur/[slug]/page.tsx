import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Check } from '@/components/brand/Check'
import { CaseCard } from '@/components/blocks/CasesBlock'
import { DeviceFrame, MediaImage } from '@/components/site/MediaImage'
import { Faq } from '@/components/site/Faq'
import { ButtonLink, H2, Kicker, PriceNote, Section, Wrap } from '@/components/site/primitives'
import { PackageCard, PriceLine, type Pkg, type PriceLabels } from '@/components/service/PackageCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { Link } from '@/i18n/navigation'
import { stripEmphasis, withEmphasis } from '@/lib/emphasis'
import { breadcrumbNode, serviceNode, webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { cmsMetadata } from '@/lib/pageMeta'
import { telHref } from '@/lib/phone'
import { formatPackagePrice, serviceTeaserPrice } from '@/lib/price'
import { getBlockContext } from '@/lib/queries/blockContext'
import { getCasesByIds, getCasesForService, getPostsByIds, getServiceBySlug, idOf } from '@/lib/queries/content'
import { SITE_URL, canonicalUrl, localeAlternates } from '@/lib/seo'
import { findRedirect } from '@/lib/redirects'
import { translatedLocales } from '@/lib/translations'
import { permanentRedirect } from 'next/navigation'
import type { Service } from '@/payload-types'

// One template for all six service pages (design: Leistungsseite.dc.html).
// Every section renders only when its content exists.

export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await props.params
  const service = await getServiceBySlug(slug, locale as Locale)
  if (!service) return {}
  return cmsMetadata({
    locale,
    path: `/agentur/${slug}`,
    meta: service.meta,
    fallbackTitle: service.title,
    fallbackDescription: service.promise ?? service.teaser,
    available: await translatedLocales('services', service.id),
  })
}

/** "Danach" card: another service's package(s), e.g. the care plan after a website. */
function aftercareCard(service: Service, all: Service[], locale: Locale) {
  const target = all.find((s) => s.id === idOf(service.aftercare?.service))
  if (!target) return null
  const cards = (target.packages ?? []).filter((p) => p.display !== 'box')
  const names = (service.aftercare?.packageName ?? '')
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)
  const chosen = names.length > 0 ? cards.filter((p) => names.includes(p.name)) : cards
  if (chosen.length === 0) return null
  const first = chosen[0]
  if (chosen.length === 1) {
    return { target, title: first.name, pkg: first, description: first.description, items: includes(first) }
  }
  // Several packages: priced like the entry one, the others listed as a line.
  const line = chosen.map((p) => `${p.name} ${formatPackagePrice(p, locale)}`).join(' · ')
  return {
    target,
    title: target.shortLabel || target.title,
    pkg: { ...first, priceIsFrom: true },
    description: line,
    items: includes(first),
  }
}

const includes = (p: Pkg) => (p.includes ?? []).map((i) => i.item).filter(Boolean)

export default async function ServicePage(props: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await props.params
  setRequestLocale(locale)
  const loc = locale as Locale
  const service = await getServiceBySlug(slug, loc)
  if (!service) {
    const target = await findRedirect(`/${locale}/agentur/${slug}`)
    if (target) permanentRedirect(target)
    notFound()
  }
  const { servedLang } = localeAlternates(`/agentur/${slug}`, await translatedLocales('services', service.id), locale)

  const [ctx, t, tf] = await Promise.all([
    getBlockContext(loc),
    getTranslations({ locale, namespace: 'Site' }),
    getTranslations({ locale, namespace: 'Layout' }),
  ])
  const labels: PriceLabels = {
    from: t('from'),
    once: t('once'),
    perMonth: t('perMonth'),
    perHour: t('perHour'),
    onRequest: t('onRequest'),
    priceNote: t('priceNote'),
  }

  const nr = String((ctx.services.findIndex((s) => s.id === service.id) ?? 0) + 1).padStart(2, '0')
  const packages = service.packages ?? []
  const boxes = packages.filter((p) => p.display === 'box')
  const cards = packages.filter((p) => p.display !== 'box')
  const aftercare = aftercareCard(service, ctx.services, loc)
  const deliverables = (service.deliverables?.items ?? []).map((i) => i.item).filter(Boolean)
  const steps = service.steps ?? []
  const inHouse = service.inHouse
  const inHouseItems = (inHouse?.items ?? []).map((i) => i.item).filter(Boolean)
  const faq = (service.faq ?? []).map((f) => ({ question: f.question, answer: f.answer }))

  const manualCaseIds = (service.cases ?? []).map(idOf).filter((id): id is number => id !== null)
  const cases = manualCaseIds.length > 0 ? await getCasesByIds(manualCaseIds, loc) : await getCasesForService(service.id, loc)
  const postIds = (service.posts ?? []).map(idOf).filter((id): id is number => id !== null)
  const posts = await getPostsByIds(postIds, loc)

  const c = ctx.settings.company ?? {}
  const phoneHref = telHref(c.phone)
  const requestHref = `/kontakt?leistung=${service.slug}`
  const rate = c.hourlyRate
  const canonical = canonicalUrl(servedLang, `/agentur/${slug}`)

  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical,
            name: service.meta?.title || service.title,
            description: service.meta?.description ?? service.promise ?? undefined,
            lang: servedLang as Locale,
          }),
          serviceNode(service, canonical, ctx.settings),
          breadcrumbNode(canonical, [
            { name: t('home'), url: `${SITE_URL}/${servedLang}` },
            { name: t('agency'), url: canonicalUrl(servedLang, '/agentur') },
            { name: service.title, url: canonical },
          ]),
        ]}
      />
      <div lang={servedLang !== locale ? servedLang : undefined}>

      {/* Hero */}
      <section className="bg-white pt-7 pb-[clamp(56px,8vw,104px)]">
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
                <Link href="/agentur" className="text-muted">
                  {t('agency')}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-bold text-ink">
                {service.title}
              </li>
            </ol>
          </nav>
          <div className="mt-[clamp(32px,5vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(40px,5vw,72px)]">
            <div>
              <p className="text-[15px] font-extrabold text-muted">
                {nr} · {service.title}
              </p>
              <h1 className="mt-2 text-[clamp(36px,4.8vw,60px)] leading-[1.05] font-extrabold tracking-[-0.025em] text-balance">
                {withEmphasis(service.headline || service.title)}
              </h1>
              {service.promise && (
                <p className="mt-[22px] max-w-[34em] text-[clamp(18px,1.5vw,21px)] leading-[1.55]">{service.promise}</p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={requestHref}>{tf('cta')}</ButtonLink>
                {cards.length > 0 && (
                  <ButtonLink href="#pakete" variant="secondary">
                    {t('service.packagesButton')}
                  </ButtonLink>
                )}
              </div>
              <p className="mt-[22px] text-base">
                <strong className="text-ink">
                  {service.shortLabel ? `${service.shortLabel} ` : ''}
                  {serviceTeaserPrice(service, loc)}
                </strong>
                {packages[0]?.price != null && <span className="text-sm text-muted"> · {t('priceNote')}</span>}
              </p>
            </div>
            <DeviceFrame media={service.heroImage} sizes="(min-width: 1024px) 560px, 100vw" />
          </div>
        </Wrap>
      </section>

      {/* Das bekommst du */}
      {(deliverables.length > 0 || service.deliverables?.heading) && (
        <Section divider>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-[72px] gap-y-8">
            <div>
              <Kicker>{t('service.deliverablesKicker')}</Kicker>
              <H2>{service.deliverables?.heading}</H2>
              {service.deliverables?.text && <p className="mt-[18px] max-w-[30em] text-lg">{service.deliverables.text}</p>}
            </div>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] content-start gap-x-8 gap-y-1">
              {deliverables.map((item, i) => (
                <li key={item} className="flex items-start gap-3.5 border-b border-line py-3.5 text-[17px]">
                  <Check size={22} index={i} className="mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* Eigener Kasten, z. B. Pflichtangaben-Update für bestehende Shops */}
      {boxes.map((p) => (
        <section key={p.id ?? p.name} className="bg-white pb-[clamp(56px,8vw,104px)]">
          <Wrap>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-14 gap-y-7 rounded-[4px] border-2 border-ink p-[clamp(24px,4vw,48px)]">
              <div>
                {p.kicker && <p className="text-sm font-extrabold tracking-[0.08em] uppercase">{p.kicker}</p>}
                <h2 className="mt-2.5 text-[clamp(26px,2.6vw,34px)] font-extrabold">{p.name}</h2>
                {p.description && <p className="mt-3 text-lg">{p.description}</p>}
                <PriceLine pkg={p} locale={loc} labels={labels} />
                {p.price != null && <PriceNote text={t('priceNote')} className="mt-2" />}
              </div>
              <div>
                <ul className="grid gap-3.5 text-[17px]">
                  {includes(p).map((item, i) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={22} index={i} className="mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <ButtonLink href={requestHref} variant="secondary" className="mt-6 text-base">
                  {t('service.request', { name: p.name })}
                </ButtonLink>
              </div>
            </div>
          </Wrap>
        </section>
      ))}

      {/* Pakete & Preise */}
      {cards.length > 0 && (
        <Section tone="offwhite" id="pakete">
          <Kicker tone="offwhite">{t('service.packagesKicker')}</Kicker>
          <H2>{t('service.packagesHeading')}</H2>
          <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
            {cards.map((p, i) => (
              <PackageCard
                key={p.id ?? p.name}
                kicker={p.kicker}
                title={p.name}
                pkg={p}
                description={p.description}
                items={includes(p)}
                highlighted={cards.length > 1 && i === 1}
                cta={{ href: requestHref, label: t('service.request', { name: p.name }) }}
                locale={loc}
                labels={labels}
              />
            ))}
            {aftercare && (
              <PackageCard
                kicker={t('service.aftercareKicker')}
                title={aftercare.title}
                pkg={aftercare.pkg}
                description={aftercare.description}
                items={aftercare.items}
                cta={{
                  href: `/kontakt?leistung=${aftercare.target.slug}`,
                  label: t('service.request', { name: aftercare.title }),
                }}
                locale={loc}
                labels={labels}
              />
            )}
          </div>
          {rate != null && <p className="mt-5 text-[15px] text-muted">{t('hourlyFootnote', { rate })}</p>}
        </Section>
      )}

      {/* Ablauf */}
      {steps.length > 0 && (
        <Section>
          <Kicker>{t('service.processKicker')}</Kicker>
          <H2>{t('service.processHeading', { count: steps.length })}</H2>
          <ol className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-x-6 gap-y-8">
            {steps.map((s, i) => (
              <li key={s.id ?? s.title} className="border-t-2 border-ink pt-5">
                <p className="flex items-center gap-2.5 text-sm font-extrabold text-muted">
                  <Check size={26} index={i} />
                  {t('service.step', { n: i + 1 })}
                </p>
                <h3 className="mt-3.5 text-[21px] font-extrabold">{s.title}</h3>
                {s.text && <p className="mt-1.5 text-[17px]">{s.text}</p>}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Aus dem eigenen Haus */}
      {inHouse?.heading && (
        <Section tone="dark">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-x-16 gap-y-10">
            <div>
              <Kicker tone="dark">{t('service.inHouseKicker')}</Kicker>
              <H2 light>{inHouse.heading}</H2>
              {inHouse.text && <p className="mt-[18px] max-w-[32em] text-lg">{inHouse.text}</p>}
              {inHouseItems.length > 0 && (
                <ul className="mt-6 grid gap-3 text-[17px]">
                  {inHouseItems.map((item, i) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={22} index={i} surface="dark" className="mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {inHouse.url && inHouse.linkLabel && (
                <p className="mt-6">
                  <a href={inHouse.url} target="_blank" rel="noopener noreferrer" className="font-bold text-white">
                    {inHouse.linkLabel} <span aria-hidden="true">↗</span>
                  </a>
                </p>
              )}
            </div>
            <div className="rounded-[4px] bg-white p-6">
              <MediaImage media={inHouse.image} ratio="16/10" sizes="(min-width: 1024px) 520px, 100vw" />
            </div>
          </div>
        </Section>
      )}

      {/* Passende Referenzen */}
      {cases.length > 0 && (
        <Section>
          <Kicker>{t('service.referencesKicker')}</Kicker>
          <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(min(100%,420px),1fr))] gap-x-10 gap-y-12">
            {cases.map((cs) => (
              <CaseCard key={cs.id} c={cs} referenceAria={t('referenceAria', { name: cs.client })} />
            ))}
          </div>
        </Section>
      )}

      <Faq kicker={t('service.faqKicker')} heading={t('service.faqHeading')} items={faq} />

      {/* Weiterlesen im Ratgeber — only with published articles */}
      {posts.length > 0 && (
        <Section tone="offwhite">
          <h2 className="text-[clamp(26px,2.6vw,34px)] font-extrabold">{t('service.guidesHeading')}</h2>
          <ul className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
            {posts.map((p) => (
              <li key={p.id} className="rounded-[4px] border border-line bg-white p-6">
                <h3 className="text-xl leading-[1.3] font-extrabold">
                  <Link href={`/ratgeber/${p.slug}`} className="no-underline hover:underline">
                    {p.title}
                  </Link>
                </h3>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* CTA */}
      <section className="bg-ink py-[clamp(56px,8vw,104px)] text-[#D6D6D6]">
        <Wrap className="flex flex-wrap items-center justify-between gap-7">
          <div>
            <h2 className="text-[clamp(30px,3.6vw,46px)] leading-[1.08] font-extrabold text-white">
              {withEmphasis(service.cta?.heading || stripEmphasis(service.title))}
            </h2>
            {service.cta?.text && <p className="mt-3 text-lg">{service.cta.text}</p>}
            {(phoneHref || c.email) && (
              <p className="mt-3 text-lg">
                {phoneHref && c.phone && (
                  <>
                    {t('service.ctaCall')}{' '}
                    <a href={phoneHref} className="font-extrabold text-white">
                      {c.phone}
                    </a>
                  </>
                )}
                {phoneHref && c.email && ` · ${t('service.ctaOr')} `}
                {c.email && (
                  <a href={`mailto:${c.email}`} className="font-bold text-white">
                    {c.email}
                  </a>
                )}
              </p>
            )}
          </div>
          <ButtonLink href={requestHref} onDark>
            {service.cta?.buttonLabel || tf('cta')}
          </ButtonLink>
        </Wrap>
      </section>
      </div>
    </>
  )
}
