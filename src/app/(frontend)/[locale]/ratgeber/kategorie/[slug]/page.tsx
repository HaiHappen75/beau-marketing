import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { GuideList } from '@/components/guide/GuideList'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbNode, webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { categoryIndexable, getCategories, getCategoryBySlug, getLivePosts } from '@/lib/queries/content'
import { SITE_URL, canonicalUrl, pageMetadata } from '@/lib/seo'

// Category page: noindex,follow while thin (blog standard) — see categoryIndexable.
export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await props.params
  const category = await getCategoryBySlug(slug, locale as Locale)
  if (!category) return {}
  const posts = await getLivePosts(locale as Locale, category.id)
  return pageMetadata({
    locale,
    path: `/ratgeber/kategorie/${slug}`,
    title: category.title,
    description: category.description ?? undefined,
    noindex: !categoryIndexable(category, posts.length),
  })
}

export default async function CategoryPage(props: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await props.params
  setRequestLocale(locale)
  const loc = locale as Locale
  const category = await getCategoryBySlug(slug, loc)
  if (!category) notFound()
  const t = await getTranslations({ locale, namespace: 'Guide' })
  const [posts, all, categories] = await Promise.all([getLivePosts(loc, category.id), getLivePosts(loc), getCategories(loc)])
  const used = categories.filter((c) =>
    all.some((p) => (typeof p.category === 'object' ? p.category?.id : p.category) === c.id),
  )
  const canonical = canonicalUrl(locale, `/ratgeber/kategorie/${slug}`)
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({ canonical, name: category.title, description: category.description ?? undefined, lang: loc }),
          breadcrumbNode(canonical, [
            { name: t('home'), url: `${SITE_URL}/${locale}` },
            { name: t('guide'), url: canonicalUrl(locale, '/ratgeber') },
            { name: category.title, url: canonical },
          ]),
        ]}
      />
      <GuideList
        locale={loc}
        kicker={t('categoryKicker')}
        heading={category.title}
        intro={category.description}
        posts={posts}
        categories={used}
        activeCategory={category.id}
      />
    </>
  )
}
