import { withEmphasis } from '@/lib/emphasis'

import { Kicker, Section } from './primitives'

type Item = { question: string; answer: string }

/** FAQ accordion (native <details>, works without JS). Renders nothing without items. */
export function Faq({ kicker, heading, items }: { kicker?: string | null; heading?: string | null; items: Item[] }) {
  if (items.length === 0) return null
  return (
    <Section divider>
      <div className="flex flex-wrap gap-x-[72px] gap-y-6">
        <div className="flex-[1_1_280px]">
          <Kicker>{kicker}</Kicker>
          {heading && (
            <h2 className="text-[clamp(30px,3.2vw,42px)] leading-[1.1] font-extrabold tracking-[-0.02em]">
              {withEmphasis(heading)}
            </h2>
          )}
        </div>
        <div className="flex-[2_1_480px]">
          {items.map((item) => (
            <details key={item.question} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-[22px] text-[19px] font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                {item.question}
                <span aria-hidden="true" className="text-[28px] font-normal transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-[40em] pb-6 text-lg">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}
