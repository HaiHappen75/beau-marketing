import { expect, test, type APIResponse } from '@playwright/test'

import { LEGACY_GONE, LEGACY_REDIRECTS, legacyUrlTarget, stripTrailingSlash } from '../src/lib/legacyUrls'

// Old WordPress URLs (22.10.2026): one hop — 301 to the new page or 410 — with and
// without a trailing slash, query kept. Every other path behaves as before.

const SITE = 'https://beau-marketing.de'

// Next writes the Location relative when the target is its own origin (local run).
const locationOf = (res: APIResponse, base: string) => {
  const url = new URL(res.headers()['location'], base)
  return url.pathname + url.search + url.hash
}

test('Altseiten (Entscheidung): Ziel mit Query, 410 mit Muster, alles andere unberührt', () => {
  expect(legacyUrlTarget('/customer-journey/', '', SITE)).toEqual({ status: 301, location: `${SITE}/de/ratgeber` })
  expect(legacyUrlTarget('/customer-journey', '?utm_source=x', SITE)).toEqual({
    status: 301,
    location: `${SITE}/de/ratgeber?utm_source=x`,
  })
  // The query goes in front of the anchor.
  expect(legacyUrlTarget('/stephan-beau-card/', '?a=1', SITE)).toEqual({ status: 301, location: `${SITE}/de/marken?a=1#tappi` })

  const gone = ['/test-2', '/test-2/', '/2019', '/2019/05/alter-beitrag/', '/tag/seo/', '/category/news', '/author/stephan/']
  gone.push('/feed/', '/wp-content/uploads/2021/x.jpg', '/wp-includes/js/jquery.js')
  for (const path of gone) expect(legacyUrlTarget(path, '', SITE), path).toEqual({ status: 410 })

  // Anchored at the root: real pages under a locale prefix are never hit.
  const untouched = ['/', '/de', '/de/', '/de/agentur/', '/de/ratgeber/2024-rueckblick', '/de/ratgeber/kategorie/websites', '/de/tag/x']
  untouched.push('/impressum/', '/kontakt', '/marken', '/website-ferienwohnung', '/api/', '/admin', '/tags', '/20', '/2019abc', '/feeds')
  for (const path of untouched) expect(legacyUrlTarget(path, '', SITE), path).toBeNull()

  expect(stripTrailingSlash('/')).toBeNull()
  expect(stripTrailingSlash('/de/agentur')).toBeNull()
  expect(stripTrailingSlash('/de/agentur/')).toBe('/de/agentur')
  expect(stripTrailingSlash('/de/agentur//')).toBe('/de/agentur')
  // Never a protocol-relative target.
  expect(stripTrailingSlash('//evil.example/')).toBe('/evil.example')
  expect(stripTrailingSlash('///evil.example/x/')).toBe('/evil.example/x')
})

test('Altseiten 301: ein Sprung mit und ohne Schrägstrich, Ziel antwortet 200', async ({ request, baseURL }) => {
  for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
    for (const path of [from, `${from}/`]) {
      const res = await request.get(path, { maxRedirects: 0 })
      expect(res.status(), path).toBe(301)
      expect(locationOf(res, baseURL!), path).toBe(to)
    }
    // No target may redirect again or answer 404.
    const target = await request.get(to.split('#')[0], { maxRedirects: 0 })
    expect(target.status(), to).toBe(200)
  }
})

test('Altseiten 301: Query bleibt erhalten, auch vor dem Anker', async ({ request, baseURL }) => {
  const cases: [string, string][] = [
    ['/customer-journey/?utm_source=x&utm_medium=y', '/de/ratgeber?utm_source=x&utm_medium=y'],
    ['/seo-analyse?x=1', '/de/agentur/lokale-sichtbarkeit?x=1'],
    ['/stephan-beau-card/?a=1', '/de/marken?a=1#tappi'],
  ]
  for (const [path, to] of cases) {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status(), path).toBe(301)
    expect(locationOf(res, baseURL!), path).toBe(to)
  }
})

test('Altseiten 410: Liste und WordPress-Archive, mit Hinweisseite', async ({ request }) => {
  const paths = [...LEGACY_GONE].flatMap((p) => [p, `${p}/`])
  paths.push('/2019/05/alter-beitrag/', '/tag/seo/', '/category/allgemein/', '/author/stephan/', '/feed/', '/wp-content/uploads/2021/x.jpg')
  for (const path of paths) {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status(), path).toBe(410)
    expect(res.headers()['content-type'], path).toContain('text/html')
    expect(await res.text(), path).toContain('Diese Seite gibt es nicht mehr.')
  }
})

test('übrige Pfade: Schrägstrich-308 wie bisher, /impressum/ und /kontakt/ landen auf der Seite', async ({ request, baseURL }) => {
  const cases: [string, string][] = [
    ['/de/agentur/', '/de/agentur'],
    ['/de/agentur/?x=1', '/de/agentur?x=1'],
    ['/admin/', '/admin'],
    ['/api/', '/api'],
    ['/impressum/', '/impressum'],
    ['/website-ferienwohnung', '/de/website-ferienwohnung'],
    // next.config redirects() now catch the slash variant directly: one hop.
    ['/de/studio/', '/de/agentur/apps-software'],
  ]
  for (const [path, to] of cases) {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status(), path).toBe(308)
    expect(locationOf(res, baseURL!), path).toBe(to)
  }
  for (const [path, final] of [
    ['/impressum/', '/de/impressum'],
    ['/kontakt/', '/de/kontakt'],
  ]) {
    const res = await request.get(path)
    expect(res.status(), path).toBe(200)
    expect(new URL(res.url()).pathname, path).toBe(final)
  }
  expect((await request.get('/de/agentur', { maxRedirects: 0 })).status()).toBe(200)
})
