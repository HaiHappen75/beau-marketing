import { getTranslations } from 'next-intl/server'

import { MediaImage } from '@/components/site/MediaImage'
import { H2, Kicker, Section } from '@/components/site/primitives'
import { Link } from '@/i18n/navigation'
import { getLatestPosts } from '@/lib/queries/content'
import type { Category } from '@/payload-types'

import type { BlockContext, BlockOf } from './types'

/** Latest guide articles. Hides itself entirely while nothing is published. */
export async function PostTeaserBlock({ block, ctx }: { block: BlockOf<'postTeaser'>; ctx: BlockContext }) {
  const posts = await getLatestPosts(ctx.locale, 3)
  if (posts.length === 0) return null
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  return (
    <Section>
      <Kicker>{block.kicker}</Kicker>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <H2>{block.heading}</H2>
        <Link href="/ratgeber" className="text-[17px] font-bold">
          {t('allArticles')}
        </Link>
      </div>
      <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-8">
        {posts.map((p) => {
          const cat = typeof p.category === 'object' ? (p.category as Category) : null
          return (
            <li key={p.id}>
              <MediaImage media={p.heroImage} ratio="16/10" sizes="(min-width: 1024px) 380px, 100vw" />
              {cat && <p className="mt-[18px] text-sm font-extrabold text-muted">{cat.title}</p>}
              <h3 className="mt-2 text-[22px] leading-[1.25] font-extrabold">
                <Link href={`/ratgeber/${p.slug}`} className="no-underline hover:underline">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 text-[17px]">{p.excerpt}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
