import type { Metadata } from 'next'

import { stripEmphasis } from '@/lib/emphasis'
import { localeAlternates, pageMetadata } from '@/lib/seo'

type Meta = { title?: string | null; description?: string | null; image?: unknown } | null | undefined

/** Metadata from the SEO plugin fields with sensible fallbacks. */
export function cmsMetadata(args: {
  locale: string
  path: string
  meta: Meta
  fallbackTitle: string
  fallbackDescription?: string | null
  absoluteTitle?: boolean
  /** Locales with a real translation — drives canonical/hreflang (fallback concept). */
  available?: string[]
}): Metadata {
  const title = stripEmphasis(args.meta?.title || args.fallbackTitle)
  const description = args.meta?.description || args.fallbackDescription || undefined
  return pageMetadata({
    locale: args.locale,
    path: args.path,
    title,
    description,
    absoluteTitle: args.absoluteTitle,
    alternates: args.available ? localeAlternates(args.path, args.available, args.locale).alternates : undefined,
  })
}
