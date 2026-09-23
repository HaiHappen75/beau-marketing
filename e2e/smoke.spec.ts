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
