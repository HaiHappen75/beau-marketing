import { getTranslations } from 'next-intl/server'

import { PostCard } from '@/components/guide/PostCard'
import { H2, Kicker, Section } from '@/components/site/primitives'
import { Link } from '@/i18n/navigation'
import { getLatestPosts } from '@/lib/queries/content'

import type { BlockContext, BlockOf } from './types'

/** Latest guide articles. Hides itself entirely while nothing is published. */
export async function PostTeaserBlock({ block, ctx }: { block: BlockOf<'postTeaser'>; ctx: BlockContext }) {
  const posts = await getLatestPosts(ctx.locale, 3)
  if (posts.length === 0) return null
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  const tg = await getTranslations({ locale: ctx.locale, namespace: 'Guide' })
  return (
    <Section>
      <Kicker>{block.kicker}</Kicker>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <H2>{block.heading}</H2>
        <Link href="/ratgeber" className="text-[17px] font-bold">
          {t('allArticles')}
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-8">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} meta={(c, min) => tg('cardMeta', { category: c, min })} />
        ))}
      </div>
    </Section>
  )
}
