/**
 * Seed placeholder content. Run with: pnpm seed
 * Idempotent: brands are upserted by slug; globals are overwritten with placeholders.
 * Brand copy & screenshots are placeholders — replace later via the admin (/admin).
 */
import { getPayload } from 'payload'
import config from '@payload-config'

type Tri = { de: string; en: string; da: string }
type TriPara = { de: string[]; en: string[]; da: string[] }

/** Build a minimal Lexical editor state from paragraphs. */
function rt(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
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

const PLACEHOLDER: Tri = {
  de: 'Platzhaltertext – der finale Text folgt.',
  en: 'Placeholder text – final copy to follow.',
  da: 'Pladsholdertekst – endelig tekst følger.',
}

type BrandSeed = {
  name: string
  slug: string
  category: 'ecommerce' | 'app' | 'tool'
  order: number
  accentColor: string
  gradient: { from: string; to: string }
  platforms: ('ios' | 'android' | 'macos' | 'web')[]
  url: string
  tagline: Tri
  desc: TriPara
}

const BRANDS: BrandSeed[] = [
  {
    name: 'Fjella',
    slug: 'fjella',
    category: 'ecommerce',
    order: 1,
    accentColor: '#2F6F7C',
    gradient: { from: '#2F6F7C', to: '#15323a' },
    platforms: ['web'],
    url: 'https://fjella.example.com',
    tagline: {
      de: 'Skandinavischer Lifestyle, kuratiert.',
      en: 'Scandinavian lifestyle, curated.',
      da: 'Skandinavisk livsstil, kurateret.',
    },
    desc: {
      de: [
        'Fjella ist ein Online-Store für Lifestyle-Produkte mit skandinavischer Handschrift – reduziert, hochwertig und alltagstauglich.',
        PLACEHOLDER.de,
      ],
      en: [
        'Fjella is an online store for lifestyle products with a Scandinavian signature — understated, high quality and made for everyday life.',
        PLACEHOLDER.en,
      ],
      da: [
        'Fjella er en webshop for livsstilsprodukter med skandinavisk signatur – enkel, i høj kvalitet og til hverdagsbrug.',
        PLACEHOLDER.da,
      ],
    },
  },
  {
    name: 'Family Manager',
    slug: 'family-manager',
    category: 'app',
    order: 2,
    accentColor: '#E2683C',
    gradient: { from: '#E2683C', to: '#7a2d18' },
    platforms: ['ios', 'android', 'web'],
    url: 'https://family-manager.example.com',
    tagline: {
      de: 'Der Familienalltag, organisiert.',
      en: 'Family life, organized.',
      da: 'Familielivet, organiseret.',
    },
    desc: {
      de: [
        'Family Manager bündelt alles, was eine Familie täglich organisieren muss – Termine, Aufgaben, Listen und mehr an einem Ort.',
        PLACEHOLDER.de,
      ],
      en: [
        'Family Manager brings together everything a family organizes day to day — calendars, tasks, lists and more in one place.',
        PLACEHOLDER.en,
      ],
      da: [
        'Family Manager samler alt, hvad en familie skal organisere til daglig – kalendere, opgaver, lister og meget mere ét sted.',
        PLACEHOLDER.da,
      ],
    },
  },
  {
    name: 'ThingR',
    slug: 'thingr',
    category: 'tool',
    order: 3,
    accentColor: '#4F5BD5',
    gradient: { from: '#4F5BD5', to: '#232a66' },
    platforms: ['web', 'ios', 'android'],
    url: 'https://thingr.example.com',
    tagline: {
      de: 'Vereinsführung, leicht gemacht.',
      en: 'Club management made easy.',
      da: 'Foreningsledelse, gjort let.',
    },
    desc: {
      de: [
        'ThingR ist Software für die Vereinsführung – Mitglieder, Beiträge, Termine und Kommunikation, ohne den üblichen Verwaltungsaufwand.',
        PLACEHOLDER.de,
      ],
      en: [
        'ThingR is software for running clubs and associations — members, fees, events and communication, without the usual admin overhead.',
        PLACEHOLDER.en,
      ],
      da: [
        'ThingR er software til foreningsledelse – medlemmer, kontingenter, arrangementer og kommunikation uden det sædvanlige administrative besvær.',
        PLACEHOLDER.da,
      ],
    },
  },
  {
    name: 'Anwurf',
    slug: 'anwurf',
    category: 'app',
    order: 4,
    accentColor: '#1C6E8C',
    gradient: { from: '#1C6E8C', to: '#0c2f3e' },
    platforms: ['ios', 'android'],
    url: 'https://anwurf.example.com',
    tagline: {
      de: 'Angeln an Nord- und Ostsee.',
      en: 'Fishing the North & Baltic Sea.',
      da: 'Fiskeri i Nord- og Østersøen.',
    },
    desc: {
      de: [
        'Anwurf ist die Angel-App für Nord- und Ostsee – mit Spots, Gezeiten und allem, was Angler vor Ort brauchen.',
        PLACEHOLDER.de,
      ],
      en: [
        'Anwurf is the fishing app for the North and Baltic Sea — with spots, tides and everything anglers need on the water.',
        PLACEHOLDER.en,
      ],
      da: [
        'Anwurf er fiskeappen til Nord- og Østersøen – med spots, tidevand og alt, hvad lystfiskere har brug for på stedet.',
        PLACEHOLDER.da,
      ],
    },
  },
  {
    name: 'Huusbook',
    slug: 'huusbook',
    category: 'tool',
    order: 5,
    accentColor: '#2E8B6B',
    gradient: { from: '#2E8B6B', to: '#143f30' },
    platforms: ['ios', 'android', 'macos'],
    url: 'https://huusbook.example.com',
    tagline: {
      de: 'Das Haushaltsbuch, neu gedacht.',
      en: 'The household budget, reimagined.',
      da: 'Husholdningsbudgettet, gentænkt.',
    },
    desc: {
      de: [
        'Huusbook ist ein modernes Haushaltsbuch – Ausgaben erfassen, Budgets behalten und den Überblick über die Finanzen wahren.',
        PLACEHOLDER.de,
      ],
      en: [
        'Huusbook is a modern household budget book — track spending, keep budgets and stay on top of your finances.',
        PLACEHOLDER.en,
      ],
      da: [
        'Huusbook er en moderne husholdningsbog – registrér udgifter, hold budgetter og bevar overblikket over din økonomi.',
        PLACEHOLDER.da,
      ],
    },
  },
  {
    name: 'Tappi',
    slug: 'tappi',
    category: 'tool',
    order: 6,
    accentColor: '#2348B0',
    gradient: { from: '#2348B0', to: '#101d4a' },
    platforms: ['web'],
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
  },
]

const seed = async () => {
  const payload = await getPayload({ config })

  for (const b of BRANDS) {
    const existing = await payload.find({
      collection: 'brands',
      where: { slug: { equals: b.slug } },
      locale: 'de',
      limit: 1,
    })

    const baseData = {
      name: b.name,
      slug: b.slug,
      category: b.category,
      order: b.order,
      accentColor: b.accentColor,
      accentGradient: b.gradient,
      platforms: b.platforms,
      tagline: b.tagline.de,
      description: rt(b.desc.de),
      links: [{ label: 'Website', url: b.url, type: 'website' as const }],
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
      data: { tagline: b.tagline.en, description: rt(b.desc.en) },
    })
    await payload.update({
      collection: 'brands',
      id,
      locale: 'da',
      data: { tagline: b.tagline.da, description: rt(b.desc.da) },
    })
    payload.logger.info(`Seeded brand: ${b.name}`)
  }

  // ── Globals ────────────────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'de',
    data: {
      siteName: 'Beau-Marketing',
      tagline: 'Markenhaus & Software-Studio.',
      contact: {
        email: 's.beau@beau-marketing.de',
        address: 'Beau-Marketing\nMusterstraße 1\n00000 Musterstadt',
      },
      social: [{ platform: 'LinkedIn', url: 'https://www.linkedin.com/' }],
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: { tagline: 'Brand house & software studio.' },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'da',
    data: { tagline: 'Brandhus & softwarestudie.' },
  })

  const now = new Date().toISOString()
  const legal = {
    impressum: {
      title: { de: 'Impressum', en: 'Imprint', da: 'Kolofon' },
      body: {
        de: ['Angaben gemäß § 5 TMG.', PLACEHOLDER.de],
        en: ['Legal disclosure.', PLACEHOLDER.en],
        da: ['Juridiske oplysninger.', PLACEHOLDER.da],
      },
    },
    datenschutz: {
      title: { de: 'Datenschutz', en: 'Privacy', da: 'Privatliv' },
      body: {
        de: ['Datenschutzerklärung.', PLACEHOLDER.de],
        en: ['Privacy policy.', PLACEHOLDER.en],
        da: ['Privatlivspolitik.', PLACEHOLDER.da],
      },
    },
  } as const

  for (const slug of ['impressum', 'datenschutz'] as const) {
    const entry = legal[slug]
    for (const loc of ['de', 'en', 'da'] as const) {
      await payload.updateGlobal({
        slug,
        locale: loc,
        data: { title: entry.title[loc], content: rt(entry.body[loc]), lastUpdated: now },
      })
    }
    payload.logger.info(`Seeded global: ${slug}`)
  }

  payload.logger.info('✅ Seed complete.')
  process.exit(0)
}

await seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
