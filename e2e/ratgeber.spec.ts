import { execFileSync } from 'node:child_process'

import { expect, test, type Page } from '@playwright/test'

// Guide (Paket 4). Runs before smoke.spec.ts (alphabetical). First the empty
// state, then — only with E2E_FIXTURES=1 and a local DATABASE_URI — the fixture
// articles from e2e/fixtures/posts.ts, which are removed again afterwards.

const fixture = (action: 'up' | 'rename' | 'down') =>
  execFileSync('pnpm', ['-s', 'payload', 'run', 'e2e/fixtures/posts.ts'], {
    env: { ...process.env, FIXTURE_ACTION: action },
    stdio: 'pipe',
  })

const robotsOf = async (page: Page) => {
  const meta = page.locator('meta[name="robots"]')
  return (await meta.count()) > 0 ? meta.first().getAttribute('content') : null
}

const jsonLdTypes = async (page: Page) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  return blocks.flatMap((b) => {
    const data = JSON.parse(b)
    const graph = Array.isArray(data['@graph']) ? data['@graph'] : [data]
    return graph.map((n: { '@type': string }) => n['@type'])
  })
}

test.describe.serial('Ratgeber ohne Beiträge', () => {
  test.beforeAll(() => {
    if (process.env.E2E_FIXTURES === '1') fixture('down')
  })

  test('kein Menüpunkt, kein Teaser, /ratgeber noindex, nicht in der Sitemap', async ({ page, request }) => {
    await page.goto('/de')
    await expect(page.locator('header a[href="/de/ratgeber"]')).toHaveCount(0)
    await expect(page.locator('footer a[href="/de/ratgeber"]')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Frag erst mal den Ratgeber.' })).toHaveCount(0)

    const res = await page.goto('/de/ratgeber')
    expect(res?.status()).toBe(200)
    expect(await robotsOf(page)).toContain('noindex')

    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).not.toContain('/ratgeber')
  })
})

test.describe.serial('Ratgeber mit Beitrag', () => {
  test.skip(process.env.E2E_FIXTURES !== '1', 'needs E2E_FIXTURES=1 and a local DATABASE_URI')
  test.beforeAll(() => {
    fixture('up')
  })
  test.afterAll(() => {
    fixture('down')
  })

  test('Artikel: eine H1, Kurzantwort, Autor und Daten, TOC, CTA, FAQ, Quellen', async ({ page }) => {
    await page.goto('/de/ratgeber/e2e-testartikel')
    await expect(page.locator('h1')).toHaveCount(1) // body H1 is downgraded
    await expect(page.locator('h1')).toHaveText('E2E-Testartikel: Aufbau und Anker')
    await expect(page.getByRole('region', { name: 'Kurz beantwortet' })).toContainText('Kurzantwort für den automatischen Test')
    const meta = page.locator('article dl').first()
    await expect(meta).toContainText('Veröffentlicht')
    await expect(meta).toContainText('Aktualisiert')
    await expect(meta).toContainText('Auf Aktualität geprüft am')
    await expect(meta).not.toContainText('Fachlich')
    await expect(meta).toContainText('Lesezeit')
    await expect(page.getByText('Dieser Artikel ersetzt keine Rechtsberatung.')).toBeVisible()

    // Body H1 became an H2 with an anchor; the TOC links to it.
    await expect(page.locator('h2#eine-ueberschrift-erster-ordnung-im-text')).toHaveCount(1)
    await expect(page.locator('h3#ein-unterabschnitt')).toHaveCount(1)
    const toc = page.locator('aside[aria-label="Inhaltsverzeichnis"] a[href="#vierter-abschnitt"]').first()
    await expect(toc).toHaveCount(1)

    // CTA box before the 4th H2, price from the services + net-price note.
    const cta = page.getByRole('complementary', { name: 'Passende Leistung' })
    await expect(cta).toContainText('Pflichtangaben-Update – ab 490 €')
    await expect(cta).toContainText('zzgl. USt., Angebot für Unternehmen')
    await expect(cta.getByRole('link', { name: 'Pflichtangaben-Update anfragen' })).toHaveAttribute(
      'href',
      '/de/kontakt?leistung=shopify-shops',
    )
    const order = await page.evaluate(() => {
      const box = document.querySelector('aside[aria-label="Passende Leistung"]')!
      const fourth = document.getElementById('vierter-abschnitt')!
      return Boolean(box.compareDocumentPosition(fourth) & Node.DOCUMENT_POSITION_FOLLOWING)
    })
    expect(order).toBe(true)

    await expect(page.locator('h2#faq')).toHaveText('Häufige Fragen')
    await expect(page.locator('h2#quellen')).toHaveText('Quellen')
    await expect(page.getByRole('heading', { name: 'Das könnte dich auch interessieren' })).toBeVisible()
  })

  test('Artikel: JSON-LD, Meta, SSR', async ({ page, request }) => {
    await page.goto('/de/ratgeber/e2e-testartikel')
    const types = await jsonLdTypes(page)
    for (const t of ['BlogPosting', 'BreadcrumbList', 'FAQPage', 'Person', 'WebPage', 'Organization']) expect(types).toContain(t)
    expect(await page.locator('meta[property="og:type"]').getAttribute('content')).toBe('article')
    expect(await page.locator('meta[property="article:published_time"]').count()).toBe(1)
    expect(await robotsOf(page)).toContain('max-image-preview:large')

    // Blog standard item 1: everything is in the server HTML, no JS needed.
    const html = await (await request.get('/de/ratgeber/e2e-testartikel')).text()
    expect(html).toContain('Kurzantwort für den automatischen Test')
    expect(html).toContain('id="vierter-abschnitt"')
    expect(html).toContain('"@type":"BlogPosting"')
  })

  test('Sichtbarkeit: Menü, Teaser, Sitemap, Entwurf, Kategorie', async ({ page, request }) => {
    await page.goto('/de')
    await expect(page.locator('header a[href="/de/ratgeber"]').first()).toBeAttached()
    await expect(page.locator('footer a[href="/de/ratgeber"]')).toHaveCount(1)
    await expect(page.getByRole('heading', { name: 'Frag erst mal den Ratgeber.' })).toBeVisible()

    await page.goto('/de/ratgeber')
    expect(await robotsOf(page)).toBeNull() // indexable: no robots restriction
    await expect(page.getByRole('heading', { name: 'E2E-Zweiter Artikel' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'E2E-Entwurf' })).toHaveCount(0)

    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).toContain('/de/ratgeber</loc>')
    expect(sitemap).toMatch(/\/de\/ratgeber\/e2e-testartikel<\/loc>[\s\S]*?<lastmod>2026-09-15/)
    expect(sitemap).not.toContain('e2e-entwurf')
    expect(sitemap).not.toContain('/ratgeber/kategorie/') // thin categories stay out

    expect((await request.get('/de/ratgeber/e2e-entwurf')).status()).toBe(404)

    await page.goto('/de/ratgeber/kategorie/websites')
    expect(await robotsOf(page)).toContain('noindex')
    expect(await robotsOf(page)).toContain('follow')
  })

  test('Slug-Wechsel: alte URLs leiten ohne Kette auf die neue', async ({ request }) => {
    fixture('rename')
    for (const old of ['e2e-testartikel', 'e2e-testartikel-neu']) {
      const res = await request.get(`/de/ratgeber/${old}`, { maxRedirects: 0 })
      expect(res.status()).toBe(308)
      expect(res.headers()['location']).toBe('/de/ratgeber/e2e-testartikel-final')
    }
    expect((await request.get('/de/ratgeber/e2e-testartikel-final')).status()).toBe(200)
  })
})
