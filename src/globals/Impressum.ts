import type { GlobalConfig } from 'payload'

export const Impressum: GlobalConfig = {
  slug: 'impressum',
  label: 'Impressum',
  admin: { group: 'Rechtliches' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true, defaultValue: 'Impressum' },
    { name: 'content', type: 'richText', localized: true },
    { name: 'lastUpdated', type: 'date', admin: { description: 'Stand der letzten Änderung.' } },
  ],
}
