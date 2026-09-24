import { execFileSync } from 'node:child_process'

import { expect, test, type Page } from '@playwright/test'

// Brand cards with screenshot. Runs only with E2E_FIXTURES=1 and a local
// DATABASE_URI: e2e/fixtures/brand-screenshots.ts gives Tappi a landscape
// screenshot + logo and Huusbook a portrait one, and restores both afterwards.

const fixture = (action: 'up' | 'down') =>
  execFileSync('pnpm', ['-s', 'payload', 'run', 'e2e/fixtures/brand-screenshots.ts'], {
    env: { ...process.env, FIXTURE_ACTION: action },
    stdio: 'pipe',
  })

const brandsInGraph = async (page: Page) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  return blocks
    .flatMap((b) => {
      const data = JSON.parse(b)
      return Array.isArray(data['@graph']) ? data['@graph'] : [data]
    })
    .filter((n: { '@type': string }) => n['@type'] === 'Brand') as Record<string, string>[]
}

test.describe.serial('Markenkarten mit Screenshot', () => {
  test.skip(process.env.E2E_FIXTURES !== '1', 'needs E2E_FIXTURES=1 and a local DATABASE_URI')
  test.beforeAll(() => {
    fixture('up')
  })
  test.afterAll(() => {
    fixture('down')
  })

  test('Tappi: Querformat, Alt-Text, stabiles 16:10, cover', async ({ page }) => {
    await page.goto('/de/marken')
    const card = page.locator('li#tappi')
    const img = card.locator('img')
    await expect(img).toHaveCount(1)
    await expect(img).toHaveAttribute('alt', /\S/)
    await expect(img).toHaveAttribute('loading', 'lazy')
    await expect(img).toHaveAttribute('sizes', /212px/)
    const box = img.locator('xpath=..')
    const before = await box.boundingBox()
    await img.scrollIntoViewIfNeeded()
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
    const after = await box.boundingBox()
    expect(Math.abs(after!.width / after!.height - 1.6)).toBeLessThan(0.02)
    expect(after!.height).toBeCloseTo(before!.height, 0) // no layout shift
    expect(await img.evaluate((el) => getComputedStyle(el).objectFit)).toBe('cover')
    // The image sits above the name, which stays a text heading.
    await expect(card.locator('p').first()).toHaveText('Tappi')
  })

  test('Huusbook: nur Hochformat → contain, nie beschnitten', async ({ page }) => {
    await page.goto('/de/marken')
    const img = page.locator('li#huusbook img')
    await expect(img).toHaveCount(1)
    expect(await img.evaluate((el) => getComputedStyle(el).objectFit)).toBe('contain')
  })

  test('Karte ohne Screenshot unverändert, höchstens ein Link je Karte', async ({ page }) => {
    await page.goto('/de/marken')
    const fjella = page.locator('li#fjella')
    await expect(fjella.locator('img')).toHaveCount(0)
    await expect(fjella.locator('p').first()).toHaveText('Fjella')
    await expect(fjella.getByRole('link')).toHaveCount(1)
    for (const card of await page.locator('#marken li').all()) {
      expect(await card.locator('a').count()).toBeLessThanOrEqual(1)
    }
  })

  test('alle Sprachen zeigen das Bild', async ({ page }) => {
    for (const locale of ['de', 'da', 'en']) {
      await page.goto(`/${locale}/marken`)
      await expect(page.locator('li#tappi img'), locale).toHaveAttribute('alt', /\S/)
    }
  })

  test('JSON-LD: logo und image nur, wo gepflegt, als absolute URL', async ({ page }) => {
    await page.goto('/de/marken')
    const brands = await brandsInGraph(page)
    const bySlug = (s: string) => brands.find((b) => b['@id'].endsWith(`#${s}`))!
    expect(bySlug('tappi').logo).toMatch(/^https?:\/\/[^/]+\/api\/media\/file\/e2e-marke-logo/)
    expect(bySlug('tappi').image).toMatch(/^https?:\/\/[^/]+\/api\/media\/file\/e2e-marke-quer/)
    expect(bySlug('huusbook').image).toMatch(/e2e-marke-hoch/)
    expect(bySlug('fjella')).not.toHaveProperty('image')
    expect(bySlug('anwurf')).not.toHaveProperty('logo')
    expect(bySlug('anwurf')).not.toHaveProperty('image')
  })
})

test('Markennamen laufen bei keiner Breite über den Kartenrand', async ({ page }) => {
  for (const width of [390, 480, 640, 700, 768, 820, 900, 1024, 1100, 1180, 1280, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/de/marken')
    const names = page.locator('#marken li > p:first-of-type')
    await expect(page.locator('#marken li', { hasText: 'FamilyManager' })).toHaveCount(1) // the long name is rendered
    for (const name of await names.all()) {
      const { scroll, client, text } = await name.evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth, text: el.textContent }))
      expect(scroll, `${text} @ ${width}px`).toBeLessThanOrEqual(client)
    }
  }
})
