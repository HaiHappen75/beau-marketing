import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Brands } from './collections/Brands'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { migrations } from './migrations'
import { Datenschutz } from './globals/Datenschutz'
import { Impressum } from './globals/Impressum'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — Beau-Marketing',
    },
  },
  collections: [Brands, Media, Users],
  globals: [SiteSettings, Impressum, Datenschutz],
  localization: {
    locales: [
      { label: 'Deutsch', code: 'de' },
      { label: 'English', code: 'en' },
      { label: 'Dansk', code: 'da' },
    ],
    defaultLocale: 'de',
    fallback: true,
  },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Dev syncs the schema automatically (push). Production runs these committed
    // migrations on boot — no CLI needed in the standalone container.
    prodMigrations: migrations,
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    seoPlugin({
      collections: ['brands'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const name = (doc as { name?: string })?.name
        return name ? `${name} — Beau-Marketing` : 'Beau-Marketing'
      },
      generateDescription: ({ doc }) => (doc as { tagline?: string })?.tagline ?? '',
    }),
    redirectsPlugin({ collections: ['brands'] }),
  ],
})
