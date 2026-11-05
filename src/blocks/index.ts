import type { Block, Field } from 'payload'

import { ICON_OPTIONS } from '../lib/icons'

// Layout blocks for free pages (start, agency overview, about, contact, offer pages).
// Data-driven blocks (services, cases, brands, trust, engagements, posts) only
// carry a heading — their content comes from the collections and they hide
// themselves when nothing is published.

// Headings: text in *asterisks* is rendered as italic emphasis (src/lib/emphasis.tsx).
const heading: Field = {
  name: 'heading',
  label: 'Überschrift',
  type: 'text',
  localized: true,
  admin: { description: '*Betonung* in Sternchen wird kursiv.' },
}
const kicker: Field = { name: 'kicker', label: 'Kicker', type: 'text', localized: true }
const intro: Field = { name: 'intro', label: 'Einleitung', type: 'textarea', localized: true }

const link = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', label: 'Text', type: 'text', localized: true, admin: { width: '50%' } },
        { name: 'href', label: 'Pfad', type: 'text', admin: { width: '50%', description: 'z. B. /kontakt' } },
      ],
    },
  ],
})

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heros' },
  fields: [
    kicker,
    { name: 'heading', label: 'Überschrift', type: 'text', localized: true, required: true },
    { name: 'text', label: 'Text', type: 'textarea', localized: true },
    { name: 'image', label: 'Bild', type: 'upload', relationTo: 'media', admin: { description: 'Leer = Kontur-Quadrat.' } },
    {
      type: 'row',
      fields: [
        { name: 'captionName', label: 'Bildunterschrift: Name', type: 'text', admin: { width: '50%' } },
        { name: 'captionText', label: 'Bildunterschrift: Text', type: 'text', localized: true, admin: { width: '50%' } },
      ],
    },
    link('primary', 'Button'),
    link('secondary', 'Zweiter Link'),
    {
      name: 'checks',
      label: 'Häkchen',
      type: 'array',
      labels: { singular: 'Häkchen', plural: 'Häkchen' },
      admin: { description: 'Preise kommen immer aus der Leistung, nie als freier Text.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'kind',
              label: 'Art',
              type: 'select',
              defaultValue: 'service',
              options: [
                { label: 'Preis einer Leistung', value: 'service' },
                { label: 'Text', value: 'text' },
              ],
              admin: { width: '30%' },
            },
            {
              name: 'service',
              label: 'Leistung',
              type: 'relationship',
              relationTo: 'services',
              admin: { width: '35%', condition: (_, s) => s?.kind === 'service' },
            },
            {
              name: 'text',
              label: 'Text',
              type: 'text',
              localized: true,
              admin: { width: '35%', condition: (_, s) => s?.kind === 'text' },
            },
          ],
        },
      ],
    },
    { name: 'note', label: 'Hinweis', type: 'text', localized: true },
  ],
}

export const ServiceTilesBlock: Block = {
  slug: 'serviceTiles',
  labels: { singular: 'Leistungskacheln', plural: 'Leistungskacheln' },
  fields: [kicker, heading, intro],
}

export const PackagesBlock: Block = {
  slug: 'packages',
  labels: { singular: 'Pakete', plural: 'Pakete' },
  fields: [kicker, heading, intro],
}

export const CasesBlock: Block = {
  slug: 'caseTeaser',
  labels: { singular: 'Referenzen', plural: 'Referenzen' },
  fields: [
    kicker,
    heading,
    {
      name: 'cases',
      label: 'Referenzen',
      type: 'relationship',
      relationTo: 'cases',
      hasMany: true,
      admin: { description: 'Leer = alle mit „Auf der Startseite“.' },
    },
  ],
}

export const BrandsBlock: Block = {
  slug: 'brandShowcase',
  labels: { singular: 'Marken', plural: 'Marken' },
  fields: [kicker, heading, intro],
}

export const TrustBlock: Block = {
  slug: 'trustBar',
  labels: { singular: 'Trust-Leiste', plural: 'Trust-Leisten' },
  fields: [heading],
}

