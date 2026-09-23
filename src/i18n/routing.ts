import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['de', 'en', 'da'],
  defaultLocale: 'de',
  // Every locale is explicit in the URL: /de, /en, /da
  localePrefix: 'always',
  // Deterministic: / and unprefixed paths always go to /de (x-default). With
  // Accept-Language detection the target would vary per visitor — incompatible
  // with a permanent (308) redirect that browsers cache.
  localeDetection: false,
})
