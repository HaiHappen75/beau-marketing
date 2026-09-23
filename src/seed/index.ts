import path from 'node:path'
import type { Payload } from 'payload'

import {
  AUTHORS,
  BRANDS,
  CASES,
  CATEGORIES,
  ENGAGEMENTS,
  NAV_FOOTER_LEGAL,
  NAV_HEADER,
  RELEASE,
  SERVICES,
  SITE_SETTINGS,
  TRUST_MEDIA,
  TRUST_SERVER_NOTE,
} from './data'
import { display, emptyPlan, ensureMedia, fillGlobal, fillRowLabels, fillRowsByKey, mergePlans, upsertDoc } from './fill'
import type { Plan } from './fill'
import {
  isLegacyUrl,
  LEGACY_BRAND_DESCRIPTIONS,
  LEGACY_BRAND_NAMES,
  LEGACY_BRAND_ORDER,
  LEGACY_BLOCK_HEADINGS,
  LEGACY_BRAND_TAGLINES,
  LEGACY_BRAND_TAGLINES_REDESIGN,
  LEGACY_CASE_CHIPS,
  LEGACY_PACKAGE_INCLUDES,
  LEGACY_PACKAGE_ITEMS,
  LEGACY_PAGE_META,
  LEGACY_SERVICE_TEXTS,
  LEGACY_PLACEHOLDER_PARAGRAPH,
  LEGACY_SITE_NAME,
} from './legacy'
import { isRichText, nodeText, rt } from './richtext'
import { PAGES, SERVICE_CONTENT, type BlockSeed } from './content'
import { LOCATIONS } from './locations'
import { fillTranslations } from './translations'
import type { SeedLocale, SeedSummary } from './types'

// Idempotent master-data seed: `pnpm seed` locally, admin button (POST /api/seed)
// in production. Fill-only — see src/seed/fill.ts for the rules.

const TRUST_DIR = path.resolve(process.cwd(), 'public', 'brand', 'trust')

type Obj = Record<string, unknown>

const websiteLink = (url: string) => [{ label: 'Website', url, type: 'website' }]

/**
 * Brand rules beyond plain fields: legacy link rows and legacy description
 * paragraphs. An empty link list is filled by planFill (links are part of the
 * create data); here only rows with an invented URL are removed or replaced.
 */
function brandCustom(slug: string, url: string | null) {
  return (current: Obj, locale: SeedLocale): Plan => {
    const plan = emptyPlan()

    const description = current.description
    if (isRichText(description)) {
      const legacyParas = [LEGACY_PLACEHOLDER_PARAGRAPH[locale], LEGACY_BRAND_DESCRIPTIONS[slug]?.[locale]].filter(
        Boolean,
      )
      const children = description.root.children
      const kept = children.filter((node) => !legacyParas.includes(nodeText(node).trim()))
      if (kept.length !== children.length) {
        const next = kept.some((n) => nodeText(n).trim() !== '')
          ? { ...description, root: { ...description.root, children: kept } }
          : null
        plan.patch.description = next
        plan.legacy.push({ field: 'description', from: display(description), to: next ? display(next) : null })
      }
    }

    if (locale === 'de') {
      const rows = Array.isArray(current.links) ? (current.links as Obj[]) : []
      const kept = rows.filter((r) => !isLegacyUrl(r.url))
      for (const r of rows.filter((row) => isLegacyUrl(row.url))) {
        plan.legacy.push({ field: 'links', from: String(r.url), to: kept.length === 0 && url ? url : null })
      }
      if (kept.length !== rows.length) {
        plan.patch.links = kept.length === 0 && url ? websiteLink(url) : kept
      }
    }
    return plan
  }
}