export const EngagementBlock: Block = {
  slug: 'engagementBand',
  labels: { singular: 'Engagement-Band', plural: 'Engagement-Bänder' },
  fields: [
    kicker,
    heading,
    {
      name: 'text',
      label: 'Text',
      type: 'textarea',
      localized: true,
      admin: { description: 'Interne Links im Text: [Flensburg](/region/flensburg).' },
    },
    link('link', 'Link'),
  ],
}

export const PostTeaserBlock: Block = {
  slug: 'postTeaser',
  labels: { singular: 'Ratgeber-Teaser', plural: 'Ratgeber-Teaser' },
  fields: [kicker, heading],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    heading,
    {
      name: 'items',
      label: 'Fragen',
      type: 'array',
      fields: [
        { name: 'question', label: 'Frage', type: 'text', localized: true, required: true },
        { name: 'answer', label: 'Antwort', type: 'textarea', localized: true, required: true },
      ],
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Handlungsaufforderung', plural: 'Handlungsaufforderungen' },
  fields: [heading, { name: 'text', label: 'Text', type: 'textarea', localized: true }, link('button', 'Button')],
}

export const TextImageBlock: Block = {
  slug: 'textImage',
  labels: { singular: 'Text/Bild', plural: 'Text/Bild' },
  fields: [
    kicker,
    heading,
    { name: 'body', label: 'Text', type: 'richText', localized: true },
    { name: 'image', label: 'Bild', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        {
          name: 'imagePosition',
          label: 'Bildposition',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'rechts', value: 'right' },
            { label: 'links', value: 'left' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'imageRatio',
          label: 'Bildformat',
          type: 'select',
          defaultValue: 'landscape',
          options: [
            { label: 'quer (4:3)', value: 'landscape' },
            { label: 'quadratisch (1:1)', value: 'square' },
            { label: 'hoch (4:5)', value: 'portrait' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
  ],
}

export const PriceTableBlock: Block = {
  slug: 'priceTable',
  labels: { singular: 'Preistabelle', plural: 'Preistabellen' },
  fields: [kicker, heading, intro],
}

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  labels: { singular: 'Kontaktformular', plural: 'Kontaktformulare' },
  fields: [heading, intro],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'Zeitleiste', plural: 'Zeitleisten' },
  fields: [
    kicker,
    heading,
    intro,
    {
      name: 'items',
      label: 'Stationen',
      type: 'array',
      labels: { singular: 'Station', plural: 'Stationen' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Zeit', type: 'text', localized: true, required: true, admin: { width: '30%' } },
            { name: 'title', label: 'Titel', type: 'text', localized: true, required: true, admin: { width: '70%' } },
          ],
        },
        { name: 'text', label: 'Text', type: 'textarea', localized: true },
      ],
    },
  ],
}

export const DarkTextBlock: Block = {
  slug: 'darkText',
  labels: { singular: 'Dunkler Textblock', plural: 'Dunkle Textblöcke' },
  fields: [
    kicker,
    heading,
    { name: 'text', label: 'Text', type: 'textarea', localized: true },
    {
      name: 'images',
      label: 'Bilder',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Optional. Ohne Bilder entfällt die Galerie.' },
    },
  ],
}

export const CaseGridBlock: Block = {
  slug: 'caseGrid',
  labels: { singular: 'Referenzen mit Filter', plural: 'Referenzen mit Filter' },
  fields: [kicker, heading],
}

/**
 * Offer pages (e.g. /de/gastgeber/ferienwohnung): a priced box, a two-column
 * section (text | check list) or a plain section. Prices are numbers here, never
 * free text — with a price the block also becomes an Offer in the page's
 * JSON-LD (name = heading).
 */
export const OfferBlock: Block = {
  slug: 'offer',
  labels: { singular: 'Angebot', plural: 'Angebote' },
  fields: [
    {
      name: 'style',
      label: 'Darstellung',
      type: 'select',
      defaultValue: 'box',
      options: [
        { label: 'Kasten', value: 'box' },
        { label: 'Zwei Spalten (Text | Häkchen)', value: 'columns' },
        { label: 'Schlicht', value: 'plain' },
      ],
    },
    kicker,
    {
      name: 'heading',
      label: 'Überschrift',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: '*Betonung* in Sternchen wird kursiv. Mit Preis zugleich der Angebotsname im JSON-LD.' },
    },
    {
      name: 'text',
      label: 'Text',
      type: 'textarea',
      localized: true,
      admin: { description: 'Absätze durch eine Leerzeile trennen.' },
    },
    {
      name: 'items',
      label: 'Häkchen',
      type: 'array',
      labels: { singular: 'Punkt', plural: 'Punkte' },
      fields: [{ name: 'item', label: 'Punkt', type: 'text', localized: true, required: true }],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          label: 'Preis (€, netto)',
          type: 'number',
          min: 0,
          admin: { width: '40%', description: 'Leer = kein Preis, kein Angebot im JSON-LD.' },
        },
        { name: 'priceIsFrom', label: '„ab“-Preis', type: 'checkbox', defaultValue: false, admin: { width: '20%' } },
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
          admin: { width: '40%' },
        },
      ],
    },
    link('link', 'Button'),
  ],
}

