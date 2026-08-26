import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { AboutTeaser } from '@/components/marketing/AboutTeaser'
import { BrandShowcase } from '@/components/marketing/BrandShowcase'
import { ContactCta } from '@/components/marketing/ContactCta'
import { Hero } from '@/components/marketing/Hero'
import { JsonLd } from '@/components/seo/JsonLd'
import { StudioSection } from '@/components/marketing/StudioSection'
import { WhatWeDo } from '@/components/marketing/WhatWeDo'
import { webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { getBrands } from '@/lib/queries/getBrands'
import { canonicalUrl, pageMetadata } from '@/lib/seo'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'Meta' })
  return pageMetadata({
    locale,
    path: '',
    title: t('homeTitle'),
    description: t('homeDescription'),
    absoluteTitle: true,
  })
}

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  // Same namespace generateMetadata reads — next-intl caches per request.
  const t = await getTranslations({ locale, namespace: 'Meta' })
  const brands = await getBrands(locale as Locale)

  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(locale, ''),
            name: t('homeTitle'),
            description: t('homeDescription'),
            lang: locale as Locale,
          }),
        ]}
      />
      <Hero locale={locale as Locale} brandNames={brands.map((b) => b.name)} />
      <WhatWeDo locale={locale as Locale} />
      <BrandShowcase brands={brands} locale={locale as Locale} />
      <StudioSection locale={locale as Locale} />
      <AboutTeaser locale={locale as Locale} />
      <ContactCta locale={locale as Locale} />
    </>
  )
}
