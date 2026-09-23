'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import type { TocItem } from '@/lib/lexical'

/**
 * Table of contents. Desktop (≥ 960 px): sticky, the section in view is marked.
 * Mobile: a collapsed <details>. Plain anchor links — works without JavaScript.
 */
export function Toc({ items }: { items: TocItem[] }) {
  const t = useTranslations('Guide')
  const [current, setCurrent] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el))
    if (targets.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible[0]) setCurrent(visible[0].target.id)
      },
      { rootMargin: '-110px 0px -65% 0px' },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  if (items.length === 0) return null
  return (
    <aside aria-label={t('tocLabel')} className="w-full min-[960px]:sticky min-[960px]:top-[108px] min-[960px]:w-[220px] min-[960px]:flex-none">
      <div className="hidden min-[960px]:block">
        <p className="mb-3.5 text-sm font-extrabold tracking-[0.08em] uppercase">{t('toc')}</p>
        <ol className="border-l border-line">
          {items.map((item) => {
            const on = item.id === current
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setCurrent(item.id)}
                  aria-current={on ? 'true' : undefined}
                  className={`-ml-px block border-l-2 py-[7px] text-[15px] leading-[1.4] text-text no-underline hover:border-ink hover:text-ink ${
                    item.level === 3 ? 'pl-7' : 'pl-4'
                  } ${on ? 'border-accent font-extrabold' : 'border-transparent font-medium'}`}
                >
                  {item.text}
                </a>
              </li>
            )
          })}
        </ol>
      </div>
      <details className="group rounded-[4px] border border-line min-[960px]:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 py-3.5 text-base font-extrabold [&::-webkit-details-marker]:hidden">
          {t('tocMobile', { count: items.length })}
          <span aria-hidden="true" className="text-2xl font-normal transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <ol className="list-decimal px-4 pt-0 pb-3.5 pl-9 text-base leading-normal">
          {items.map((item) => (
            <li key={item.id} className="py-1.5">
              <a href={`#${item.id}`}>{item.text}</a>
            </li>
          ))}
        </ol>
      </details>
    </aside>
  )
}
