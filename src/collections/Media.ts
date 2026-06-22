import path from 'node:path'
import type { CollectionConfig } from 'payload'

// Resolve relative to the working directory (project root in dev, /app in the
// standalone container) so uploads land in a stable, mountable location.
const MEDIA_DIR = path.resolve(process.cwd(), 'media')

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Medium', plural: 'Medien' },
  admin: { group: 'Inhalte' },
  access: { read: () => true },
  upload: {
    // Local dev / single-server: files on disk. In prod, mount a Coolify volume here
    // (or switch to object storage) so uploads survive redeploys.
    staticDir: MEDIA_DIR,
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 768 },
      { name: 'feature', width: 1280 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      admin: { description: 'Alternativtext (Barrierefreiheit & SEO).' },
    },
  ],
}
