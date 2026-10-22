// URLs of the old WordPress site (before the relaunch on 24.09.2026). A pure
// decision without any next/server import, so it is unit-testable without a Next
// runtime; src/proxy.ts only wires it up (same pattern as hostRedirect.ts).
//
// A list in code, not the redirects collection (decision Stephan, 22.10.2026): the
// collection is only consulted by the [slug] pages (308, query dropped), never for
// root-level paths, and it cannot answer 410.
//
// One hop for /x and /x/: next.config sets skipTrailingSlashRedirect, so the proxy
// sees the raw path. stripTrailingSlash restores Next's default for everything else.

/** Old path (without trailing slash) → page on the new site. 301, query kept. */
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/customer-journey': '/de/ratgeber',
  '/seo-analyse': '/de/agentur/lokale-sichtbarkeit',
  '/onpage-optimierung-so-verbesserst-du-dein-google-ranking-und-das-nutzererlebnis': '/de/agentur/lokale-sichtbarkeit',
  '/offpage-optimierung': '/de/agentur/lokale-sichtbarkeit',
  '/suchmaschinenoptimierung': '/de/agentur/lokale-sichtbarkeit',
  '/keyword-recherche': '/de/agentur/lokale-sichtbarkeit',
  '/seo-agentur-flensburg': '/de/region/flensburg',
  '/onlineshop-erstellen-lassen': '/de/agentur/shopify-shops',
  '/website-relaunch': '/de/agentur/websites',
  '/wordpress': '/de/agentur/websites',
  '/case-study': '/de/referenzen',
  '/solids-technologies-ea-gmbh-case-study': '/de/referenzen',
  // End of the chain /de/marken/tappi → /de/marken#tappi (next.config.mjs).
  '/stephan-beau-card': '/de/marken#tappi',
  '/nice2know': '/de/ratgeber',
  '/datenschutzerklaerung': '/de/datenschutz',
  '/cookie-richtlinie-eu': '/de/datenschutz',
}

/** Old pages without a matching new page: 410 — Google drops them faster than a 404. */
export const LEGACY_GONE: ReadonlySet<string> = new Set([
  '/suchmaschinenanzeigen',
  '/marketing-fur-immobilienmakler',
  '/a-b-testing',
  '/absprungrate-google-analytics',
  '/signatur-mit-logo-am-iphone-ipad',
  '/test-2',
])

/**
 * WordPress date archives, tag/category/author archives, feeds and core folders.
 * Anchored at the root: every real page lives under /de, /en, /da, /api or /admin.
 */
const WP_ARCHIVE = /^\/(?:20\d{2}|tag|category|author|feed|wp-content|wp-includes)(?:\/|$)/

export type LegacyDecision = { status: 301; location: string } | { status: 410 }

/**
 * `/x/` → `/x`; null when there is nothing to strip (including `/`). Leading
 * slashes collapse to one, so the result can never read as a protocol-relative
 * `//host` (Next already normalizes `//` before the proxy — belt and braces).
 */
export function stripTrailingSlash(pathname: string): string | null {
  if (pathname.length <= 1 || !pathname.endsWith('/')) return null
  return pathname.replace(/\/+$/, '').replace(/^\/{2,}/, '/') || '/'
}

/** 301 to the absolute target on the main address, 410, or null for every other path. */
export function legacyUrlTarget(pathname: string, search: string, siteUrl: string): LegacyDecision | null {
  const path = stripTrailingSlash(pathname) ?? pathname
  const to = LEGACY_REDIRECTS[path]
  if (to) {
    const url = new URL(to, siteUrl)
    // Targets carry no query of their own; the URL API keeps a fragment behind it.
    if (search) url.search = search
    return { status: 301, location: url.href }
  }
  if (LEGACY_GONE.has(path) || WP_ARCHIVE.test(path)) return { status: 410 }
  return null
}

/**
 * Body of the 410 answer. The proxy cannot render the React 404 page, and the
 * not-found render would set the status back to 404 — so a plain page in the
 * wording of messages/de.json → NotFound, with the same ways back.
 */
export const GONE_HTML = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Seite entfernt | beau marketing</title>
<style>
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#1a1a1a;background:#fff;line-height:1.5}
main{max-width:40rem;margin:0 auto;padding:clamp(56px,10vw,140px) 16px}
h1{font-size:clamp(32px,4.8vw,52px);line-height:1.05;margin:.3em 0 .5em;letter-spacing:-.02em}
ul{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:12px 24px;font-weight:700;font-size:1.1rem}
a{color:inherit}
</style>
</head>
<body>
<main>
<p>410</p>
<h1>Diese Seite gibt es nicht mehr.</h1>
<p>Der Inhalt stammt von unserer alten Website und wurde entfernt. Hier geht es weiter:</p>
<ul>
<li><a href="/de">Zur Startseite</a></li>
<li><a href="/de/agentur">Leistungen und Preise</a></li>
<li><a href="/de/referenzen">Referenzen</a></li>
<li><a href="/de/ratgeber">Ratgeber</a></li>
<li><a href="/de/kontakt">Kontakt</a></li>
</ul>
</main>
</body>
</html>
`
