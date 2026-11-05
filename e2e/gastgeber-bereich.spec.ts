import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

// Host area "Gastgeber im Norden" (05.11.2026): hub /de/gastgeber, landing page
// /de/gastgeber/gastronomie, the holiday-let page below it (its own spec:
// gastgeber.spec.ts), a menu item with a submenu, two sections on the start
// page and three contact topics. Everything German only.

const HUB = '/de/gastgeber'
const GASTRO = '/de/gastgeber/gastronomie'
const HOLIDAY_LET = '/de/gastgeber/ferienwohnung'
const DEMO_MENU = 'https://moevenkrug.deckplan.beau-marketing.de/karte'
const MAILPIT = process.env.MAILPIT_URL ?? 'http://localhost:8025'

const graphOf = async (page: Page) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  return blocks.flatMap((b) => JSON.parse(b)['@graph']) as Record<string, unknown>[]
}
const hrefs = (page: Page, selector: string) => page.locator(selector).evaluateAll((els) => els.map((e) => e.getAttribute('href')))

// ── Navigation ───────────────────────────────────────────────────────────────

test('Navigation Desktop: „Gastgeber“ nach „Agentur“, Untermenü mit drei Zielen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/de')
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' })
  // Order: Agentur, Gastgeber, then the links from the CMS (Referenzen first).
  const items = await nav.locator('ul > li').evaluateAll((els) => els.map((e) => e.textContent?.trim()))
  expect(items.slice(0, 3)).toEqual(['Agentur', 'Gastgeber', 'Referenzen'])

  const button = nav.getByRole('button', { name: 'Gastgeber' })
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(button).toHaveAttribute('aria-expanded', 'true')
  const panel = page.locator(`[id="${await button.getAttribute('aria-controls')}"]`)
  await expect(panel.getByRole('link', { name: /^Gastronomie/ })).toHaveAttribute('href', GASTRO)
  await expect(panel.getByRole('link', { name: /^Ferienwohnung & Ferienhaus/ })).toHaveAttribute('href', HOLIDAY_LET)
  await expect(panel.getByRole('link', { name: 'Alle Gastgeber-Angebote' })).toHaveAttribute('href', HUB)

  // One panel at a time; Escape closes.
  await nav.getByRole('button', { name: 'Agentur' }).focus()
  await page.keyboard.press('Enter')
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await expect(nav.getByRole('button', { name: 'Agentur' })).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(nav.getByRole('button', { name: 'Agentur' })).toHaveAttribute('aria-expanded', 'false')

  // Following a submenu link closes the panel and marks the item as current.
  await button.focus()
  await page.keyboard.press('Enter')
  await panel.getByRole('link', { name: /^Gastronomie/ }).click()
  await expect(page).toHaveURL(new RegExp(`${GASTRO}$`))
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await expect(button).toHaveClass(/border-accent/)
})

test('Navigation Mobil: Gruppe „Gastgeber“ im Menü mit drei Zielen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de')
  const toggle = page.getByRole('button', { name: 'Menü öffnen' })
  // Read the target first: once open, the button is called "Menü schließen".
  const menuId = await toggle.getAttribute('aria-controls')
  await toggle.click()
  const menu = page.locator(`[id="${menuId}"]`)
  await expect(page.getByRole('button', { name: 'Menü schließen' })).toHaveAttribute('aria-expanded', 'true')
  await expect(menu.getByText('Gastgeber', { exact: true })).toBeVisible()
  await expect(menu.getByRole('link', { name: 'Gastronomie', exact: true })).toHaveAttribute('href', GASTRO)
  await expect(menu.getByRole('link', { name: 'Ferienwohnung & Ferienhaus' })).toHaveAttribute('href', HOLIDAY_LET)
  await expect(menu.getByRole('link', { name: 'Alle Gastgeber-Angebote' })).toHaveAttribute('href', HUB)
  // The group sits between the services and the other pages.
  const texts = await menu.locator('a, p.kicker').evaluateAll((els) => els.map((e) => e.textContent?.trim()))
  expect(texts.indexOf('Gastgeber')).toBeGreaterThan(texts.indexOf('Agentur'))
  expect(texts.indexOf('Alle Gastgeber-Angebote')).toBeLessThan(texts.indexOf('Referenzen'))

  await menu.getByRole('link', { name: 'Alle Gastgeber-Angebote' }).click()
  await expect(page).toHaveURL(new RegExp(`${HUB}$`))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gastgeber im Norden')
})

