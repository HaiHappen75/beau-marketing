import { getTranslations } from 'next-intl/server'

import { Check } from '@/components/icons'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import type { Locale } from '@/lib/locale'

function Track({
  label,
  title,
  body,
  points,
  featured = false,
}: {
  label: string
  title: string
  body: string
  points: string[]
  featured?: boolean
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-card border p-8 sm:p-10 ${
        featured
          ? 'border-transparent bg-petrol text-paper shadow-[0_30px_80px_-40px_rgba(0,73,89,0.6)]'
          : 'border-line bg-paper-2 text-ink'
      }`}
    >
      <span className={`eyebrow ${featured ? 'text-accent-soft' : 'text-accent'}`}>{label}</span>
      <h3 className="mt-4 text-2xl font-bold sm:text-[1.7rem]">{title}</h3>
      <p className={`mt-4 leading-relaxed ${featured ? 'text-paper/70' : 'text-ink-soft'}`}>{body}</p>
      <ul className="mt-8 flex flex-col gap-3">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-3">
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                featured ? 'bg-accent text-white' : 'bg-petrol/10 text-petrol'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className={featured ? 'text-paper/90' : 'text-ink'}>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function WhatWeDo({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'WhatWeDo' })

  return (
    <section className="bg-paper py-24 sm:py-32">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-balance text-4xl font-extrabold sm:text-5xl">{t('title')}</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-5">
          <Reveal className="md:col-span-3" delay={0.05}>
            <Track
              featured
              label={t('brandHouse.label')}
              title={t('brandHouse.title')}
              body={t('brandHouse.body')}
              points={t.raw('brandHouse.points') as string[]}
            />
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.12}>
            <Track
              label={t('studio.label')}
              title={t('studio.title')}
              body={t('studio.body')}
              points={t.raw('studio.points') as string[]}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
