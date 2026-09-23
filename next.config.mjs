import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lean runtime image + low memory footprint on the 8 GB server.
  output: 'standalone',
  // Pin the workspace root (a stray lockfile in $HOME otherwise misleads Next).
  turbopack: { root: dirname },
  outputFileTracingRoot: dirname,
  reactStrictMode: true,
  // Relaunch redirects (Paket 5): every URL of the old site keeps working.
  // permanent: true answers 308 (the permanent twin of 301 that keeps the method).
  async redirects() {
    const locale = ':locale(de|en|da)'
    return [
      // "Studio" became the service "Apps & Software".
      { source: `/${locale}/studio`, destination: '/:locale/agentur/apps-software', permanent: true },
      // Brand detail pages are gone; each brand has an anchor on the brand house page.
      { source: `/${locale}/marken/thingr`, destination: '/:locale/marken', permanent: true },
      {
        source: `/${locale}/marken/:slug(tappi|huusbook|fjella|family-manager|anwurf)`,
        destination: '/:locale/marken#:slug',
        permanent: true,
      },
    ]
  },
  images: {
    // Payload serves uploaded media from the same origin. Allow localhost in dev;
    // the production domain works automatically (same-origin). Extend as needed.
    remotePatterns: [{ protocol: 'http', hostname: 'localhost' }],
  },
}

export default withPayload(withNextIntl(nextConfig))