test('Navigation: da/en ohne „Gastgeber“ – weder Desktop noch Mobil, kein Link in den Bereich', async ({ page }) => {
  for (const locale of ['da', 'en']) {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`/${locale}`)
    await expect(page.locator('header').getByRole('button', { name: /Gastgeber|Hosts|Værter/ }), locale).toHaveCount(0)
    await expect(page.locator('a[href*="/gastgeber"]'), locale).toHaveCount(0)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.locator('header button[aria-controls][aria-label]').click()
    await expect(page.locator('header a[href*="/gastgeber"]'), locale).toHaveCount(0)
  }
})

// ── Startseite ───────────────────────────────────────────────────────────────

test('Startseite: Kachel-Band unter dem Hero, SEO-Abschnitt vor „Für die Region“, Hero unverändert', async ({ page }) => {
  await page.goto('/de')
  const main = page.locator('main')
  // Hero A as before.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Websites, Shops und Sichtbarkeit für Betriebe im Norden.')
  await expect(main.getByRole('link', { name: 'Projekt anfragen' }).first()).toHaveAttribute('href', '/de/kontakt')
  await expect(main.getByRole('link', { name: 'Preise ansehen' })).toHaveAttribute('href', '#preise')

  const band = main.locator('section', { has: page.getByRole('heading', { name: 'Spezialisiert auf Gastgeber im Norden' }) })
  await expect(band).toContainText('Restaurants, Wirtshäuser, Landgasthöfe, Ferienwohnungen – wir bauen Websites, die Gäste bringen')
  await expect(band.getByRole('link', { name: /Für Restaurants und Gasthöfe/ })).toHaveAttribute('href', GASTRO)
  await expect(band.getByRole('link', { name: /Für Vermieter von Ferienwohnungen/ })).toHaveAttribute('href', HOLIDAY_LET)
  await expect(band.getByRole('link', { name: /Alle Gastgeber-Angebote/ })).toHaveAttribute('href', HUB)

  const seo = main.locator('section', {
    has: page.getByRole('heading', { level: 2, name: 'Webdesign-Agentur aus Satrup bei Flensburg – für Schleswig-Holstein und darüber hinaus' }),
  })
  await expect(seo.locator('p')).toHaveCount(3)
  await expect(seo).toContainText('beau marketing ist eine Agentur für Webdesign, Shopify-Shops und Software aus Satrup in Angeln')
  await expect(seo.getByRole('link', { name: 'Webdesign Flensburg' })).toHaveAttribute('href', '/de/region/flensburg')

  // Order: hero → tile band → … → SEO text → region band (whose own Flensburg sentence stays).
  const order = await main.locator('section').evaluateAll((els) => els.map((e) => e.querySelector('h1, h2')?.textContent?.trim() ?? ''))
  const at = (start: string) => order.findIndex((h) => h.startsWith(start))
  expect(at('Spezialisiert auf Gastgeber')).toBe(at('Websites, Shops und Sichtbarkeit') + 1)
  expect(at('Webdesign-Agentur aus Satrup')).toBe(at('Satrup ist nicht nur') - 1)
  await expect(main.locator('#region').getByRole('link', { name: 'Flensburg', exact: true })).toHaveAttribute('href', '/de/region/flensburg')
})

