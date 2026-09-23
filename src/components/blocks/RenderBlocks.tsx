import { Faq } from '@/components/site/Faq'

import { BrandsBlock } from './BrandsBlock'
import { CasesBlock } from './CasesBlock'
import { ContactFormBlock } from './ContactFormBlock'
import { CtaBlock } from './CtaBlock'
import { EngagementBlock } from './EngagementBlock'
import { HeroBlock } from './HeroBlock'
import { PackagesBlock } from './PackagesBlock'
import { PostTeaserBlock } from './PostTeaserBlock'
import { PriceTableBlock } from './PriceTableBlock'
import { ServiceTilesBlock } from './ServiceTilesBlock'
import { TextImageBlock } from './TextImageBlock'
import { TrustBlock } from './TrustBlock'
import type { BlockContext, LayoutBlock } from './types'

/** Renders a page's layout blocks in order. Blocks without data render nothing. */
export function RenderBlocks({ blocks, ctx }: { blocks: LayoutBlock[] | null | undefined; ctx: BlockContext }) {
  return (
    <>
      {(blocks ?? []).map((block, i) => {
        const key = block.id ?? `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={key} block={block} ctx={ctx} />
          case 'packages':
            return <PackagesBlock key={key} block={block} ctx={ctx} />
          case 'serviceTiles':
            return <ServiceTilesBlock key={key} block={block} ctx={ctx} />
          case 'priceTable':
            return <PriceTableBlock key={key} block={block} ctx={ctx} />
          case 'caseTeaser':
            return <CasesBlock key={key} block={block} ctx={ctx} />
          case 'brandShowcase':
            return <BrandsBlock key={key} block={block} ctx={ctx} />
          case 'engagementBand':
            return <EngagementBlock key={key} block={block} ctx={ctx} />
          case 'trustBar':
            return <TrustBlock key={key} block={block} ctx={ctx} />
          case 'postTeaser':
            return <PostTeaserBlock key={key} block={block} ctx={ctx} />
          case 'cta':
            return <CtaBlock key={key} block={block} ctx={ctx} />
          case 'faq':
            return (
              <Faq
                key={key}
                heading={block.heading}
                items={(block.items ?? []).map((it) => ({ question: it.question, answer: it.answer }))}
              />
            )
          case 'textImage':
            return <TextImageBlock key={key} block={block} />
          case 'contactForm':
            return <ContactFormBlock key={key} block={block} ctx={ctx} />
          default:
            return null
        }
      })}
    </>
  )
}
