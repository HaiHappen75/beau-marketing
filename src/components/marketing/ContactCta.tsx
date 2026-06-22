import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/locale'
import { getSiteSettings } from '@/lib/queries/getSiteSettings'

export async function ContactCta({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Contact' })
  const settings = await getSiteSettings(locale)
  const email = settings?.contact?.email || 's.beau@beau-marketing.de'

  return (
    <section id="kontakt" className="scroll-mt-24 bg-paper py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="stage grain relative overflow-hidden rounded-card px-8 py-16 text-paper sm:px-16 sm:py-24">
            <p className="eyebrow text-accent-soft">{t('eyebrow')}</p>
            <h2 className="mt-4 max-w-2xl text-balance text-4xl font-extrabold sm:text-6xl">
              {t('title')}
            </h2>
            <p className="mt-5 max-w-md text-lg text-paper/70">{t('subtitle')}</p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Button href={`mailto:${email}`} variant="primary" withArrow>
                {t('emailCta')}
              </Button>
              <a href={`mailto:${email}`} className="link-sweep text-paper/80 hover:text-paper">
                {email}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
