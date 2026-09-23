import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

import { routing } from './i18n/routing'

const intl = createMiddleware(routing)

/**
 * next-intl adds the locale prefix with a 307 (temporary). Google then keeps
 * "/" as canonical and treats /de as a duplicate (concept "Canonicals und
 * hreflang bei Locale-Fallback"). The target is deterministic
 * (localeDetection: false), so the redirect is made permanent: 308.
 */
export default function proxy(request: NextRequest) {
  const response = intl(request)
  const location = response.headers.get('location')
  if (response.status === 307 && location) {
    return NextResponse.redirect(location, 308)
  }
  return response
}

export const config = {
  // Run on everything EXCEPT Payload admin/api, Next internals and files with an extension.
  // Without excluding `admin`/`api`, next-intl would rewrite /admin -> /de/admin and break Payload.
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