test('Startseite da/en: weder Kachel-Band noch SEO-Abschnitt, übrige Blöcke übersetzt', async ({ page }) => {
  for (const [locale, heading] of [
    ['da', 'Hjemmesider, shops og synlighed'],
    ['en', 'Websites, shops and visibility'],
  ]) {
    await page.goto(`/${locale}`)
    await expect(page.getByRole('heading', { level: 1 }), locale).toContainText(heading)
    const text = await page.locator('main').innerText()
    expect(text, locale).not.toContain('Spezialisiert auf Gastgeber')
    expect(text, locale).not.toContain('Webdesign-Agentur aus Satrup')
  }
})

// ── Hub ──────────────────────────────────────────────────────────────────────

test('Hub: 200, H1, Title, Description, Abschnitte in Reihenfolge, Ziele der Buttons', async ({ page }) => {
  const res = await page.goto(HUB)
  expect(res?.status()).toBe(200)
  await expect(page).toHaveTitle('Gastgeber im Norden – Gastronomie & Vermieter | beau marketing')
  expect([...(await page.title())].length).toBeLessThanOrEqual(65)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Website, digitale Speisekarte, Reservierung und Belegungskalender für Restaurants, Gasthöfe und Ferienwohnungen in Schleswig-Holstein. Aus Satrup bei Flensburg, vom Koch gebaut.',
  )
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gastgeber im Norden')
  const main = page.locator('main')
  await expect(main.getByRole('link', { name: 'Für Restaurants und Gasthöfe' })).toHaveAttribute('href', GASTRO)
  await expect(main.getByRole('link', { name: 'Für Ferienvermieter' })).toHaveAttribute('href', HOLIDAY_LET)

  const h2 = await main.getByRole('heading', { level: 2 }).allTextContents()
  expect(h2).toEqual(['Zwei Angebote, ein Prinzip', 'Was Gastgeber von uns bekommen', 'Vom Koch gebaut', 'Rund um den Tisch', 'So geht es los'])
  await expect(main.getByRole('link', { name: /Mehr für Restaurants/ })).toHaveAttribute('href', GASTRO)
  await expect(main.getByRole('link', { name: /Mehr für Vermieter/ })).toHaveAttribute('href', HOLIDAY_LET)
  await expect(main.getByRole('heading', { level: 3 })).toContainText([
    'Eine Website, die Gäste bringt.',
    'Werkzeuge, die dein Betrieb selbst bedient.',
    'Rechtstexte, die sich selbst aktuell halten.',
    'Gäste aus Dänemark verstehen dich.',
    'Alles rund um den Tisch.',
    'Ein fester Ansprechpartner.',
    'Demo an deinem Tresen.',
    'Entscheidung ohne Druck.',
    'Live in wenigen Wochen.',
  ])
  await expect(main).toContainText('– Stephan Beau, Geschäftsführer beau marketing')
  await expect(main.getByRole('link', { name: 'Anfragen', exact: true })).toHaveAttribute('href', '/de/kontakt?anliegen=rund-um-den-tisch')
  await expect(main.getByRole('link', { name: 'Demo-Termin anfragen' })).toHaveAttribute('href', '/de/kontakt?anliegen=demo-gastronomie')
  // Closing box with the two service pages.
  await expect(main).toContainText('Du bist Immobilienmakler oder Eventanbieter?')
  await expect(main.getByRole('link', { name: 'Websites', exact: true })).toHaveAttribute('href', '/de/agentur/websites')
  await expect(main.getByRole('link', { name: 'Betreuung & Pflege', exact: true })).toHaveAttribute('href', '/de/agentur/betreuung-pflege')
  // No prices on the hub.
  expect(await main.innerText()).not.toMatch(/\d+\s?€/)

  // Images are media entries with the description as alt text; the portrait is the real one.
  await expect(main.getByRole('img', { name: 'Gastraum mit Tischaufsteller' })).toBeVisible()
  await expect(main.getByRole('img', { name: 'Screenshot Speisekarte am Handy' })).toBeAttached()
  await expect(main.getByRole('img', { name: 'Stephan Beau, Geschäftsführer der Beau Marketing GmbH' })).toBeAttached()

  // German only.
  expect(new URL((await page.locator('link[rel="canonical"]').getAttribute('href'))!).pathname).toBe(HUB)
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0)
  for (const code of ['da', 'en']) for (const href of await hrefs(page, `a[hreflang="${code}"]`)) expect(href, code).toBe(`/${code}`)
})

