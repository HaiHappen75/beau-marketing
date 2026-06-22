import type { CSSProperties } from 'react'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PlatformBadge } from '@/components/ui/PlatformBadge'
import { CATEGORY_LABEL } from '@/lib/categories'
import type { Locale } from '@/lib/locale'
import type { Brand } from '@/payload-types'
import { BrandVisual } from './BrandVisual'

function BrandRow({
  brand,
  index,
  exploreLabel,
}: {
  brand: Brand
  index: number
  exploreLabel: string
}) {
  const reversed = index % 2 === 1
  return (
    <Reveal>
      <div
        className="grid items-center gap-8 md:grid-cols-2 md:gap-16"
        style={{ '--brand-accent': brand.accentColor } as CSSProperties}
      >
        <div className={reversed ? 'md:order-2' : ''}>
          <BrandVisual brand={brand} />
        </div>
        <div className={reversed ? 'md:order-1' : ''}>
          <p className="eyebrow" style={{ color: 'var(--brand-accent)' }}>
            {CATEGORY_LABEL[brand.category] ?? brand.category}
          </p>
          <h3 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {brand.name}
          </h3>
          {brand.tagline && <p className="mt-4 max-w-md text-lg text-ink-soft">{brand.tagline}</p>}
          {brand.platforms && brand.platforms.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {brand.platforms.map((p) => (
                <PlatformBadge key={p} platform={p} />
              ))}
            </div>
          )}
          <div className="mt-7">
            <Button href={`/marken/${brand.slug}`} variant="ghost" withArrow>
              {exploreLabel}
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export async function BrandShowcase({ brands, locale }: { brands: Brand[]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Brands' })

  return (
    <section id="marken" className="scroll-mt-24 bg-paper py-24 sm:py-32">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-balance text-4xl font-extrabold sm:text-6xl">{t('title')}</h2>
          <p className="mt-5 text-lg text-ink-soft">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {brands.map((b, i) => (
            <BrandRow key={b.id} brand={b} index={i} exploreLabel={t('explore')} />
          ))}
        </div>
      </Container>
    </section>
  )
}
