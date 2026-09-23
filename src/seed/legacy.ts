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
