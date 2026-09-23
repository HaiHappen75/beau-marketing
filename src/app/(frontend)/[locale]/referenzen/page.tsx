import type { Metadata } from 'next'

import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'

// Filtered views (?leistung=<slug>) share the overview's canonical — they are
// views of one page, not pages of their own.
export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return cmsPageMetadata('referenzen', '/referenzen', locale, 'Referenzen')
}

export default async function Page(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ leistung?: string | string[] }>
}) {
  const { locale } = await props.params
  const { leistung } = await props.searchParams
  return (
    <CmsPage slug="referenzen" path="/referenzen" locale={locale} service={typeof leistung === 'string' ? leistung : null} />
  )
}
