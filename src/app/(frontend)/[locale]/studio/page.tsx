import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ContactCta } from '@/components/marketing/ContactCta'
import { PageMasthead } from '@/components/marketing/PageMasthead'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/locale'
import { pageMetadata } from '@/lib/seo'

type Service = { title: string; body: string }

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'Studio' })
  return pageMetadata({ locale, path: '/studio', title: t('eyebrow'), description: t('subtitle') })
}

export default async function StudioPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Studio' })
  const services = (t.raw('services') as Service[]) ?? []

  return (
    <>
      <PageMasthead eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
      <section className="bg-paper py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="h-full rounded-card border border-line bg-paper-2 p-8">
                  <div className="h-1 w-10 rounded-full bg-accent" />
                  <h2 className="mt-5 text-xl font-bold">{s.title}</h2>
                  <p className="mt-2 leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <ContactCta locale={locale as Locale} />
    </>
  )
}
