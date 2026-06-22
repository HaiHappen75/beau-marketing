import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/locale'

type Service = { title: string; body: string }

export async function StudioSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Studio' })
  const services = (t.raw('services') as Service[]) ?? []

  return (
    <section id="studio" className="stage grain relative scroll-mt-24 overflow-hidden py-24 text-paper sm:py-32">
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="eyebrow text-accent-soft">{t('eyebrow')}</p>
            <h2 className="mt-4 text-balance text-4xl font-extrabold sm:text-5xl">{t('title')}</h2>
            <p className="mt-5 max-w-md text-lg text-paper/70">{t('subtitle')}</p>
            <div className="mt-8">
              <Button href="/kontakt" variant="primary" withArrow>
                {t('cta')}
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-px overflow-hidden rounded-card border border-line-dark bg-line-dark">
              {services.map((s) => (
                <div key={s.title} className="bg-petrol p-7 transition-colors hover:bg-petrol-700">
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-paper/65">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
