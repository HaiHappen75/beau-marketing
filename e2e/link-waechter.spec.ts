import { execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { expect, test } from '@playwright/test'

import { blockedLinkHost, findPreviewLinks, previewLinkMessage } from '../src/lib/previewLinks'

// Link guard (26.10.2026): rich-text links to preview or local hosts block saving
// in guide articles and pages; real sources stay allowed. First the pure decision,
// then — only with E2E_FIXTURES=1 and a local DATABASE_URI — real saves.

const text = (t: string) => ({ type: 'text', text: t })
const link = (t: string, url: string, linkType = 'custom') => ({ type: 'link', fields: { url, linkType }, children: [text(t)] })
const lexical = (...children: object[]) => ({ root: { type: 'root', children: [{ type: 'paragraph', children }] } })

test('Link-Wächter (Erkennung): Vorschau-Hosts mit allen Varianten, normale Links erlaubt', () => {
  const blocked: [string, string][] = [
    ['https://www.claudeusercontent.com/de/agentur/websites', 'claudeusercontent.com'],
    ['http://claudeusercontent.com/', 'claudeusercontent.com'],
    ['https://abc123.claudeusercontent.com/x?y=1#z', 'abc123.claudeusercontent.com'],
    ['HTTPS://WWW.ClaudeUserContent.COM/De', 'claudeusercontent.com'],
    ['https://claudeusercontent.com./de', 'claudeusercontent.com'],
    ['www.claudeusercontent.com/de/kontakt', 'claudeusercontent.com'],
    ['//www.claudeusercontent.com/de', 'claudeusercontent.com'],
    ['https://beau-marketing.de@claudeusercontent.com/de', 'claudeusercontent.com'],
    ['http://localhost:3000/de/kontakt', 'localhost'],
    ['localhost:3000/de', 'localhost'],
    ['http://127.0.0.1:3000/de', '127.0.0.1'],
    ['https://beau-marketing-git-main.vercel.app/de', 'beau-marketing-git-main.vercel.app'],
    ['https://preview.netlify.app', 'preview.netlify.app'],
  ]
  for (const [url, host] of blocked) expect(blockedLinkHost(url), url).toBe(host)

  const allowed = [
    // claude.ai deliberately stays allowed: in an AI guide it can be a real source.
    'https://claude.ai/new',
    'https://www.claude.ai/x',
    'https://beau-marketing.de/de/kontakt',
    'https://www.beau-marketing.de/de',
    'https://example.org/?ref=claudeusercontent.com',
    'https://example.org/localhost',
    'https://notclaudeusercontent.com/',
    'https://claudeusercontent.com.example.org/',
    '/de/kontakt',
    '#faq',
    '?x=1',
    'mailto:info@beau-marketing.de',
    'tel:+4946332029925',
    '',
  ]
  for (const url of allowed) expect(blockedLinkHost(url), url).toBeNull()
})

test('Link-Wächter (Erkennung): Feldpfad, Linktext, auch in Blöcken und Tabellenzellen', () => {
  const tableCell = {
    root: {
      type: 'root',
      children: [{ type: 'table', children: [{ type: 'tablerow', children: [{ type: 'tablecell', children: [{ type: 'paragraph', children: [link('Website Start', 'https://www.claudeusercontent.com/de/agentur/websites')] }] }] }] }],
    },
  }
  const data = {
    title: 'localhost',
    layout: [{ blockType: 'cta' }, { blockType: 'textImage', body: lexical(text('Zum '), link('Kontakt', 'http://localhost:3000/de/kontakt')) }],
    content: tableCell,
    other: lexical(link('Intern', 'http://localhost:3000/x', 'internal'), link('Quelle', 'https://example.org'), { type: 'autolink', fields: { url: 'https://x.netlify.app' }, children: [] }),
  }
  expect(findPreviewLinks(data)).toEqual([
    { path: 'layout.1.body', text: 'Kontakt', url: 'http://localhost:3000/de/kontakt', host: 'localhost' },
    { path: 'content', text: 'Website Start', url: 'https://www.claudeusercontent.com/de/agentur/websites', host: 'claudeusercontent.com' },
    { path: 'other', text: 'https://x.netlify.app', url: 'https://x.netlify.app', host: 'x.netlify.app' },
  ])

  const [contact, start, preview] = findPreviewLinks(data)
  expect(previewLinkMessage(start)).toBe(
    'Link ‚Website Start‘ zeigt auf claudeusercontent.com – bitte durch https://beau-marketing.de/de/agentur/websites ersetzen.',
  )
  expect(previewLinkMessage(contact)).toBe('Link ‚Kontakt‘ zeigt auf localhost – bitte durch https://beau-marketing.de/de/kontakt ersetzen.')
  // A path that is not one of this site's is not carried over.
  expect(previewLinkMessage(preview)).toContain('bitte durch https://beau-marketing.de/… ersetzen.')
})

const fixture = (action: 'guard' | 'user' | 'down', env: Record<string, string> = {}) =>
  execFileSync('pnpm', ['-s', 'payload', 'run', 'e2e/fixtures/posts.ts'], {
    env: { ...process.env, FIXTURE_ACTION: action, ...env },
    stdio: 'pipe',
    // Windows: pnpm is a .cmd shim, which only a shell resolves.
    shell: process.platform === 'win32',
  }).toString('utf8')

test.describe.serial('Link-Wächter beim Speichern', () => {
  test.skip(process.env.E2E_FIXTURES !== '1', 'needs E2E_FIXTURES=1 and a local DATABASE_URI')
  test.afterAll(() => {
    fixture('down')
  })

  test('Vorschau-Link blockiert Artikel und Seite (auch als Entwurf), externe Quelle klappt', () => {
    const out = fixture('guard')
    expect(out).toContain(
      'post with preview link blocked: content: Link ‚Website Start‘ zeigt auf claudeusercontent.com – bitte durch https://beau-marketing.de/de/agentur/websites ersetzen.',
    )
    expect(out).toContain(
      'page with localhost link blocked: layout.0.body: Link ‚Kontakt‘ zeigt auf localhost – bitte durch https://beau-marketing.de/de/kontakt ersetzen.',
    )
    expect(out).toContain('post with external source saved')
  })

  test('REST (wie das Admin): Meldung im Toast-Text und mit Feldpfad, damit das Feld markiert wird', async ({ request }) => {
    const password = `E2e-${randomUUID()}`
    fixture('user', { E2E_PASSWORD: password })
    const login = await request.post('/api/users/login', { data: { email: 'e2e-waechter@localhost.test', password } })
    expect(login.status()).toBe(200)
    const { token } = await login.json()

    const t = (s: string) => ({ type: 'text', text: s, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })
    const node = { format: '', indent: 0, direction: 'ltr' }
    const body = {
      root: {
        type: 'root',
        version: 1,
        ...node,
        children: [
          {
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            ...node,
            children: [{ type: 'link', version: 3, ...node, fields: { url: 'http://localhost:3000/de/kontakt', newTab: false, linkType: 'custom' }, children: [t('Kontakt')] }],
          },
        ],
      },
    }
    const res = await request.post('/api/pages?draft=true', {
      headers: { Authorization: `JWT ${token}` },
      data: { _status: 'draft', title: 'E2E-REST', slug: 'e2e-rest', layout: [{ blockType: 'textImage', body }] },
    })
    expect(res.status()).toBe(400)
    const json = await res.json()
    const message = 'Link ‚Kontakt‘ zeigt auf localhost – bitte durch https://beau-marketing.de/de/kontakt ersetzen.'
    // The admin toasts errors[].message and marks the field from data.errors[] (src/hooks/previewLinkGuard.ts).
    expect(json.errors[0].message).toContain(message)
    expect(json.errors[0].data.errors).toEqual([expect.objectContaining({ path: 'layout.0.body', message })])
  })
})
