import type { CollectionConfig } from 'payload'

import { publicReadAccess } from '../access'
import { slugField } from '../fields/slug'

/** Fixed guide categories along the building blocks. No tag pages (blog standard). */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategorie', plural: 'Kategorien' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'order', 'noindex'], group: 'Ratgeber' },
  access: publicReadAccess,
  defaultSort: 'order',
  fields: [
    { name: 'title', label: 'Titel', type: 'text', localized: true, required: true },
    slugField('title'),
    { name: 'description', label: 'Beschreibung', type: 'textarea', localized: true },
    { name: 'order', label: 'Reihenfolge', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'noindex',
      label: 'noindex',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'An, solange die Kategorie dünn ist (noindex,follow). Erst mit genug Artikeln abschalten.',
      },
    },
  ],
}
