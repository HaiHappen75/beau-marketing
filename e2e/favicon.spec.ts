import { expect, test, type Page } from '@playwright/test'

// Favicon set "square with tick": src/app/icon.svg (switches with the colour
// scheme), favicon.ico (48/32/16) and apple-icon.png (180, opaque), all via the
// Next metadata convention — one link each in the head, in every language.

const hrefOf = async (page: Page, selector: string) => (await page.locator(selector).getAttribute('href'))!

for (const locale of ['de', 'da', 'en']) {
  test(`/${locale}: genau ein SVG-, ein ICO- und ein Apple-Icon-Link`, async ({ page }) => {
    await page.goto(`/${locale}`)
    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveCount(1)
    await expect(page.locator('link[rel="icon"][type="image/x-icon"]')).toHaveCount(1)
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1)
    // No duplicates, no stale "shortcut icon" or leftover links.
    await expect(page.locator('link[rel~="icon"], link[rel="apple-touch-icon"]')).toHaveCount(3)
  })
}

test('favicon.ico: 200, Icon-Typ, Einträge 48/32/16 px', async ({ request }) => {
  const res = await request.get('/favicon.ico')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toMatch(/^image\/(x-icon|vnd\.microsoft\.icon)/)
  const ico = await res.body()
  expect(ico.readUInt16LE(2)).toBe(1) // type: icon
  const count = ico.readUInt16LE(4)
  const sizes = Array.from({ length: count }, (_, i) => ico[6 + 16 * i])
  expect(sizes).toEqual([48, 32, 16])
})

test('icon.svg schaltet mit dem Farbschema, apple-icon.png ist 180 × 180', async ({ page, request }) => {
  await page.goto('/de')

  const svg = await request.get(await hrefOf(page, 'link[rel="icon"][type="image/svg+xml"]'))
  expect(svg.status()).toBe(200)
  expect(await svg.text()).toContain('prefers-color-scheme')

  const apple = await request.get(await hrefOf(page, 'link[rel="apple-touch-icon"]'))
  expect(apple.status()).toBe(200)
  const png = await apple.body()
  // IHDR: width and height as big-endian uint32 at bytes 16 and 20.
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([180, 180])
})

test('Admin: Favicon ist dieselbe icon.svg, kein Payload-Standard', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/icon.svg')
  const hrefs = await page.locator('link[rel~="icon"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')))
  expect(hrefs.join(' ')).not.toContain('payload-favicon')
})
