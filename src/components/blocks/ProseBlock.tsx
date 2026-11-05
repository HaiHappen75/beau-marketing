import { H2, Kicker, Section } from '@/components/site/primitives'
import { withInlineLinks } from '@/lib/inlineLinks'

import type { BlockOf } from './types'

/**
 * Running text under a heading: heading left, paragraphs right (the layout of the
 * region band and the timeline), stacked on narrow screens. Internal links in the
 * text as [Text](/pfad).
 */
export function ProseBlock({ block }: { block: BlockOf<'prose'> }) {
  const paragraphs = (block.text ?? '').split(/\n\s*\n/).filter((p) => p.trim())
  if (!block.heading && paragraphs.length === 0) return null
  const tone = block.tone === 'offwhite' ? 'offwhite' : 'white'
  return (
    <Section tone={tone}>
      <div className="flex flex-wrap gap-x-16 gap-y-6">
        {/* 2 : 3 — a long heading (the SEO text of the start page) needs the room. */}
        <div className="flex-[2_1_340px]">
          <Kicker tone={tone}>{block.kicker}</Kicker>
          <H2 className="text-[clamp(28px,3vw,38px)] leading-[1.12]">{block.heading}</H2>
        </div>
        {paragraphs.length > 0 && (
          <div className="max-w-[68ch] flex-[3_1_460px]">
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-lg' : 'mt-4 text-lg'}>
                {withInlineLinks(p)}
              </p>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
