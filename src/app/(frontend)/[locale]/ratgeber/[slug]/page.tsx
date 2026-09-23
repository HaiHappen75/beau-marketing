import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Check } from '@/components/brand/Check'
import { ArticleBody } from '@/components/guide/ArticleBody'
import { PostCard } from '@/components/guide/PostCard'
import { Toc } from '@/components/guide/Toc'
import { JsonLd } from '@/components/seo/JsonLd'
import { MediaImage, asMedia } from '@/components/site/MediaImage'
import { ButtonLink, Wrap } from '@/components/site/primitives'
import { Link } from '@/i18n/navigation'
import { stripEmphasis, withEmphasis } from '@/lib/emphasis'
import { blogPostingNode, breadcrumbNode, faqPageNode, personNode, webPageNode } from '@/lib/json-ld'
import { isLexical, readingMinutes, splitBeforeH2, tocOf } from '@/lib/lexical'
import type { Locale } from '@/lib/locale'
import { formatPackagePrice, serviceTeaserPrice } from '@/lib/price'
import { getLivePosts, getPostBySlug } from '@/lib/queries/content'
import { findRedirect } from '@/lib/redirects'
import { SITE_URL, canonicalUrl, localeAlternates, pageMetadata } from '@/lib/seo'
import { translatedLocales } from '@/lib/translations'
import type { Author, Category, Media, Service } from '@/payload-types'

// Guide article (design: Ratgeber Artikel.dc.html), built to the blog standard:
// server-rendered, one H1, short answer, author + dates, TOC, CTA box, FAQ,
// BlogPosting + BreadcrumbList (+ FAQPage only when filled).

const LEGAL_CATEGORY = 'pflichtangaben-recht'

