'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { localeLabels, type Locale } from '@/lib/locale'

// Display order of the design: de · da · en.
const ORDER: Locale[] = ['de', 'da', 'en']

/** Links to the same page in the other languages. `buttons` = the mobile variant with 44 px targets. */
export function LanguageSwitcher({ variant = 'inline' }: { variant?: 'inline' | 'buttons' }) {
  const t = useTranslations('Layout')
  const current = useLocale() as Locale
  const pathname = usePathname()

  return (
    <div role="group" aria-label={t('language')} className="flex items-center">
      {ORDER.map((code, i) => {
        const active = code === current
        if (variant === 'buttons') {
          return (
            <Link
              key={code}
              href={pathname}
              locale={code}
              hrefLang={code}
              lang={code}
              aria-label={localeLabels[code]}
              aria-current={active ? 'true' : undefined}
              className={`mr-1 inline-flex min-h-11 min-w-12 items-center justify-center rounded-[3px] border text-base no-underline ${
                active ? 'border-ink font-extrabold text-ink' : 'border-line font-medium text-muted'
              }`}
            >
              {code}
            </Link>
          )
        }
        return (
          <span key={code} className="flex items-center">
            {i > 0 && (
              <span aria-hidden="true" className="text-sm text-muted">
                ·
              </span>
            )}
            <Link
              href={pathname}
              locale={code}
              hrefLang={code}
              lang={code}
              aria-label={localeLabels[code]}
              aria-current={active ? 'true' : undefined}
              className={`px-1.5 py-1.5 text-[15px] underline decoration-2 underline-offset-[5px] ${
                active ? 'font-extrabold text-ink decoration-accent' : 'font-medium text-muted decoration-transparent'
              }`}
            >
              {code}
            </Link>
          </span>
        )
      })}
    </div>
  )
}
