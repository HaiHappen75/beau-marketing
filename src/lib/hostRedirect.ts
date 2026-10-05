// www → apex. A pure decision without any next/server import, so it is unit-testable
// without a Next runtime; src/proxy.ts only wires it up.
//
// Only document navigations are redirected. RSC fetches and subresources keep their
// origin — a cross-origin redirect makes the browser abort them and Next falls back
// to full navigations. The `RSC` header cannot tell them apart: Next 16 strips it
// before the proxy runs. `Sec-Fetch-Dest` survives (navigation = `document`, RSC
// fetch = `empty`). Without it (curl, crawlers, old Safari) everything is redirected
// except an explicit RSC accept — so `curl -I` keeps proving the redirect after deploys.

export type RedirectRequest = {
  method: string
  /** Host header as received (may carry a port). */
  host: string | null
  pathname: string
  /** Query string including the leading `?`, or ''. */
  search: string
  secFetchDest: string | null
  accept: string | null
}

/** Absolute target on the main address, or null when the request stays where it is. */
export function wwwRedirectTarget(req: RedirectRequest, siteUrl: string): string | null {
  if (req.method !== 'GET' && req.method !== 'HEAD') return null
  const site = new URL(siteUrl)
  if ((req.host ?? '').trim().toLowerCase() !== `www.${site.host}`) return null
  if (req.secFetchDest) {
    if (req.secFetchDest !== 'document') return null
  } else if ((req.accept ?? '').includes('text/x-component')) {
    return null
  }
  return new URL(`${req.pathname}${req.search}`, site.origin).href
}
