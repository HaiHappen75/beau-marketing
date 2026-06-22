import type { ReactNode } from 'react'

import { Container } from '@/components/ui/Container'

/** Petrol "stage" masthead for inner pages so the fixed header always sits over a dark top. */
export function PageMasthead({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <section className="stage grain relative overflow-hidden text-paper">
      <Container className="relative pb-16 pt-36 sm:pb-20 sm:pt-44">
        {eyebrow && <p className="eyebrow text-accent-soft">{eyebrow}</p>}
        <h1 className="mt-4 max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">{subtitle}</p>}
        {children}
      </Container>
    </section>
  )
}
