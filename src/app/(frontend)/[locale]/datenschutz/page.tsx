import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { PageMasthead } from '@/components/marketing/PageMasthead'
import { RichText } from '@/components/richtext/RichText'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/locale'
import { getDatenschutz } from '@/lib/queries/getLegal'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const data = await getDatenschutz(locale as Locale)
  return pageMetadata({ locale, path: '/datenschutz', title: data.title || 'Datenschutz' })
}

export default async function DatenschutzPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const data = await getDatenschutz(locale as Locale)

  return (
    <>
      <PageMasthead title={data.title || 'Datenschutz'} />
      <section className="bg-paper py-16 sm:py-24">
        <Container className="max-w-3xl">
          {data.content ? (
            <RichText data={data.content} />
          ) : (
            <p className="text-ink-soft">Dieser Inhalt wird über das CMS gepflegt.</p>
          )}
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
