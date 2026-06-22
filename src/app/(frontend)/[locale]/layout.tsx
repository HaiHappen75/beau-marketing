import type { Metadata } from 'next'
import { Bricolage_Grotesque, Roboto } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/lib/locale'
import { SITE_URL } from '@/lib/seo'
import { getBrands } from '@/lib/queries/getBrands'
import { getSiteSettings } from '@/lib/queries/getSiteSettings'
import '@/styles/globals.css'

// Effra placeholder until the licensed font files land — a characterful grotesk for display.
const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700', '800'],
  variable: '--font-display-src',
  display: 'swap',
})

const body = Roboto({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  variable: '--font-body-src',
  display: 'swap',
})

// CMS-driven: render on request so Payload edits go live instantly — and so the
// production image builds without needing a database connection.
export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'Meta' })
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('homeTitle'), template: '%s — Beau-Marketing' },
    description: t('homeDescription'),
  }
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const [settings, brands] = await Promise.all([
    getSiteSettings(locale as Locale),
    getBrands(locale as Locale),
  ])

  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:text-paper"
          >
            Zum Inhalt springen
          </a>
          <Header settings={settings} brands={brands} locale={locale as Locale} />
          <main id="main">{props.children}</main>
          <Footer settings={settings} locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
