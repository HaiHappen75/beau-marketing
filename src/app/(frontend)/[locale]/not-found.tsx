import { getLocale, getTranslations } from 'next-intl/server'

import { Kicker, Wrap } from '@/components/site/primitives'
import { Link } from '@/i18n/navigation'
import { withEmphasis } from '@/lib/emphasis'
import { hasPublishedPosts } from '@/lib/queries/content'

// 404 in the brand voice with ways back into the content (blog standard, item 14).
export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'NotFound' })
  const guide = await hasPublishedPosts()
  const links = [
    { href: '/', label: t('home') },
    { href: '/agentur', label: t('agency') },
    { href: '/referenzen', label: t('references') },
    ...(guide ? [{ href: '/ratgeber', label: t('guide') }] : []),
    { href: '/kontakt', label: t('contact') },
  ]
  return (
    <section className="bg-white py-[clamp(56px,10vw,140px)]">
      <Wrap>
        <Kicker>{t('kicker')}</Kicker>
        <h1 className="text-[clamp(36px,4.8vw,60px)] leading-[1.05] font-extrabold tracking-[-0.025em]">
          {withEmphasis(t('title'))}
        </h1>
        <p className="mt-5 max-w-[34em] text-lg">{t('text')}</p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-lg font-bold">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  )
}