test('Hub JSON-LD: WebPage über die Agentur, Brotkrume, kein Angebot', async ({ page }) => {
  await page.goto(HUB)
  const graph = await graphOf(page)
  const agency = graph.find((n) => n['@type'] === 'ProfessionalService')!
  const webPage = graph.find((n) => n['@type'] === 'WebPage') as { about: unknown; url: string }
  expect(webPage.about).toEqual({ '@id': agency['@id'] })
  expect(String(agency['@id'])).toMatch(/#agentur$/)
  const crumbs = graph.find((n) => n['@type'] === 'BreadcrumbList') as { itemListElement: { name: string; item: string }[] }
  expect(crumbs.itemListElement.map((i) => [i.name, new URL(i.item).pathname])).toEqual([
    ['Startseite', '/de'],
    ['Gastgeber', HUB],
  ])
  expect(graph.some((n) => n['@type'] === 'Service')).toBe(false)
  expect(JSON.stringify(graph)).not.toContain('"Offer"')
})

// ── Gastronomie ──────────────────────────────────────────────────────────────

test('Gastronomie: 200, H1, Title, Description, Reihenfolge – Preise erst nach dem Koch', async ({ page }) => {
  const res = await page.goto(GASTRO)
  expect(res?.status()).toBe(200)
  await expect(page).toHaveTitle('Restaurant-Website, Speisekarte & Reservierung | beau marketing')
  expect([...(await page.title())].length).toBeLessThanOrEqual(65)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Restaurant-Website mit digitaler Speisekarte per QR-Code, Online-Reservierung und Veranstaltungen – dein Team pflegt alles selbst. Aus Satrup bei Flensburg, für Gastronomie in Schleswig-Holstein.',
  )
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Website, Speisekarte und Reservierung für dein Restaurant')
  const main = page.locator('main')
  expect(await main.getByRole('heading', { level: 2 }).allTextContents()).toEqual([
    'Kommt dir das bekannt vor?',
    'Ein System, das dein Betrieb selbst bedient',
    'Die Speisekarte, die immer stimmt',
    'Reservierung ohne Telefonklingeln',
    'Veranstaltungen mit Anmeldung',
    'Eine Website, die Gäste bringt',
    'Probier es aus – jetzt, am Handy',
    'Deine Gäste aus Dänemark verstehen die Karte',
    'Rund um den Tisch',
    'Vom Koch gebaut',
    'Was es kostet',
    'Häufige Fragen',
    'Lass es uns an deinem Tresen anschauen',
  ])
  // No price above the price section (the entry stays free of them).
  const sections = await main.locator('section').evaluateAll((els) => els.map((e) => ({ h: e.querySelector('h1, h2')?.textContent ?? '', text: (e as HTMLElement).innerText })))
  const priceAt = sections.findIndex((s) => s.h === 'Was es kostet')
  for (const s of sections.slice(0, priceAt)) expect(s.text, s.h).not.toMatch(/\d+\s?€/)
  const prices = main.locator('section', { has: page.getByRole('heading', { name: 'Was es kostet' }) })
  for (const text of ['Deckplan Start', '89 €', 'Deckplan Plus', '149 €', '/ Monat', 'Einrichtung', '490 €', 'Website-Check', '290 €', 'einmalig']) {
    await expect(prices).toContainText(text)
  }
  await expect(prices).toContainText('zzgl. USt., Angebot für Unternehmen')
  await expect(prices).toContainText('Bei 24 Monaten Laufzeit entfällt die Einrichtung.')
  await expect(prices).toContainText('Nicht dabei, bewusst: Online-Bestellung außer Haus und ein grafischer Tischplan.')
  await expect(prices.getByRole('link', { name: 'Demo-Termin anfragen' })).toHaveAttribute('href', '/de/kontakt?anliegen=demo-gastronomie')
  await expect(prices.getByRole('link', { name: 'Website-Check anfragen' })).toHaveAttribute('href', '/de/kontakt?anliegen=website-check-gastro')

  await expect(main.locator('details summary')).toHaveCount(7)
  await expect(main.getByRole('link', { name: 'Anfragen', exact: true })).toHaveAttribute('href', '/de/kontakt?anliegen=rund-um-den-tisch')
  await expect(main.getByRole('link', { name: /Zur Seite für Vermieter/ })).toHaveAttribute('href', HOLIDAY_LET)
  await expect(page.getByRole('navigation', { name: 'Brotkrumen' }).getByRole('link', { name: 'Gastgeber' })).toHaveAttribute('href', HUB)

  // Seven placeholder images + the portrait, all from the media library, each with its description.
  for (const alt of [
    'Handy mit Speisekarte vor Gastraum',
    'Screenshot Speisekarte am Handy + Admin-Ansicht „heute aus“',
    'Screenshot Reservierungsliste im Admin',
    'Screenshot Event-Seite mit Anmeldung',
    'Screenshot Website-Startseite eines Betriebs',
    'Screenshot Speisekarte auf Dänisch',
    'Stephan Beau, Geschäftsführer der Beau Marketing GmbH',
  ]) {
    await expect(main.getByRole('img', { name: alt, exact: true })).toBeAttached()
  }
  for (const src of await main.locator('img').evaluateAll((els) => els.map((e) => e.getAttribute('src') ?? ''))) {
    expect(decodeURIComponent(src)).toContain('/api/media/file/')
  }

  expect(new URL((await page.locator('link[rel="canonical"]').getAttribute('href'))!).pathname).toBe(GASTRO)
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0)
})

