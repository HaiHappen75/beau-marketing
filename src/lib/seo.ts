import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** hreflang alternates map for a locale-agnostic path (e.g. '' or '/marken/fjella'). */
export function buildLanguageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`
  }
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`
  return languages
}

export function pageMetadata(args: {
  locale: string
  path: string
  title: string
  description?: string
  images?: string[]
  /** Use the title verbatim (skip the layout's "%s — Beau-Marketing" template). */
  absoluteTitle?: boolean
}): Metadata {
  const { locale, path, title, description, images, absoluteTitle } = args
  const canonical = `${SITE_URL}/${locale}${path}`
  return {
    metadataBase: new URL(SITE_URL),
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages: buildLanguageAlternates(path) },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Beau-Marketing',
      locale,
      type: 'website',
      ...(images ? { images } : {}),
    },
  }
}
