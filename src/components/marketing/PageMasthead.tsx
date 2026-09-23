import type { ReactNode } from 'react'

import { Kicker, Wrap } from '@/components/site/primitives'

/** Plain masthead for inner pages (legal texts). */
export function PageMasthead({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string
  /**
   * Omitted on the legal pages whose eRecht24 text brings its own <h1> — a page
   * must not carry two.
   */
  title?: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <section className="bg-white pt-[clamp(32px,6vw,72px)] pb-6">
      <Wrap>
        {eyebrow && <Kicker>{eyebrow}</Kicker>}
        {title && (
          <h1 className="max-w-4xl text-[clamp(34px,4.4vw,54px)] leading-[1.08] font-extrabold tracking-[-0.025em] text-balance">
            {title}
          </h1>
        )}
        {subtitle && <p className="mt-5 max-w-2xl text-lg">{subtitle}</p>}
        {children}
      </Wrap>
    </section>
  )
}
