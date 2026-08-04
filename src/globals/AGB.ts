import type { GlobalConfig } from 'payload'

/**
 * Terms and conditions. Not offered by the eRecht24 API either (see Widerruf),
 * so the wording is maintained here.
 */
export const AGB: GlobalConfig = {
  slug: 'agb',
  label: 'AGB',
  admin: {
    group: 'Rechtliches',
    description:
      'Wird unter /agb ausgespielt und im Footer verlinkt. Bleibt der Inhalt leer, versteckt sich der Footer-Link von selbst.',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true, defaultValue: 'AGB' },
    { name: 'content', type: 'richText', localized: true },
    { name: 'lastUpdated', type: 'date', admin: { description: 'Stand der letzten Änderung.' } },
  ],
}
