import { getTranslations } from 'next-intl/server'

import { H2, Kicker, Section } from '@/components/site/primitives'
import { Link } from '@/i18n/navigation'
import { getPublishedCases, idOf } from '@/lib/queries/content'

import { CaseCard } from './CasesBlock'
import type { BlockContext, BlockOf } from './types'

/**
 * All published references with a service filter. The filter is a plain link
 * (?leistung=<slug>) rendered on the server — works without JavaScript and every
 * filtered view has a real URL. Chips only for services that have references.
 */
export async function CaseGridBlock({ block, ctx }: { block: BlockOf<'caseGrid'>; ctx: BlockContext }) {
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  const all = await getPublishedCases(ctx.locale)
  if (all.length === 0) return null

  const withCases = ctx.services.filter((s) => all.some((c) => (c.services ?? []).map(idOf).includes(s.id)))
  const active = withCases.find((s) => s.slug === ctx.preselectService) ?? null
  const cases = active ? all.filter((c) => (c.services ?? []).map(idOf).includes(active.id)) : all

  const chip = (on: boolean) =>
    `inline-flex min-h-9 items-center rounded-[3px] border px-3 py-1.5 text-sm font-bold no-underline ${
      on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'
    }`

  // Directly under the page hero (no heading of its own) the block needs no top padding.
  const standalone = Boolean(block.kicker || block.heading)
  return (
    <Section className={standalone ? '' : '!pt-0'}>
      <Kicker>{block.kicker}</Kicker>
      <H2>{block.heading}</H2>
      <nav aria-label={t('filter.label')} className={standalone ? 'mt-6' : ''}>
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link href="/referenzen" aria-current={active ? undefined : 'page'} className={chip(!active)} scroll={false}>
              {t('filter.all')}
            </Link>
          </li>
          {withCases.map((s) => (
            <li key={s.id}>
              <Link
                href={`/referenzen?leistung=${s.slug}`}
                aria-current={active?.id === s.id ? 'page' : undefined}
                className={chip(active?.id === s.id)}
                scroll={false}
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {cases.length > 0 ? (
        <div className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(min(100%,460px),1fr))] gap-x-10 gap-y-14">
          {cases.map((c) => (
            <CaseCard key={c.id} c={c} referenceAria={t('referenceAria', { name: c.client })} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-lg text-muted">{t('filter.empty')}</p>
      )}
    </Section>
  )
}
