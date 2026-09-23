import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/lib/locale'
import { telHref } from '@/lib/phone'
import { PACKAGE_DEFS, packagePrice } from '@/lib/packages'
import { serviceTeaserPrice } from '@/lib/price'
import { getNavigation, getPublishedServices, getSettings } from '@/lib/queries/getLayoutData'

import { HeaderNav, type HeaderPackage, type HeaderService } from './HeaderNav'

/**
 * Site header (design: Header.dc.html). Server part collects the data: nav links
 * from the `navigation` global, the "Agentur" mega menu from the published
 * services (with their teaser price), the phone number for the mobile menu.
 */
export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Layout' })
  const [navigation, services, settings] = await Promise.all([
    getNavigation(locale),
    getPublishedServices(locale),
    getSettings(locale),
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

  const links = (navigation.header ?? []).map((n) => ({ label: n.label, href: n.href }))
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
