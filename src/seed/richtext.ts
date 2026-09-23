// Minimal Lexical helpers for seed data and legacy comparison.

type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }
export type RichTextValue = { root: LexicalNode & { children: LexicalNode[] } }

export const isRichText = (v: unknown): v is RichTextValue =>
  Boolean(v && typeof v === 'object' && 'root' in (v as object))

/** Build a Lexical state from plain paragraphs. */
export function rt(paragraphs: string[]): RichTextValue {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      })),
    },
  } as RichTextValue
}

export const nodeText = (node: LexicalNode): string =>
  node.text ?? (node.children ?? []).map(nodeText).join('')

/** Plain text of each top-level block (paragraph, heading, …). */
export const paragraphsOf = (value: RichTextValue): string[] =>
  value.root.children.map(nodeText).map((t) => t.trim())