test('Gastronomie: Demo-Links extern im neuen Tab, QR-Code als Inline-SVG auf dieselbe Adresse', async ({ page, request }) => {
  await page.goto(GASTRO)
  const main = page.locator('main')
  const demo = main.locator(`a[href="${DEMO_MENU}"]`)
  await expect(demo).toHaveCount(2)
  await expect(main.getByRole('link', { name: 'Demo-Speisekarte ansehen' })).toHaveAttribute('href', DEMO_MENU)
  await expect(main.getByRole('link', { name: 'Demo-Speisekarte öffnen' })).toHaveAttribute('href', DEMO_MENU)
  for (const attrs of await demo.evaluateAll((els) => els.map((e) => [e.getAttribute('target'), e.getAttribute('rel')]))) {
    expect(attrs).toEqual(['_blank', 'noopener'])
  }
  // Internal buttons stay in the tab.
  await expect(main.getByRole('link', { name: 'Demo an deinem Tresen' })).not.toHaveAttribute('target', /.+/)

  // The QR code is drawn on the server: an inline SVG with fixed size, no image request.
  const qr = main.getByRole('img', { name: 'QR-Code: Demo-Speisekarte öffnen' })
  await expect(qr).toBeVisible()
  expect(await qr.evaluate((el) => [el.tagName.toLowerCase(), el.getAttribute('width'), el.getAttribute('height')])).toEqual(['svg', '176', '176'])
  await expect(main.locator('img[alt*="QR" i]')).toHaveCount(0)
  // Not in the JSON-LD (the demo is not the agency's profile).
  expect(JSON.stringify(await graphOf(page))).not.toContain('moevenkrug')

  // The demo itself answers (external system — skipped when offline).
  const res = await request.get(DEMO_MENU, { maxRedirects: 0, timeout: 15_000 }).catch(() => null)
  test.skip(!res, 'Demo-System nicht erreichbar')
  expect(res!.status()).toBe(200)
})

