import type { Metadata } from 'next'

import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return cmsPageMetadata('ueber-uns', '/ueber-uns', locale, 'Über uns')
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  return <CmsPage slug="ueber-uns" path="/ueber-uns" locale={locale} />
}
