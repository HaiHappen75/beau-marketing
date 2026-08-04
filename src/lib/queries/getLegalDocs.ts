import { getPayloadClient } from '@/lib/getPayload'
import { toPayloadLocale, type Locale } from '@/lib/locale'
import type { Agb, Widerruf } from '@/payload-types'

// Legal texts still maintained in Payload. Impressum and Datenschutz come from
// eRecht24 instead (src/lib/erecht24.ts) — their API does not serve these two.

export async function getWiderruf(locale: Locale): Promise<Widerruf> {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'widerruf',
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    depth: 1,
  })
}

export async function getAGB(locale: Locale): Promise<Agb> {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'agb',
    locale: toPayloadLocale(locale),
    fallbackLocale: toPayloadLocale('de'),
    depth: 1,
  })
}

type LexicalNode = { text?: string; children?: LexicalNode[] }

function hasText(nodes: LexicalNode[]): boolean {
  return nodes.some(
    (node) =>
      (typeof node.text === 'string' && node.text.trim().length > 0) ||
      (Array.isArray(node.children) && hasText(node.children)),
  )
}

/**
 * True when the global actually holds text. A freshly created Lexical field is
 * not empty but holds one blank paragraph — an untouched AGB global would
 * otherwise render an empty page and a dead footer link.
 */
export function hasContent(doc: { content?: unknown } | null | undefined): boolean {
  const root = (doc?.content as { root?: { children?: LexicalNode[] } } | undefined)?.root
  return Array.isArray(root?.children) ? hasText(root.children) : false
}
