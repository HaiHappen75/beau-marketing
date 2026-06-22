import { getTranslations } from 'next-intl/server'

import { Marquee } from '@/components/motion/Marquee'
import { RotatingWord } from '@/components/motion/RotatingWord'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/locale'

export async function Hero({ locale, brandNames }: { locale: Locale; brandNames: string[] }) {
  const t = await getTranslations({ locale, namespace: 'Hero' })
  const words = (t.raw('rotating') as string[]) ?? []

  return (
    <section className="stage grain relative isolate flex min-h-dvh flex-col justify-between overflow-hidden text-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="drift absolute -left-24 top-4 h-[34rem] w-[34rem] rounded-full bg-petrol-700/45 blur-[130px]" />
        <div
          className="drift absolute -right-28 bottom-0 h-[30rem] w-[30rem] rounded-full bg-accent/25 blur-[130px]"
          style={{ animationDelay: '-7s' }}
        />
      </div>

      <Container className="flex flex-1 flex-col justify-center pb-16 pt-32 sm:pt-40">
        <p className="eyebrow text-accent-soft">{t('eyebrow')}</p>
        <h1 className="mt-6 text-[clamp(2.75rem,8.5vw,7rem)] font-extrabold leading-[0.95] tracking-tight">
          <span className="sr-only">
            {t('titleLead')} {words[0]} {t('titleTail')}
          </span>
          <span aria-hidden>
            {t('titleLead')} <RotatingWord words={words} />
            <br />
            {t('titleTail')}
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/70 sm:text-xl">
          {t('subtitle')}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/marken" variant="primary" withArrow>
            {t('ctaPrimary')}
          </Button>
          <Button href="/studio" variant="outline" tone="dark">
            {t('ctaSecondary')}
          </Button>
        </div>
      </Container>

      <div className="relative border-t border-line-dark py-6">
        <Marquee
          items={
            brandNames.length
              ? brandNames
              : ['Fjella', 'Family Manager', 'ThingR', 'Anwurf', 'Huusbook']
          }
        />
      </div>
    </section>
  )
}
