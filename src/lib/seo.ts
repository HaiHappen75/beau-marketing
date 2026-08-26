import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

// Public base URL for every absolute link the frontend emits — canonicals,
// hreflang, sitemap, robots and the @id anchors of the JSON-LD graph.
// Same NODE_ENV-dependent fallback as the Payload serverURL (src/payload.config.ts):
// the Dockerfile declares NEXT_PUBLIC_SERVER_URL only in the builder stage, so unless
// Coolify also injects it at RUNTIME the server boots without it. A plain localhost
// default would then leak into every canonical and every JSON-LD @id in production.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://beau-marketing.de' : 'http://localhost:3000')

/**
 * Self-canonical of a page. One source for <link rel="canonical"> and the JSON-LD
 * `@id`/`url` — the two must never drift apart, or the graph anchors point at URLs
 * that do not exist.
 */
export const canonicalUrl = (locale: string, path: string) => `${SITE_URL}/${locale}${path}`

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
  return { canonical: canonicalUrl(servedLang, path), languages }
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
    canonical: canonicalUrl(locale, path),
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
