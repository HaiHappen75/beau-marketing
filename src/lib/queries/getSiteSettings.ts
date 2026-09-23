import type { SiteSetting } from '@/payload-types'
import type { Locale } from '@/lib/locale'
import { getSettings } from '@/lib/queries/getLayoutData'

export async function getSiteSettings(locale: Locale): Promise<SiteSetting> {
  return getSettings(locale)
}
