import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

import { routing } from './i18n/routing'
import { wwwRedirectTarget } from './lib/hostRedirect'
import { SITE_URL } from './lib/seo'

const intl = createMiddleware(routing)

/**
 * Payload admin/api, Next internals and files with an extension: no locale handling.
 * Same exclusion the matcher used to carry before the www redirect needed every path.
 */
const NOT_LOCALIZED = /^\/(?:api|admin|_next|_vercel|.*\..*)/

/**
 * 1. www.beau-marketing.de → beau-marketing.de with 301, path and query kept
 *    (decision in src/lib/hostRedirect.ts). Covers every path, files and admin included.
 * 2. next-intl adds the locale prefix with a 307 (temporary). Google then keeps
 *    "/" as canonical and treats /de as a duplicate (concept "Canonicals und
 *    hreflang bei Locale-Fallback"). The target is deterministic
 *    (localeDetection: false), so the redirect is made permanent: 308.
 */
export default function proxy(request: NextRequest) {
  const target = wwwRedirectTarget(
    {
      method: request.method,
      host: request.headers.get('host'),
      pathname: request.nextUrl.pathname,
      search: request.nextUrl.search,
      secFetchDest: request.headers.get('sec-fetch-dest'),
      accept: request.headers.get('accept'),
    },
    SITE_URL,
  )
  if (target) return NextResponse.redirect(target, 301)

  // Without excluding `admin`/`api`, next-intl would rewrite /admin -> /de/admin and break Payload.
  if (NOT_LOCALIZED.test(request.nextUrl.pathname)) return NextResponse.next()

  const response = intl(request)
  const location = response.headers.get('location')
  if (response.status === 307 && location) {
    return NextResponse.redirect(location, 308)
  }
  return response
}

export const config = {
  // Everything except the static build output — the www redirect has to reach
  // sitemap, robots, public files and the admin as well.
  matcher: ['/((?!_next/static|_next/image).*)'],
}
