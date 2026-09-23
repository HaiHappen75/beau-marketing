import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { JsonLd } from '@/components/seo/JsonLd'
import { routing } from '@/i18n/routing'
import { siteGraph } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { SITE_URL } from '@/lib/seo'
import { getBrands } from '@/lib/queries/getBrands'
import '@/styles/globals.css'

// Nunito Sans (SIL OFL, src/app/fonts/OFL.txt), self-hosted — no request to
// Google. Variable weight axis, upright + italic; the latin subset covers
// German, Danish and English including „“, – and €.
const nunito = localFont({
  src: [
    { path: '../../fonts/NunitoSans-latin-wght-normal.woff2', weight: '200 1000', style: 'normal' },
    { path: '../../fonts/NunitoSans-latin-wght-italic.woff2', weight: '200 1000', style: 'italic' },
  ],
  variable: '--font-nunito',
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
    title: { default: t('homeTitle'), template: '%s | beau marketing' },
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

  const brands = await getBrands(locale as Locale)
  const t = await getTranslations({ locale, namespace: 'Layout' })

  return (
    <html lang={locale} className={nunito.variable}>
      <body>
        {/* Sitewide graph: Organization + Brands + WebSite. Every public page carries
            it, so the per-page WebPage node's isPartOf/publisher references resolve.
            Route group (payload) has its own layout — /admin and /api get nothing. */}
        <JsonLd graph={siteGraph(brands)} />
        <NextIntlClientProvider>
          <a href="#main" className="btn sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]">
            {t('skipToContent')}
          </a>
          <Header locale={locale as Locale} />
          <main id="main">{props.children}</main>
          <Footer locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
