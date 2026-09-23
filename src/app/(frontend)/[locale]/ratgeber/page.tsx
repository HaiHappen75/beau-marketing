import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { GuideList } from '@/components/guide/GuideList'
import { JsonLd } from '@/components/seo/JsonLd'
import { webPageNode } from '@/lib/json-ld'
import type { Locale } from '@/lib/locale'
import { getCategories, getLivePosts, hasPublishedPosts } from '@/lib/queries/content'
import { canonicalUrl, pageMetadata } from '@/lib/seo'

// Guide hub. Without a published article it stays reachable but noindex and
// out of the sitemap (decision Stephan); menu items hide themselves.
export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'Guide' })
  return pageMetadata({
    locale,
    path: '/ratgeber',
    title: t('overviewMetaTitle'),
    description: t('overviewMetaDescription'),
    noindex: !(await hasPublishedPosts()),
  })
}

export default async function GuidePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const loc = locale as Locale
  const t = await getTranslations({ locale, namespace: 'Guide' })
  const [posts, categories] = await Promise.all([getLivePosts(loc), getCategories(loc)])
  const used = categories.filter((c) =>
    posts.some((p) => (typeof p.category === 'object' ? p.category?.id : p.category) === c.id),
  )
  return (
    <>
      <JsonLd
        graph={[
          webPageNode({
            canonical: canonicalUrl(locale, '/ratgeber'),
            name: t('overviewMetaTitle'),
            description: t('overviewMetaDescription'),
            lang: loc,
          }),
        ]}
      />
      <GuideList
        locale={loc}
        kicker={t('overviewKicker')}
        heading={t('overviewTitle')}
        intro={t('overviewIntro')}
        posts={posts}
        categories={used}
      />
    </>
  )
}
