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
      name: 'shortLabel',
      label: 'Kurzlabel',
      type: 'text',
      localized: true,
      admin: { position: 'sidebar', description: 'Für Preis-Häkchen im Hero, z. B. „Website“ → „Website ab 1.900 €“.' },
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
      name: 'teaser',
      label: 'Kacheltext',
      type: 'textarea',
      localized: true,
      admin: { description: 'Ein Satz für die Leistungskachel auf Start- und Agentur-Seite.' },
    },
    {
      name: 'headline',
      label: 'Überschrift (H1)',
      type: 'text',
      localized: true,
      admin: { description: 'Text in *Sternchen* wird kursiv betont. Leer = Titel.' },
    },
    {
      name: 'promise',
      label: 'Nutzenversprechen',
      type: 'textarea',
      localized: true,
      admin: { description: 'Zwei, drei Sätze unter der Überschrift der Leistungsseite.' },
    },
    {
      name: 'deliverables',
      label: 'Das bekommst du',
      type: 'group',
      fields: [
        { name: 'heading', label: 'Überschrift', type: 'text', localized: true },
        { name: 'text', label: 'Text', type: 'textarea', localized: true },
        {
          name: 'items',
          label: 'Punkte',
          type: 'array',
          labels: { singular: 'Punkt', plural: 'Punkte' },
          fields: [{ name: 'item', label: 'Punkt', type: 'text', localized: true, required: true }],
        },
      ],
    },
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
        {
          type: 'row',
          fields: [
            { name: 'name', label: 'Name', type: 'text', localized: true, required: true, admin: { width: '50%' } },
            {
              name: 'kicker',
              label: 'Kicker',
              type: 'text',
              localized: true,
              admin: { width: '25%', description: 'z. B. „Einstieg“' },
            },
            {
              name: 'display',
              label: 'Darstellung',
              type: 'select',
              defaultValue: 'card',
              options: [
                { label: 'Paketkarte', value: 'card' },
                { label: 'Eigener Kasten', value: 'box' },
              ],
              admin: { width: '25%', description: 'Kasten z. B. für das Pflichtangaben-Update.' },
            },
          ],
        },
        { name: 'description', label: 'Beschreibung', type: 'textarea', localized: true },
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
    {
      name: 'aftercare',
      label: '„Danach“-Karte',
      type: 'group',
      admin: { description: 'Zeigt nach den eigenen Paketen die Betreuung, z. B. Pflege-Abo nach der Website.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'service',
              label: 'Leistung',
              type: 'relationship',
              relationTo: 'services',
              admin: { width: '50%' },
            },
            {
              name: 'packageName',
              label: 'Pakete',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Name des Pakets oder mehrere, kommagetrennt (z. B. „Basis, Plus, Pro“). Leer = alle Paketkarten.',
              },
            },
          ],
        },
      ],
    },
    faqField(),
    {
      name: 'inHouse',
      label: 'Aus dem eigenen Haus',
      type: 'group',
      admin: { description: 'Optionaler Block mit einem eigenen Projekt (z. B. Fjella). Leer = entfällt.' },
      fields: [
        { name: 'heading', label: 'Überschrift', type: 'text', localized: true, admin: { description: '*Betonung* möglich.' } },
        { name: 'text', label: 'Text', type: 'textarea', localized: true },
        {
          name: 'items',
          label: 'Punkte',
          type: 'array',
          fields: [{ name: 'item', label: 'Punkt', type: 'text', localized: true, required: true }],
        },
        { name: 'image', label: 'Screenshot', type: 'upload', relationTo: 'media' },
        {
          type: 'row',
          fields: [
            { name: 'linkLabel', label: 'Link-Text', type: 'text', localized: true, admin: { width: '50%' } },
            { name: 'url', label: 'URL', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    { name: 'heroImage', label: 'Screenshot im Hero', type: 'upload', relationTo: 'media', admin: { description: 'Leer = Kontur-Quadrat.' } },
    {
      name: 'cases',
      label: 'Referenzen',
      type: 'relationship',
      relationTo: 'cases',
      hasMany: true,
      admin: { description: 'Leer = automatisch alle veröffentlichten Referenzen mit dieser Leistung.' },
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