// ── Free blocks of the host area (05.11.2026) ────────────────────────────────
// Rule for all of them: no `required` on localized fields. The page list is the
// same in every language, so a required German-only text would block saving the
// page in Danish or English (the check runs per language) — in the admin and in
// the seed. The components simply render nothing for an empty field.

const tone: Field = {
  name: 'tone',
  label: 'Hintergrund',
  type: 'select',
  defaultValue: 'white',
  options: [
    { label: 'weiß', value: 'white' },
    { label: 'hell (Off-White)', value: 'offwhite' },
  ],
}

/**
 * `layout` is not localized — every block shows in all three languages, untranslated
 * ones with the German text. A block that leads to German-only pages (offer pages)
 * or has no translation is switched off for the other languages here.
 */
const deOnly: Field = {
  name: 'deOnly',
  label: 'Nur auf der deutschen Seite anzeigen',
  type: 'checkbox',
  defaultValue: false,
  admin: { description: 'Für Abschnitte, die auf Nur-Deutsch-Seiten verlinken oder nicht übersetzt sind.' },
}

/** Free tiles: cards side by side, or one highlighted box with columns (e.g. the demo box with a QR code). */
export const TilesBlock: Block = {
  slug: 'tiles',
  labels: { singular: 'Kacheln', plural: 'Kacheln' },
  fields: [
    {
      name: 'style',
      label: 'Darstellung',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Karten', value: 'cards' },
        { label: 'Kasten mit Spalten', value: 'box' },
      ],
    },
    kicker,
    heading,
    intro,
    {
      name: 'items',
      label: 'Kacheln',
      type: 'array',
      labels: { singular: 'Kachel', plural: 'Kacheln' },
      fields: [
        { name: 'image', label: 'Bild', type: 'upload', relationTo: 'media' },
        {
          name: 'qr',
          label: 'QR-Code zum Link anzeigen',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Nur im Kasten: QR-Code, der auf das Linkziel der Kachel führt. Folgt dem Link automatisch.' },
        },
        { name: 'title', label: 'Titel', type: 'text', localized: true },
        {
          name: 'text',
          label: 'Text',
          type: 'textarea',
          localized: true,
          admin: {
            description:
              'Absätze durch eine Leerzeile trennen. Hat die Kachel kein Linkziel, sind Links im Text möglich: [Websites](/agentur/websites).',
          },
        },
        link('link', 'Link'),
      ],
    },
    link('link', 'Link darunter'),
    tone,
    deOnly,
  ],
}

