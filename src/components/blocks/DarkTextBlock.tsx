import { MediaImage, asMedia } from '@/components/site/MediaImage'
import { H2, Kicker, Section } from '@/components/site/primitives'

import type { BlockOf } from './types'

/** Dark text band (design: Über uns, "Die Werkstatt"). Gallery only with real photos. */
export function DarkTextBlock({ block }: { block: BlockOf<'darkText'> }) {
  const images = (block.images ?? []).map(asMedia).filter(Boolean)
  return (
    <Section tone="dark">
      <Kicker tone="dark">{block.kicker}</Kicker>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-end gap-x-16 gap-y-6">
        <H2 light className="text-[clamp(30px,3.4vw,44px)] leading-[1.08]">
          {block.heading}
        </H2>
        {block.text && <p className="max-w-[34em] text-lg">{block.text}</p>}
      </div>
      {images.length > 0 && (
        <ul className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
          {images.map((m) => (
            <li key={m!.id}>
              <MediaImage media={m} ratio="4/3" sizes="(min-width: 1024px) 380px, 100vw" dark />
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
