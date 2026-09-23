import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { de } from '@payloadcms/translations/languages/de'

import { Authors } from './collections/Authors'
import { Brands } from './collections/Brands'
import { Cases } from './collections/Cases'
import { Categories } from './collections/Categories'
import { Engagements } from './collections/Engagements'
import { Locations } from './collections/Locations'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Services } from './collections/Services'
import { Users } from './collections/Users'
import { migrations } from './migrations'
import { AGB } from './globals/AGB'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { Trust } from './globals/Trust'
import { Widerruf } from './globals/Widerruf'
import { seedEndpoint } from './seed/endpoint'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const smtpPort = Number(process.env.SMTP_PORT ?? 587)

/**
 * SMTP is opt-in via `SMTP_HOST`. Without it Payload falls back to its console adapter,
 * which only logs a stub line instead of sending — acceptable locally, but it turns
 * "forgot password" in the admin into a dead end, so production must set these.
 * A failing transport is only logged by the adapter, it never blocks boot.
 */
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'noreply@beau-marketing.de',
      defaultFromName: process.env.SMTP_FROM_NAME || 'Beau Marketing',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: smtpPort,
        // 465 is implicit TLS; 587 starts plain and upgrades via STARTTLS.
        secure: smtpPort === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    })
  : undefined

// Public base URL. Payload builds absolute links from it — without one, password
// reset mails carry only '/admin/reset/<token>' with no host (verified on DJV, 25.08.).
// The fallback is deliberately NODE_ENV-dependent instead of a fixed localhost:
// the Dockerfile declares NEXT_PUBLIC_SERVER_URL only in the builder stage, so unless
// Coolify also injects it as a RUNTIME variable the server boots without it — and a
// localhost link in production is worse than no serverURL at all.
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://beau-marketing.de' : 'http://localhost:3000')

export default buildConfig({
  serverURL,
  cors: [serverURL],
  // Payload appends serverURL to the csrf list on its own — listed explicitly anyway
  // so both lists sit together. cors is not set automatically.
  csrf: [serverURL],
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    // House rule: the admin carries the company logo, never Payload's.
    components: {
      graphics: {
        Logo: '/components/admin/AdminLogo#AdminLogo',
        Icon: '/components/admin/AdminIcon#AdminIcon',
      },
      beforeDashboard: ['/components/admin/SeedPanel#SeedPanel'],
    },
    meta: {
      titleSuffix: ' — Beau Marketing',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/icon.svg' }],
      // Without its own openGraph block Payload keeps "Payload App" as og:site_name.
      openGraph: {
        title: 'Beau Marketing – Backend',
        description: 'Redaktionssystem von beau-marketing.de',
        siteName: 'Beau Marketing',
      },
    },
  },
  i18n: {
    supportedLanguages: { de },
    fallbackLanguage: 'de',
  },
  collections: [
    Pages,
    Services,
    Locations,
    Cases,
    Brands,
    Engagements,
    Posts,
    Categories,
    Authors,
    Media,
    Users,
  ],
  email,
  endpoints: [seedEndpoint],
  globals: [SiteSettings, Navigation, Trust, AGB, Widerruf],
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
    // Fleet pool standard: without a connect timeout node-pg waits forever on a
    // hanging database instead of failing the boot cleanly.
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      allowExitOnIdle: false,
    },
    // No dev push: it leaves a `batch = -1` row in payload_migrations (which makes
    // `payload migrate` prompt and hang) and can silently rewrite constraints.
    // Schema changes go through `pnpm payload migrate:create` only; production runs
    // these committed migrations on boot — no CLI needed in the standalone container.
    push: false,
    prodMigrations: migrations,
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  // Payload phones home with anonymous usage stats by default. No visitor data
  // is involved, but this site deliberately sends nothing anywhere it doesn't
  // have to — there is no analytics, no consent tool and no third-party cookie.
  telemetry: false,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    seoPlugin({
      collections: ['pages', 'services', 'locations', 'cases', 'brands', 'posts'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const d = doc as { title?: string; name?: string; client?: string }
        return d?.title ?? d?.name ?? d?.client ?? 'Beau Marketing'
      },
      generateDescription: ({ doc }) => {
        const d = doc as { excerpt?: string; shortDescription?: string; tagline?: string }
        return d?.excerpt ?? d?.shortDescription ?? d?.tagline ?? ''
      },
    }),
    redirectsPlugin({
      collections: ['pages', 'services', 'locations', 'cases', 'brands', 'posts'],
      overrides: { admin: { group: 'Konfiguration' } },
    }),
  ],
})
