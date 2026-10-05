import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

// Offer page "Website für Ferienwohnung und Ferienhaus" (05.10.2026): German only,
// two priced offers, contact form with a fixed topic, linked from the Websites
// service page and the footer, not from the main navigation.

const PATH = '/de/website-ferienwohnung'
const CHECK_HREF = '/de/kontakt?anliegen=website-check-fewo'
const TOPIC = 'Website-Check Ferienwohnung (290 €)'
const MAILPIT = process.env.MAILPIT_URL ?? 'http://localhost:8025'

const graphOf = async (page: Page) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  return blocks.flatMap((b) => JSON.parse(b)['@graph']) as Record<string, unknown>[]
}

test('Angebotsseite: 200, Title, Description, H1, beide Preise, Button-Ziel', async ({ page }) => {
  const res = await page.goto(PATH)
  expect(res?.status()).toBe(200)
  await expect(page).toHaveTitle('Website für Ferienwohnung und Ferienhaus – Festpreis 2.900 € | Beau Marketing')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Eigene Website für deine Ferienwohnung: Belegungskalender, Buchungsanfrage, Rechtstexte, fertig in 4 Wochen. Festpreis 2.900 € netto, aus Satrup bei Flensburg.',
  )
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Website für Ferienwohnung und Ferienhaus')
  await expect(page.getByRole('heading', { name: 'Website-Check' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Gastgeber-Website' })).toBeVisible()
  const main = page.locator('main')
  await expect(main).toContainText('290 €')
  await expect(main).toContainText('2.900 €')
  await expect(main).toContainText('zzgl. USt., Angebot für Unternehmen')

  const buttons = main.getByRole('link', { name: 'Website-Check anfragen' })
  expect(await buttons.count()).toBeGreaterThanOrEqual(2)
  for (const href of await buttons.evaluateAll((els) => els.map((e) => e.getAttribute('href')))) {
    expect(href).toBe(CHECK_HREF)
  }
  await expect(main.getByRole('link', { name: /Referenz Hüpfburgen OWL/ })).toHaveAttribute('href', '/de/referenzen/huepfburgen-owl')

  // German only: self-canonical, no hreflang alternates, html lang de.
  expect(new URL((await page.locator('link[rel="canonical"]').getAttribute('href'))!).pathname).toBe(PATH)
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0)
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')

  // Not in the main navigation (only the switcher's own "de" link points here);
  // the language switchers lead da/en to their start page.
  await expect(page.locator('header a[href*="website-ferienwohnung"]:not([hreflang])')).toHaveCount(0)
  for (const code of ['da', 'en']) {
    for (const href of await page.locator(`a[hreflang="${code}"]`).evaluateAll((els) => els.map((e) => e.getAttribute('href')))) {
      expect(href, code).toBe(`/${code}`)
    }
  }
})

test('Angebotsseite: da/en liefern 404, ohne Sprachpräfix 308 auf /de', async ({ request }) => {
  for (const path of ['/da/website-ferienwohnung', '/en/website-ferienwohnung']) {
    expect((await request.get(path)).status(), path).toBe(404)
  }
  const res = await request.get('/website-ferienwohnung', { maxRedirects: 0 })
  expect(res.status()).toBe(308)
  expect(new URL(res.headers()['location'], 'http://x').pathname).toBe(PATH)
})

test('Sitemap: Angebotsseite nur auf Deutsch', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  expect(locs).toContain(PATH)
  expect(locs).not.toContain('/da/website-ferienwohnung')
  expect(locs).not.toContain('/en/website-ferienwohnung')
})

test('JSON-LD: Service mit zwei Nettoangeboten, Anbieter ist die Agentur, FAQPage', async ({ page }) => {
  await page.goto(PATH)
  const graph = await graphOf(page)
  const agency = graph.find((n) => n['@type'] === 'ProfessionalService')!
  const service = graph.find((n) => n['@type'] === 'Service') as {
    provider: unknown
    areaServed: unknown[]
    offers: { name: string; priceSpecification: Record<string, unknown> }[]
  }
  expect(service.provider).toEqual({ '@id': agency['@id'] })
  expect(service.areaServed).toEqual([{ '@type': 'State', name: 'Schleswig-Holstein' }])
  expect(service.offers.map((o) => [o.name, o.priceSpecification.price])).toEqual([
    ['Website-Check', 290],
    ['Gastgeber-Website', 2900],
  ])
  for (const o of service.offers) {
    expect(o.priceSpecification.valueAddedTaxIncluded).toBe(false)
    expect(o.priceSpecification.priceCurrency).toBe('EUR')
  }
  const faq = graph.find((n) => n['@type'] === 'FAQPage') as { mainEntity: { name: string }[] }
  expect(faq.mainEntity.map((q) => q.name)).toContain('Gehört die Website mir?')
  expect(faq.mainEntity).toHaveLength(5)
})

test('Einbindung: Kasten auf der Leistungsseite Websites und Footer-Link, nur auf Deutsch', async ({ page }) => {
  await page.goto('/de/agentur/websites')
  await expect(page.getByText('Für Gastgeber', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Zum Gastgeber-Paket' })).toHaveAttribute('href', PATH)
  await expect(page.locator('footer').getByRole('link', { name: 'Website für Ferienwohnung und Ferienhaus' })).toHaveAttribute(
    'href',
    PATH,
  )
  for (const path of ['/da/agentur/websites', '/en/agentur/websites']) {
    await page.goto(path)
    await expect(page.locator('a[href*="website-ferienwohnung"]'), path).toHaveCount(0)
  }
})

test('Kontakt: ?anliegen= belegt nur bekannte Schlüssel vor', async ({ page }) => {
  await page.goto(CHECK_HREF)
  const form = page.getByRole('form', { name: 'Anfrageformular' })
  await expect(form.getByLabel('Leistung')).toHaveValue(TOPIC)

  // Unknown key: ignored — no option, nothing preselected.
  await page.goto('/de/kontakt?anliegen=irgendwas-anderes')
  await expect(form.getByLabel('Leistung')).toHaveValue('')
  await expect(form.locator('option', { hasText: 'irgendwas' })).toHaveCount(0)
  await expect(form.locator('option', { hasText: 'Website-Check' })).toHaveCount(0)
})

async function mailsFor(request: APIRequestContext, marker: string) {
  const res = await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`"${marker}"`)}`)
  expect(res.ok()).toBeTruthy()
  return ((await res.json()).messages ?? []) as { ID: string; Subject: string }[]
}

test('Kontakt: Anliegen landet im Betreff der Mail', async ({ page, request }) => {
  const marker = `e2e-fewo-${Date.now()}`
  await page.goto(CHECK_HREF)
  const form = page.getByRole('form', { name: 'Anfrageformular' })
  await form.getByLabel('Name').fill('Erika Test')
  await form.getByLabel('Firma').fill(`Ferienhaus ${marker}`)
  await form.getByLabel('E-Mail').fill('erika.test@example.org')
  await form.getByLabel('Region').selectOption('Schleswig-Holstein')
  await form.getByLabel('Nachricht').fill(`Gastgeber-Test ${marker}`)
  await form.getByRole('button', { name: 'Anfrage senden' }).click()
  await expect(page.getByRole('status')).toContainText('Danke, ist angekommen.')

  await expect.poll(async () => (await mailsFor(request, marker)).length, { timeout: 10_000 }).toBe(1)
  const [mail] = await mailsFor(request, marker)
  expect(mail.Subject).toContain(TOPIC)
})
