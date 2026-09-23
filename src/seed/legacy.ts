import type { SeedLocale } from './types'

// Values written by the seed of the first site version (June–August 2026).
// They count as EMPTY for the fill-only seed: a field holding exactly one of
// these was never edited by hand, so replacing it cannot undo anyone's work.
// Anything else in a field — even one character different — is left alone.
//
// Brand claims: a legacy claim counts as legacy in all three languages when its
// German text differs from the corrected brand list (Huusbook's matches and
// stays, en/da included). Descriptions: the filler paragraph always goes; the
// remaining old text only where it describes the brand wrongly or with
// unverified feature claims (Tappi's real product text stays).

/** Invented hosts from the old seed. */
export const isLegacyUrl = (url: unknown): boolean =>
  typeof url === 'string' && /^https?:\/\/[a-z0-9-]+\.example\.com\/?$/i.test(url.trim())

export const LEGACY_SITE_NAME = ['Beau-Marketing']

export const LEGACY_BRAND_NAMES: Record<string, string[]> = {
  'family-manager': ['Family Manager'],
}

/**
 * Sort order from the old seed, per brand slug. Small numbers collide easily with
 * a deliberate choice, so the order only counts as legacy while ALL brands still
 * carry exactly this order — i.e. nobody has ever sorted by hand.
 */
export const LEGACY_BRAND_ORDER: Record<string, number> = {
  fjella: 1,
  'family-manager': 2,
  thingr: 3,
  anwurf: 4,
  huusbook: 5,
  tappi: 6,
}

export const LEGACY_BRAND_TAGLINES: Record<string, Record<SeedLocale, string>> = {
  fjella: {
    de: 'Skandinavischer Lifestyle, kuratiert.',
    en: 'Scandinavian lifestyle, curated.',
    da: 'Skandinavisk livsstil, kurateret.',
  },
  'family-manager': {
    de: 'Der Familienalltag, organisiert.',
    en: 'Family life, organized.',
    da: 'Familielivet, organiseret.',
  },
  thingr: {
    de: 'Vereinsführung, leicht gemacht.',
    en: 'Club management made easy.',
    da: 'Foreningsledelse, gjort let.',
  },
  anwurf: {
    de: 'Angeln an Nord- und Ostsee.',
    en: 'Fishing the North & Baltic Sea.',
    da: 'Fiskeri i Nord- og Østersøen.',
  },
  tappi: {
    de: 'Digitale Visitenkarte. Einmal tippen, immer aktuell.',
    en: 'Digital business card. Tap once, always current.',
    da: 'Digitalt visitkort. Tap én gang, altid opdateret.',
  },
}

/** The filler paragraph the old seed appended to descriptions. */
export const LEGACY_PLACEHOLDER_PARAGRAPH: Record<SeedLocale, string> = {
  de: 'Platzhaltertext – der finale Text folgt.',
  en: 'Placeholder text – final copy to follow.',
  da: 'Pladsholdertekst – endelig tekst følger.',
}

/** Old description paragraphs of the brands whose claim was wrong. */
export const LEGACY_BRAND_DESCRIPTIONS: Record<string, Record<SeedLocale, string>> = {
  fjella: {
    de: 'Fjella ist ein Online-Store für Lifestyle-Produkte mit skandinavischer Handschrift – reduziert, hochwertig und alltagstauglich.',
    en: 'Fjella is an online store for lifestyle products with a Scandinavian signature — understated, high quality and made for everyday life.',
    da: 'Fjella er en webshop for livsstilsprodukter med skandinavisk signatur – enkel, i høj kvalitet og til hverdagsbrug.',
  },
  'family-manager': {
    de: 'Family Manager bündelt alles, was eine Familie täglich organisieren muss – Termine, Aufgaben, Listen und mehr an einem Ort.',
    en: 'Family Manager brings together everything a family organizes day to day — calendars, tasks, lists and more in one place.',
    da: 'Family Manager samler alt, hvad en familie skal organisere til daglig – kalendere, opgaver, lister og meget mere ét sted.',
  },
  thingr: {
    de: 'ThingR ist Software für die Vereinsführung – Mitglieder, Beiträge, Termine und Kommunikation, ohne den üblichen Verwaltungsaufwand.',
    en: 'ThingR is software for running clubs and associations — members, fees, events and communication, without the usual admin overhead.',
    da: 'ThingR er software til foreningsledelse – medlemmer, kontingenter, arrangementer og kommunikation uden det sædvanlige administrative besvær.',
  },
  anwurf: {
    de: 'Anwurf ist die Angel-App für Nord- und Ostsee – mit Spots, Gezeiten und allem, was Angler vor Ort brauchen.',
    en: 'Anwurf is the fishing app for the North and Baltic Sea — with spots, tides and everything anglers need on the water.',
    da: 'Anwurf er fiskeappen til Nord- og Østersøen – med spots, tidevand og alt, hvad lystfiskere har brug for på stedet.',
  },
}

