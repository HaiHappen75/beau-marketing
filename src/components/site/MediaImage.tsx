import Image from 'next/image'

import type { Media } from '@/payload-types'

import { SquareGraphic } from './primitives'

export const asMedia = (v: unknown): Media | null =>
  v && typeof v === 'object' && 'url' in v && (v as Media).url ? (v as Media) : null

/** Payload returns absolute URLs built from serverURL; next/image wants the local path. */
const localPath = (url: string) => url.replace(/^https?:\/\/[^/]+/, '')

/**
 * A CMS image in a fixed aspect ratio — or, without an image, the outline-square
 * graphic. There is never a grey placeholder box on the live site.
 */
export function MediaImage({
  media,
  ratio,
  sizes,
  priority = false,
  dark = false,
  className = '',
}: {
  media: unknown
  ratio: string
  sizes: string
  priority?: boolean
  dark?: boolean
  className?: string
}) {
  const m = asMedia(media)
  if (!m) return <SquareGraphic ratio={ratio} dark={dark} className={className} />
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
      <Image
        src={localPath(m.url as string)}
        alt={m.alt ?? ''}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: `${m.focalX ?? 50}% ${m.focalY ?? 50}%` }}
      />
    </div>
  )
}

/**
 * Screenshot in a laptop frame (design component "Gerät"). Only with a real
 * screenshot — otherwise the outline-square graphic, no empty device mock-up.
 */
export function DeviceFrame({ media, sizes }: { media: unknown; sizes: string }) {
  const m = asMedia(media)
  if (!m) return <SquareGraphic ratio="16/10" />
  return (
    <div className="pr-[10%] pb-[5%]">
      <div className="rounded-t-[10px] bg-ink p-[2.2%]">
        <MediaImage media={m} ratio="16/10" sizes={sizes} />
      </div>
      <div className="-mx-[3%] h-2.5 rounded-b-xl bg-line" />
    </div>
  )
}
