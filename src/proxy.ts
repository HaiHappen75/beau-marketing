import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Run on everything EXCEPT Payload admin/api, Next internals and files with an extension.
  // Without excluding `admin`/`api`, next-intl would rewrite /admin -> /de/admin and break Payload.
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
