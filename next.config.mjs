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
  images: {
    // Payload serves uploaded media from the same origin. Allow localhost in dev;
    // the production domain works automatically (same-origin). Extend as needed.
    remotePatterns: [{ protocol: 'http', hostname: 'localhost' }],
  },
}

export default withPayload(withNextIntl(nextConfig))
