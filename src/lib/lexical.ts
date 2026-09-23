// Helpers for Lexical rich text on the frontend (guide articles, cases).

type Node = { type?: string; tag?: string; text?: string; children?: Node[] }
export type LexicalState = { root: Node & { children: Node[] } }

export const isLexical = (v: unknown): v is LexicalState =>
  Boolean(v && typeof v === 'object' && 'root' in (v as object) && Array.isArray((v as LexicalState).root?.children))

export const nodeText = (n: Node): string => n.text ?? (n.children ?? []).map(nodeText).join('')

/** True when the editor state holds any visible text. */
export const hasText = (v: unknown): boolean => isLexical(v) && v.root.children.some((n) => nodeText(n).trim() !== '')

/** URL fragment from a heading text (German/Danish transliteration, like slugs). */
export const anchorId = (text: string): string =>
  text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'abschnitt'

export type TocItem = { id: string; text: string; level: 2 | 3 }

/**
 * Headings for the table of contents, in document order. A body H1 counts as H2
 * (it is rendered as H2 — the article title is the only H1). Ids are unique;
 * the heading converter consumes them in the same order.
 */
export function tocOf(v: unknown, reserved: string[] = []): TocItem[] {
  if (!isLexical(v)) return []
  const used = new Set(reserved)
  const out: TocItem[] = []
  for (const n of v.root.children) {
    if (n.type !== 'heading') continue
    const level = n.tag === 'h3' ? 3 : n.tag === 'h1' || n.tag === 'h2' ? 2 : null
    if (!level) continue
    const text = nodeText(n).trim()
    if (!text) continue
    let id = anchorId(text)
    for (let i = 2; used.has(id); i++) id = `${anchorId(text)}-${i}`
    used.add(id)
    out.push({ id, text, level })
  }
  return out
}

/** Reading time in minutes (200 words per minute, at least 1). */
export function readingMinutes(...parts: unknown[]): number {
  const text = parts
    .map((p) => (typeof p === 'string' ? p : isLexical(p) ? p.root.children.map(nodeText).join(' ') : ''))
    .join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** Splits the top-level nodes before the n-th H2 (1-based); without it, all go first. */
export function splitBeforeH2(v: LexicalState, n: number): [LexicalState, LexicalState | null] {
  let count = 0
  const idx = v.root.children.findIndex((c) => {
    if (c.type === 'heading' && (c.tag === 'h2' || c.tag === 'h1')) count++
    return count === n
  })
  if (idx <= 0) return [v, null]
  return [
    { root: { ...v.root, children: v.root.children.slice(0, idx) } },
    { root: { ...v.root, children: v.root.children.slice(idx) } },
  ]
}
