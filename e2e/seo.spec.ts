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

test('Landingpage Flensburg: sechs FAQ-Fragen, FAQPage genau einmal mit allen sechs', async ({ page }) => {
  await page.goto('/de/region/flensburg')
  const added = [
    'Was kostet eine Website für einen Betrieb in Flensburg?',
    'Wie lange dauert es, bis meine Website online ist?',
    'Macht ihr auch Visitenkarten, Flyer und Logos?',
  ]
  await expect(page.locator('main details summary')).toHaveCount(6)
  for (const q of added) await expect(page.locator('main summary', { hasText: q })).toHaveCount(1)
  const faqs = (await graphOf(page)).filter((n) => n['@type'] === 'FAQPage') as { mainEntity: { name: string }[] }[]
  expect(faqs).toHaveLength(1)
  expect(faqs[0].mainEntity).toHaveLength(6)
  expect(faqs[0].mainEntity.map((q) => q.name)).toEqual(expect.arrayContaining(added))
})

test('Leistungsseiten: Meta-Title aus dem CMS, Marke einmal, da/en unverändert', async ({ page }) => {
  const titles: [string, string][] = [
    ['/de/agentur/websites', 'Homepage erstellen lassen ab 1.900 €'],
    ['/de/agentur/shopify-shops', 'Shopify-Shop erstellen lassen ab 3.900 €'],
    ['/de/agentur/betreuung-pflege', 'Website-Betreuung und Wartung ab 49 € im Monat'],
    ['/de/agentur/lokale-sichtbarkeit', 'Google-Unternehmensprofil und lokales SEO'],
    ['/de/agentur/apps-software', 'App- und Softwareentwicklung für Betriebe'],
    ['/de/agentur/druck-werbemittel', 'Druck und Werbemittel mit Gestaltung'],
    // An empty da/en meta title would show the German one through the fallback locale.
    ['/da/agentur/websites', 'Hjemmesider'],
    ['/en/agentur/websites', 'Websites'],
    ['/da/agentur/druck-werbemittel', 'Tryk og reklamemateriale'],
  ]
  for (const [path, title] of titles) {
    await page.goto(path)
    await expect(page, path).toHaveTitle(`${title} | beau marketing`)
    expect([...(await page.title())].length, path).toBeLessThanOrEqual(65)
  }
  // The H1 stays the service headline, not the meta title.
  await page.goto('/de/agentur/websites')
  await expect(page.getByRole('heading', { level: 1 })).not.toContainText('Homepage erstellen lassen')
})

test('Startseite: Title nach Konvention, Markenname nur einmal, neue Description', async ({ page }) => {
  await page.goto('/de')
  await expect(page).toHaveTitle('Webdesign & Shopify in Schleswig-Holstein | beau marketing')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Websites, Shopify-Shops und lokale Sichtbarkeit für Betriebe in Schleswig-Holstein, Hamburg und Dänemark – transparente Preise, Betreuung aus Satrup in Angeln.',
  )
  for (const locale of ['da', 'en']) {
    await page.goto(`/${locale}`)
    const title = await page.title()
    expect(title, locale).toMatch(/ \| beau marketing$/)
    expect(title.toLowerCase().split('beau marketing').length - 1, locale).toBe(1)
  }
})

test('JSON-LD: Organization mit Logo (absolute URL, Datei vorhanden)', async ({ page, request }) => {
  await page.goto('/de')
  const org = (await graphOf(page)).find((n) => n['@type'] === 'Organization') as { logo: { url: string } }
  expect(org.logo.url).toMatch(/^https?:\/\/[^/]+\/brand\/beau-marketing-logo\.png$/)
  const res = await request.get(new URL(org.logo.url).pathname)
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/png')
})

test('HEAD auf die REST-API: wie GET, nur ohne Body', async ({ request }) => {
  const file = '/api/media/file/sh-partner-badge-der-echte-norden.png'
  const get = await request.get(file)
  const head = await request.head(file)
  expect(get.status()).toBe(200)
  expect(head.status()).toBe(200)
  expect((await head.body()).length).toBe(0)
  for (const h of ['content-type', 'content-length', 'etag', 'last-modified', 'cache-control']) {
    expect(head.headers()[h], h).toBe(get.headers()[h])
  }
  expect((await request.head('/api/brands')).status()).toBe(200)
  const missing = '/api/media/file/gibt-es-nicht.png'
  expect((await request.head(missing)).status()).toBe((await request.get(missing)).status())
})
