import type { Block, Field } from 'payload'

// Layout blocks for free pages (start, agency overview, about, contact).
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
  fields: [kicker, heading, { name: 'text', label: 'Text', type: 'textarea', localized: true }, link('link', 'Link')],
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
      name: 'imagePosition',
      label: 'Bildposition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'rechts', value: 'right' },
        { label: 'links', value: 'left' },
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
]
