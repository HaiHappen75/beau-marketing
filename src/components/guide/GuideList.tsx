import { getTranslations } from 'next-intl/server'

import { Kicker, Wrap } from '@/components/site/primitives'
import { Link } from '@/i18n/navigation'
import { withEmphasis } from '@/lib/emphasis'
import type { Locale } from '@/lib/locale'
import type { Category, Post } from '@/payload-types'

import { PostCard } from './PostCard'

/** Guide overview / category page body: heading, category chips, cards or empty note. */
export async function GuideList({
  locale,
  kicker,
  heading,
  intro,
  posts,
  categories,
  activeCategory,
}: {
  locale: Locale
  kicker: string
  heading: string
  intro?: string | null
  posts: Post[]
  categories: Category[]
  activeCategory?: number | null
}) {
  const t = await getTranslations({ locale, namespace: 'Guide' })
  const chip = (on: boolean) =>
    `inline-flex min-h-9 items-center rounded-[3px] border px-3 py-1.5 text-sm font-bold no-underline ${
      on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'
    }`
  return (
    <section className="bg-white pt-[clamp(40px,6vw,88px)] pb-[clamp(56px,8vw,104px)]">
      <Wrap>
        <Kicker>{kicker}</Kicker>
        <h1 className="text-[clamp(36px,4.8vw,60px)] leading-[1.05] font-extrabold tracking-[-0.025em] text-balance">
          {withEmphasis(heading)}
        </h1>
        {intro && <p className="mt-5 max-w-[38em] text-[clamp(18px,1.5vw,21px)]">{intro}</p>}
        {categories.length > 0 && (
          <nav aria-label={t('filterLabel')} className="mt-8">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link href="/ratgeber" aria-current={activeCategory ? undefined : 'page'} className={chip(!activeCategory)}>
                  {t('all')}
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/ratgeber/kategorie/${c.slug}`}
                    aria-current={activeCategory === c.id ? 'page' : undefined}
                    className={chip(activeCategory === c.id)}
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {posts.length > 0 ? (
          <div className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-8">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} meta={(c, min) => t('cardMeta', { category: c, min })} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-lg text-muted">{t('empty')}</p>
        )}
      </Wrap>
    </section>
  )
}
