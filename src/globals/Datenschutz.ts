import type { GlobalConfig } from 'payload'

export const Datenschutz: GlobalConfig = {
  slug: 'datenschutz',
  label: 'Datenschutz',
  admin: { group: 'Rechtliches' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true, defaultValue: 'Datenschutz' },
    { name: 'content', type: 'richText', localized: true },
    { name: 'lastUpdated', type: 'date', admin: { description: 'Stand der letzten Änderung.' } },
  ],
}
