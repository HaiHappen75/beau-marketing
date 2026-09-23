'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState } from 'react'

import { Check } from '@/components/brand/Check'
import { Link, usePathname } from '@/i18n/navigation'

import { LanguageSwitcher } from './LanguageSwitcher'

export type HeaderService = { slug: string; title: string; description: string; price: string }
export type HeaderPackage = { title: string; note: string; price: string }

type Props = {
  services: HeaderService[]
  packages: HeaderPackage[]
  links: { label: string; href: string }[]
  phone: { display: string; href: string | null } | null
}

const LOGO = { src: '/brand/beau-marketing-logo.png', width: 1200, height: 358 }

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`)

export function HeaderNav({ services, packages, links, phone }: Props) {
  const t = useTranslations('Layout')
  const pathname = usePathname()
  const megaId = useId()
  const mobileId = useId()
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  // Hover opens the mega menu; a mouse click right after that must not close it
  // again (hover + click is one gesture). Keyboard activation toggles normally.
  const hoverOpenedAt = useRef(0)

  // Close menus on navigation — adjusted during render, not in an effect.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setMegaOpen(false)
    setMobileOpen(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const agencyActive = pathname.startsWith('/agentur') || megaOpen

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white" onMouseLeave={() => setMegaOpen(false)}>
      {/* ── Desktop (≥ 1100 px) ─────────────────────────────────────────── */}
      <div className="mx-auto hidden h-[84px] max-w-(--container-page) items-center gap-10 px-10 min-[1100px]:flex">
        <Link href="/" aria-label={t('homeLabel')} className="flex flex-none no-underline">
          <Image {...LOGO} alt="beau marketing – success simplified" priority className="h-[52px] w-auto" />
        </Link>
        <nav aria-label={t('mainNav')} className="min-w-0 flex-1">
          <ul className="flex items-center gap-[26px]">
            <li>
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-controls={megaId}
                onClick={() =>
                  setMegaOpen((o) => (o && Date.now() - hoverOpenedAt.current < 600 ? true : !o))
                }
                onMouseEnter={() => {
                  if (!megaOpen) hoverOpenedAt.current = Date.now()
                  setMegaOpen(true)
                }}
                className={`flex cursor-pointer items-center gap-[7px] border-b-2 py-2 text-base font-bold text-ink ${
                  agencyActive ? 'border-accent' : 'border-transparent'
                }`}
              >
                {t('agency')}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.8" fill="none" />
                </svg>
              </button>
            </li>
            {links.map((l) => {
              const active = isActive(pathname, l.href)
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onMouseEnter={() => setMegaOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`nav-link block whitespace-nowrap border-b-2 py-2 text-base font-bold hover:border-ink ${
                      active ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <LanguageSwitcher />
        <Link href="/kontakt" className="btn flex-none">
          {t('cta')}
        </Link>
      </div>

      {megaOpen && (
        <div
          id={megaId}
          className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_30px_40px_-30px_rgba(17,17,17,.25)] min-[1100px]:block"
        >
          <div className="mx-auto grid max-w-(--container-page) grid-cols-[minmax(0,3fr)_minmax(0,1fr)] gap-12 px-10 pt-7 pb-10">
            <div>
              <p className="kicker mb-3">{t('services')}</p>
              <ul className="-ml-4 grid grid-cols-3 gap-1">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/agentur/${s.slug}`}
                      className="block h-full rounded-[4px] border border-transparent px-4 py-3.5 no-underline hover:border-line"
                    >
                      <span className="block text-[17px] font-extrabold text-ink">{s.title}</span>
                      <span className="mt-0.5 block text-[15px] leading-snug text-muted">{s.description}</span>
                      <span className="mt-2 block text-sm font-bold text-text">{s.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {packages.length > 0 && (
              <div className="border-l border-line pl-8">
                <p className="kicker mb-3">{t('packages')}</p>
                <ul className="grid gap-3.5">
                  {packages.map((p) => (
                    <li key={p.title} className="flex items-start gap-3">
                      <span className="pt-0.5">
                        <Check size={18} checked />
                      </span>
                      <span>
                        <strong className="block text-base text-ink">{p.title}</strong>
                        <span className="text-sm text-muted">
                          {p.note} · {p.price}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base">
                  <Link href="/agentur">{t('allPrices')}</Link>
                </p>
                <p className="price-note mt-2 text-[13px]">{t('priceNote')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile (< 1100 px) ──────────────────────────────────────────── */}
      <div className="flex h-[68px] items-center gap-2.5 pr-4 pl-5 min-[1100px]:hidden">
        <Link href="/" aria-label={t('homeLabel')} className="flex flex-none no-underline">
          <Image {...LOGO} alt="beau marketing – success simplified" priority className="h-10 w-auto" />
        </Link>
        <span className="flex-1" />
        <Link href="/kontakt" className="btn flex-none px-3 text-sm">
          {t('cta')}
        </Link>
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls={mobileId}
          aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-11 w-11 flex-none cursor-pointer items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={mobileOpen ? 'M5 5l14 14M19 5L5 19' : 'M3 6h18M3 12h18M3 18h18'}
              stroke="currentColor"
              strokeWidth="2.4"
              fill="none"
            />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div id={mobileId} className="fixed inset-x-0 top-[69px] bottom-0 overflow-auto bg-white px-5 pt-2 pb-10 min-[1100px]:hidden">
          <p className="kicker mt-3 mb-1">{t('agency')}</p>
          <ul className="mb-3">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-line">
                <Link
                  href={`/agentur/${s.slug}`}
                  className="flex items-baseline justify-between gap-3 py-3 text-lg font-bold text-ink no-underline"
                >
                  <span>{s.title}</span>
                  <span className="whitespace-nowrap text-sm font-semibold text-muted">{s.price}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link
                  href={l.href}
                  aria-current={isActive(pathname, l.href) ? 'page' : undefined}
                  className="block py-3.5 text-[22px] font-extrabold text-ink no-underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <LanguageSwitcher variant="buttons" />
          </div>
          {phone?.href && (
            <>
              <p className="mt-7 text-base text-muted">{t('callInstead')}</p>
              <p className="mt-0.5 text-2xl font-extrabold">
                <a href={phone.href}>{phone.display}</a>
              </p>
            </>
          )}
        </div>
      )}
    </header>
  )
}
