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

/**
 * Alternates for pages that do not exist in every locale — the legal texts.
 * eRecht24 delivers German and, if maintained, English; Danish it does not have.
 * A locale that gets served someone else's language therefore points its
 * canonical at the locale that actually owns that text, and hreflang lists only
 * the languages that genuinely exist. Otherwise Google sees three URLs claiming
 * three languages for one German document.
 */
export function legalAlternates(args: {
  path: string
  /** Language actually rendered on this URL. */
  servedLang: 'de' | 'en'
  /** Languages the text exists in at all. */
  availableLangs: Array<'de' | 'en'>
}): NonNullable<Metadata['alternates']> {
  const { path, servedLang, availableLangs } = args
  const languages: Record<string, string> = {}
  for (const lang of availableLangs) {
    languages[lang] = `${SITE_URL}/${lang}${path}`
  }
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`
  return { canonical: `${SITE_URL}/${servedLang}${path}`, languages }
}

export function pageMetadata(args: {
  locale: string
  path: string
  title: string
  description?: string
  images?: string[]
  /** Use the title verbatim (skip the layout's "%s — Beau-Marketing" template). */
  absoluteTitle?: boolean
  /** Replaces the default self-canonical + all-locale hreflang (see legalAlternates). */
  alternates?: NonNullable<Metadata['alternates']>
}): Metadata {
  const { locale, path, title, description, images, absoluteTitle } = args
  const alternates = args.alternates ?? {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: buildLanguageAlternates(path),
  }
  const canonical = String(alternates.canonical)
  return {
    metadataBase: new URL(SITE_URL),
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
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
