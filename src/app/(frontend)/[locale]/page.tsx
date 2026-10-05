import type { Metadata } from 'next'

import { CmsPage, cmsPageMetadata } from '@/lib/cmsPage'
import { professionalServiceNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { getSettings } from '@/lib/queries/getLayoutData'

// Start page = CMS page "start". Carries the agency as a local business (JSON-LD).

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return cmsPageMetadata('start', '', locale, 'Beau Marketing', { absoluteTitle: true })
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const settings = await getSettings(locale as Locale)
  return <CmsPage slug="start" path="" locale={locale} extraGraph={[professionalServiceNode(settings)]} />
}
