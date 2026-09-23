import type { Metadata } from 'next'

import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'

// Agency overview = CMS page "agentur".

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return cmsPageMetadata('agentur', '/agentur', locale, 'Agentur')
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  return <CmsPage slug="agentur" path="/agentur" locale={locale} />
}
