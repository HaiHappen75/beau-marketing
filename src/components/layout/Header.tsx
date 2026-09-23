import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/lib/locale'
import { telHref } from '@/lib/phone'
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

  // The three packages of the design, priced from the services themselves.
  const bySlug = new Map(services.map((s) => [s.slug, s]))
  const cheapestOf = (...slugs: string[]) => {
    const found = slugs
      .map((slug) => bySlug.get(slug))
      .filter((s): s is NonNullable<typeof s> => Boolean(s?.packages?.[0]?.price != null))
      .sort((a, b) => (a.packages?.[0]?.price ?? 0) - (b.packages?.[0]?.price ?? 0))
    return found[0] ? serviceTeaserPrice(found[0], locale) : null
  }
  const packages: HeaderPackage[] = [
    { title: t('packageAppearance'), note: t('packageAppearanceNote'), price: cheapestOf('websites', 'shopify-shops') },
    { title: t('packageOperation'), note: t('packageOperationNote'), price: cheapestOf('betreuung-pflege') },
    { title: t('packageVisibility'), note: t('packageVisibilityNote'), price: cheapestOf('lokale-sichtbarkeit') },
  ].filter((p): p is HeaderPackage => p.price !== null)

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
