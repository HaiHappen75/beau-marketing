import type { Metadata } from 'next'

import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'

// Start page = CMS page "start".

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return cmsPageMetadata('start', '', locale, 'Beau Marketing', { absoluteTitle: true })
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  return <CmsPage slug="start" path="" locale={locale} />
}
