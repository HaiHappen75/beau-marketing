'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LocaleSwitcher({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const pathname = usePathname()
  const active = useLocale()

  const idle = tone === 'light' ? 'text-paper/55 hover:text-paper' : 'text-ink/45 hover:text-ink'
  const current = tone === 'light' ? 'text-paper' : 'text-ink'

  return (
    <nav aria-label="Sprache" className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className={tone === 'light' ? 'text-paper/25' : 'text-ink/20'}>·</span>}
          <Link
            href={pathname}
            locale={loc}
            aria-current={loc === active ? 'true' : undefined}
            className={`rounded px-1 py-0.5 transition-colors ${loc === active ? current : idle}`}
          >
            {loc}
          </Link>
        </span>
      ))}
    </nav>
  )
}
