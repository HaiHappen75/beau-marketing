import { MediaImage } from '@/components/site/MediaImage'
import { Link } from '@/i18n/navigation'
import { readingMinutes } from '@/lib/lexical'
import type { Category, Post } from '@/payload-types'

/** Guide card (style tile "Ratgeber-Karte"): image, category · reading time, title, teaser. */
export function PostCard({ post, meta }: { post: Post; meta: (category: string, min: number) => string }) {
  const category = typeof post.category === 'object' ? (post.category as Category) : null
  const min = readingMinutes(post.shortAnswer, post.content)
  return (
    <article className="overflow-hidden rounded-[4px] border border-line bg-white">
      <MediaImage media={post.heroImage} ratio="16/9" sizes="(min-width: 1024px) 380px, 100vw" />
      <div className="px-[22px] pt-5 pb-6">
        <p className="text-sm font-bold text-muted">{meta(category?.title ?? '', min).replace(/^ · /, '')}</p>
        <h3 className="mt-2 text-xl leading-[1.3] font-extrabold">
          <Link href={`/ratgeber/${post.slug}`} className="no-underline hover:underline">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 text-[17px]">{post.excerpt}</p>}
      </div>
    </article>
  )
}
