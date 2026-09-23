import { MediaImage } from '@/components/site/MediaImage'
import { H2, Kicker, Section } from '@/components/site/primitives'
import { RichText } from '@/components/richtext/RichText'

import type { BlockOf } from './types'

export function TextImageBlock({ block }: { block: BlockOf<'textImage'> }) {
  const left = block.imagePosition === 'left'
  return (
    <Section>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-x-16 gap-y-10">
        <div className={left ? 'md:order-2' : ''}>
          <Kicker>{block.kicker}</Kicker>
          <H2>{block.heading}</H2>
          {block.body && (
            <div className="rich mt-5">
              <RichText data={block.body} />
            </div>
          )}
        </div>
        {block.image ? <MediaImage media={block.image} ratio="4/3" sizes="(min-width: 1024px) 560px, 100vw" /> : null}
      </div>
    </Section>
  )
}
