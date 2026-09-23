import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'

// One source for footer, contact page, landing pages and JSON-LD. Maintained by
// hand (decision Stephan) — the imprint itself comes from eRecht24, so NAP data
// lives in two places on purpose.
const NAP_HINT = 'Bei Änderung auch im eRecht24-Portal und im Google-Unternehmensprofil anpassen.'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Einstellungen',
  admin: { group: 'Konfiguration' },
  access: { read: anyone, update: isAdmin },
  fields: [
    { name: 'siteName', label: 'Name der Website', type: 'text', defaultValue: 'Beau Marketing' },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'company',
          label: 'Firma',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'legalName', label: 'Firmenname', type: 'text', admin: { width: '50%' } },
                { name: 'managingDirector', label: 'Geschäftsführer', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'street', label: 'Straße und Hausnummer', type: 'text', admin: { width: '50%', description: NAP_HINT } },
                { name: 'postalCode', label: 'PLZ', type: 'text', admin: { width: '15%' } },
                { name: 'city', label: 'Ort', type: 'text', admin: { width: '35%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'district',
                  label: 'Ortsteil',
                  type: 'text',
                  admin: { width: '50%', description: 'Darf im Fließtext stehen (z. B. Satrup).' },
                },
                { name: 'country', label: 'Land', type: 'text', defaultValue: 'Deutschland', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  label: 'Telefon',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: `Anzeigeformat, z. B. 04633 202 9925 – der Anruf-Link wird daraus erzeugt. ${NAP_HINT}`,
                  },
                },
                { name: 'email', label: 'E-Mail', type: 'email', admin: { width: '50%', description: NAP_HINT } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'registerCourt', label: 'Registergericht', type: 'text', admin: { width: '50%' } },
                { name: 'registerNumber', label: 'Handelsregisternummer', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              name: 'vatId',
              label: 'USt-IdNr.',
              type: 'text',
              admin: { description: 'Leer, solange nicht erteilt – die Anzeige blendet sich dann aus.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'latitude', label: 'Breitengrad', type: 'number', admin: { width: '50%' } },
                { name: 'longitude', label: 'Längengrad', type: 'number', admin: { width: '50%' } },
              ],
            },
            {
              name: 'areaServed',
              label: 'Einzugsgebiet',
              type: 'array',
              labels: { singular: 'Gebiet', plural: 'Gebiete' },
              admin: { description: 'Landet als areaServed im JSON-LD.' },
              fields: [{ name: 'name', label: 'Gebiet', type: 'text', required: true }],
            },
            {
              name: 'hourlyRate',
              label: 'Stundensatz Einzelaufgaben (€, netto)',
              type: 'number',
              min: 0,
            },
          ],
        },
        {
          name: 'contact',
          label: 'Kontakt',
          fields: [
            { name: 'hours', label: 'Erreichbarkeit', type: 'textarea', localized: true },
            { name: 'bookingUrl', label: 'Termin-Link', type: 'text', admin: { description: 'Später. Leer = kein Termin-Button.' } },
          ],
        },
        {
          name: 'profiles',
          label: 'Profile',
          fields: [
            { name: 'linkedin', label: 'LinkedIn', type: 'text' },
            { name: 'instagram', label: 'Instagram', type: 'text' },
            { name: 'googleBusiness', label: 'Google-Unternehmensprofil', type: 'text' },
            { name: 'googleReviewUrl', label: 'Bewertungslink', type: 'text' },
          ],
        },
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            {
              name: 'titleSuffix',
              label: 'Title-Suffix',
              type: 'text',
              admin: { description: 'Wird an jeden Seitentitel gehängt, z. B. „ | beau marketing“.' },
            },
            { name: 'defaultOgImage', label: 'Standard-Social-Bild', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
