import type { CollectionConfig } from 'payload'

import { editorialAccess, loggedInField } from '../access'
import { slugField } from '../fields/slug'

/**
 * Client projects. Truthful only: detail sections render when filled, quotes
 * only with a real, released statement. The release date is internal proof and
 * never leaves the admin.
 */
export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: { singular: 'Referenz', plural: 'Referenzen' },
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'place', 'hasDetailPage', 'featuredOnHome', '_status'],
    group: 'Agentur',
  },
  access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 25 },
  defaultSort: 'order',
  fields: [
    { name: 'client', label: 'Kunde', type: 'text', required: true },
    slugField('client'),
    {
      type: 'row',
      fields: [
        { name: 'industry', label: 'Branche', type: 'text', localized: true, admin: { width: '50%' } },
        { name: 'place', label: 'Ort', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'url', label: 'Website', type: 'text', admin: { description: 'Ohne https:// möglich.' } },
    {
      name: 'summary',
      label: 'Einleitung',
      type: 'textarea',
      localized: true,
      admin: { description: 'Ein Satz unter der Überschrift der Detailseite. Nur Belegtes.' },
    },
    {
      name: 'services',
      label: 'Leistungen (Relation)',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Nur, wo die Leistung heute wirklich zutrifft.' },
    },
    {
      name: 'chips',
      label: 'Leistungs-Chips',
      type: 'array',
      labels: { singular: 'Chip', plural: 'Chips' },
      admin: { description: 'Frei formuliert, auch für Historisches (z. B. Shopware).' },
      fields: [{ name: 'label', label: 'Text', type: 'text', localized: true, required: true }],
    },
    {
      name: 'hasDetailPage',
      label: 'Eigene Detailseite',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Aus = nur Karte in der Übersicht.' },
    },
    {
      name: 'featuredOnHome',
      label: 'Auf der Startseite',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    { name: 'order', label: 'Reihenfolge', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'challenge', label: 'Ausgangslage', type: 'richText', localized: true },
    { name: 'solution', label: 'Lösung', type: 'richText', localized: true },
    { name: 'result', label: 'Ergebnis', type: 'richText', localized: true },
    {
      name: 'figures',
      label: 'Zahlen',
      type: 'array',
      labels: { singular: 'Zahl', plural: 'Zahlen' },
      admin: { description: 'Nur belegte Zahlen.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', label: 'Wert', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'label', label: 'Bedeutung', type: 'text', localized: true, required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    { name: 'screenshots', label: 'Screenshots', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'quote',
      label: 'Zitat',
      type: 'group',
      admin: { description: 'Nur ein echtes Zitat mit Freigabe. Leer = Block entfällt.' },
      fields: [
        { name: 'text', label: 'Zitat', type: 'textarea', localized: true },
        {
          type: 'row',
          fields: [
            { name: 'name', label: 'Name', type: 'text', admin: { width: '50%' } },
            { name: 'role', label: 'Rolle', type: 'text', localized: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'releaseDate',
      label: 'Freigabe liegt vor am',
      type: 'date',
      required: true,
      access: { read: loggedInField },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' },
        description: 'Nur intern. Ohne Freigabe keine Referenz.',
      },
    },
    {
      name: 'releaseNote',
      label: 'Vermerk zur Freigabe',
      type: 'text',
      access: { read: loggedInField },
      admin: { position: 'sidebar', description: 'Nur intern, z. B. „laut Stephan“.' },
    },
  ],
}