/** Running text under a heading — no tiles, no image. */
export const ProseBlock: Block = {
  slug: 'prose',
  labels: { singular: 'Textabschnitt', plural: 'Textabschnitte' },
  fields: [
    kicker,
    heading,
    {
      name: 'text',
      label: 'Text',
      type: 'textarea',
      localized: true,
      admin: { description: 'Absätze durch eine Leerzeile trennen. Interne Links im Text: [Flensburg](/region/flensburg).' },
    },
    tone,
    deOnly,
  ],
}

/** Points with an icon, or numbered steps (the "Ablauf" of the service pages). */
export const PointsBlock: Block = {
  slug: 'points',
  labels: { singular: 'Punkte', plural: 'Punkte' },
  fields: [
    {
      name: 'style',
      label: 'Darstellung',
      type: 'select',
      defaultValue: 'icons',
      options: [
        { label: 'Punkte mit Icon', value: 'icons' },
        { label: 'Nummerierte Schritte', value: 'steps' },
      ],
    },
    kicker,
    heading,
    intro,
    {
      name: 'items',
      label: 'Punkte',
      type: 'array',
      labels: { singular: 'Punkt', plural: 'Punkte' },
      fields: [
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          options: ICON_OPTIONS.map((o) => ({ label: o.label, value: o.value })),
          admin: { description: 'Nur bei „Punkte mit Icon“.' },
        },
        { name: 'title', label: 'Titel', type: 'text', localized: true },
        { name: 'text', label: 'Text', type: 'textarea', localized: true },
      ],
    },
    link('link', 'Button'),
    tone,
    deOnly,
  ],
}

/**
 * Prices of an offer page as cards and rows. Prices are numbers, never free text —
 * every row with a name and a price also becomes an Offer in the page's JSON-LD.
 */
export const PricingBlock: Block = {
  slug: 'pricing',
  labels: { singular: 'Preise', plural: 'Preise' },
  fields: [
    kicker,
    heading,
    intro,
    {
      name: 'offers',
      label: 'Angebote',
      type: 'array',
      labels: { singular: 'Angebot', plural: 'Angebote' },
      admin: { description: 'Jedes Angebot mit Name und Preis erscheint auch im JSON-LD der Seite.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'display',
              label: 'Darstellung',
              type: 'select',
              defaultValue: 'card',
              options: [
                { label: 'Karte', value: 'card' },
                { label: 'Zeile', value: 'row' },
              ],
              admin: { width: '30%' },
            },
            { name: 'name', label: 'Name', type: 'text', localized: true, admin: { width: '70%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'price', label: 'Preis (€, netto)', type: 'number', min: 0, required: true, admin: { width: '40%' } },
            { name: 'priceIsFrom', label: '„ab“-Preis', type: 'checkbox', defaultValue: false, admin: { width: '20%' } },
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
              admin: { width: '40%' },
            },
          ],
        },
        { name: 'note', label: 'Hinweis am Preis', type: 'text', localized: true, admin: { description: 'z. B. „Voll anrechenbar“.' } },
        { name: 'text', label: 'Text', type: 'textarea', localized: true },
        {
          name: 'items',
          label: 'Häkchen',
          type: 'array',
          labels: { singular: 'Punkt', plural: 'Punkte' },
          fields: [{ name: 'item', label: 'Punkt', type: 'text', localized: true }],
        },
      ],
    },
    { name: 'footnote', label: 'Hinweis unter den Preisen', type: 'textarea', localized: true },
    link('primary', 'Button'),
    link('secondary', 'Zweiter Button'),
    deOnly,
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  ServiceTilesBlock,
  PackagesBlock,
  CasesBlock,
  BrandsBlock,
  TrustBlock,
  EngagementBlock,
  PostTeaserBlock,
  FaqBlock,
  CtaBlock,
  TextImageBlock,
  PriceTableBlock,
  ContactFormBlock,
  TimelineBlock,
  DarkTextBlock,
  CaseGridBlock,
  OfferBlock,
  TilesBlock,
  ProseBlock,
  PointsBlock,
  PricingBlock,
]
