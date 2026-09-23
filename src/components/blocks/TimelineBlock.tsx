import { Check } from '@/components/brand/Check'
import { H2, Kicker, Section } from '@/components/site/primitives'

import type { BlockOf } from './types'

/** Company history as a checked timeline (design: Über uns, "Die Geschichte"). */
export function TimelineBlock({ block }: { block: BlockOf<'timeline'> }) {
  const items = block.items ?? []
  if (items.length === 0) return null
  return (
    <Section divider>
      <div className="flex flex-wrap gap-x-[72px] gap-y-8">
        <div className="flex-[1_1_280px]">
          <Kicker>{block.kicker}</Kicker>
          <H2 className="text-[clamp(28px,3vw,38px)] leading-[1.12]">{block.heading}</H2>
          {block.intro && <p className="mt-4 max-w-[30em] text-lg">{block.intro}</p>}
        </div>
        <ol className="flex-[2_1_480px]">
          {items.map((item, i) => (
            <li
              key={item.id ?? item.title}
              className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] gap-x-7 gap-y-2 border-t border-line py-6"
            >
              <p className="flex items-center gap-2 text-[17px] font-black text-ink">
                <Check size={20} index={i} />
                {item.label}
              </p>
              <div>
                <h3 className="text-[21px] font-extrabold">{item.title}</h3>
                {item.text && <p className="mt-1.5 max-w-[38em] text-lg">{item.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
