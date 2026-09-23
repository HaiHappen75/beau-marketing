import type { GlobalConfig } from 'payload'

import { anyone, isEditor } from '../access'

/**
 * Trust bar (start page + footer). The SH partner badge is mandatory, must stay
 * unchanged and link to partner-sh.de (partner programme terms). Shopify badge
 * and Google reviews render only with real values.
 */
export const Trust: GlobalConfig = {
  slug: 'trust',
  label: 'Trust-Leiste',
  admin: { group: 'Konfiguration' },
  access: { read: anyone, update: isEditor },
  fields: [
    {
      name: 'badges',
      label: 'Siegel',
      type: 'array',
      labels: { singular: 'Siegel', plural: 'Siegel' },
      admin: { description: 'SH-Partner „Der echte Norden“ ist Pflicht und verlinkt auf https://partner-sh.de.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'href', label: 'Link', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'image', label: 'Datei', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'serverNote',
      label: 'Hinweis Serverstandort',
      type: 'text',
      localized: true,
      admin: { description: 'Nur für Payload-Websites zutreffend, nicht für Shopify.' },
    },
    {
      name: 'shopifyBadge',
      label: 'Shopify-Partner-Siegel',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Erst nach Anlage des Partnerkontos. Leer = kein Siegel, kein Platzhalter.' },
    },
    {
      name: 'googleReviews',
      label: 'Google-Bewertungen',
      type: 'group',
      fields: [
        {
          name: 'show',
          label: 'anzeigen',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Nur mit echten Werten aus dem Google-Unternehmensprofil.' },
        },
        {
          type: 'row',
          fields: [
            { name: 'rating', label: 'Durchschnitt', type: 'number', min: 1, max: 5, admin: { width: '50%' } },
            { name: 'count', label: 'Anzahl', type: 'number', min: 0, admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
}
