import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/lib/locale'
import { telHref } from '@/lib/phone'
import { PACKAGE_DEFS, packagePrice } from '@/lib/packages'
import { serviceTeaserPrice } from '@/lib/price'
import { hasPublishedPosts } from '@/lib/queries/content'
import { getNavigation, getPublishedServices, getSettings } from '@/lib/queries/getLayoutData'

import { HeaderNav, type HeaderPackage, type HeaderService } from './HeaderNav'

export const GUIDE_PATH = '/ratgeber'

/**
 * Site header (design: Header.dc.html). Server part collects the data: nav links
 * from the `navigation` global, the "Agentur" mega menu from the published
 * services (with their teaser price), the phone number for the mobile menu.
 */
export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Layout' })
  const [navigation, services, settings, guideLive] = await Promise.all([
    getNavigation(locale),
    getPublishedServices(locale),
    getSettings(locale),
    hasPublishedPosts(),
  ])

  const headerServices: HeaderService[] = services
    .filter((s): s is typeof s & { slug: string } => Boolean(s.slug))
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      description: s.shortDescription,
      price: serviceTeaserPrice(s, locale),
    }))

  // The three packages (src/lib/packages.ts), priced from the services themselves.
  const labels = {
    appearance: [t('packageAppearance'), t('packageAppearanceNote')],
    operation: [t('packageOperation'), t('packageOperationNote')],
    visibility: [t('packageVisibility'), t('packageVisibilityNote')],
  } as const
  const packages: HeaderPackage[] = PACKAGE_DEFS.map((def) => ({
    title: labels[def.key][0],
    note: labels[def.key][1],
    price: packagePrice(services, def.slugs, locale),
  })).filter((p): p is HeaderPackage => p.price !== null)

  // The guide appears in the menu only once an article is live (decision Stephan).
  const links = (navigation.header ?? [])
    .filter((n) => guideLive || n.href !== GUIDE_PATH)
    .map((n) => ({ label: n.label, href: n.href }))
  const phone = settings.company?.phone ?? null

  return (
    <HeaderNav
      services={headerServices}
      packages={packages}
      links={links}
      phone={phone ? { display: phone, href: telHref(phone) } : null}
    />
  )
}
