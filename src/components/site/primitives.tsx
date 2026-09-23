import type { ReactNode } from 'react'

import { Link } from '@/i18n/navigation'
import { withEmphasis } from '@/lib/emphasis'

// Building blocks of the redesign pages (design: Startseite/Leistungsseite/Kontakt).

type Tone = 'white' | 'offwhite' | 'dark'

const SECTION_BG: Record<Tone, string> = {
  white: 'bg-white',
  offwhite: 'bg-offwhite',
  dark: 'bg-ink text-[#D6D6D6]',
}

export function Section({
  tone = 'white',
  id,
  divider = false,
  className = '',
  label,
  children,
}: {
  tone?: Tone
  id?: string
  divider?: boolean
  className?: string
  label?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`${SECTION_BG[tone]} py-[clamp(56px,8vw,112px)] ${divider ? 'border-t border-line' : ''} ${
        id ? 'scroll-mt-24' : ''
      } ${className}`}
    >
      <Wrap>{children}</Wrap>
    </section>
  )
}

export function Wrap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] ${className}`}>{children}</div>
}

/** Kicker with the small outline square. Contrast rule: black square on off-white. */
export function Kicker({ children, tone = 'white' }: { children: ReactNode; tone?: Tone }) {
  if (!children) return null
  const square = tone === 'offwhite' ? 'border-ink' : 'border-accent'
  const text = tone === 'dark' ? 'text-white' : 'text-ink'
  return (
    <p className={`mb-4 flex items-center gap-2.5 text-sm font-extrabold tracking-[0.08em] uppercase ${text}`}>
      <span aria-hidden="true" className={`inline-block h-3 w-3 flex-none border-2 ${square}`} />
      {children}
    </p>
  )
}

export function H2({ children, className = '', light = false }: { children: string | null | undefined; className?: string; light?: boolean }) {
  if (!children) return null
  return (
    <h2
      className={`text-[clamp(30px,3.4vw,44px)] leading-[1.1] font-extrabold tracking-[-0.02em] text-balance ${
        light ? 'text-white' : ''
      } ${className}`}
    >
      {withEmphasis(children)}
    </h2>
  )
}

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  onDark?: boolean
  className?: string
}

/** Orange/black button. Internal paths go through the locale-aware Link. */
export function ButtonLink({ href, children, variant = 'primary', onDark = false, className = '' }: ButtonProps) {
  const base =
    'inline-flex min-h-11 items-center justify-center rounded-[3px] text-[17px] font-extrabold no-underline transition-colors'
  const look =
    variant === 'primary'
      ? `bg-accent px-6 py-[15px] text-ink ${onDark ? 'hover:bg-white hover:text-ink' : 'hover:bg-ink hover:text-white'}`
      : 'border-2 border-ink px-[22px] py-[13px] text-ink hover:bg-ink hover:text-white'
  const cls = `${base} ${look} ${className}`
  if (/^(https?:|mailto:|tel:|#)/.test(href)) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

/** Net-price note that accompanies every price (B2B). Text from messages (Site.priceNote). */
export function PriceNote({ text, className = '' }: { text: string; className?: string }) {
  return <p className={`text-sm text-muted ${className}`}>{text}</p>
}

/**
 * Stand-in when no photo/screenshot exists: the outline square from the logo.
 * Never a grey "photo · description" box. Orange outline only on white or black.
 */
export function SquareGraphic({
  ratio = '4/3',
  dark = false,
  className = '',
}: {
  ratio?: string
  dark?: boolean
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      style={{ aspectRatio: ratio }}
      className={`flex w-full items-center justify-center ${dark ? 'bg-ink' : 'border border-line bg-white'} ${className}`}
    >
      <span className="block aspect-square w-[28%] max-w-40 border-[clamp(4px,0.9vw,8px)] border-accent" />
    </div>
  )
}
