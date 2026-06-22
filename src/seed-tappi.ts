/**
 * Targeted, idempotent add of the "Tappi" brand (upsert by slug).
 * Run with: pnpm payload run src/seed-tappi.ts
 * Does NOT touch the other brands or globals.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

function rt(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [
          { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
        ],
      })),
    },
  }
}

const TAPPI = {
  name: 'Tappi',
  slug: 'tappi',
  category: 'tool' as const,
  order: 6,
  accentColor: '#2348B0',
  gradient: { from: '#2348B0', to: '#101d4a' },
  platforms: ['web'] as ('ios' | 'android' | 'macos' | 'web')[],
  url: 'https://gettappi.de',
  tagline: {
    de: 'Digitale Visitenkarte. Einmal tippen, immer aktuell.',
    en: 'Digital business card. Tap once, always current.',
    da: 'Digitalt visitkort. Tap én gang, altid opdateret.',
  },
  desc: {
    de: [
      'Tappi ist die digitale Visitenkarte mit NFC: Profil einmal anlegen, per Tap, QR-Code oder Link teilen – und Kontaktdaten jederzeit aktualisieren, ohne neu zu drucken.',
      'Gemacht für Einzelpersonen, Freelancer und Teams – mit zentraler Verwaltung, eigenem Branding und Apple-/Google-Wallet-Anbindung. Wer deinen Kontakt empfängt, braucht keine App.',
    ],
    en: [
      'Tappi is the NFC-powered digital business card: create your profile once, share it by tap, QR code or link — and update your details anytime, without reprinting.',
      'Built for individuals, freelancers and teams, with central management, custom branding and Apple/Google Wallet integration. Recipients need no app to save your contact.',
    ],
    da: [
      'Tappi er det NFC-baserede digitale visitkort: opret din profil én gang, del den med et tap, QR-kode eller link – og opdatér dine oplysninger når som helst, uden at trykke nyt.',
      'Skabt til enkeltpersoner, freelancere og teams – med central styring, eget branding og Apple/Google Wallet-integration. Modtagere behøver ingen app for at gemme din kontakt.',
    ],
  },
}

const run = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'brands',
    where: { slug: { equals: TAPPI.slug } },
    locale: 'de',
    limit: 1,
  })

  const baseData = {
    name: TAPPI.name,
    slug: TAPPI.slug,
    category: TAPPI.category,
    order: TAPPI.order,
    accentColor: TAPPI.accentColor,
    accentGradient: TAPPI.gradient,
    platforms: TAPPI.platforms,
    tagline: TAPPI.tagline.de,
    description: rt(TAPPI.desc.de),
    links: [{ label: 'Website', url: TAPPI.url, type: 'website' as const }],
  }

  let id: number | string
  if (existing.docs.length > 0) {
    id = existing.docs[0].id
    await payload.update({ collection: 'brands', id, locale: 'de', data: baseData })
  } else {
    const created = await payload.create({ collection: 'brands', locale: 'de', data: baseData })
    id = created.id
  }

  await payload.update({
    collection: 'brands',
    id,
    locale: 'en',
    data: { tagline: TAPPI.tagline.en, description: rt(TAPPI.desc.en) },
  })
  await payload.update({
    collection: 'brands',
    id,
    locale: 'da',
    data: { tagline: TAPPI.tagline.da, description: rt(TAPPI.desc.da) },
  })

  payload.logger.info('✅ Tappi added/updated.')
  process.exit(0)
}

await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
