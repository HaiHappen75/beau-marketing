import { Fragment } from 'react'

import { Link } from '@/i18n/navigation'

export type Crumb = { label: string; href?: string }

/**
 * Breadcrumb trail above a page's hero (design: Leistungsseite). The last item is
 * the page itself and never a link. `label` names the landmark (Site.breadcrumb).
 */
export function Breadcrumb({ items, label }: { items: Crumb[]; label: string }) {
  if (items.length === 0) return null
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap gap-2 text-[15px] text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <Fragment key={`${i}-${item.label}`}>
              {i > 0 && <li aria-hidden="true">/</li>}
              {last || !item.href ? (
                <li aria-current={last ? 'page' : undefined} className={last ? 'font-bold text-ink' : undefined}>
                  {item.label}
                </li>
              ) : (
                <li>
                  <Link href={item.href} className="text-muted">
                    {item.label}
                  </Link>
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
