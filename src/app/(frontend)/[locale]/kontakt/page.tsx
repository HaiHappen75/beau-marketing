import type { Metadata } from 'next'

import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'

// Contact = CMS page "kontakt"; ?leistung=<slug> preselects the service.

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return cmsPageMetadata('kontakt', '/kontakt', locale, 'Kontakt')
}

export default async function Page(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ leistung?: string | string[] }>
}) {
  const { locale } = await props.params
  const { leistung } = await props.searchParams
  return <CmsPage slug="kontakt" path="/kontakt" locale={locale} service={typeof leistung === 'string' ? leistung : null} />
}
