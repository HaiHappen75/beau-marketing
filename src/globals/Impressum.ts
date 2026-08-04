import type { GlobalConfig } from 'payload'

/**
 * RETIRED — the imprint now comes from the eRecht24 Project Manager
 * (src/lib/erecht24.ts). Kept, not deleted: the old wording stays available for
 * reference, and dropping a global would mean a schema migration for nothing.
 */
export const Impressum: GlobalConfig = {
  slug: 'impressum',
  label: 'Impressum (stillgelegt)',
  admin: {
    group: 'Rechtliches',
    description:
      'Wird nicht mehr ausgespielt. Der Text kommt automatisch aus dem eRecht24 Project Manager — Änderungen bitte dort vornehmen. Dieser Eintrag bleibt nur als Archiv bestehen.',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true, defaultValue: 'Impressum' },
    { name: 'content', type: 'richText', localized: true },
    { name: 'lastUpdated', type: 'date', admin: { description: 'Stand der letzten Änderung.' } },
  ],
}
