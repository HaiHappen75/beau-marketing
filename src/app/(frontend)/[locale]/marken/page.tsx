import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { BrandCard } from '@/components/marketing/BrandCard'
import { PageMasthead } from '@/components/marketing/PageMasthead'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/locale'
import { getBrands } from '@/lib/queries/getBrands'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'Brands' })
  return pageMetadata({ locale, path: '/marken', title: t('indexTitle'), description: t('indexSubtitle') })
}

export default async function BrandsIndexPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Brands' })
  const brands = await getBrands(locale as Locale)

  return (
    <>
      <PageMasthead eyebrow={t('eyebrow')} title={t('indexTitle')} subtitle={t('indexSubtitle')} />
      <section className="bg-paper py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((b) => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
