import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/locale'

export async function AboutTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'About' })

  return (
    <section id="ueber-uns" className="scroll-mt-24 bg-paper-2 py-24 sm:py-32">
      <Container>
        <Reveal className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:items-start">
          <p className="eyebrow pt-2 text-accent">{t('eyebrow')}</p>
          <div>
            <h2 className="text-balance text-3xl font-extrabold leading-tight sm:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{t('body')}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
