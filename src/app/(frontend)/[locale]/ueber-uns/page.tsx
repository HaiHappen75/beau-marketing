import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ContactCta } from '@/components/marketing/ContactCta'
import { PageMasthead } from '@/components/marketing/PageMasthead'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'About' })
  return pageMetadata({ locale, path: '/ueber-uns', title: t('eyebrow'), description: t('body') })
}

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'About' })

  const pillars = ['e-Commerce', 'Software-as-a-Service', 'Apps (iOS · Android · macOS)']

  return (
    <>
      <PageMasthead eyebrow={t('eyebrow')} title={t('title')} />
      <section className="bg-paper py-16 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-xl leading-relaxed text-ink-soft">{t('body')}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {pillars.map((p) => (
                <div key={p} className="rounded-card border border-line bg-paper-2 p-6">
                  <div className="h-1 w-8 rounded-full bg-accent" />
                  <p className="mt-4 font-display text-lg font-bold">{p}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>
      <ContactCta locale={locale as Locale} />
    </>
  )
}
