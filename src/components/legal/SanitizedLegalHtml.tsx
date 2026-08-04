import parse from 'html-react-parser'

import type { WebsiteLegalText } from '@/lib/erecht24'

/**
 * Renders a legal text coming from lib/erecht24.ts — the only path this markup
 * takes to the page. Two layers: getWebsiteLegalText returns allowlist-sanitised
 * markup (sanitize-html), and html-react-parser turns it into real React
 * elements instead of injecting a raw string into the DOM.
 *
 * Reuses the `.rich` prose styles of the Lexical RichText component; `.legal`
 * only adds what eRecht24 markup brings on top (its own h1, tables).
 */
export function SanitizedLegalHtml({ legal }: { legal: WebsiteLegalText }) {
  return <div className="rich legal">{parse(legal.html)}</div>
}
