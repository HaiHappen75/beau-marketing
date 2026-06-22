import type { TypedLocale } from 'payload'
import { routing } from '@/i18n/routing'

export type Locale = (typeof routing.locales)[number]

export const localeLabels: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  da: 'Dansk',
}

/** next-intl locale codes are 1:1 with Payload locale codes; single chokepoint if that ever changes. */
export const toPayloadLocale = (locale: string): TypedLocale => locale as TypedLocale
