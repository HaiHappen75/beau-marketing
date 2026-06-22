import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Website-Einstellungen',
  admin: { group: 'Konfiguration' },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Allgemein',
          fields: [
            { name: 'siteName', type: 'text', defaultValue: 'Beau-Marketing' },
            { name: 'tagline', type: 'text', localized: true, admin: { description: 'Untertitel / Claim der Marke.' } },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'nav',
              type: 'array',
              labels: { singular: 'Menüpunkt', plural: 'Menüpunkte' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', localized: true, required: true, admin: { width: '50%' } },
                    { name: 'href', type: 'text', required: true, admin: { width: '50%', description: 'z. B. /marken' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Kontakt & Social',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                { name: 'email', type: 'text' },
                { name: 'phone', type: 'text' },
                { name: 'address', type: 'textarea', localized: true },
              ],
            },
            {
              name: 'social',
              type: 'array',
              labels: { singular: 'Profil', plural: 'Profile' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'platform', type: 'text', admin: { width: '50%', placeholder: 'LinkedIn' } },
                    { name: 'url', type: 'text', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
