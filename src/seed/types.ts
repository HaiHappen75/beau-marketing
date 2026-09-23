export type SeedLocale = 'de' | 'en' | 'da'

export type LegacyEvent = {
  doc: string
  field: string
  locale?: SeedLocale
  from: string
  /** null = the legacy value was cleared, nothing replaced it. */
  to: string | null
}

export type CollectionSummary = {
  created: string[]
  filled: string[]
  skipped: string[]
  /** "doc · field (locale)" for every field that was empty and got filled. */
  filledFields: string[]
  legacyReplaced: LegacyEvent[]
}

export type SeedSummary = Record<string, CollectionSummary>
