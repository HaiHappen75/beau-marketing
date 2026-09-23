import { getTranslations } from 'next-intl/server'

import { DeviceFrame } from '@/components/site/MediaImage'
import { H2, Kicker, Section } from '@/components/site/primitives'
import { Link } from '@/i18n/navigation'
import { getCasesByIds, getFeaturedCases, idOf } from '@/lib/queries/content'
import type { Case } from '@/payload-types'

import type { BlockContext, BlockOf } from './types'

/** Reference cards; only cases with their own detail page link to it. */
export function CaseCard({ c, referenceAria }: { c: Case; referenceAria: string }) {
  const detail = c.hasDetailPage ? `/referenzen/${c.slug}` : null
  const shot = c.screenshots?.[0]
  const chips = (c.chips ?? []).map((x) => x.label).filter(Boolean)
  return (
    <article>
      {detail ? (
        <Link href={detail} aria-label={referenceAria} className="block no-underline">
          <DeviceFrame media={shot} sizes="(min-width: 1024px) 560px, 100vw" />
        </Link>
      ) : (
        <DeviceFrame media={shot} sizes="(min-width: 1024px) 560px, 100vw" />
      )}
      <div className="mt-5 flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5">
        <h3 className="text-2xl font-extrabold">
          {detail ? (
            <Link href={detail} className="no-underline hover:underline">
              {c.client}
            </Link>
          ) : (
            c.client
          )}
        </h3>
        {c.industry && <span className="text-[15px] text-muted">{c.industry}</span>}
      </div>
      {chips.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={chip} className="rounded-[3px] border border-line px-2.5 py-1 text-sm font-bold text-ink">
              {chip}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export async function CasesBlock({ block, ctx }: { block: BlockOf<'caseTeaser'>; ctx: BlockContext }) {
  const t = await getTranslations({ locale: ctx.locale, namespace: 'Site' })
  const ids = (block.cases ?? []).map(idOf).filter((id): id is number => id !== null)
  const cases = ids.length > 0 ? await getCasesByIds(ids, ctx.locale) : await getFeaturedCases(ctx.locale)
  if (cases.length === 0) return null
  return (
    <Section>
      <Kicker>{block.kicker}</Kicker>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <H2>{block.heading}</H2>
        <Link href="/referenzen" className="text-[17px] font-bold">
          {t('allReferences')}
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(min(100%,460px),1fr))] gap-x-10 gap-y-14">
        {cases.map((c) => (
          <CaseCard key={c.id} c={c} referenceAria={t('referenceAria', { name: c.client })} />
        ))}
      </div>
    </Section>
  )
}
