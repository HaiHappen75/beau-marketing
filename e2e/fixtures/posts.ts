/**
 * E2E fixture for the guide (never part of the seed — real articles come from
 * the editorial process). Usage:
 *   E2E_FIXTURES=1 FIXTURE_ACTION=up|rename|down pnpm payload run e2e/fixtures/posts.ts
 * Refuses to run against anything but a local database.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const action = process.env.FIXTURE_ACTION
const uri = process.env.DATABASE_URI ?? ''
if (process.env.E2E_FIXTURES !== '1' || !/@(localhost|127\.0\.0\.1)[:/]/.test(uri)) {
  console.error('fixture: refused (needs E2E_FIXTURES=1 and a localhost DATABASE_URI)')
  process.exit(1)
}

const payload = await getPayload({ config })
const ALT = 'E2E-Testbild'

const text = (t: string) => ({ type: 'text', text: t, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })
const block = (type: string, t: string, tag?: string) => ({
  type,
  ...(tag ? { tag } : {}),
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  ...(type === 'paragraph' ? { textFormat: 0 } : {}),
  children: [text(t)],
})
const body = (nodes: object[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: nodes } })

const SHORT =
  'Das ist eine Kurzantwort für den automatischen Test. Sie hat genug Wörter, um die Regel von vierzig bis sechzig Wörtern zu erfüllen, und steht als hervorgehobener Block direkt unter der Überschrift des Artikels. Mehr muss sie nicht können, denn sie prüft nur den Aufbau der Seite und nichts sonst.'

async function one(collection: 'categories' | 'authors' | 'services', slug: string) {
  const { docs } = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  if (!docs[0]) throw new Error(`fixture: ${collection}/${slug} missing — run pnpm seed first`)
  return docs[0].id
}

async function down() {
  await payload.delete({ collection: 'posts', where: { slug: { like: 'e2e-' } } })
  await payload.delete({ collection: 'redirects', where: { from: { like: '/ratgeber/e2e-' } } })
  await payload.delete({ collection: 'media', where: { alt: { equals: ALT } } })
}

if (action === 'down') {
  await down()
} else if (action === 'up') {
  await down()
  const media = await payload.create({
    collection: 'media',
    filePath: `${process.cwd()}/public/brand/beau-marketing-logo.png`,
    data: { alt: ALT, credit: { author: 'Beau Marketing', source: 'E2E', license: 'Test' } },
  })
  const category = await one('categories', 'websites')
  const author = await one('authors', 'stephan-beau')
  const service = await one('services', 'shopify-shops')
  const base = {
    shortAnswer: SHORT,
    excerpt: 'Testartikel für den automatischen Durchlauf.',
    category,
    author,
    service,
    heroImage: media.id,
    publishedAt: '2026-09-01T10:00:00.000Z',
  }
  await payload.create({
    collection: 'posts',
    data: {
      ...base,
      _status: 'published',
      title: 'E2E-Testartikel: *Aufbau* und Anker',
      slug: 'e2e-testartikel',
      ctaPackage: 'Pflichtangaben-Update',
      contentUpdatedAt: '2026-09-15T10:00:00.000Z',
      reviewedAt: '2026-09-15T10:00:00.000Z',
      content: body([
        block('heading', 'Eine Überschrift erster Ordnung im Text', 'h1'),
        block('paragraph', 'Einleitung des Testartikels.'),
        block('heading', 'Zweiter Abschnitt', 'h2'),
        block('paragraph', 'Text im zweiten Abschnitt.'),
        block('heading', 'Ein Unterabschnitt', 'h3'),
        block('paragraph', 'Text im Unterabschnitt.'),
        block('heading', 'Dritter Abschnitt', 'h2'),
        block('paragraph', 'Text im dritten Abschnitt.'),
        block('heading', 'Vierter Abschnitt', 'h2'),
        block('paragraph', 'Text im vierten Abschnitt nach der CTA-Box.'),
      ]) as never,
      faq: [
        { question: 'Testfrage eins?', answer: 'Testantwort eins.' },
        { question: 'Testfrage zwei?', answer: 'Testantwort zwei.' },
      ],
      sources: [{ title: 'Beispielquelle', url: 'https://example.org/quelle' }],
    },
  })
  await payload.create({
    collection: 'posts',
    data: { ...base, _status: 'published', title: 'E2E-Zweiter Artikel', slug: 'e2e-zweiter-artikel', content: body([block('paragraph', 'Kurz.')]) as never },
  })
  await payload.create({
    collection: 'posts',
    draft: true,
    data: { ...base, _status: 'draft', title: 'E2E-Entwurf', slug: 'e2e-entwurf', content: body([block('paragraph', 'Entwurf.')]) as never },
  })
} else if (action === 'rename') {
  // Two slug changes in a row: both old URLs must lead straight to the final one.
  const { docs } = await payload.find({ collection: 'posts', where: { slug: { equals: 'e2e-testartikel' } }, limit: 1 })
  await payload.update({ collection: 'posts', id: docs[0].id, data: { slug: 'e2e-testartikel-neu' } })
  await payload.update({ collection: 'posts', id: docs[0].id, data: { slug: 'e2e-testartikel-final' } })
} else {
  console.error('fixture: FIXTURE_ACTION must be up, rename or down')
  process.exit(1)
}
console.log(`fixture ${action}: ok`)
process.exit(0)
