import type { ReactNode } from 'react'

import { Check } from '@/components/brand/Check'
import { ButtonLink } from '@/components/site/primitives'

/** Check-marked list of a package or offer (design: Leistungsseite). */
export function CheckList({
  items,
  className = 'grid gap-3.5 text-[17px]',
  itemClassName = 'flex items-start gap-3',
}: {
  items: string[]
  className?: string
  itemClassName?: string
}) {
  if (items.length === 0) return null
  return (
    <ul className={className}>
      {items.map((item, i) => (
        <li key={item} className={itemClassName}>
          <Check size={22} index={i} className="mt-0.5" />
          {item}
        </li>
      ))}
    </ul>
  )
}

/**
 * The black-bordered box of the service pages ("eigener Kasten", e.g. the
 * Pflichtangaben-Update) — shared by service packages shown as a box, the
 * pointer box to an offer page and the offer block. Left: kicker, title and
 * whatever the caller adds; right (only when given): `aside` and the button.
 */
export function OfferBox({
  kicker,
  title,
  children,
  aside,
  cta,
}: {
  kicker?: string | null
  title: ReactNode
  children?: ReactNode
  aside?: ReactNode
  cta?: { href: string; label: string }
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-14 gap-y-7 rounded-[4px] border-2 border-ink p-[clamp(24px,4vw,48px)]">
      <div>
        {kicker && <p className="text-sm font-extrabold tracking-[0.08em] uppercase">{kicker}</p>}
        <h2 className="mt-2.5 text-[clamp(26px,2.6vw,34px)] font-extrabold">{title}</h2>
        {children}
      </div>
      {(aside || cta) && (
        <div>
          {aside}
          {cta && (
            <ButtonLink href={cta.href} variant="secondary" className={aside ? 'mt-6 text-base' : 'text-base'}>
              {cta.label}
            </ButtonLink>
          )}
        </div>
      )}
    </div>
  )
}
