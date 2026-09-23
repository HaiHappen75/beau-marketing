import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { PageMasthead } from '@/components/marketing/PageMasthead'
import { JsonLd } from '@/components/seo/JsonLd'
import { RichText } from '@/components/richtext/RichText'
import { Container } from '@/components/ui/Container'
import { webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { getAGB, hasContent } from '@/lib/queries/getLegalDocs'
import { canonicalUrl, localeAlternates, pageMetadata } from '@/lib/seo'
import { translatedGlobalLocales } from '@/lib/translations'

// Maintained in Payload, not pulled from eRecht24 — their API only serves
// imprint and privacy policy. Empty global = no page, so an unfilled draft
// never goes live as a blank legal page.
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'Footer' })
  const data = await getAGB(locale as Locale)
  // Localized with fallback: only locales with their own text are real versions.
  const available = await translatedGlobalLocales('agb', 'content')
  return pageMetadata({
    locale,
    path: '/agb',
    title: data.title || t('agb'),
    alternates: localeAlternates('/agb', available, locale).alternates,
  })
}

export default async function AGBPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Footer' })
  const data = await getAGB(locale as Locale)

  if (!hasContent(data)) notFound()

  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(localeAlternates('/agb', await translatedGlobalLocales('agb', 'content'), locale).servedLang, '/agb'),
            name: data.title || t('agb'),
            lang: locale as Locale,
          }),
        ]}
      />
      <PageMasthead eyebrow={t('legal')} title={data.title || t('agb')} />
      <section className="bg-paper py-16 sm:py-24">
        <Container className="max-w-3xl">
          <RichText data={data.content} />
          {data.lastUpdated && (
            <p className="mt-12 text-sm text-ink/40">
              Stand: {new Date(data.lastUpdated).toLocaleDateString(locale)}
            </p>
          )}
        </Container>
      </section>
    </>
  )
}
