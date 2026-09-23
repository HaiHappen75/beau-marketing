import { H2, Kicker, Section } from '@/components/site/primitives'
import { MediaImage } from '@/components/site/MediaImage'
import { Link } from '@/i18n/navigation'
import { getVisibleEngagements } from '@/lib/queries/content'

import type { BlockContext, BlockOf } from './types'

/** "Für die Region". Photos only when real ones exist — otherwise the outline square. */
export async function EngagementBlock({ block, ctx }: { block: BlockOf<'engagementBand'>; ctx: BlockContext }) {
  const items = await getVisibleEngagements(ctx.locale)
  if (items.length === 0) return null
  return (
    <Section id="region">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-end gap-x-16 gap-y-6">
        <div>
          <Kicker>{block.kicker}</Kicker>
          <H2 className="text-[clamp(28px,3vw,38px)] leading-[1.12]">{block.heading}</H2>
        </div>
        {block.text && <p className="max-w-[34em] text-lg">{block.text}</p>}
      </div>
      <ul className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-6">
        {items.map((e) => (
          <li key={e.id}>
            <MediaImage media={e.photos?.[0]} ratio="4/3" sizes="(min-width: 1024px) 280px, 100vw" />
            <p className="mt-3.5 text-[17px] leading-[1.4] font-bold text-ink">{e.kind}</p>
            <p className="text-[15px] text-muted">{e.institution}</p>
          </li>
        ))}
      </ul>
      {block.link?.href && block.link.label && (
        <p className="mt-7 text-[17px]">
          <Link href={block.link.href}>{block.link.label}</Link>
        </p>
      )}
    </Section>
  )
}
