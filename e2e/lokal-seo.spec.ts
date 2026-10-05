import { expect, test, type Page } from '@playwright/test'

import { wwwRedirectTarget, type RedirectRequest } from '../src/lib/hostRedirect'

// Lokale SEO (05.10.2026): www → main address, Flensburg linked from the start
// page and the footer, the agency as ProfessionalService, minimum term of
// "Sichtbarkeit" three months instead of six.

const graphOf = async (page: Page) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  return blocks.flatMap((b) => JSON.parse(b)['@graph']) as Record<string, unknown>[]
}

// ── www → apex ───────────────────────────────────────────────────────────────

const req = (over: Partial<RedirectRequest>): RedirectRequest => ({
  method: 'GET',
  host: 'www.beau-marketing.de',
  pathname: '/de/agentur',
  search: '?x=1&y=2',
  secFetchDest: null,
  accept: null,
  ...over,
})
const SITE = 'https://beau-marketing.de'

test('www-Weiterleitung (Entscheidung): Ziel mit Pfad und Query, nur für Dokumente', () => {
  expect(wwwRedirectTarget(req({}), SITE)).toBe('https://beau-marketing.de/de/agentur?x=1&y=2')
  expect(wwwRedirectTarget(req({ secFetchDest: 'document' }), SITE)).toBe('https://beau-marketing.de/de/agentur?x=1&y=2')
  expect(wwwRedirectTarget(req({ method: 'HEAD', pathname: '/sitemap.xml', search: '' }), SITE)).toBe(
    'https://beau-marketing.de/sitemap.xml',
  )
  expect(wwwRedirectTarget(req({ host: 'WWW.Beau-Marketing.de' }), SITE)).not.toBeNull()
  // RSC fetches and subresources keep their origin (Next 16 strips the RSC header).
  expect(wwwRedirectTarget(req({ secFetchDest: 'empty' }), SITE)).toBeNull()
  expect(wwwRedirectTarget(req({ secFetchDest: 'image' }), SITE)).toBeNull()
  expect(wwwRedirectTarget(req({ accept: 'text/x-component' }), SITE)).toBeNull()
  // Writes are never redirected, the main address never.
  expect(wwwRedirectTarget(req({ method: 'POST' }), SITE)).toBeNull()
  expect(wwwRedirectTarget(req({ host: 'beau-marketing.de' }), SITE)).toBeNull()
  expect(wwwRedirectTarget(req({ host: 'www.example.org' }), SITE)).toBeNull()
})

test('www-Host → 301 auf die Hauptadresse, Pfad und Query bleiben', async ({ request, baseURL }) => {
  const base = new URL(baseURL!)
  for (const path of ['/de/agentur?x=1&y=2', '/sitemap.xml', '/de/website-ferienwohnung']) {
    const res = await request.get(path, { headers: { host: `www.${base.host}` }, maxRedirects: 0 })
    expect(res.status(), path).toBe(301)
    // Next writes the Location relative when the target is its own origin (local run);
    // in production (https://beau-marketing.de ≠ internal origin) it stays absolute.
    const target = new URL(res.headers()['location'], base.origin)
    expect(target.host, path).toBe(base.host)
    expect(target.pathname + target.search, path).toBe(path)
  }
  // Without www nothing changes.
  expect((await request.get('/de/agentur', { maxRedirects: 0 })).status()).toBe(200)
})

// ── Flensburg ────────────────────────────────────────────────────────────────

test('Startseite verlinkt die Regionsseite Flensburg (Text und Footer)', async ({ page }) => {
  await page.goto('/de')
  const region = page.locator('#region')
  await expect(region).toContainText('Wir sitzen in Satrup bei Flensburg')
  await expect(region.getByRole('link', { name: 'Flensburg', exact: true })).toHaveAttribute('href', '/de/region/flensburg')
  await expect(page.locator('footer').getByRole('link', { name: 'Webdesign Flensburg' })).toHaveAttribute(
    'href',
    '/de/region/flensburg',
  )
  const res = await page.goto('/de/region/flensburg')
  expect(res?.status()).toBe(200)

  // The landing page exists in German only: no footer link to a fallback page.
  await page.goto('/da')
  await expect(page.locator('footer a[href*="/region/"]')).toHaveCount(0)
})

// ── ProfessionalService ──────────────────────────────────────────────────────

test('JSON-LD: ProfessionalService auf Start- und Regionsseite, an die Organization gehängt', async ({ page }) => {
  for (const path of ['/de', '/de/region/flensburg']) {
    await page.goto(path)
    const graph = await graphOf(page)
    const org = graph.find((n) => n['@type'] === 'Organization')!
    const agency = graph.find((n) => n['@type'] === 'ProfessionalService') as Record<string, unknown> | undefined
    expect(agency, path).toBeTruthy()
    expect(String(agency!['@id']), path).toMatch(/\/#agentur$/)
    expect(agency!.parentOrganization, path).toEqual({ '@id': org['@id'] })
    expect(agency!.telephone, path).toBe('+49 4633 202 9925')
    expect(agency!.email, path).toBe('s.beau@beau-marketing.de')
    expect(agency!.address, path).toMatchObject({ '@type': 'PostalAddress', postalCode: '24986', addressCountry: 'DE' })
    expect(agency!.areaServed, path).toContainEqual({ '@type': 'State', name: 'Schleswig-Holstein' })
    // Nothing invented.
    for (const key of ['openingHours', 'openingHoursSpecification', 'geo', 'aggregateRating', 'review', 'priceRange']) {
      expect(agency, `${path} ${key}`).not.toHaveProperty(key)
    }
  }
})

// ── Mindestlaufzeit Sichtbarkeit ─────────────────────────────────────────────

const SIX_MONTHS = /(6|sechs)\s*Monat|(6|seks)\s*måned|(6|six)\s*month/i

test('Sichtbarkeit: nirgends mehr sechs Monate, drei Monate sichtbar', async ({ page, request }) => {
  for (const locale of ['de', 'da', 'en']) {
    for (const path of [`/${locale}`, `/${locale}/agentur`, `/${locale}/agentur/lokale-sichtbarkeit`]) {
      const html = await (await request.get(path)).text()
      expect(html, path).not.toMatch(SIX_MONTHS)
    }
  }
  await page.goto('/de/agentur/lokale-sichtbarkeit')
  await expect(page.locator('#pakete')).toContainText('Mindestlaufzeit drei Monate, danach monatlich kündbar.')
  await expect(page.locator('#pakete')).toContainText('490 €')
  await page.goto('/de/agentur')
  await expect(page.locator('#preisliste')).toContainText('Mindestlaufzeit drei Monate, danach monatlich kündbar.')
  await page.goto('/da/agentur/lokale-sichtbarkeit')
  await expect(page.locator('#pakete')).toContainText('tre måneder')
})
