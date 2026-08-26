import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { PageMasthead } from '@/components/marketing/PageMasthead'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { getSiteSettings } from '@/lib/queries/getSiteSettings'
import { canonicalUrl, pageMetadata } from '@/lib/seo'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'Contact' })
  return pageMetadata({ locale, path: '/kontakt', title: t('eyebrow'), description: t('subtitle') })
}

export default async function KontaktPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Contact' })
  const settings = await getSiteSettings(locale as Locale)

  const email = settings?.contact?.email || 's.beau@beau-marketing.de'
  const phone = settings?.contact?.phone
  const address = settings?.contact?.address

  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(locale, '/kontakt'),
            name: t('eyebrow'),
            description: t('subtitle'),
            lang: locale as Locale,
          }),
        ]}
      />
      <PageMasthead eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
      <section className="bg-paper py-16 sm:py-24">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow text-accent">{t('labelEmail')}</p>
            <a
              href={`mailto:${email}`}
              className="link-sweep mt-3 block font-display text-2xl font-bold sm:text-3xl"
            >
              {email}
            </a>
            <div className="mt-8">
              <Button href={`mailto:${email}`} variant="primary" withArrow>
                {t('emailCta')}
              </Button>
            </div>
          </div>
          <div className="space-y-8">
            {phone && (
              <div>
                <p className="eyebrow text-accent">{t('labelPhone')}</p>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="link-sweep mt-2 block text-lg">
                  {phone}
                </a>
              </div>
            )}
            {address && (
              <div>
                <p className="eyebrow text-accent">{t('labelAddress')}</p>
                <p className="mt-2 whitespace-pre-line text-lg leading-relaxed text-ink-soft">
                  {address}
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
