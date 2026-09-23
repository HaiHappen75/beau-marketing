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
  LEGACY_BRAND_TAGLINES,
  LEGACY_PACKAGE_ITEMS,
  LEGACY_PLACEHOLDER_PARAGRAPH,
  LEGACY_SITE_NAME,
} from './legacy'
import { isRichText, nodeText } from './richtext'
import { PAGES, SERVICE_CONTENT, type BlockSeed } from './content'
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
      { key: a.slug, where: { slug: { equals: a.slug } }, data: { de: { name: a.name, slug: a.slug, role: a.role } } },
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
          (field === 'tagline' && legacyTagline?.[locale] === value),
        custom: brandCustom(b.slug, b.url),
      },
      summary,
    )
  }

  // ── Cases ─────────────────────────────────────────────────────────────────────
  for (const c of CASES) {
    await upsertDoc(
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
      },
      summary,
    )
  }

  return summary
}

/** Human-readable summary for the CLI. */
export function formatSummary(summary: SeedSummary): string {
  const lines: string[] = []
  for (const [collection, s] of Object.entries(summary)) {
    lines.push(
      `${collection}: angelegt ${s.created.length} · ergänzt ${s.filled.length} · übersprungen ${s.skipped.length} · Altwert ersetzt ${s.legacyReplaced.length}`,
    )
    for (const l of s.legacyReplaced) {
      lines.push(`  ↳ Altwert ersetzt: ${l.doc} · ${l.field}${l.locale ? ` (${l.locale})` : ''}: „${l.from}“ → ${l.to === null ? '(geleert)' : `„${l.to}“`}`)
    }
  }
  return lines.join('\n')
}
