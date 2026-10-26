/**
 * E2E fixture for the guide (never part of the seed — real articles come from
 * the editorial process). Usage:
 *   E2E_FIXTURES=1 FIXTURE_ACTION=up|rename|guard|user|down pnpm payload run e2e/fixtures/posts.ts
 * `guard` tries to save preview-host links (src/hooks/previewLinkGuard.ts) and prints
 * what happened; `user` adds an editor login (password from E2E_PASSWORD) for the
 * REST check. Refuses to run against anything but a local database.
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
const USER = 'e2e-waechter@localhost.test'

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
const paragraph = (...children: object[]) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children })
const link = (t: string, url: string) => ({
  type: 'link',
  format: '',
  indent: 0,
  version: 3,
  direction: 'ltr',
  fields: { url, newTab: false, linkType: 'custom' },
  children: [text(t)],
})
// Same shape the admin editor stores: header row + header column (its insert default).
const table = (rows: string[][]) => ({
  type: 'table',
  format: '',
  indent: 0,
  version: 1,
  direction: null,
  colWidths: rows[0].map(() => 92),
  children: rows.map((cells, r) => ({
    type: 'tablerow',
    format: '',
    indent: 0,
    version: 1,
    direction: null,
    children: cells.map((t, c) => ({
      type: 'tablecell',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      colSpan: 1,
      rowSpan: 1,
      backgroundColor: null,
      headerState: (r === 0 ? 1 : 0) | (c === 0 ? 2 : 0),
      children: [block('paragraph', t)],
    })),
  })),
})

const SHORT =
  'Das ist eine Kurzantwort für den automatischen Test. Sie hat genug Wörter, um die Regel von vierzig bis sechzig Wörtern zu erfüllen, und steht als hervorgehobener Block direkt unter der Überschrift des Artikels. Mehr muss sie nicht können, denn sie prüft nur den Aufbau der Seite und nichts sonst.'

async function one(collection: 'categories' | 'authors' | 'services', slug: string) {
  const { docs } = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  if (!docs[0]) throw new Error(`fixture: ${collection}/${slug} missing — run pnpm seed first`)
  return docs[0].id
}

async function down() {
  await payload.delete({ collection: 'posts', where: { slug: { like: 'e2e-' } } })
  await payload.delete({ collection: 'pages', where: { slug: { like: 'e2e-' } } })
  await payload.delete({ collection: 'redirects', where: { from: { like: '/ratgeber/e2e-' } } })
  await payload.delete({ collection: 'media', where: { alt: { equals: ALT } } })
  await payload.delete({ collection: 'users', where: { email: { equals: USER } } })
}

/** Test image plus the seeded relations every post needs. */
async function postBase() {
  const media = await payload.create({
    collection: 'media',
    filePath: `${process.cwd()}/public/brand/beau-marketing-logo.png`,
    data: { alt: ALT, credit: { author: 'Beau Marketing', source: 'E2E', license: 'Test' } },
  })
  return {
    shortAnswer: SHORT,
    excerpt: 'Testartikel für den automatischen Durchlauf.',
    category: await one('categories', 'websites'),
    author: await one('authors', 'stephan-beau'),
    service: await one('services', 'shopify-shops'),
    heroImage: media.id,
    publishedAt: '2026-09-01T10:00:00.000Z',
  }
}

/** Runs a save and reports it as one line: "<label> saved" or "<label> blocked: <path>: <message>". */
async function attempt(label: string, save: () => Promise<unknown>) {
  try {
    await save()
    console.log(`${label} saved`)
  } catch (e) {
    const errors = (e as { data?: { errors?: { path: string; message: string }[] } }).data?.errors ?? []
    console.log(`${label} blocked: ${errors.map((x) => `${x.path}: ${x.message}`).join(' | ') || (e as Error).message}`)
  }
}

if (action === 'down') {
  await down()
} else if (action === 'up') {
  await down()
  const base = await postBase()
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
  await payload.create({
    collection: 'posts',
    data: {
      ...base,
      _status: 'published',
      title: 'E2E-Tabelle',
      slug: 'e2e-tabelle',
      content: body([
        block('paragraph', 'Vor der Tabelle.'),
        table([
          ['Kriterium', 'Baukasten', 'WordPress', 'Individuell', 'Anmerkung'],
          ['Einrichtung', 'Stunden', 'Tage', 'Wochen', 'grobe Größenordnung'],
          ['Pflege', 'selbst', 'selbst oder Agentur', 'Agentur', 'je nach Vertrag'],
          ['Erweiterbar', 'begrenzt', 'über Plugins', 'frei', '–'],
        ]),
        block('paragraph', 'Nach der Tabelle.'),
      ]) as never,
    },
  })
} else if (action === 'guard') {
  await down()
  const base = await postBase()
  await attempt('post with preview link', () =>
    payload.create({
      collection: 'posts',
      data: {
        ...base,
        _status: 'published',
        title: 'E2E-Vorschaulink',
        slug: 'e2e-vorschaulink',
        content: body([paragraph(text('Siehe '), link('Website Start', 'https://www.claudeusercontent.com/de/agentur/websites'))]) as never,
      },
    }),
  )
  // A draft page: the guard holds for drafts too, and for rich text inside blocks.
  await attempt('page with localhost link', () =>
    payload.create({
      collection: 'pages',
      draft: true,
      data: {
        _status: 'draft',
        title: 'E2E-Seite',
        slug: 'e2e-seite',
        layout: [{ blockType: 'textImage', body: body([paragraph(link('Kontakt', 'http://localhost:3000/de/kontakt'))]) as never }],
      },
    }),
  )
  await attempt('post with external source', () =>
    payload.create({
      collection: 'posts',
      data: {
        ...base,
        _status: 'published',
        title: 'E2E-Quelle',
        slug: 'e2e-quelle',
        content: body([paragraph(text('Laut '), link('Beispielquelle', 'https://example.org/quelle'))]) as never,
      },
    }),
  )
  await down()
} else if (action === 'user') {
  await down()
  await payload.create({
    collection: 'users',
    data: { email: USER, username: 'e2e-waechter', password: process.env.E2E_PASSWORD ?? '', role: 'redaktion' },
  })
} else if (action === 'rename') {
  // Two slug changes in a row: both old URLs must lead straight to the final one.
  const { docs } = await payload.find({ collection: 'posts', where: { slug: { equals: 'e2e-testartikel' } }, limit: 1 })
  await payload.update({ collection: 'posts', id: docs[0].id, data: { slug: 'e2e-testartikel-neu' } })
  await payload.update({ collection: 'posts', id: docs[0].id, data: { slug: 'e2e-testartikel-final' } })
} else {
  console.error('fixture: FIXTURE_ACTION must be up, rename, guard, user or down')
  process.exit(1)
}
console.log(`fixture ${action}: ok`)
process.exit(0)
