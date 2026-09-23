import type { CollectionConfig } from 'payload'

import { publicReadAccess } from '../access'

/**
 * Social engagement in the region ("Für die Region"). Guard rails: no
 * recognisable children on photos, club logos only with permission.
 */
export const Engagements: CollectionConfig = {
  slug: 'engagements',
  labels: { singular: 'Engagement', plural: 'Engagements' },
  admin: {
    useAsTitle: 'institution',
    defaultColumns: ['institution', 'kind', 'place', 'visible', 'order'],
    group: 'Agentur',
    description: 'Keine erkennbaren Kinder auf Fotos. Vereinslogos nur mit Erlaubnis.',
  },
  access: publicReadAccess,
  defaultSort: 'order',
  fields: [
    { name: 'institution', label: 'Einrichtung', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'place', label: 'Ort', type: 'text', admin: { width: '50%' } },
        {
          name: 'kind',
          label: 'Art',
          type: 'text',
          localized: true,
          required: true,
          admin: { width: '50%', description: 'z. B. Trikots, Warnwesten, Kleidung' },
        },
      ],
    },
    { name: 'years', label: 'Jahr(e)', type: 'text' },
    { name: 'photos', label: 'Fotos', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'link', label: 'Link zur Einrichtung', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'logo', label: 'Logo der Einrichtung', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
        {
          name: 'logoPermission',
          label: 'Erlaubnis für das Logo liegt vor',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '50%', description: 'Ohne Häkchen wird das Logo nicht angezeigt.' },
        },
      ],
    },
    { name: 'visible', label: 'sichtbar', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'order', label: 'Reihenfolge', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
