import type { Field } from 'payload'

/** Slugify with German/Danish transliteration so URLs stay clean across locales. */
const toSlug = (val: string): string =>
  val
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const slugField = (source = 'name'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'URL-Pfad. Wird aus dem Namen erzeugt, kann überschrieben werden.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim().length > 0) return toSlug(value)
        const src = data?.[source]
        if (typeof src === 'string' && src.trim().length > 0) return toSlug(src)
        return value
      },
    ],
  },
})
