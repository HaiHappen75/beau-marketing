import type { Field, GlobalConfig } from 'payload'

import { anyone, isEditor } from '../access'

// Header and footer links. The "Agentur" mega menu is not maintained here — it
// lists the published services automatically.
const linkRow: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'label', label: 'Text', type: 'text', localized: true, required: true, admin: { width: '50%' } },
      {
        name: 'href',
        label: 'Pfad',
        type: 'text',
        required: true,
        admin: { width: '50%', description: 'Ohne Sprachpräfix, z. B. /referenzen' },
      },
    ],
  },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: { group: 'Konfiguration' },
  access: { read: anyone, update: isEditor },
  fields: [
    {
      name: 'header',
      label: 'Hauptnavigation',
      type: 'array',
      labels: { singular: 'Menüpunkt', plural: 'Menüpunkte' },
      admin: { description: 'Nach dem Menüpunkt „Agentur“ (Leistungen, automatisch).' },
      fields: linkRow,
    },
    {
      name: 'footerLegal',
      label: 'Footer: Rechtliches',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      fields: linkRow,
    },
  ],
}