export async function runSeed(payload: Payload): Promise<SeedSummary> {
  const summary: SeedSummary = {}

  // ── Media (trust badges, byte-identical files from public/brand/trust) ────────
  const media: Record<keyof typeof TRUST_MEDIA, number> = { sh: 0, erecht24: 0 }
  for (const key of Object.keys(TRUST_MEDIA) as (keyof typeof TRUST_MEDIA)[]) {
    const m = TRUST_MEDIA[key]
    media[key] = await ensureMedia(
      payload,
      { filename: m.filename, filePath: path.join(TRUST_DIR, m.filename), alt: m.alt, credit: m.credit },
      summary,
    )
  }

  // ── Services ──────────────────────────────────────────────────────────────────
  // Services other services point to ("Danach"-Karte) are handled first.
  const serviceIds: Record<string, number> = {}
  const referenced = new Set(Object.values(SERVICE_CONTENT).map((c) => c.aftercare?.service).filter(Boolean))
  const serviceOrder = [...SERVICES].sort((a, b) => Number(referenced.has(b.slug)) - Number(referenced.has(a.slug)))
  for (const s of serviceOrder) {
    const content = SERVICE_CONTENT[s.slug]
    const packages = s.packages.map((p) => ({
      name: p.name,
      kicker: content?.packages[p.name]?.kicker,
      display: content?.packages[p.name]?.display ?? 'card',
      description: content?.packages[p.name]?.description,
      price: p.price,
      priceIsFrom: p.priceIsFrom,
      unit: p.unit,
      term: p.term,
      includes: p.includes.map((item) => ({ item })),
    }))
    const aftercareId = content?.aftercare ? serviceIds[content.aftercare.service] : undefined
    const doc = await upsertDoc(
      payload,
      'services',
      {
        key: s.slug,
        where: { slug: { equals: s.slug } },
        status: 'published',
        data: {
          de: {
            title: s.title,
            slug: s.slug,
            shortDescription: s.shortDescription,
            order: s.order,
            packages,
            ...(content
              ? {
                  shortLabel: content.shortLabel,
                  teaser: content.teaser,
                  headline: content.headline,
                  promise: content.promise,
                  deliverables: {
                    heading: content.deliverables.heading,
                    text: content.deliverables.text,
                    items: content.deliverables.items.map((item) => ({ item })),
                  },
                  aftercare: aftercareId ? { service: aftercareId, packageName: content.aftercare!.packageName } : undefined,
                  steps: content.steps,
                  faq: content.faq,
                  inHouse: content.inHouse
                    ? { ...content.inHouse, items: content.inHouse.items.map((item) => ({ item })) }
                    : undefined,
                  cta: { heading: content.cta.heading },
                }
              : {}),
          },
        },
        // Legacy service copy (e.g. Druck & Werbemittel before 23.09.): exact old
        // strings, or an item list that still equals the old list as a whole.
        legacy: (field, value) =>
          (LEGACY_SERVICE_TEXTS[s.slug] ?? []).some(
            (l) =>
              l.field === field &&
              l.values.some((v) =>
                Array.isArray(v)
                  ? Array.isArray(value) &&
                    JSON.stringify((value as Obj[]).map((r) => r.item)) === JSON.stringify(v)
                  : v === value,
              ),
          ),
        // Existing packages: fill new sub-fields per package (matched by name)
        // and reword legacy items — prices and everything else stay untouched.
        custom: (current, locale) =>
          locale !== 'de'
            ? emptyPlan()
            : fillRowsByKey(
                current.packages,
                packages.map(({ name, kicker, description, display }) => ({ name, kicker, description, display })),
                'packages',
                'name',
                locale,
                () => false,
                (row, _want, plan, path) => {
                  const items = Array.isArray(row.includes) ? (row.includes as Obj[]) : []
                  // A whole item list that still equals an old seed list is replaced.
                  const texts = items.map((it) => String(it.item))
                  const oldLists = LEGACY_PACKAGE_INCLUDES[String(row.name)] ?? []
                  const fresh = packages.find((p) => p.name === row.name)?.includes
                  if (fresh && oldLists.some((l) => JSON.stringify(l) === JSON.stringify(texts))) {
                    plan.legacy.push({
                      field: `${path}.includes`,
                      from: texts.join(' / '),
                      to: fresh.map((f) => f.item).join(' / '),
                    })
                    return { ...row, includes: fresh }
                  }
                  let changed = false
                  const next = items.map((it) => {
                    const replacement = LEGACY_PACKAGE_ITEMS[String(it.item)]
                    if (!replacement) return it
                    changed = true
                    plan.legacy.push({ field: `${path}.includes`, from: String(it.item), to: replacement })
                    return { ...it, item: replacement }
                  })
                  return changed ? { ...row, includes: next } : row
                },
              ),
      },
      summary,
    )
    if (doc) serviceIds[s.slug] = doc.id as number
  }

  // ── Guide taxonomy ───────────────────────────────────────────────────────────
  for (const [i, c] of CATEGORIES.entries()) {
    await upsertDoc(
      payload,
      'categories',
      { key: c.slug, where: { slug: { equals: c.slug } }, data: { de: { title: c.title, slug: c.slug, order: i + 1, noindex: true } } },
      summary,
    )
  }
  for (const a of AUTHORS) {
    await upsertDoc(
      payload,
      'authors',
      { key: a.slug, where: { slug: { equals: a.slug } }, data: { de: { name: a.name, slug: a.slug, role: a.role, aboutPath: a.aboutPath } } },
      summary,
    )
  }

  // ── Brands ────────────────────────────────────────────────────────────────────
  const { docs: existingBrands } = await payload.find({ collection: 'brands', depth: 0, limit: 100, pagination: false })
  const legacyOrderIntact =
    existingBrands.length > 0 &&
    existingBrands.every((b) => b.slug && LEGACY_BRAND_ORDER[b.slug] === b.order)
  for (const b of BRANDS) {
    const legacyTagline = LEGACY_BRAND_TAGLINES[b.slug]
    await upsertDoc(
      payload,
      'brands',
      {
        key: b.slug,
        where: { slug: { equals: b.slug } },
        createIfMissing: b.create,
        data: {
          de: {
            name: b.name,
            slug: b.slug,
            status: b.status,
            tagline: b.tagline,
            order: b.order,
            category: b.category,
            links: b.url ? websiteLink(b.url) : undefined,
          },
          // Only clears legacy claims; new en/da claims come with the translations.
          ...(legacyTagline ? { en: { tagline: null }, da: { tagline: null } } : {}),
        },
        legacy: (field, value, locale) =>
          (field === 'name' && (LEGACY_BRAND_NAMES[b.slug] ?? []).includes(value as string)) ||
          (field === 'order' && legacyOrderIntact && LEGACY_BRAND_ORDER[b.slug] === value) ||
          (field === 'tagline' && legacyTagline?.[locale] === value) ||
          (field === 'tagline' && locale === 'de' && (LEGACY_BRAND_TAGLINES_REDESIGN[b.slug] ?? []).includes(value as string)),
        custom: brandCustom(b.slug, b.url),
      },
      summary,
    )
  }

  // ── Cases ─────────────────────────────────────────────────────────────────────
  const caseIds: Record<string, number> = {}
  for (const c of CASES) {
    const caseDoc = await upsertDoc(
      payload,
      'cases',
      {
        key: c.slug,
        where: { slug: { equals: c.slug } },
        status: c.status,
        data: {
          de: {
            client: c.client,
            slug: c.slug,
            industry: c.industry,
            place: c.place,
            url: c.url,
            chips: c.chips.map((label) => ({ label })),
            services: c.services.map((slug) => serviceIds[slug]).filter(Boolean),
            hasDetailPage: c.hasDetailPage,
            featuredOnHome: c.featuredOnHome,
            order: c.order,
            releaseDate: RELEASE.date,
            releaseNote: RELEASE.note,
            ...(c.detail
              ? { summary: c.detail.summary, solution: rt([c.detail.solution]), result: rt([c.detail.result]) }
              : {}),
          },
        },
        // Reworded chips: only the chip row itself is replaced, the rest stays.
        custom: (current, locale) => {
          const map = LEGACY_CASE_CHIPS[c.slug]
          const plan = emptyPlan()
          if (locale !== 'de' || !map || !Array.isArray(current.chips)) return plan
          let changed = false
          const next = (current.chips as Obj[]).map((row) => {
            const to = map[String(row.label)]
            if (!to) return row
            changed = true
            plan.legacy.push({ field: 'chips', from: String(row.label), to })
            return { ...row, label: to }
          })
          if (changed) plan.patch.chips = next
          return plan
        },
      },
      summary,
    )
    if (caseDoc) caseIds[c.slug] = caseDoc.id as number
  }

  // ── Local landing pages ──────────────────────────────────────────────────────
  for (const l of LOCATIONS) {
    await upsertDoc(
      payload,
      'locations',
      {
        key: l.slug,
        where: { slug: { equals: l.slug } },
        status: l.status,
        data: {
          de: {
            title: l.title,
            slug: l.slug,
            place: l.place,
            region: l.region,
            headline: l.headline,
            lead: l.lead,
            introHeading: l.introHeading,
            intro: l.intro,
            highlights: l.highlights?.map((item) => ({ item })),
            localReference: l.regionalNote ? { type: 'regional', regionalNote: l.regionalNote } : undefined,
            cases: l.cases?.map((slug) => caseIds[slug]).filter(Boolean),
            visitInfo: l.visitInfo,
            distance: l.distance,
            faq: l.faq,
          },
        },
      },
      summary,
    )
  }

  // ── Engagements (photos stay empty until real ones exist) ────────────────────
  for (const e of ENGAGEMENTS) {
    await upsertDoc(
      payload,
      'engagements',
      {
        key: e.institution,
        where: { institution: { equals: e.institution } },
        data: { de: { institution: e.institution, place: e.place, kind: e.kind, order: e.order, visible: true } },
      },
      summary,
    )
  }

  // ── Globals ───────────────────────────────────────────────────────────────────
  await fillGlobal(
    payload,
    {
      slug: 'site-settings',
      data: { de: SITE_SETTINGS },
      legacy: (field, value) => field === 'siteName' && LEGACY_SITE_NAME.includes(value as string),
    },
    summary,
  )

  await fillGlobal(
    payload,
    {
      slug: 'navigation',
      data: {
        de: {
          header: NAV_HEADER.map((n) => ({ label: n.de, href: n.href })),
          footerLegal: NAV_FOOTER_LEGAL.map((n) => ({ label: n.de, href: n.href })),
        },
      },
      custom: (current, locale) =>
        locale === 'de'
          ? emptyPlan()
          : mergePlans(
              fillRowLabels(current.header, NAV_HEADER.map((n) => n[locale]), 'header'),
              fillRowLabels(current.footerLegal, NAV_FOOTER_LEGAL.map((n) => n[locale]), 'footerLegal'),
            ),
    },
    summary,
  )

  await fillGlobal(
    payload,
    {
      slug: 'trust',
      data: {
        de: {
          badges: [
            { name: TRUST_MEDIA.sh.name, href: TRUST_MEDIA.sh.href, image: media.sh },
            {
              name: TRUST_MEDIA.erecht24.name,
              href: TRUST_MEDIA.erecht24.href,
              image: media.erecht24,
              caption: TRUST_MEDIA.erecht24.caption,
            },
          ],
          serverNote: TRUST_SERVER_NOTE.de,
          googleReviews: { show: false },
        },
        en: { serverNote: TRUST_SERVER_NOTE.en },
        da: { serverNote: TRUST_SERVER_NOTE.da },
      },
      // Badge captions (Paket 2) for badges that already exist.
      custom: (current, locale) =>
        locale !== 'de'
          ? emptyPlan()
          : fillRowsByKey(
              current.badges,
              [{ name: TRUST_MEDIA.erecht24.name, caption: TRUST_MEDIA.erecht24.caption }],
              'badges',
              'name',
              locale,
            ),
    },
    summary,
  )

  // ── Pages (start, agentur, kontakt) ──────────────────────────────────────────
  const toBlock = (b: BlockSeed) => {
    if (b.blockType !== 'hero' || !b.checks) return b
    return {
      ...b,
      checks: b.checks
        .map((c) => (c.kind === 'service' ? { kind: 'service', service: serviceIds[c.service] } : c))
        .filter((c) => c.kind === 'text' || (c as { service?: number }).service),
    }
  }
  for (const page of PAGES) {
    await upsertDoc(
      payload,
      'pages',
      {
        key: page.slug,
        where: { slug: { equals: page.slug } },
        status: 'published',
        data: {
          de: { title: page.title, slug: page.slug, meta: page.meta, layout: page.layout.map(toBlock) },
        },
        legacy: (field, value, locale) => locale === 'de' && (LEGACY_PAGE_META[page.slug]?.[field] ?? []).includes(value as string),
        // Reworded block headings of existing pages (matched by block type).
        custom: (current, locale) => {
          const legacyHeadings = LEGACY_BLOCK_HEADINGS[page.slug]
          if (locale !== 'de' || !legacyHeadings) return emptyPlan()
          const desired = page.layout
            .filter((b) => b.blockType in legacyHeadings && 'heading' in b)
            .map((b) => ({ blockType: b.blockType, heading: (b as { heading?: string }).heading }))
          return fillRowsByKey(current.layout, desired, 'layout', 'blockType', locale, (field, value) =>
            Object.values(legacyHeadings).some((list) => field.endsWith('.heading') && list.includes(value as string)),
          )
        },
      },
      summary,
    )
  }

  // ── Translations (da complete, en core pages) — after everything they refer to ─
  await fillTranslations(payload, summary)

  return summary
}

/** Human-readable summary for the CLI. */
export function formatSummary(summary: SeedSummary): string {
  const lines: string[] = []
  for (const [collection, s] of Object.entries(summary)) {
    lines.push(
      `${collection}: angelegt ${s.created.length} · ergänzt ${s.filled.length} · übersprungen ${s.skipped.length} · Altwert ersetzt ${s.legacyReplaced.length}`,
    )
    for (const x of s.skipped.filter((k) => k.includes('deutscher Text geändert') || k.includes('Dokument fehlt'))) {
      lines.push(`  ↳ nicht übersetzt: ${x}`)
    }
    for (const l of s.legacyReplaced) {
      lines.push(`  ↳ Altwert ersetzt: ${l.doc} · ${l.field}${l.locale ? ` (${l.locale})` : ''}: „${l.from}“ → ${l.to === null ? '(geleert)' : `„${l.to}“`}`)
    }
  }
  return lines.join('\n')
}
