import type { CollectionConfig } from 'payload'

import { editorialAccess } from '../access'
import { pageBlocks } from '../blocks'
import { slugField } from '../fields/slug'

/** Free pages built from layout blocks: start, agency overview, about, contact. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Seite', plural: 'Seiten' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'], group: 'Inhalte' },
  access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 25 },
  fields: [
    { name: 'title', label: 'Titel', type: 'text', localized: true, required: true },
    slugField('title'),
    { name: 'layout', label: 'Inhalt', type: 'blocks', blocks: pageBlocks },
  ],
}