/**
 * Package items of the first redesign seed (Paket 1) that were reworded.
 * RDG: we implement mandatory information, we do not sell legal checks.
 */
export const LEGACY_PACKAGE_ITEMS: Record<string, string> = {
  'CCD-II-Check der Zahlarten': 'Zahlarten nach CCD II einrichten',
}

/** Brand claims of the redesign seed (Paket 1) that were replaced later. */
export const LEGACY_BRAND_TAGLINES_REDESIGN: Record<string, string[]> = {
  fjella: ['Nordisches Interior – „Zuhause, nordisch gedacht.“ Unser eigener Shopify-Shop.'],
}

/**
 * Package item lists of the redesign seed (Paket 1) replaced as a whole — only
 * when the list is exactly this, i.e. nobody has touched it.
 */
export const LEGACY_PACKAGE_INCLUDES: Record<string, string[][]> = {
  'Website Start': [['Onepager']],
}

/**
 * Druck & Werbemittel before the decision of 23.09.2026 (design and print via
 * partner printers; the workshop is not offered as a service).
 */
export const LEGACY_SERVICE_TEXTS: Record<string, { field: string; values: (string | string[])[] }[]> = {
  'druck-werbemittel': [
    { field: 'shortDescription', values: ['Flyer, Schilder, Textil, Lasergravur.'] },
    { field: 'teaser', values: ['Flyer, Schilder, Textil, Lasergravur – aus der eigenen Werkstatt.'] },
    {
      field: 'promise',
      values: [
        'Gestaltung und Druck von Flyern, Visitenkarten, Bannern und Textil. Schilder und Lasergravur entstehen in der eigenen Werkstatt in Satrup.',
      ],
    },
    {
      field: 'deliverables.items',
      values: [
        [
          'Gestaltung',
          'Flyer und Visitenkarten',
          'Banner und Roll-ups',
          'Textil, z. B. Trikots und Warnwesten',
          'Schilder und Lasergravur aus der eigenen Werkstatt',
        ],
      ],
    },
  ],
}

/** Block headings of the Paket-2 page seed that were reworded (page slug → block type). */
export const LEGACY_BLOCK_HEADINGS: Record<string, Record<string, string[]>> = {
  start: { caseTeaser: ['Echte Betriebe, echte Seiten.'] },
}

/** Case chips replaced later (Hüpfburgen OWL: online booking is not released). */
export const LEGACY_CASE_CHIPS: Record<string, Record<string, string>> = {
  'huepfburgen-owl': { Buchungssystem: 'Verleih-Dashboard' },
}

/** Start page meta from Paket 2 and the Paket-5 proposal, replaced by the Xovi-checked title. */
export const LEGACY_PAGE_META: Record<string, Record<string, string[]>> = {
  start: {
    'meta.title': ['Beau Marketing – Websites, Shops und Sichtbarkeit für Betriebe im Norden', 'Webdesign & Shops in Schleswig-Holstein – Beau Marketing'],
    'meta.description': [
      'Wir bauen Websites und Shopify-Shops für Handwerk, Handel und Gastro in Schleswig-Holstein, Hamburg und Dänemark – und halten sie danach am Laufen.',
      'Websites, Shopify-Shops und lokale Sichtbarkeit für Betriebe in Schleswig-Holstein, Hamburg und Dänemark – feste Preise, Betreuung aus Satrup in Angeln.',
    ],
  },
}