const absolute = (url: string | null | undefined) =>
  url ? (url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`) : null

const dateFmt = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : `${locale}-DE`, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))

const ogImage = (m: Media | null) => {
  if (!m) return null
  return absolute(m.sizes?.og?.url ?? m.url)
}

export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await props.params
  const post = await getPostBySlug(slug, locale as Locale)
  if (!post) return {}
  const image = ogImage(asMedia(post.socialImage) ?? asMedia(post.heroImage))
  const author = typeof post.author === 'object' ? (post.author as Author) : null
  return pageMetadata({
    locale,
    path: `/ratgeber/${slug}`,
    title: stripEmphasis(post.meta?.title || post.title),
    description: post.meta?.description || post.excerpt,
    images: image ? [image] : undefined,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.contentUpdatedAt ?? post.publishedAt,
      authors: author ? [author.name] : undefined,
    },
    noindex: Boolean(post.noindex),
    alternates: localeAlternates(`/ratgeber/${slug}`, await translatedLocales('posts', post.id), locale).alternates,
  })
}

export default async function ArticlePage(props: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await props.params
  setRequestLocale(locale)
  const loc = locale as Locale
  const post = await getPostBySlug(slug, loc)
  if (!post) {
    // Slug changed? The hook stored a permanent redirect for the old URL.
    const target = await findRedirect(`/${locale}/ratgeber/${slug}`)
    if (target) permanentRedirect(target)
    notFound()
  }

  const [t, ts] = await Promise.all([
    getTranslations({ locale, namespace: 'Guide' }),
    getTranslations({ locale, namespace: 'Site' }),
  ])
  const category = typeof post.category === 'object' ? (post.category as Category) : null
  const author = typeof post.author === 'object' ? (post.author as Author) : null
  const service = typeof post.service === 'object' ? (post.service as Service) : null
  const { servedLang } = localeAlternates(`/ratgeber/${slug}`, await translatedLocales('posts', post.id), locale)
  const canonical = canonicalUrl(servedLang, `/ratgeber/${slug}`)
  const minutes = readingMinutes(post.shortAnswer, post.content)
  const faq = (post.faq ?? []).map((f) => ({ question: f.question, answer: f.answer }))
  const sources = post.sources ?? []

  // TOC: body headings, then the template sections FAQ and sources.
  const toc = [
    ...tocOf(post.content, ['faq', 'quellen']),
    ...(faq.length > 0 ? [{ id: 'faq', text: t('faq'), level: 2 as const }] : []),
    ...(sources.length > 0 ? [{ id: 'quellen', text: t('sources'), level: 2 as const }] : []),
  ]

  // CTA box before the 4th H2 (design), otherwise after the body.
  const [bodyA, bodyB] = isLexical(post.content) ? splitBeforeH2(post.content, 4) : [null, null]
  const ctaPkg = post.ctaPackage ? service?.packages?.find((p) => p.name === post.ctaPackage) : null
  const cta = service
    ? {
        title: ctaPkg ? `${ctaPkg.name} – ${formatPackagePrice(ctaPkg, loc)}` : `${service.title} – ${serviceTeaserPrice(service, loc)}`,
        items: (ctaPkg?.includes ?? []).map((i) => i.item).filter(Boolean).slice(0, 4),
        button: t('ctaButton', { name: ctaPkg?.name ?? service.shortLabel ?? service.title }),
        href: `/kontakt?leistung=${service.slug}`,
        priced: ctaPkg ? ctaPkg.price != null : service.packages?.[0]?.price != null,
      }
    : null
  const showDisclaimer = Boolean(post.reviewedAt) || category?.slug === LEGAL_CATEGORY

  // Related: manual choice, else same category, filled up with the latest.
  const manual = (post.relatedPosts ?? []).filter((p): p is Exclude<typeof p, number> => typeof p === 'object')
  let related = manual.filter((p) => p._status === 'published')
  if (related.length === 0) {
    const all = (await getLivePosts(loc)).filter((p) => p.id !== post.id)
    const sameCat = all.filter((p) => (typeof p.category === 'object' ? p.category?.id : p.category) === category?.id)
    related = [...sameCat, ...all.filter((p) => !sameCat.includes(p))].slice(0, 3)
  }

  const photo = asMedia(author?.photo)
  const image = ogImage(asMedia(post.heroImage))
  const crumbs = [
    { name: t('home'), url: `${SITE_URL}/${locale}` },
    { name: t('guide'), url: canonicalUrl(locale, '/ratgeber') },
    ...(category ? [{ name: category.title, url: canonicalUrl(locale, `/ratgeber/kategorie/${category.slug}`) }] : []),
    { name: stripEmphasis(post.title), url: canonical },
  ]
  const graph = [
    webPageNode({ canonical, name: stripEmphasis(post.meta?.title || post.title), description: post.meta?.description || post.excerpt, lang: servedLang as Locale }),
    blogPostingNode({
      canonical,
      headline: stripEmphasis(post.title),
      description: post.meta?.description || post.excerpt,
      image,
      datePublished: post.publishedAt,
      dateModified: post.contentUpdatedAt ?? post.publishedAt,
      authorSlug: author?.slug ?? 'autor',
      lang: servedLang as Locale,
    }),
    ...(author
      ? [
          personNode({
            slug: author.slug ?? 'autor',
            name: author.name,
            jobTitle: author.role,
            url: author.aboutPath ? canonicalUrl(locale, author.aboutPath) : null,
            sameAs: (author.sameAs ?? []).map((s) => s.url),
          }),
        ]
      : []),
    breadcrumbNode(canonical, crumbs),
    ...[faqPageNode(canonical, faq)].filter((n): n is NonNullable<typeof n> => n !== null),
  ]

  const dates: [string, string | null | undefined][] = [
    [t('published'), post.publishedAt],
    [t('updated'), post.contentUpdatedAt],
    [t('reviewed'), post.reviewedAt],
  ]

  return (
    <>
      <JsonLd graph={graph} />
      <article lang={servedLang !== locale ? servedLang : undefined}>
        <header className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] pt-7">
          <nav aria-label={ts('breadcrumb')}>
            <ol className="flex flex-wrap gap-2 text-[15px] text-muted">
              <li>
                <Link href="/" className="text-muted">
                  {t('home')}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/ratgeber" className="text-muted">
                  {t('guide')}
                </Link>
              </li>
              {category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={`/ratgeber/kategorie/${category.slug}`} className="text-muted">
                      {category.title}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>
          <div className="mt-[clamp(28px,5vw,56px)] max-w-[780px]">
            {category && (
              <p className="flex gap-2">
                <span className="rounded-[3px] border border-ink px-2.5 py-[3px] text-sm font-extrabold">{category.title}</span>
              </p>
            )}
            <h1 className="mt-[18px] text-[clamp(34px,4.4vw,54px)] leading-[1.08] font-extrabold tracking-[-0.025em] text-balance">
              {withEmphasis(post.title)}
            </h1>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3.5">
              {author && (
                <div className="flex items-center gap-3">
                  <div className="w-[52px] flex-none overflow-hidden rounded-full">
                    <MediaImage media={photo} ratio="1/1" sizes="52px" />
                  </div>
                  <p className="text-base leading-[1.35]">
                    <strong className="text-ink">{author.name}</strong>
                    {author.role && (
                      <>
                        <br />
                        <span className="text-muted">{author.role}</span>
                      </>
                    )}
                  </p>
                </div>
              )}
              <dl className="flex flex-wrap gap-x-[18px] gap-y-1 text-[15px] text-muted">
                {dates
                  .filter(([, v]) => Boolean(v))
                  .map(([label, v]) => (
                    <div key={label} className="flex gap-[5px]">
                      <dt>{label}</dt>
                      <dd className="font-bold text-text">
                        <time dateTime={(v as string).slice(0, 10)}>{dateFmt(v as string, loc)}</time>
                      </dd>
                    </div>
                  ))}
                <div className="flex gap-[5px]">
                  <dt>{t('readingTime')}</dt>
                  <dd className="font-bold text-text">{t('minutes', { min: minutes })}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="mt-9">
            <MediaImage media={post.heroImage} ratio="21/9" sizes="(min-width: 1280px) 1200px, 100vw" priority />
          </div>
        </header>

        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-16 px-[clamp(20px,4vw,40px)] pt-[clamp(40px,6vw,72px)] min-[960px]:flex-row">
          <Toc items={toc} />
          <div className="max-w-[720px] min-w-0 flex-1">
            <section aria-label={t('shortAnswer')} className="rounded-[4px] border-2 border-ink p-[clamp(20px,3vw,32px)]">
              <p className="flex items-center gap-2.5 text-sm font-extrabold tracking-[0.08em] uppercase">
                <span aria-hidden="true" className="inline-block h-3.5 w-3.5 border-2 border-accent" />
                {t('shortAnswer')}
              </p>
              <p className="mt-3 text-[19px] leading-[1.6] text-ink">{post.shortAnswer}</p>
            </section>

            <div className="max-w-[68ch]">
              {bodyA && <ArticleBody data={bodyA as never} toc={toc} />}
              {cta && (
                <aside aria-label={t('ctaLabel')} className="mt-12 rounded-[4px] bg-ink p-[clamp(24px,3vw,36px)] text-[#D6D6D6]">
                  <p className="text-sm font-extrabold tracking-[0.08em] text-white uppercase">{t('ctaKicker')}</p>
                  <p className="mt-2.5 text-2xl leading-[1.25] font-extrabold text-white">{cta.title}</p>
                  {cta.items.length > 0 && (
                    <ul className="mt-[18px] grid gap-2.5 text-[17px]">
                      {cta.items.map((item, i) => (
                        <li key={item} className="flex items-start gap-3">
                          <Check size={22} index={i} surface="dark" className="mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3.5">
                    <ButtonLink href={cta.href} onDark className="text-base">
                      {cta.button}
                    </ButtonLink>
                    {cta.priced && <span className="text-sm text-[#BDBDBD]">{ts('priceNote')}</span>}
                  </div>
                </aside>
              )}
              {bodyB && <ArticleBody data={bodyB as never} toc={toc} />}

              {faq.length > 0 && (
                <>
                  <h2 id="faq" className="mt-14 scroll-mt-28 text-[clamp(26px,2.6vw,32px)] leading-[1.2] font-extrabold">
                    {t('faq')}
                  </h2>
                  <div className="mt-3">
                    {faq.map((f) => (
                      <details key={f.question} className="group border-b border-line">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-[18px] text-lg font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                          {f.question}
                          <span aria-hidden="true" className="text-[26px] font-normal transition-transform group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="pb-5">{f.answer}</p>
                      </details>
                    ))}
                  </div>
                </>
              )}

              {sources.length > 0 && (
                <>
                  <h2 id="quellen" className="mt-12 scroll-mt-28 text-[clamp(22px,2.2vw,26px)] font-extrabold">
                    {t('sources')}
                  </h2>
                  <ol className="mt-3.5 grid list-decimal gap-2 pl-[22px] text-base leading-[1.6]">
                    {sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {showDisclaimer && <p className="mt-[18px] text-sm text-muted">{t('disclaimer')}</p>}
            </div>

            {author && (
              <section
                aria-label={t('writtenBy')}
                className="mt-14 flex flex-wrap items-start gap-x-6 gap-y-5 border-t-2 border-ink py-7"
              >
                <div className="w-24 flex-none overflow-hidden rounded-full">
                  <MediaImage media={photo} ratio="1/1" sizes="96px" />
                </div>
                <div className="flex-[1_1_300px]">
                  <p className="text-sm font-extrabold tracking-[0.08em] text-muted uppercase">{t('writtenBy')}</p>
                  <p className="text-[22px] font-extrabold text-ink">{author.name}</p>
                  {author.bio && <p className="mt-1.5 text-[17px]">{author.bio}</p>}
                  {author.aboutPath && (
                    <p className="mt-2.5 text-base">
                      <Link href={author.aboutPath}>{t('moreAbout', { name: author.name.split(' ')[0] })}</Link>
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="rel-h" className="mt-14 bg-offwhite py-[clamp(56px,8vw,96px)]">
          <Wrap>
            <h2 id="rel-h" className="text-[clamp(26px,2.6vw,34px)] font-extrabold">
              {t('related')}
            </h2>
            <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
              {related.map((p) => (
                <PostCard key={p.id} post={p} meta={(c, min) => t('cardMeta', { category: c, min })} />
              ))}
            </div>
          </Wrap>
        </section>
      )}
    </>
  )
}