test('Gastronomie JSON-LD: Service mit vier Nettoangeboten, Monatspreise je Einheit, FAQ, Brotkrume', async ({ page }) => {
  await page.goto(GASTRO)
  const graph = await graphOf(page)
  const agency = graph.find((n) => n['@type'] === 'ProfessionalService')!
  const service = graph.find((n) => n['@type'] === 'Service') as {
    name: string
    provider: unknown
    areaServed: unknown[]
    audience: unknown
    offers: { name: string; priceSpecification: Record<string, unknown> }[]
  }
  expect(service.name).toBe('Deckplan – Website und Werkzeuge für Gastronomie')
  expect(service.provider).toEqual({ '@id': agency['@id'] })
  expect(service.areaServed).toEqual([{ '@type': 'State', name: 'Schleswig-Holstein' }])
  expect(service.audience).toEqual({ '@type': 'Audience', audienceType: 'Restaurants und Gastronomie' })
  expect(service.offers.map((o) => [o.name, o.priceSpecification['@type'], o.priceSpecification.price, o.priceSpecification.unitCode])).toEqual([
    ['Deckplan Start', 'UnitPriceSpecification', 89, 'MON'],
    ['Deckplan Plus', 'UnitPriceSpecification', 149, 'MON'],
    ['Einrichtung', 'PriceSpecification', 490, undefined],
    ['Website-Check', 'PriceSpecification', 290, undefined],
  ])
  for (const o of service.offers) {
    expect(o.priceSpecification.valueAddedTaxIncluded).toBe(false)
    expect(o.priceSpecification.priceCurrency).toBe('EUR')
  }
  const faqs = graph.filter((n) => n['@type'] === 'FAQPage') as { mainEntity: { name: string }[] }[]
  expect(faqs).toHaveLength(1)
  expect(faqs[0].mainEntity).toHaveLength(7)
  expect(faqs[0].mainEntity[0].name).toBe('Brauche ich zusätzlich ein Reservierungstool wie resmio oder DISH?')
  const crumbs = graph.find((n) => n['@type'] === 'BreadcrumbList') as { itemListElement: { name: string; item: string }[] }
  expect(crumbs.itemListElement.map((i) => [i.name, new URL(i.item).pathname])).toEqual([
    ['Startseite', '/de'],
    ['Gastgeber', HUB],
    ['Gastronomie', GASTRO],
  ])
})

// ── Nur Deutsch, Sitemap, Footer ─────────────────────────────────────────────

test('Bereich: Locale-Varianten 404, ohne Sprachpräfix 308 auf /de', async ({ request }) => {
  for (const locale of ['da', 'en']) {
    for (const path of ['/gastgeber', '/gastgeber/gastronomie', '/gastgeber/ferienwohnung']) {
      expect((await request.get(`/${locale}${path}`)).status(), `/${locale}${path}`).toBe(404)
    }
  }
  for (const path of ['/gastgeber', '/gastgeber/gastronomie']) {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status(), path).toBe(308)
    expect(new URL(res.headers()['location'], 'http://x').pathname, path).toBe(`/de${path}`)
  }
})

