import type { CSSProperties } from 'react'

import { ArrowUpRight } from '@/components/icons'
import { CATEGORY_LABEL } from '@/lib/categories'
import { Link } from '@/i18n/navigation'
import type { Brand } from '@/payload-types'
import { BrandVisual } from './BrandVisual'

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/marken/${brand.slug}`}
      className="group flex flex-col"
      style={{ '--brand-accent': brand.accentColor } as CSSProperties}
    >
      <BrandVisual brand={brand} className="transition-transform duration-300 group-hover:-translate-y-1.5" />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow" style={{ color: 'var(--brand-accent)' }}>
            {CATEGORY_LABEL[brand.category] ?? brand.category}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{brand.name}</h3>
          {brand.tagline && <p className="mt-1 text-ink-soft">{brand.tagline}</p>}
        </div>
        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-ink/40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--brand-accent)]" />
      </div>
    </Link>
  )
}
