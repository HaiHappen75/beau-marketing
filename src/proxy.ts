import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

import { routing } from './i18n/routing'
import { wwwRedirectTarget } from './lib/hostRedirect'
import { GONE_HTML, legacyUrlTarget, stripTrailingSlash } from './lib/legacyUrls'
import { SITE_URL } from './lib/seo'

const intl = createMiddleware(routing)

/**
 * Payload admin/api, Next internals and files with an extension: no locale handling.
 * Same exclusion the matcher used to carry before the www redirect needed every path.
 */
const NOT_LOCALIZED = /^\/(?:api|admin|_next|_vercel|.*\..*)/

/**
 * 1. Old WordPress URLs: 301 straight to the new page or 410, with and without a
 *    trailing slash (src/lib/legacyUrls.ts). Before www, so www.…/old-url is one hop too.
 * 2. www.beau-marketing.de → beau-marketing.de with 301, path and query kept
 *    (decision in src/lib/hostRedirect.ts). Covers every path, files and admin included.
 * 3. Trailing slash → 308 without it. Next's own redirect is switched off
 *    (skipTrailingSlashRedirect, so step 1 sees the raw path); this restores it for
 *    every path, /api and /admin included — hence before NOT_LOCALIZED.
 * 4. next-intl adds the locale prefix with a 307 (temporary). Google then keeps
 *    "/" as canonical and treats /de as a duplicate (concept "Canonicals und
 *    hreflang bei Locale-Fallback"). The target is deterministic
 *    (localeDetection: false), so the redirect is made permanent: 308.
 */
export default function proxy(request: NextRequest) {
  const legacy = legacyUrlTarget(request.nextUrl.pathname, request.nextUrl.search, SITE_URL)
  if (legacy?.status === 410) {
    return new NextResponse(GONE_HTML, { status: 410, headers: { 'content-type': 'text/html; charset=utf-8' } })
  }
  if (legacy) return NextResponse.redirect(legacy.location, 301)

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

  // A plain URL, not a nextUrl clone: NextURL remembers the trailing slash and
  // would append it again when formatting. Setting only the pathname keeps the origin.
  const stripped = stripTrailingSlash(request.nextUrl.pathname)
  if (stripped) {
    const url = new URL(request.url)
    url.pathname = stripped
    return NextResponse.redirect(url, 308)
  }

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