test('Sitemap und Footer: drei Seiten des Bereichs je einmal, nur auf Deutsch', async ({ page, request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  for (const path of [HUB, GASTRO, HOLIDAY_LET]) expect(locs.filter((l) => l === path), path).toHaveLength(1)
  expect(locs.filter((l) => l.includes('gastgeber') || l.includes('website-ferienwohnung'))).toHaveLength(3)
  // No hreflang alternates for German-only pages.
  const entry = xml.slice(xml.indexOf(`${HUB}</loc>`), xml.indexOf('</url>', xml.indexOf(`${HUB}</loc>`)))
  expect(entry).not.toContain('hreflang')

  await page.goto('/de')
  const footer = page.locator('footer')
  await expect(footer.getByRole('link', { name: 'Gastgeber im Norden' })).toHaveAttribute('href', HUB)
  await expect(footer.getByRole('link', { name: 'Website für Restaurants' })).toHaveAttribute('href', GASTRO)
  await expect(footer.getByRole('link', { name: 'Website für Ferienwohnung und Ferienhaus' })).toHaveAttribute('href', HOLIDAY_LET)
  await page.goto('/da')
  await expect(page.locator('footer a[href*="/gastgeber"]')).toHaveCount(0)
})

// ── Kontakt ──────────────────────────────────────────────────────────────────

// key → topic as the mail carries it → text of the option on screen.
const TOPICS: [key: string, name: string, shown: string][] = [
  ['demo-gastronomie', 'Demo Gastronomie', 'Demo Gastronomie'],
  ['website-check-gastro', 'Website-Check Gastronomie', 'Website-Check'],
  ['rund-um-den-tisch', 'Rund um den Tisch', 'Rund um den Tisch'],
]

test('Kontakt: die drei Anliegen des Bereichs werden vorbelegt, das Label passt ins Feld', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const [key, name, shown] of TOPICS) {
    await page.goto(`/de/kontakt?anliegen=${key}`)
    const select = page.getByRole('form', { name: 'Anfrageformular' }).getByLabel('Leistung')
    await expect(select, key).toHaveValue(name)
    await expect(select.locator('option:checked'), key).toHaveText(shown)
    // Only the requested topic becomes an option — the others stay out of the list.
    for (const [, other] of TOPICS.filter(([k]) => k !== key)) {
      await expect(select.locator(`option[value="${other}"]`), `${key}: ${other}`).toHaveCount(0)
    }
    // Not cut off (finding of PR #15): the text is no wider than the field's inside.
    const fit = await select.evaluate((el: HTMLSelectElement) => {
      const style = getComputedStyle(el)
      const ctx = document.createElement('canvas').getContext('2d')!
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      const inner = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      return { text: ctx.measureText(el.options[el.selectedIndex].text).width, inner }
    })
    expect(fit.text, `${key}: ${Math.round(fit.text)} px in ${Math.round(fit.inner)} px`).toBeLessThanOrEqual(fit.inner)
  }
})

async function mailsFor(request: APIRequestContext, marker: string) {
  const res = await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`"${marker}"`)}`)
  expect(res.ok()).toBeTruthy()
  return ((await res.json()).messages ?? []) as { ID: string; Subject: string }[]
}

test('Kontakt: Anliegen aus dem Bereich steht im Betreff der Mail', async ({ page, request }) => {
  // One real submission (the form allows five per ten minutes and IP), with the
  // topic whose option text is shortened: the mail must carry the full topic.
  const [key, name, shown] = TOPICS[1]
  const marker = `e2e-gastro-${Date.now()}`
  await page.goto(GASTRO)
  await page.locator('main').getByRole('link', { name: 'Website-Check anfragen' }).click()
  await expect(page).toHaveURL(new RegExp(`/de/kontakt\\?anliegen=${key}$`))
  const form = page.getByRole('form', { name: 'Anfrageformular' })
  await expect(form.getByLabel('Leistung')).toHaveValue(name)
  await expect(form.getByLabel('Leistung').locator('option:checked')).toHaveText(shown)
  await form.getByLabel('Name').fill('Erika Test')
  await form.getByLabel('Firma').fill(`Landgasthof ${marker}`)
  await form.getByLabel('E-Mail').fill('erika.test@example.org')
  await form.getByLabel('Region').selectOption('Schleswig-Holstein')
  await form.getByLabel('Nachricht').fill(`Gastgeber-Bereich-Test ${marker}`)
  await form.getByRole('button', { name: 'Anfrage senden' }).click()
  await expect(page.getByRole('status')).toContainText('Danke, ist angekommen.')

  await expect.poll(async () => (await mailsFor(request, marker)).length, { timeout: 10_000 }).toBe(1)
  const [mail] = await mailsFor(request, marker)
  expect(mail.Subject).toContain(name)
})
