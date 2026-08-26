import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { SanitizedLegalHtml } from '@/components/legal/SanitizedLegalHtml'
import { PageMasthead } from '@/components/marketing/PageMasthead'
import { JsonLd } from '@/components/seo/JsonLd'
import { Container } from '@/components/ui/Container'
import { getWebsiteLegalText } from '@/lib/erecht24'
import { webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { canonicalUrl, legalAlternates, pageMetadata } from '@/lib/seo'

// Privacy policy — pulled from the eRecht24 Project Manager (live fetch with
// data-cache tag + push webhook, snapshot as fallback; see src/lib/erecht24.ts).
// The former Payload global `datenschutz` is retired and no longer read.
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'Footer' })
  const legal = await getWebsiteLegalText('privacyPolicy', locale as Locale)
  return pageMetadata({
    locale,
    path: '/datenschutz',
    title: t('datenschutz'),
    alternates: legalAlternates({
      path: '/datenschutz',
      servedLang: legal.lang,
      availableLangs: legal.availableLangs,
    }),
  })
}

export default async function DatenschutzPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Footer' })
  const legal = await getWebsiteLegalText('privacyPolicy', locale as Locale)

  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(legal.lang, '/datenschutz'),
            name: t('datenschutz'),
            lang: legal.lang,
          }),
        ]}
      />
      {/* No title when the text brings its own <h1> — exactly one per page. */}
      <PageMasthead eyebrow={t('legal')} title={legal.hasH1 ? undefined : t('datenschutz')} />
      <section className="bg-paper py-16 sm:py-24">
        <Container className="max-w-3xl">
          <SanitizedLegalHtml legal={legal} />
        </Container>
      </section>
    </>
  )
}
