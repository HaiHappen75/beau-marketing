import { createErecht24PushRoute } from '@dagsite/erecht24-next'

// eRecht24 push webhook: eRecht24 reports text changes here, the handler checks
// the shared secret (ERECHT24_PUSH_SECRET) and invalidates the data-cache tag of
// the affected text — changes are live within seconds, without a redeploy.
// Registration (max. 3 clients per project, the secret is shown exactly once):
//   npx erecht24-register https://beau-marketing.de/api/erecht24/push
//
// Lives outside the (payload) route group: the static segment wins over the
// Payload catch-all /api/[...slug]. There is no fallthrough — methods this file
// does not export answer 405, they do not reach the catch-all. /api is already
// excluded from the locale redirect in proxy.ts.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = createErecht24PushRoute({
  // Our legal pages live behind the locale prefix; German is the canonical one.
  pathByType: {
    imprint: '/de/impressum',
    privacyPolicy: '/de/datenschutz',
    privacyPolicySocialMedia: '/de/datenschutz',
  },
})
