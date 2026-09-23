import path from 'node:path'
import type { CollectionConfig } from 'payload'

import { publicReadAccess } from '../access'
import { requiredText } from '../fields/validators'

// Resolve relative to the working directory (project root in dev, /app in the
// standalone container) so uploads land in a stable, mountable location.
// Production: Coolify volume `bm-prod-media` is mounted on /app/media.
const MEDIA_DIR = path.resolve(process.cwd(), 'media')

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Medium', plural: 'Medien' },
  admin: { group: 'Inhalte', defaultColumns: ['filename', 'alt', 'credit.author'] },
  access: publicReadAccess,
  upload: {
    staticDir: MEDIA_DIR,
    mimeTypes: ['image/*'],
    focalPoint: true,
    // Derived sizes as WebP; the original stays byte-identical (partner badges
    // must not be re-encoded).
    imageSizes: [
      { name: 'thumbnail', width: 400, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 768, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'feature', width: 1280, formatOptions: { format: 'webp', options: { quality: 82 } } },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
  },
  fields: [
    {
      // Required in the admin, nullable in the database (existing uploads have none).
      name: 'alt',
      label: 'Alternativtext',
      type: 'text',
      localized: true,
      validate: requiredText,
      admin: { description: 'Pflicht. Beschreibt das Bild für Screenreader und Suchmaschinen.' },
    },
    {
      name: 'credit',
      label: 'Bildnachweis',
      type: 'group',
      admin: {
        description:
          'Pflicht – Schutz vor Bildrechte-Abmahnungen. Vorbelegt für eigene Fotos; bei fremden Bildern anpassen.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'author',
              label: 'Urheber',
              type: 'text',
              defaultValue: 'Stephan Beau',
              validate: requiredText,
              admin: { width: '33%' },
            },
            {
              name: 'source',
              label: 'Quelle',
              type: 'text',
              defaultValue: 'eigene Aufnahme',
              validate: requiredText,
              admin: { width: '33%' },
            },
            {
              name: 'license',
              label: 'Lizenz',
              type: 'text',
              defaultValue: 'alle Rechte vorbehalten',
              validate: requiredText,
              admin: { width: '34%' },
            },
          ],
        },
      ],
    },
  ],
}
