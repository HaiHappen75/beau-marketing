'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { ArrowRight, ChevronDown, Close, Menu } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { Link, usePathname } from '@/i18n/navigation'
import { CATEGORY_LABEL } from '@/lib/categories'
import type { Locale } from '@/lib/locale'
import type { Brand, SiteSetting } from '@/payload-types'
import { LocaleSwitcher } from './LocaleSwitcher'

const BRANDS_HREF = '/marken'

export function Header({ settings, brands }: { settings: SiteSetting; locale: Locale; brands: Brand[] }) {
  const t = useTranslations('Nav')
  const tb = useTranslations('Brands')
  const pathname = usePathname()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false) // mobile overlay
  const [brandsOpen, setBrandsOpen] = useState(false) // desktop flyout
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false) // mobile accordion
  const brandsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setSolid(window.scrollY > 16))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Close all menus on navigation.
  useEffect(() => {
    setOpen(false)
    setBrandsOpen(false)
    setMobileBrandsOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Escape closes the mobile overlay and the desktop flyout.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setBrandsOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Click outside closes the desktop flyout (it can also be opened by click, not just hover).
  useEffect(() => {
    if (!brandsOpen) return
    const onDown = (e: MouseEvent) => {
      if (brandsRef.current && !brandsRef.current.contains(e.target as Node)) setBrandsOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [brandsOpen])

  const navItems =
    settings?.nav && settings.nav.length > 0
      ? settings.nav.map((n) => ({ label: n.label ?? '', href: n.href }))
      : [
          { label: t('brands'), href: '/marken' },
          { label: t('studio'), href: '/studio' },
          { label: t('about'), href: '/ueber-uns' },
          { label: t('contact'), href: '/kontakt' },
        ]

  const hasBrandsMenu = brands.length > 0
  const tone = solid ? 'dark' : 'light'
  const linkColor = solid ? 'text-ink/70 hover:text-ink' : 'text-paper/75 hover:text-paper'

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'border-b border-line bg-paper/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Logo tone={tone} />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Hauptnavigation">
          {navItems.map((item) => {
            // Brands item → flyout with the individual brands listed underneath.
            if (item.href === BRANDS_HREF && hasBrandsMenu) {
              return (
                <div
                  key={item.href}
                  ref={brandsRef}
                  className="relative"
                  onMouseEnter={() => setBrandsOpen(true)}
                  onMouseLeave={() => setBrandsOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setBrandsOpen((v) => !v)}
                    aria-expanded={brandsOpen}
                    aria-haspopup="true"
                    className={`relative flex items-center gap-1 py-1 text-sm font-medium transition-colors ${linkColor} ${
                      isActive(item.href)
                        ? 'after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-[calc(100%-1.25rem)] after:bg-accent'
                        : ''
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${brandsOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {brandsOpen && (
                    <div className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2">
                      {/* hover bridge so the menu doesn't close in the gap */}
                      <div className="absolute -top-3 left-0 h-3 w-full" aria-hidden />
                      <div className="dropdown-in overflow-hidden rounded-2xl border border-line bg-paper-2 p-2 shadow-2xl shadow-petrol/10">
                        <Link
                          href={BRANDS_HREF}
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-petrol/5"
                        >
                          {tb('viewAll')}
                          <ArrowRight className="h-4 w-4 text-accent" />
                        </Link>
                        <div className="my-1 h-px bg-line" />
                        <ul>
                          {brands.map((b) => (
                            <li key={b.id}>
                              <Link
                                href={`${BRANDS_HREF}/${b.slug}`}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-petrol/5"
                              >
                                <span
                                  className="h-2.5 w-2.5 flex-none rounded-full ring-2 ring-inset ring-black/10"
                                  style={{ backgroundColor: b.accentColor }}
                                  aria-hidden
                                />
                                <span className="flex flex-col leading-tight">
                                  <span className="text-sm font-medium text-ink">{b.name}</span>
                                  <span className="text-xs text-ink-soft">
                                    {CATEGORY_LABEL[b.category] ?? ''}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`relative py-1 text-sm font-medium transition-colors ${linkColor} ${
                  isActive(item.href)
                    ? 'after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:bg-accent'
                    : ''
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <LocaleSwitcher tone={tone} />
          <Button href="/kontakt" variant="primary" className="!px-5 !py-2 !text-sm">
            {t('cta')}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`-mr-2 p-2 md:hidden ${solid ? 'text-ink' : 'text-paper'}`}
          aria-label={t('openMenu')}
          aria-expanded={open}
        >
          <Menu className="h-6 w-6" />
        </button>
      </Container>

      {/* Mobile overlay */}
      <div
        className={`stage fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <Container className="flex h-16 items-center justify-between">
          <Logo tone="light" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="-mr-2 p-2 text-paper"
            aria-label={t('closeMenu')}
          >
            <Close className="h-6 w-6" />
          </button>
        </Container>

        <Container className="mt-6 flex flex-col pb-12">
          {navItems.map((item) => {
            // Brands item → tap to expand the individual brands beneath.
            if (item.href === BRANDS_HREF && hasBrandsMenu) {
              return (
                <div key={item.href} className="border-b border-line-dark">
                  <button
                    type="button"
                    onClick={() => setMobileBrandsOpen((v) => !v)}
                    aria-expanded={mobileBrandsOpen}
                    className="flex w-full items-center justify-between py-4 text-left font-display text-3xl font-bold text-paper"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-7 w-7 text-paper/70 transition-transform duration-200 ${
                        mobileBrandsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileBrandsOpen && (
                    <ul className="dropdown-in -mt-1 flex flex-col gap-1 pb-4 pl-1">
                      <li>
                        <Link
                          href={BRANDS_HREF}
                          className="flex items-center gap-3 py-2 text-base font-semibold text-paper/90"
                        >
                          {tb('viewAll')}
                          <ArrowRight className="h-4 w-4 text-accent" />
                        </Link>
                      </li>
                      {brands.map((b) => (
                        <li key={b.id}>
                          <Link
                            href={`${BRANDS_HREF}/${b.slug}`}
                            className="flex items-center gap-3 py-2 text-lg text-paper/80"
                          >
                            <span
                              className="h-2.5 w-2.5 flex-none rounded-full ring-2 ring-inset ring-white/15"
                              style={{ backgroundColor: b.accentColor }}
                              aria-hidden
                            />
                            {b.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line-dark py-4 font-display text-3xl font-bold text-paper"
              >
                {item.label}
              </Link>
            )
          })}

          <div className="mt-10 flex items-center justify-between">
            <LocaleSwitcher tone="light" />
            <Button href="/kontakt" variant="primary">
              {t('cta')}
            </Button>
          </div>
        </Container>
      </div>
    </header>
  )
}
