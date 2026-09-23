import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig, TextareaFieldValidation } from 'payload'

import { editorialAccess, loggedInField } from '../access'
import { slugRedirectHook } from '../hooks/slugRedirect'
import { faqField } from '../fields/faq'
import { slugField } from '../fields/slug'

// Guide articles ("Ratgeber"), built to the blog standard of all Beau projects.
// The title is the only H1 — the editor offers H2–H4 only.

const SHORT_ANSWER_WORDS = { min: 40, max: 60 }

const shortAnswerLength: TextareaFieldValidation = (value) => {
  if (typeof value !== 'string' || value.trim().length === 0) return 'Pflichtfeld.'
  const words = value.trim().split(/\s+/).length
  return words >= SHORT_ANSWER_WORDS.min && words <= SHORT_ANSWER_WORDS.max
    ? true
    : `Die Kurzantwort hat ${words} Wörter – erlaubt sind ${SHORT_ANSWER_WORDS.min}–${SHORT_ANSWER_WORDS.max}.`
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Ratgeber-Artikel', plural: 'Ratgeber' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Ratgeber',
  },
  access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 50 },
  hooks: { afterChange: [slugRedirectHook('/ratgeber')] },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', label: 'Titel', type: 'text', localized: true, required: true },
    slugField('title'),
    {
      name: 'shortAnswer',
      label: 'Kurzantwort',
      type: 'textarea',
      localized: true,
      required: true,
      validate: shortAnswerLength,
      admin: { description: '40–60 Wörter. Beantwortet die Frage aus dem Titel direkt unter der H1.' },
    },
    {
      name: 'excerpt',
      label: 'Teaser',
      type: 'textarea',
      localized: true,
      required: true,
      admin: { description: 'Für Karten und als Fallback der Meta-Description.' },
    },
    {
      name: 'content',
      label: 'Beitrag',
      type: 'richText',
      localized: true,
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures.filter((f) => f.key !== 'heading'),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        ],
      }),
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          label: 'Kategorie',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'service',
          label: 'Leistungsbezug',
          type: 'relationship',
          relationTo: 'services',
          required: true,
          admin: { width: '50%', description: 'Speist die CTA-Box im Artikel.' },
        },
      ],
    },
    { name: 'author', label: 'Autor', type: 'relationship', relationTo: 'authors', required: true },
    {
      name: 'ctaPackage',
      label: 'Paket in der CTA-Box',
      type: 'text',
      admin: { description: 'Optional, z. B. „Pflichtangaben-Update“. Leer = die Leistung mit ihrem Einstiegspreis.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'heroImage',
          label: 'Titelbild',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { width: '50%', description: 'Mindestens 1200 px breit.' },
        },
        {
          name: 'socialImage',
          label: 'Social-Media-Bild',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: '1200 × 630. Leer = Titelbild.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'publishedAt',
          label: 'Veröffentlicht am',
          type: 'date',
          required: true,
          admin: { width: '33%', description: 'Zukunftsdatum = geplante Veröffentlichung.' },
        },
        {
          name: 'contentUpdatedAt',
          label: 'Aktualisiert am',
          type: 'date',
          admin: { width: '33%', description: 'Nur bei inhaltlicher Änderung setzen.' },
        },
        {
          name: 'reviewedAt',
          // RDG: visible label "Auf Aktualität geprüft am" — no appearance of a legal check.
          label: 'Auf Aktualität geprüft am',
          type: 'date',
          admin: { width: '34%', description: 'Bei Rechts- und Faktenthemen: Stand der Prüfung auf Aktualität.' },
        },
      ],
    },
    faqField(),
    {
      name: 'sources',
      label: 'Quellen',
      type: 'array',
      labels: { singular: 'Quelle', plural: 'Quellen' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', label: 'Titel', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'url', label: 'URL', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'relatedPosts',
      label: 'Verwandte Beiträge',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
      admin: { description: 'Leer = automatisch drei aus derselben Kategorie.' },
    },
    {
      name: 'editorial',
      label: 'Redaktion (nur intern)',
      type: 'group',
      access: { read: loggedInField },
      admin: { position: 'sidebar' },
      fields: [
        { name: 'focusKeyword', label: 'Fokus-Keyword', type: 'text' },
        { name: 'dossierLink', label: 'Dossier-Link', type: 'text' },
      ],
    },
    {
      name: 'noindex',
      label: 'noindex',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Ausnahmeschalter, Standard aus.' },
    },
  ],
}
