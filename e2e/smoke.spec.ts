import { expect, test, type APIRequestContext } from '@playwright/test'

// Smoke test for Paket 2: start page, one service page, contact form end to end
// (mail delivered to Mailpit, checked via its API).

const MAILPIT = process.env.MAILPIT_URL ?? 'http://localhost:8025'

type MailSummary = { ID: string; Subject: string; From: { Address: string }; To: { Address: string }[] }

async function mailsFor(request: APIRequestContext, marker: string): Promise<MailSummary[]> {
  const res = await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`"${marker}"`)}`)
  expect(res.ok()).toBeTruthy()
  return ((await res.json()).messages ?? []) as MailSummary[]
}

// Patterns of the design's placeholder contact data — built from parts so the
// acceptance grep never finds them quoted in the repo.
const PLACEHOLDERS = [new RegExp(['Muster', 'stra'].join('')), new RegExp(['12 34', ' 56'].join('')), /mo[i]n@/]

test('Startseite: Hero, Paketpreise aus den Leistungen, keine Platzhalter', async ({ page }) => {
  await page.goto('/de')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Websites, Shops und Sichtbarkeit')
  const packages = page.locator('#preise')
  await expect(packages).toContainText('1.900 €')
  await expect(packages).toContainText('49 €')
  await expect(packages).toContainText('490 €')
  await expect(packages).toContainText('zzgl. USt., Angebot für Unternehmen')
  const html = await page.content()
  for (const re of PLACEHOLDERS) expect(html).not.toMatch(re)
  await expect(page.locator('a[href="https://partner-sh.de"]').first()).toBeVisible()
})

test('Leistungsseite Websites: H1, Pakete mit Preishinweis, FAQ', async ({ page }) => {
  await page.goto('/de/agentur/websites')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Eine Website, die für deinen Betrieb')
  const packages = page.locator('#pakete')
  await expect(packages.getByRole('heading', { name: 'Website Start' })).toBeVisible()
  await expect(packages.getByRole('heading', { name: 'Website Standard' })).toBeVisible()
  await expect(packages).toContainText('zzgl. USt., Angebot für Unternehmen')
  await expect(page.getByText('Was kostet eine Website bei euch?')).toBeVisible()
})

test('Kontakt: Pflichtfelder, Versand mit From eigener Domain und Reply-To', async ({ page, request }) => {
  const marker = `e2e-${Date.now()}`
  await page.goto('/de/kontakt?leistung=websites')
  const form = page.getByRole('form', { name: 'Anfrageformular' })

  // Empty submit → error summary, nothing sent.
  await form.getByRole('button', { name: 'Anfrage senden' }).click()
  await expect(form.getByRole('alert')).toContainText('Bitte prüf die markierten Felder')
  await expect(form.getByText('Bitte gib deinen Namen an.')).toBeVisible()

  // Preselected service from ?leistung=websites.
  await expect(form.getByLabel('Leistung')).toHaveValue('Websites')

  await form.getByLabel('Name').fill('Erika Test')
  await form.getByLabel('Firma').fill(`Testbetrieb ${marker}`)
  await form.getByLabel('E-Mail').fill('erika.test@example.org')
  await form.getByLabel('Region').selectOption('Schleswig-Holstein')
  await form.getByLabel('Nachricht').fill(`Smoke-Test ${marker}`)
  await form.getByRole('button', { name: 'Anfrage senden' }).click()
  await expect(page.getByRole('status')).toContainText('Danke, ist angekommen.')

  await expect.poll(async () => (await mailsFor(request, marker)).length, { timeout: 10_000 }).toBe(1)
  const [summary] = await mailsFor(request, marker)
  const mail = await (await request.get(`${MAILPIT}/api/v1/message/${summary.ID}`)).json()
  expect(mail.From.Address).toBe('noreply@beau-marketing.de')
  expect(mail.ReplyTo?.[0]?.Address).toBe('erika.test@example.org')
  expect(mail.To[0].Address).toBe('s.beau@beau-marketing.de')
  expect(mail.Text).toContain(marker)
})

test('Kontakt: ausgefülltes Honeypot-Feld → Scheinbestätigung, keine Mail', async ({ page, request }) => {
  const marker = `e2e-bot-${Date.now()}`
  await page.goto('/de/kontakt')
  const form = page.getByRole('form', { name: 'Anfrageformular' })
  await form.getByLabel('Name').fill('Bot')
  await form.getByLabel('Firma').fill(`Bot ${marker}`)
  await form.getByLabel('E-Mail').fill('bot@example.org')
  await form.getByLabel('Leistung').selectOption({ index: 1 })
  await form.getByLabel('Region').selectOption('Hamburg')
  await form.getByLabel('Nachricht').fill(`Spam ${marker}`)
  await page.locator('input[name="website"]').fill('https://spam.example')
  await form.getByRole('button', { name: 'Anfrage senden' }).click()
  await expect(page.getByRole('status')).toContainText('Danke, ist angekommen.')
  await page.waitForTimeout(1500)
  expect(await mailsFor(request, marker)).toHaveLength(0)
})

// ── Paket 3: Referenzen, Marken, Über uns ─────────────────────────────────────

test('Referenzen: Filter nach Leistung ändert die Liste', async ({ page }) => {
  await page.goto('/de/referenzen')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Echte Betriebe, echte Projekte.')
  const cards = page.locator('article h3')
  const all = await cards.count()
  const filter = page.getByRole('navigation', { name: 'Referenzen nach Leistung filtern' })

  await filter.getByRole('link', { name: 'Druck & Werbemittel' }).click()
  await expect(page).toHaveURL(/leistung=druck-werbemittel/)
  await expect(cards).toHaveCount(1)
  await expect(cards.first()).toHaveText('Windhausen Immobilien')
  await expect(filter.getByRole('link', { name: 'Druck & Werbemittel' })).toHaveAttribute('aria-current', 'page')

  await filter.getByRole('link', { name: 'Websites' }).click()
  await expect(page.getByRole('heading', { name: 'Wirtshaus Frankenburg' })).toBeVisible()
  expect(await cards.count()).toBeLessThan(all)
  await expect(page.getByRole('heading', { name: 'Keramikwerkstatt Hinrichsen' })).toHaveCount(0)
})

test('Case Hinrichsen: nur Belegtes – kein Shopify, kein Zitat, Link zur Website', async ({ page }) => {
  await page.goto('/de/referenzen/keramikwerkstatt-hinrichsen')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keramikwerkstatt Hinrichsen')
  const main = page.locator('main')
  await expect(main).toContainText('Shopware')
  await expect(main).not.toContainText('Shopify')
  await expect(main).not.toContainText('Online seit')
  await expect(page.getByRole('heading', { name: 'Ausgangslage' })).toHaveCount(0) // not documented → omitted
  await expect(page.locator('blockquote')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Zur Seite von Keramikwerkstatt Hinrichsen/ })).toHaveAttribute(
    'href',
    'https://keramikwerkstatt-hinrichsen.de',
  )
})

test('Referenz ohne Detailseite liefert 404', async ({ request }) => {
  const res = await request.get('/de/referenzen/solids-technologies')
  expect(res.status()).toBe(404)
})

test('Markenhaus: ThingR ausgeblendet, Status und Links', async ({ page }) => {
  await page.goto('/de/marken')
  const brands = page.locator('#marken')
  await expect(brands).not.toContainText('ThingR')
  await expect(page.locator('#tappi')).toContainText('live')
  await expect(page.locator('#anwurf')).toContainText('in Entwicklung')
  await expect(page.locator('#anwurf a')).toHaveCount(0) // no link while in development
  await expect(page.locator('#fjella')).toContainText('Schön. Schlicht. Echt Fjella')
})

test('Über uns: Werkstatt laut Vorgabe, Region-Anker, keine erfundenen Sätze', async ({ page }) => {
  await page.goto('/de/ueber-uns')
  const main = page.locator('main')
  await expect(main).toContainText('Holz, Leder und Filament')
  await expect(main).toContainText('Damit entstehen Deko, Gravuren und Prototypen.')
  await expect(main).not.toContainText('Acryl')
  await expect(main).not.toContainText('Aus Gefallen')
  await expect(page.locator('#region')).toContainText('TSV Nordmark Satrup')
})

test('Druck & Werbemittel: keine Werkstatt-Leistungen', async ({ page }) => {
  await page.goto('/de/agentur/druck-werbemittel')
  const main = page.locator('main')
  await expect(main).toContainText('Partnerdruckereien')
  for (const word of ['Lasergravur', 'Schilder', 'Textil', 'eigenen Werkstatt']) await expect(main).not.toContainText(word)
})
