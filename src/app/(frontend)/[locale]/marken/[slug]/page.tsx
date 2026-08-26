import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ArrowRight } from '@/components/icons'
import { BrandCard } from '@/components/marketing/BrandCard'
import { BrandVisual } from '@/components/marketing/BrandVisual'
import { PageMasthead } from '@/components/marketing/PageMasthead'
import { JsonLd } from '@/components/seo/JsonLd'
import { RichText } from '@/components/richtext/RichText'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PlatformBadge } from '@/components/ui/PlatformBadge'
import { Link } from '@/i18n/navigation'
import { CATEGORY_LABEL } from '@/lib/categories'
import { webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { getBrandBySlug } from '@/lib/queries/getBrandBySlug'
import { getBrands } from '@/lib/queries/getBrands'
import { canonicalUrl, pageMetadata } from '@/lib/seo'

type Params = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params
  const brand = await getBrandBySlug(slug, locale as Locale)
  if (!brand) return {}
  return pageMetadata({
    locale,
    path: `/marken/${slug}`,
    title: brand.name,
    description: brand.tagline ?? undefined,
  })
}

export default async function BrandDetailPage({ params }: Params) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Brands' })

  const brand = await getBrandBySlug(slug, locale as Locale)
  if (!brand) notFound()

  const others = (await getBrands(locale as Locale)).filter((b) => b.slug !== slug).slice(0, 3)
  const extraShots = (brand.screenshots ?? []).slice(1, 5)

  return (
    <div style={{ '--brand-accent': brand.accentColor } as CSSProperties}>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(locale, `/marken/${slug}`),
            name: brand.name,
            description: brand.tagline ?? undefined,
            lang: locale as Locale,
          }),
        ]}
      />
      <PageMasthead
        eyebrow={`${t('detailEyebrow')} · ${CATEGORY_LABEL[brand.category] ?? brand.category}`}
        title={brand.name}
        subtitle={brand.tagline ?? undefined}
      />

      <section className="bg-paper py-16 sm:py-24">
        <Container className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <BrandVisual brand={brand} />
            {extraShots.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {extraShots.map((s, i) => {
                  const img = s.image
                  if (!img || typeof img !== 'object' || !img.url) return null
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img.url}
                      alt={img.alt ?? brand.name}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                  )
                })}
              </div>
            )}
          </div>

          <div>
            {brand.platforms && brand.platforms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {brand.platforms.map((p) => (
                  <PlatformBadge key={p} platform={p} />
                ))}
              </div>
            )}

            <div className="mt-6">
              <RichText data={brand.description} />
            </div>

            {brand.links && brand.links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {brand.links.map((l, i) => (
                  <Button
                    key={i}
                    href={l.url}
                    external
                    withArrow
                    variant={i === 0 ? 'primary' : 'outline'}
                    tone="light"
                  >
                    {l.label || t('visit')}
                  </Button>
                ))}
              </div>
            )}

            <div className="mt-10">
              <Link
                href="/marken"
                className="inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                {t('backToOverview')}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="bg-paper-2 py-20">
          <Container>
            <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">{t('otherBrands')}</h2>
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((b) => (
                <BrandCard key={b.id} brand={b} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  )
}
