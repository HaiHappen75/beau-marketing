import type { JSXConverters } from '@payloadcms/richtext-lexical/react'
import { RichText as LexicalRichText, defaultJSXConverters } from '@payloadcms/richtext-lexical/react'
import type { ComponentProps } from 'react'

import type { TocItem } from '@/lib/lexical'
import { nodeText } from '@/lib/lexical'

type Data = ComponentProps<typeof LexicalRichText>['data']

/**
 * Article body. H1 guard (blog standard): a body H1 is rendered as H2 — the
 * article title is the page's only H1. H2/H3 get the ids of the TOC; the ids
 * are matched by text, so split bodies (CTA box in between) stay consistent.
 */
export function ArticleBody({ data, toc }: { data: Data; toc: TocItem[] }) {
  const pool = [...toc]
  const idFor = (text: string, level: 2 | 3) => {
    const i = pool.findIndex((t) => t.text === text && t.level === level)
    if (i === -1) return undefined
    return pool.splice(i, 1)[0].id
  }
  const converters: JSXConverters = {
    ...defaultJSXConverters,
    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      const text = nodeText(node as never).trim()
      if (node.tag === 'h1' || node.tag === 'h2') {
        return (
          <h2 id={idFor(text, 2)} className="scroll-mt-28">
            {children}
          </h2>
        )
      }
      if (node.tag === 'h3') {
        return (
          <h3 id={idFor(text, 3)} className="scroll-mt-28">
            {children}
          </h3>
        )
      }
      return <h4>{children}</h4>
    },
  }
  return <LexicalRichText data={data} converters={converters} className="rich article-prose" />
}
