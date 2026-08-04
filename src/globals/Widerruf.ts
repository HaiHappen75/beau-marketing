import type { GlobalConfig } from 'payload'

/**
 * Right-of-withdrawal notice. Unlike Impressum and Datenschutz this text is NOT
 * available through the eRecht24 API (it only serves imprint, privacyPolicy and
 * privacyPolicySocialMedia), so it is maintained here. Paste the generator
 * output in and keep the wording untouched.
 */
export const Widerruf: GlobalConfig = {
  slug: 'widerruf',
  label: 'Widerrufsbelehrung',
  admin: {
    group: 'Rechtliches',
    description:
      'Wird unter /widerrufsbelehrung ausgespielt und im Footer verlinkt. Bleibt der Inhalt leer, versteckt sich der Footer-Link von selbst.',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true, defaultValue: 'Widerrufsbelehrung' },
    { name: 'content', type: 'richText', localized: true },
    { name: 'lastUpdated', type: 'date', admin: { description: 'Stand der letzten Änderung.' } },
  ],
}
