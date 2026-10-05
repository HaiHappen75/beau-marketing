import { Fragment, type ReactNode } from 'react'

import { Link } from '@/i18n/navigation'

// Running CMS text with internal links written as [Text](/pfad), e.g.
// "Wir sitzen in Satrup bei [Flensburg](/region/flensburg)". Only paths starting
// with "/" count — they go through the locale-aware Link, so /region/flensburg
// becomes /de/region/flensburg. Anything else stays plain text.
const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g

export function withInlineLinks(text: string | null | undefined): ReactNode {
  if (!text) return null
  // split() with two capture groups: [text, label, href, text, label, href, …, text]
  const parts = text.split(LINK)
  const out: ReactNode[] = []
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) out.push(<Fragment key={i}>{parts[i]}</Fragment>)
    if (i + 2 < parts.length) {
      out.push(
        <Link key={i + 1} href={parts[i + 2]}>
          {parts[i + 1]}
        </Link>,
      )
    }
  }
  return out
}
