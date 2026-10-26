// Rich-text links that point at a preview or local host instead of the live site.
// A pure decision without any Payload or Next import, so it is unit-testable in a
// Playwright spec (e2e/link-waechter.spec.ts); src/hooks/previewLinkGuard.ts wires it.
//
// Background (26.10.2026): six internal links in a guide article pointed at
// www.claudeusercontent.com/de/… — pasted from an HTML preview.

import { isLexical, nodeText } from './lexical'

/**
 * Hosts a link may never point at. A match is the host itself or any subdomain
 * (www., *.vercel.app). claude.ai is deliberately missing: in an AI guide it can be
 * a legitimate source. The project configuration (.env.example, DEPLOY.md,
 * next.config.mjs) names no staging or Coolify preview host — add one here if it does.
 */
export const BLOCKED_LINK_HOSTS = ['claudeusercontent.com', 'localhost', '127.0.0.1', 'vercel.app', 'netlify.app'] as const

/** The live domain the message suggests — not SITE_URL, which is localhost (itself blocked) locally. */
const LIVE_ORIGIN = 'https://beau-marketing.de'

/** A host-like value without a scheme: "www.example.com/x", "localhost:3000/x". */
const BARE_HOST = /^(?:localhost|[a-z0-9-]+(?:\.[a-z0-9-]+)+)(?::\d+)?(?:[/?#]|$)/i

const parse = (raw: string): URL | null => {
  const value = raw.trim()
  const absolute = value.startsWith('//') ? `https:${value}` : BARE_HOST.test(value) ? `https://${value}` : value
  try {
    return new URL(absolute)
  } catch {
    return null // relative path, anchor or not a URL at all
  }
}

/** The blocked host of a link URL (without "www."), or null when the link is fine. */
export function blockedLinkHost(raw: string): string | null {
  const url = parse(raw)
  if (!url || (url.protocol !== 'http:' && url.protocol !== 'https:')) return null
  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  const hit = BLOCKED_LINK_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
  return hit ? host.replace(/^www\./, '') : null
}

export type PreviewLink = {
  /** Field path, e.g. `content` or `layout.2.body`. */
  path: string
  text: string
  url: string
  host: string
}

type Node = { type?: string; text?: string; children?: Node[]; fields?: { url?: unknown; linkType?: unknown } }

const linksIn = (n: Node): Node[] => [
  ...(n.type === 'link' || n.type === 'autolink' ? [n] : []),
  ...(n.children ?? []).flatMap(linksIn),
]

/** Every link inside the Lexical states anywhere in `data` that points at a blocked host. */
export function findPreviewLinks(data: unknown, path = ''): PreviewLink[] {
  const at = (key: string | number) => (path ? `${path}.${key}` : String(key))
  if (isLexical(data)) {
    return linksIn(data.root as Node).flatMap((link) => {
      const url = link.fields?.url
      if (link.fields?.linkType === 'internal' || typeof url !== 'string') return []
      const host = blockedLinkHost(url)
      return host ? [{ path, text: nodeText(link).trim() || url, url, host }] : []
    })
  }
  if (Array.isArray(data)) return data.flatMap((v, i) => findPreviewLinks(v, at(i)))
  if (data && typeof data === 'object') return Object.entries(data).flatMap(([k, v]) => findPreviewLinks(v, at(k)))
  return []
}

/**
 * "Link ‚Website Start‘ zeigt auf claudeusercontent.com – bitte durch
 * https://beau-marketing.de/de/agentur/websites ersetzen." The path is only carried
 * over when it looks like one of this site's (/de, /en, /da); otherwise "/…".
 */
export function previewLinkMessage(link: PreviewLink): string {
  const url = parse(link.url)
  const path = url && /^\/(?:de|en|da)(?:\/|$)/.test(url.pathname) ? url.pathname + url.search + url.hash : '/…'
  return `Link ‚${link.text}‘ zeigt auf ${link.host} – bitte durch ${LIVE_ORIGIN}${path} ersetzen.`
}
