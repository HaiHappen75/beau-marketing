import { Fragment, type ReactNode } from 'react'

/**
 * Headings from the CMS mark their emphasis with *asterisks* — rendered as the
 * bold-italic <em> of the design (echo of the "beau" in the logo).
 */
export function withEmphasis(text: string | null | undefined): ReactNode {
  if (!text) return null
  const parts = text.split(/\*([^*]+)\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="font-black italic">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/** Plain text without the emphasis markers (titles, meta tags, aria labels). */
export const stripEmphasis = (text: string | null | undefined): string => (text ?? '').replace(/\*([^*]+)\*/g, '$1')
