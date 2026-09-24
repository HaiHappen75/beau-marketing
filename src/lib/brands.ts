import { asMedia } from '@/components/site/MediaImage'
import type { Brand, Media } from '@/payload-types'

export type BrandScreenshot = { media: Media; orientation: 'landscape' | 'portrait' }

/**
 * The screenshot a brand card (and the Brand JSON-LD) shows: the first landscape
 * image, otherwise the first portrait one (iPhone screens), otherwise none.
 */
export function brandScreenshot(brand: Pick<Brand, 'screenshots'>): BrandScreenshot | null {
  const images = (brand.screenshots ?? []).map((s) => asMedia(s.image)).filter((m): m is Media => m !== null)
  const landscape = images.find((m) => (m.width ?? 0) > (m.height ?? 0))
  if (landscape) return { media: landscape, orientation: 'landscape' }
  return images[0] ? { media: images[0], orientation: 'portrait' } : null
}
