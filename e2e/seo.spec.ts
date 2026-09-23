import { expect, test, type Page } from '@playwright/test'

// SEO technique (Paket 5): permanent redirects, canonical/hreflang per the
// fallback concept, sitemap with self-canonical URLs only, JSON-LD, landing page.

const origin = (url: string) => new URL(url).pathname + new URL(url).hash

const canonicalOf = async (page: Page) => origin((await page.locator('link[rel="canonical"]').getAttribute('href'))!)

const hreflangsOf = async (page: Page) =>
  (await page.locator('link[rel="alternate"][hreflang]').evaluateAll((els) => els.map((e) => e.getAttribute('hreflang')))).sort()

const graphOf = async (page: Page) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  return blocks.flatMap((b) => {
    const data = JSON.parse(b)
    return Array.isArray(data['@graph']) ? data['@graph'] : [data]
  }) as Record<string, unknown>[]
}

test('alte URLs und Root leiten permanent (308) um', async ({ request }) => {
  const cases: [string, string][] = [
    ['/', '/de'],
    ['/marken', '/de/marken'],
    ['/de/studio', '/de/agentur/apps-software'],
    ['/da/studio', '/da/agentur/apps-software'],
    ['/de/marken/tappi', '/de/marken#tappi'],
    ['/de/marken/family-manager', '/de/marken#family-manager'],
    ['/de/marken/thingr', '/de/marken'],
  ]
  for (const [from, to] of cases) {
    const res = await request.get(from, { maxRedirects: 0 })
    expect(res.status(), from).toBe(308)
    expect(origin(new URL(res.headers()['location'], 'http://x').href), from).toBe(to)
  }
})

test('übersetzte Seite: self-canonical und hreflang über die übersetzten Sprachen', async ({ page }) => {
  await page.goto('/da/agentur/websites')
  expect(await canonicalOf(page)).toBe('/da/agentur/websites')
  expect(await hreflangsOf(page)).toEqual(['da', 'de', 'en', 'x-default'])
  await expect(page.locator('html')).toHaveAttribute('lang', 'da')
  await expect(page.locator('h1')).toContainText('hjemmeside')
})

test('nicht übersetzte Seite: canonical auf /de, kein hreflang, Inhalt lang="de"', async ({ page }) => {
  await page.goto('/en/agentur/apps-software')
  expect(await canonicalOf(page)).toBe('/de/agentur/apps-software')
  expect(await hreflangsOf(page)).toEqual([])
  await expect(page.locator('main div[lang="de"]').first()).toBeAttached()

  await page.goto('/da/region/flensburg')
  expect(await canonicalOf(page)).toBe('/de/region/flensburg')
})

test('Sitemap: nur self-canonical URLs, keine Entwürfe, kein Root', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  expect(locs).toContain('/de/agentur/websites')
  expect(locs).toContain('/en/agentur/websites')
  expect(locs).toContain('/da/agentur/apps-software')
  expect(locs).not.toContain('/en/agentur/apps-software') // fallback URL
  expect(locs).toContain('/de/region/flensburg')
  expect(locs).not.toContain('/da/region/flensburg')
  expect(locs.some((l) => l.includes('/region/kiel'))).toBe(false) // draft
  expect(locs).not.toContain('/')
  expect(locs.some((l) => l.includes('/studio'))).toBe(false)
})

test('JSON-LD: Service mit Nettopreis, Breadcrumb, Organization mit areaServed, Marken mit Anker', async ({ page }) => {
  await page.goto('/de/agentur/websites')
  const graph = await graphOf(page)
  const service = graph.find((n) => n['@type'] === 'Service') as { offers: { priceSpecification: Record<string, unknown> }[] }
  expect(service).toBeTruthy()
  expect(service.offers.length).toBeGreaterThan(0)
  for (const o of service.offers) {
    expect(o.priceSpecification.valueAddedTaxIncluded).toBe(false)
    expect(o.priceSpecification.priceCurrency).toBe('EUR')
  }
  expect(graph.some((n) => n['@type'] === 'BreadcrumbList')).toBe(true)
  const org = graph.find((n) => n['@type'] === 'Organization') as { areaServed: unknown[] }
  expect(org.areaServed).toHaveLength(3)
  const brands = graph.filter((n) => n['@type'] === 'Brand')
  expect(brands.length).toBeGreaterThan(0)
  for (const b of brands) expect(String(b['@id'])).toMatch(/\/de\/marken#[a-z-]+$/)
})

test('Landingpage Flensburg: Inhalt, Entfernung, keine gestrichenen Aussagen', async ({ page, request }) => {
  const res = await page.goto('/de/region/flensburg')
  expect(res?.status()).toBe(200)
  await expect(page.locator('h1')).toContainText('Flensburg')
  await expect(page.getByRole('link', { name: 'Termin vor Ort' })).toHaveAttribute('href', '#vorbei')
  await expect(page.locator('#vorbei')).toContainText('gut 20 km')
  await expect(page.getByText('Keramikwerkstatt Hinrichsen').first()).toBeVisible()
  const text = await page.locator('main').innerText()
  for (const struck of ['Mitbewerber', 'Sønderjylland', 'fast immer', 'Glücksburg', 'Profile in beiden Sprachen', 'Schilder']) {
    expect(text, struck).not.toContain(struck)
  }
  const types = (await graphOf(page)).map((n) => n['@type'])
  for (const t of ['WebPage', 'BreadcrumbList', 'FAQPage']) expect(types).toContain(t)

  expect((await request.get('/de/region/kiel')).status()).toBe(404)
})
