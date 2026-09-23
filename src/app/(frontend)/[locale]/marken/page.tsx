import type { Metadata } from 'next'

import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return cmsPageMetadata('marken', '/marken', locale, 'Marken')
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  return <CmsPage slug="marken" path="/marken" locale={locale} />
}
