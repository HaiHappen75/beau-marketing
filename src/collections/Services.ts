import type { CollectionConfig } from 'payload'

import { editorialAccess } from '../access'
import { faqField } from '../fields/faq'
import { slugField } from '../fields/slug'

/**
 * One service page per building block (/de/agentur/<slug>). Prices are net;
 * the "zzgl. USt., Angebot für Unternehmen" note is rendered by the price
 * component, never stored per package.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Leistung', plural: 'Leistungen' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', '_status'],
    group: 'Agentur',
  },
  access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 25 },
  defaultSort: 'order',
  fields: [
    { name: 'title', label: 'Titel', type: 'text', localized: true, required: true },
    slugField('title'),
    {
      name: 'order',
      label: 'Reihenfolge',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Reihenfolge in Menü und Übersicht (klein = oben).' },
    },
    {
      name: 'shortDescription',
      label: 'Kurzbeschreibung',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'Eine Zeile für Mega-Menü und Leistungskachel.' },
    },
    {
      name: 'promise',
      label: 'Nutzenversprechen',
      type: 'textarea',
      localized: true,
      admin: { description: 'Zwei, drei Sätze unter der Überschrift der Leistungsseite.' },
    },
    { name: 'scope', label: 'Leistungsumfang', type: 'richText', localized: true },
    {
      name: 'packages',
      label: 'Pakete',
      type: 'array',
      labels: { singular: 'Paket', plural: 'Pakete' },
      admin: {
        description:
          'Das erste Paket liefert den Teaser-Preis in Menü und Kacheln. Preise netto – der Zusatz „zzgl. USt., Angebot für Unternehmen“ erscheint automatisch.',
      },
      fields: [
        { name: 'name', label: 'Name', type: 'text', localized: true, required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'price',
              label: 'Preis (€, netto)',
              type: 'number',
              min: 0,
              admin: { width: '30%', description: 'Leer = „auf Anfrage“.' },
            },
            {
              name: 'priceIsFrom',
              label: '„ab“-Preis',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '20%' },
            },
            {
              name: 'unit',
              label: 'Einheit',
              type: 'select',
              defaultValue: 'once',
              options: [
                { label: 'einmalig', value: 'once' },
                { label: 'pro Monat', value: 'month' },
                { label: 'pro Stunde', value: 'hour' },
              ],
              admin: { width: '25%' },
            },
            { name: 'term', label: 'Laufzeit', type: 'text', localized: true, admin: { width: '25%' } },
          ],
        },
        {
          name: 'includes',
          label: 'Enthält',
          type: 'array',
          labels: { singular: 'Punkt', plural: 'Punkte' },
          fields: [{ name: 'item', label: 'Punkt', type: 'text', localized: true, required: true }],
        },
      ],
    },
    {
      name: 'steps',
      label: 'Ablauf',
      type: 'array',
      labels: { singular: 'Schritt', plural: 'Schritte' },
      fields: [
        { name: 'title', label: 'Titel', type: 'text', localized: true, required: true },
        { name: 'text', label: 'Text', type: 'textarea', localized: true },
      ],
    },
    faqField(),
    {
      name: 'cases',
      label: 'Referenzen',
      type: 'relationship',
      relationTo: 'cases',
      hasMany: true,
    },
    {
      name: 'posts',
      label: 'Passende Ratgeber',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
    },
    {
      name: 'cta',
      label: 'Handlungsaufforderung',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'heading', label: 'Überschrift', type: 'text', localized: true, admin: { width: '50%' } },
            { name: 'buttonLabel', label: 'Button', type: 'text', localized: true, admin: { width: '50%' } },
          ],
        },
        { name: 'text', label: 'Text', type: 'textarea', localized: true },
      ],
    },
  ],
}
