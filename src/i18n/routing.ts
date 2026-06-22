import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['de', 'en', 'da'],
  defaultLocale: 'de',
  // Every locale is explicit in the URL: /de, /en, /da
  localePrefix: 'always',
})
