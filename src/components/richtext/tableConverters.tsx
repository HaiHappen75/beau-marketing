import type { SerializedTableCellNode, SerializedTableRowNode } from '@payloadcms/richtext-lexical'
import type { JSXConverters } from '@payloadcms/richtext-lexical/react'

// Lexical's TableCellHeaderStates bit field (@lexical/table is not a direct dependency).
const ROW_HEADER = 1
const COLUMN_HEADER = 2

/**
 * Tables in guide articles (Lexical table feature, src/collections/Posts.ts).
 * Unlike Payload's built-in converter: a real <thead> — the first row is the head,
 * header flag or not — a scope on every <th>, and no inline styles (the built-in one
 * hard-codes border/padding, which beats any stylesheet; the look comes from
 * .article-table in globals.css). In the body, the editor's header flags decide:
 * header column → row header, extra header row → column header. The wrapper scrolls
 * on narrow screens instead of the page; tabIndex makes it scrollable by keyboard.
 */
export const tableConverters: JSXConverters = {
  table: ({ node, nodesToJSX }) => {
    const [head, ...body] = node.children as SerializedTableRowNode[]
    const cells = (row: SerializedTableRowNode, scopeOf: (c: SerializedTableCellNode) => 'col' | 'row' | undefined) =>
      (row.children as SerializedTableCellNode[]).map((c, i) => {
        const scope = scopeOf(c)
        const Tag = scope ? 'th' : 'td'
        return (
          <Tag
            key={i}
            scope={scope}
            colSpan={c.colSpan && c.colSpan > 1 ? c.colSpan : undefined}
            rowSpan={c.rowSpan && c.rowSpan > 1 ? c.rowSpan : undefined}
          >
            {nodesToJSX({ nodes: c.children })}
          </Tag>
        )
      })
    return (
      <div className="article-table" tabIndex={0}>
        <table>
          {head && (
            <thead>
              <tr>{cells(head, () => 'col')}</tr>
            </thead>
          )}
          {body.length > 0 && (
            <tbody>
              {body.map((row, r) => (
                <tr key={r}>
                  {cells(row, (c) => (c.headerState & COLUMN_HEADER ? 'row' : c.headerState & ROW_HEADER ? 'col' : undefined))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    )
  },
}
