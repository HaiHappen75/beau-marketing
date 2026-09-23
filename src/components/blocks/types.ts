import type { Page, Service, SiteSetting, Trust } from '@/payload-types'
import type { Locale } from '@/lib/locale'

export type LayoutBlock = NonNullable<Page['layout']>[number]
export type BlockOf<T extends LayoutBlock['blockType']> = Extract<LayoutBlock, { blockType: T }>

/** Data every page render loads once and hands to its blocks. */
export type BlockContext = {
  locale: Locale
  services: Service[]
  settings: SiteSetting
  trust: Trust
  /** ?leistung=<slug> on the contact page. */
  preselectService?: string | null
}
