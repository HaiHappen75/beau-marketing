// Page copy for Paket 2 — sources: design export (Startseite, Leistungsseite,
// Kontakt, Style-Tile), Repositionierung Agenturleistungen, Redesign-Eckpunkte.
// Where the design made claims nobody can back (response times, guarantees,
// "most customers take …", legal promises), the text is neutralised; the PR
// lists every such spot. Prices never appear in copy — they come from services.

import type { IconName } from '../lib/icons'
import type { SeedMediaKey } from './data'
import type { Anchor } from './fill'

type Faq = { question: string; answer: string }
type Step = { title: string; text: string }

export type ServiceContent = {
  shortLabel: string
  /**
   * German meta title without the brand (the layout template appends it). The
   * exception to "no prices in copy" (SEO, 22.10.2026): a price change of the
   * entry package has to be made here as well. da/en carry today's service name
   * as meta title (translations.json) — an empty one would show the German title
   * through the fallback locale.
   */
  meta?: { title: string }
  teaser: string
  headline: string | null
  promise: string
  deliverables: { heading: string; text: string | null; items: string[] }
  /** Extra fields per package, matched by package name. */
  packages: Record<string, { kicker?: string; description?: string; display?: 'card' | 'box' }>
  aftercare?: { service: string; packageName: string }
  steps: Step[]
  faq: Faq[]
  inHouse?: { heading: string; text: string; items: string[]; linkLabel: string; url: string }
  cta: { heading: string }
}

const STEPS: Step[] = [
  { title: 'Erstgespräch', text: 'Du erzählst, wir hören zu. Am Telefon oder bei dir im Betrieb.' },
  { title: 'Angebot', text: 'Schriftlich, mit Festpreis und Zeitplan.' },
  { title: 'Umsetzung', text: 'Wir bauen, du siehst jeden Zwischenstand.' },
  { title: 'Livegang', text: 'Wir schalten live und prüfen alles noch einmal.' },
  { title: 'Betreuung', text: 'Wenn du willst, bleiben wir dran.' },
]

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  websites: {
    shortLabel: 'Website',
    meta: { title: 'Homepage erstellen lassen ab 1.900 €' },
    teaser: 'Klar aufgebaut, schnell auf dem Handy, von dir selbst pflegbar.',
    headline: 'Eine Website, die für deinen Betrieb *arbeitet.*',
    promise:
      'Klar aufgebaut, schnell auf dem Handy, auf Servern in Deutschland. Fester Preis, und danach pflegst du sie selbst – oder wir machen das.',
    deliverables: {
      heading: 'Eine fertige Seite. Nicht nur ein Entwurf.',
      text: 'Du lieferst Wissen über deinen Betrieb, wir den Rest. Am Ende steht eine Seite, die online ist und funktioniert.',
      items: [
        'Struktur und Texte, gemeinsam mit dir erarbeitet',
        'Design, das nach deinem Betrieb aussieht – nicht nach Baukasten',
        'Optimiert für Handy, Tablet und Desktop',
        'Kontaktformular, Karte, Öffnungszeiten',
        'Impressum und Datenschutz über eRecht24',
        'Hosting auf Servern in Deutschland',
        'Grundlagen für Google: Ladezeit, Struktur, Metadaten',
        'Einweisung, damit du Texte selbst ändern kannst',
      ],
    },
    packages: {
      'Website Start': { kicker: 'Einstieg', description: 'Für Betriebe, die erst mal ordentlich gefunden werden wollen.' },
      'Website Standard': { kicker: 'Mehr Umfang', description: 'Für Betriebe mit mehreren Leistungen, Team und Referenzen.' },
    },
    aftercare: { service: 'betreuung-pflege', packageName: 'Basis, Plus, Pro' },
    steps: STEPS,
    faq: [
      {
        question: 'Was kostet eine Website bei euch?',
        answer:
          'Die Preise für Website Start und Website Standard stehen oben bei den Paketen, netto. Nach dem Erstgespräch bekommst du ein schriftliches Angebot mit Festpreis.',
      },
      {
        question: 'Wie lange dauert das?',
        answer: 'Das hängt vor allem daran, wie schnell Texte und Fotos da sind. Den Zeitplan schreiben wir ins Angebot.',
      },
      {
        question: 'Kann ich später selbst etwas ändern?',
        answer: 'Ja. Du bekommst eine Einweisung und kannst Texte, Bilder und Öffnungszeiten selbst pflegen.',
      },
      {
        question: 'Brauche ich die Betreuung?',
        answer: 'Nicht zwingend. Ohne Updates wird aber jede Website mit der Zeit unsicher.',
      },
      {
        question: 'Was passiert mit meiner alten Seite?',
        answer: 'Wir übernehmen, was gut ist, leiten alte Adressen um und kümmern uns um den Umzug der Domain.',
      },
    ],
    cta: { heading: 'Lass uns über deine Website reden.' },
  },
  'shopify-shops': {
    shortLabel: 'Shop',
    meta: { title: 'Shopify-Shop erstellen lassen ab 3.900 €' },
    teaser: 'Verkaufen ohne Technikfrust – inklusive aller Pflichtangaben.',
    headline: 'Ein Shopify-Shop, der *verkauft.*',
    promise:
      'Eingerichtet, mit allen Pflichtangaben umgesetzt und so gebaut, dass du ihn selbst bedienen kannst. Wir betreiben selbst einen – wir wissen, wo es hakt.',
    deliverables: {
      heading: 'Ein Shop, der am ersten Tag Bestellungen annimmt.',
      text: 'Vom Theme bis zur ersten Bestellung. Inklusive der Pflichtangaben, die viele Shops noch nicht haben.',
      items: [
        'Shopify eingerichtet: Theme, Produkte, Versand, Steuern',
        'Zahlungsarten eingerichtet und getestet',
        'Rechtstexte über einen Rechtstexte-Dienst wie eRecht24',
        'Widerrufsbutton und EU-Gewährleistungslabel',
        'Herstellerangaben zur Produktsicherheit',
        'Anbindung an Versand oder Warenwirtschaft nach Bedarf',
        'Optimiert für Handy – da kaufen die meisten',
        'Einweisung für dich und dein Team',
      ],
    },
    packages: {
      'Shop Start': { kicker: 'Einstieg', description: 'Für ein überschaubares Sortiment, das schnell online soll.' },
      'Shop Standard': { kicker: 'Mehr Umfang', description: 'Für größere Sortimente und Anbindungen.' },
      'Pflichtangaben-Update': {
        kicker: 'Für bestehende Shops',
        description: 'Dein Shop läuft schon, aber die neuen Pflichten fehlen noch? Wir rüsten nach – ohne Relaunch.',
        display: 'box',
      },
    },
    aftercare: { service: 'betreuung-pflege', packageName: 'Shop-Betreuung' },
    steps: STEPS,
    faq: [
      {
        question: 'Was kostet ein Shopify-Shop?',
        answer:
          'Die Preise für Shop Start und Shop Standard stehen oben bei den Paketen, netto. Dazu kommen die monatlichen Shopify-Gebühren, die du direkt an Shopify zahlst.',
      },
      {
        question: 'Warum Shopify und nicht WooCommerce?',
        answer:
          'Weil du dich um Server, Updates und Sicherheit nicht kümmern musst. Für die meisten kleinen Shops ist das die ruhigere Wahl.',
      },
      {
        question: 'Mein Shop läuft schon. Könnt ihr nur die Pflichtangaben nachrüsten?',
        answer:
          'Ja, mit dem Pflichtangaben-Update: Widerrufsbutton, EU-Gewährleistungslabel und Herstellerangaben zur Produktsicherheit.',
      },
      {
        question: 'Kann ich auch nach Dänemark verkaufen?',
        answer:
          'Grundsätzlich ja, über Shopify Markets. Für Dänemark brauchst du dänische Rechtstexte – das klären wir vorher.',
      },
    ],
    inHouse: {
      heading: 'Fjella – unser eigener *Shopify-Shop.*',
      text: 'Fjella ist unser eigener Shopify-Shop. Widerrufsbutton, EU-Gewährleistungslabel und Produkt-Pipeline haben wir dort selbst umgesetzt.',
      items: [
        'Shopify-Theme, Versand und Zahlungen eingerichtet',
        'Widerrufsbutton und Pflichtangaben im Einsatz',
        'Von uns betreut',
      ],
      linkLabel: 'Fjella ansehen',
      url: 'https://fjella-shop.de',
    },
    cta: { heading: 'Lass uns über deinen Shop reden.' },
  },
  'betreuung-pflege': {
    shortLabel: 'Betreuung',
    meta: { title: 'Website-Betreuung und Wartung ab 49 € im Monat' },
    teaser: 'Updates, Backups, Rechtstexte über eRecht24. Du merkst nichts davon.',
    headline: 'Damit deine Website *am Laufen bleibt.*',
    promise:
      'Hosting, Backups, Updates und Rechtstexte in einem monatlichen Paket. Impressum und Datenschutz halten wir über die eRecht24-Partnerschaft automatisch aktuell.',
    deliverables: {
      heading: 'Was im Abo steckt.',
      text: null,
      items: [
        'Hosting auf Servern in Deutschland',
        'SSL-Zertifikat',
        'Regelmäßige Backups',
        'Monitoring',
        'Updates und Sicherheit',
        'Impressum und Datenschutz automatisch aktuell',
        'Änderungskontingent ab Plus',
        'Monatsreport ab Plus',
      ],
    },
    packages: {
      'Shop-Betreuung': { description: 'Damit der Shop läuft, während du verkaufst.' },
    },
    steps: [],
    faq: [
      {
        question: 'Brauche ich die Betreuung?',
        answer: 'Nicht zwingend. Ohne Updates wird aber jede Website mit der Zeit unsicher.',
      },
    ],
    cta: { heading: 'Lass uns über die Betreuung reden.' },
  },
  'lokale-sichtbarkeit': {
    shortLabel: 'Sichtbarkeit',
    meta: { title: 'Google-Unternehmensprofil und lokales SEO' },
    teaser: 'Google-Unternehmensprofil und lokales SEO, damit man dich im Ort findet.',
    headline: 'Lokale Sichtbarkeit für Betriebe *in Schleswig-Holstein.*',
    promise: 'Google-Unternehmensprofil, Bewertungen und lokales SEO – monatlich betreut, mit einem kurzen Bericht.',
    deliverables: {
      heading: 'Gefunden werden, wo du arbeitest.',
      text: null,
      items: [
        'Google-Unternehmensprofil gepflegt',
        'Lokales SEO für deine Orte',
        'Bewertungen im Blick',
        'Lokale Landingpages',
        'Technisches SEO',
        'Monatlicher Bericht, kurz und lesbar',
      ],
    },
    packages: {
      Sichtbarkeit: { description: 'Für Betriebe, die in ihrer Gegend gefunden werden wollen.' },
    },
    steps: [],
    faq: [],
    cta: { heading: 'Lass uns über deine Sichtbarkeit reden.' },
  },
  'apps-software': {
    shortLabel: 'Apps',
    meta: { title: 'App- und Softwareentwicklung für Betriebe' },
    teaser: 'Wenn dein Betrieb ein eigenes Werkzeug braucht. Von der Idee bis zur App.',
    headline: 'Wenn es ein eigenes *Werkzeug* sein muss.',
    promise: 'Wir übernehmen ausgewählte Auftragsarbeiten in Software- und App-Entwicklung. Der Preis richtet sich nach dem Vorhaben.',
    deliverables: {
      heading: 'Von der Idee bis zur fertigen App.',
      text: 'Unsere eigenen Marken bauen wir genauso: Huusbook, Tappi, FamilyManager und Anwurf.',
      items: [
        'Native Apps für iOS, Android und macOS',
        'Web-Plattformen, Portale und Dashboards',
        'Von der Idee über den Prototyp bis zum fertigen Produkt',
      ],
    },
    packages: {},
    steps: [],
    faq: [],
    cta: { heading: 'Lass uns über dein Vorhaben reden.' },
  },
  'druck-werbemittel': {
    shortLabel: 'Druck',
    meta: { title: 'Druck und Werbemittel mit Gestaltung' },
    // Decision Stephan 23.09.2026: design + print via partner printers; the
    // workshop is not offered as a service (it only appears on "Über uns").
    teaser: 'Flyer, Visitenkarten, Banner – gestaltet von uns, gedruckt bei Partnerdruckereien.',
    headline: null,
    promise: 'Wir gestalten Flyer, Visitenkarten, Banner und mehr. Gedruckt wird bei unseren Partnerdruckereien.',
    deliverables: {
      heading: 'Gestaltet, gedruckt, geliefert.',
      text: null,
      items: ['Gestaltung', 'Flyer und Visitenkarten', 'Banner und Roll-ups', 'Druck über Partnerdruckereien'],
    },
    packages: {},
    steps: [],
    faq: [],
    cta: { heading: 'Lass uns über dein Druckprojekt reden.' },
  },
}

// ── Pages ─────────────────────────────────────────────────────────────────────
// Blocks reference services by slug; the seed resolves them to ids.

type Link = { label: string; href: string }
type Tone = 'white' | 'offwhite'

/** An image by file name (src/seed/data.ts → SEED_MEDIA); the seed turns it into the media id. */
export const media = (file: SeedMediaKey) => ({ $media: file }) as const
type MediaRef = ReturnType<typeof media>

type BlockData =
  | {
      blockType: 'hero'
      kicker?: string
      heading: string
      text?: string
      image?: MediaRef
      captionName?: string
      captionText?: string
      primary?: Link
      secondary?: Link
      checks?: ({ kind: 'service'; service: string } | { kind: 'text'; text: string })[]
    }
  | {
      blockType: 'textImage'
      kicker?: string
      heading: string
      /** Plain paragraphs; the seed builds the rich text. */
      body: string[]
      image?: MediaRef
      imagePosition: 'left' | 'right'
      imageRatio: 'landscape' | 'square' | 'portrait'
    }
  | {
      blockType: 'tiles'
      style: 'cards' | 'box'
      tone: Tone
      deOnly: boolean
      kicker?: string
      heading?: string
      intro?: string
      items: { image?: MediaRef; qr?: boolean; title?: string; text?: string; link?: Link }[]
      link?: Link
    }
  | { blockType: 'prose'; tone: Tone; deOnly: boolean; kicker?: string; heading: string; text: string }
  | {
      blockType: 'points'
      style: 'icons' | 'steps'
      tone: Tone
      deOnly: boolean
      kicker?: string
      heading: string
      intro?: string
      items: { icon?: IconName; title: string; text: string }[]
      link?: Link
    }
  | {
      blockType: 'pricing'
      deOnly: boolean
      kicker?: string
      heading: string
      intro?: string
      offers: {
        display: 'card' | 'row'
        name: string
        price: number
        priceIsFrom: boolean
        unit: 'once' | 'month' | 'hour'
        note?: string
        text?: string
        items?: { item: string }[]
      }[]
      footnote?: string
      primary?: Link
      secondary?: Link
    }
  | { blockType: 'packages' | 'serviceTiles' | 'brandShowcase' | 'postTeaser' | 'caseTeaser' | 'priceTable'; kicker?: string; heading?: string; intro?: string }
  | { blockType: 'engagementBand'; kicker?: string; heading?: string; text?: string; link?: Link }
  | { blockType: 'trustBar'; heading?: string }
  | { blockType: 'cta'; heading: string; text?: string; button?: Link }
  | { blockType: 'contactForm'; heading: string; intro?: string }
  | { blockType: 'caseGrid'; kicker?: string; heading?: string }
  | { blockType: 'timeline'; kicker?: string; heading?: string; intro?: string; items: { label: string; title: string; text?: string }[] }
  | { blockType: 'darkText'; kicker?: string; heading?: string; text?: string }
  | { blockType: 'faq'; heading?: string; items: Faq[] }
  | {
      blockType: 'offer'
      style: 'box' | 'columns' | 'plain'
      kicker?: string
      heading: string
      text?: string
      items?: { item: string }[]
      price?: number
      priceIsFrom?: boolean
      unit?: 'once' | 'month' | 'hour'
      link?: Link
    }

/**
 * `_insert` is seed-only (never sent to Payload): on a page that already exists,
 * the block is inserted at the first anchor found while the page has no block of
 * its type (src/seed/fill.ts, rule 4). Its place in the list below is where a new
 * database gets it — the seed checks that both ways lead to the same order.
 */
export type BlockSeed = BlockData & { _insert?: Anchor[] }

export type PageSeed = {
  slug: string
  title: string
  meta: { title: string; description: string }
  layout: BlockSeed[]
}

/** Contact form with the fixed topic of the offer page (src/lib/contact/topics.ts). */
const WEBSITE_CHECK_REQUEST = '/kontakt?anliegen=website-check-fewo'

// ── Host area "Gastgeber im Norden" (05.11.2026) ─────────────────────────────
// Copy: Cowork draft of 05.11.2026 (Bauauftrag G8), taken over word for word.
// Deviations (listed in the PR): prices sit in number fields and show through
// the price line with the usual net note; the contents of the two packages are a
// check list (same words); the closing sentence of "Rund um den Tisch" stands in
// the text column above the button.

const DEMO_REQUEST = '/kontakt?anliegen=demo-gastronomie'
const GASTRO_CHECK_REQUEST = '/kontakt?anliegen=website-check-gastro'
const TABLE_REQUEST = '/kontakt?anliegen=rund-um-den-tisch'
/**
 * Demo menu of the Deckplan test tenant "Mövenkrug" — checked 05.11.2026 (200).
 * The address in the Bauauftrag (moevenkrug.beau-marketing.de) does not exist;
 * tenants live under *.deckplan.beau-marketing.de (decision Stephan).
 */
const DEMO_MENU_URL = 'https://moevenkrug.deckplan.beau-marketing.de/karte'

const HOST_PATH = '/gastgeber'
const GASTRO_PATH = '/gastgeber/gastronomie'
const HOLIDAY_LET_PATH = '/gastgeber/ferienwohnung'

/** Start page, below the hero: the two host offers. German only — the targets are. */
const HOST_TILES: BlockSeed = {
  blockType: 'tiles',
  style: 'cards',
  tone: 'offwhite',
  deOnly: true,
  heading: 'Spezialisiert auf Gastgeber im Norden',
  intro:
    'Restaurants, Wirtshäuser, Landgasthöfe, Ferienwohnungen – wir bauen Websites, die Gäste bringen, und das Werkzeug dahinter: digitale Speisekarte, Reservierung, Belegungskalender. Aus Satrup bei Flensburg.',
  items: [
    {
      title: 'Für Restaurants und Gasthöfe',
      text: 'Website, Speisekarte per QR, Reservierung und Veranstaltungen aus einer Hand',
      link: { label: 'Mehr für Restaurants', href: GASTRO_PATH },
    },
    {
      title: 'Für Vermieter von Ferienwohnungen',
      text: 'Eigene Website statt nur Portal – Festpreis, fertig in vier Wochen',
      link: { label: 'Mehr für Vermieter', href: HOLIDAY_LET_PATH },
    },
  ],
  link: { label: 'Alle Gastgeber-Angebote', href: HOST_PATH },
  _insert: [{ after: 'hero' }, { before: 'packages' }, 'start'],
}

/** Start page, SEO text (H2 + running text). German only — there is no translation. */
const HOME_SEO_TEXT: BlockSeed = {
  blockType: 'prose',
  tone: 'white',
  deOnly: true,
  heading: 'Webdesign-Agentur aus Satrup bei Flensburg – für Schleswig-Holstein und darüber hinaus',
  text: [
    'beau marketing ist eine Agentur für Webdesign, Shopify-Shops und Software aus Satrup in Angeln, zwischen Flensburg und Schleswig. Seit 2016 bauen wir Websites und Onlineshops – zuerst für den eigenen Shop, heute für Betriebe in ganz Schleswig-Holstein: Handwerk, Gastronomie, Vermieter, Vereine und Immobilienmakler. Was wir anbieten, benutzen wir selbst: Unsere eigenen Marken laufen auf derselben Technik, mit derselben Betreuung, die auch unsere Kunden bekommen.',
    'Du bekommst bei uns keine Baukasten-Seite und keinen Freelancer, der nach dem Launch verschwindet. Wir übernehmen Hosting, Backups, Updates und halten Impressum und Datenschutzerklärung automatisch aktuell. Wer einen Onlineshop braucht, bekommt ihn als Shopify-Partner-Agentur aus einer Hand – vom Aufbau bis zur laufenden Pflege. Und wer eine App oder ein eigenes Werkzeug für seinen Betrieb braucht, bekommt es von uns entwickelt statt zusammengeklickt.',
    'Unsere Spezialisierung sind Gastgeber im Norden: Restaurants, Wirtshäuser, Landgasthöfe und Ferienvermieter zwischen Nordsee, Schlei und Flensburger Förde. Für sie haben wir ein eigenes Paket aus Website, digitaler Speisekarte, Online-Reservierung und Veranstaltungen entwickelt – mehr dazu auf der Seite für Gastgeber. Du sitzt in Flensburg, Kiel oder Lübeck? Wir kommen vorbei: [Webdesign Flensburg](/region/flensburg).',
  ].join('\n\n'),
  _insert: [{ before: 'engagementBand' }, { before: 'trustBar' }, { before: 'cta', pick: 'last' }, 'end'],
}

/** Pointer from one host page to the other, above the closing call to action. */
const crossLink = (title: string, label: string, href: string): BlockSeed => ({
  blockType: 'tiles',
  style: 'cards',
  tone: 'offwhite',
  deOnly: false,
  items: [{ title, link: { label, href } }],
})

/**
 * "Vom Koch gebaut" — the same section on the hub and the restaurant page. Blocks
 * cannot reference each other, so this one constant becomes two copies.
 */
const BUILT_BY_A_COOK: BlockSeed = {
  blockType: 'textImage',
  heading: 'Vom Koch gebaut',
  body: [
    'Bevor ich Websites gebaut habe, stand ich in der Küche. Erst als Koch, später in der Leitung von Küche und Service. Ich weiß, wie ein Abend läuft, wenn die Karte nicht stimmt, das Telefon im Service klingelt und der Gast am Tisch auf die Rechnung wartet.',
    'Genau deshalb bauen wir unsere Werkzeuge so, dass sie im Betrieb funktionieren – nicht nur in der Präsentation. Entwickelt haben wir sie im Austausch mit Gastronomen aus Angeln und Flensburg. Wenn du willst, zeige ich dir das System an deinem Tresen.',
    '– Stephan Beau, Geschäftsführer beau marketing',
  ],
  image: media('stephan-beau.webp'),
  imagePosition: 'left',
  imageRatio: 'square',
}

const CLOSING_CTA: BlockSeed = {
  blockType: 'cta',
  heading: 'Erzähl uns von deinem *Betrieb.*',
  text: 'Ein Anruf reicht. Du bekommst eine ehrliche Einschätzung und einen Preis – ohne Verkaufsgespräch.',
  button: { label: 'Projekt anfragen', href: '/kontakt' },
}

const PACKAGES: BlockSeed = {
  blockType: 'packages',
  kicker: 'Drei Pakete',
  heading: 'Erst der Auftritt. Dann läuft der *Betrieb.* Dann wirst du gefunden.',
}

const SERVICE_TILES: BlockSeed = {
  blockType: 'serviceTiles',
  kicker: 'Sechs Leistungen',
  heading: 'Alles, was ein Betrieb online braucht. Und ein bisschen offline.',
}

export const PAGES: PageSeed[] = [
  {
    slug: 'start',
    title: 'Startseite',
    meta: {
      // Same as Meta.homeTitle/homeDescription; checked against the Xovi keywords (Stephan, 23.09.).
      title: 'Webdesign & Shopify in Schleswig-Holstein | beau marketing',
      description:
        'Websites, Shopify-Shops und lokale Sichtbarkeit für Betriebe in Schleswig-Holstein, Hamburg und Dänemark – transparente Preise, Betreuung aus Satrup in Angeln.',
    },
    layout: [
      {
        blockType: 'hero',
        kicker: 'Agentur aus Satrup · Mittelangeln · seit 2016',
        heading: 'Websites, Shops und Sichtbarkeit für Betriebe *im Norden.*',
        text: 'Wir bauen Websites und Shopify-Shops für Handwerk, Handel und Gastro in Schleswig-Holstein, Hamburg und Dänemark – und halten sie danach am Laufen.',
        captionName: 'Stephan Beau',
        captionText: 'Inhaber. Du sprichst direkt mit ihm.',
        primary: { label: 'Projekt anfragen', href: '/kontakt' },
        secondary: { label: 'Preise ansehen', href: '#preise' },
        checks: [
          { kind: 'service', service: 'websites' },
          { kind: 'service', service: 'betreuung-pflege' },
          { kind: 'text', text: 'Server in Deutschland' },
        ],
      },
      HOST_TILES,
      PACKAGES,
      SERVICE_TILES,
      { blockType: 'caseTeaser', kicker: 'Referenzen', heading: 'Echte Betriebe, echte Projekte.' },
      {
        blockType: 'brandShowcase',
        kicker: 'Markenhaus',
        heading: 'Wir bauen das auch *für uns selbst.*',
        intro: 'Beau Marketing ist auch ein Markenhaus. Websites, Shops und Apps bauen wir auch für unsere eigenen Marken.',
      },
      // Before "Für die Region": the text ends with the region and leads into the band;
      // after the brand band its first paragraph ("Unsere eigenen Marken …") picks that up.
      HOME_SEO_TEXT,
      {
        blockType: 'engagementBand',
        kicker: 'Für die Region',
        heading: 'Satrup ist nicht nur unsere Adresse.',
        text: 'Wir sitzen in Satrup bei [Flensburg](/region/flensburg) und arbeiten für Betriebe in ganz Schleswig-Holstein. Wenn der Sportverein Trikots braucht oder die Erstklässler Warnwesten, machen wir das. Ohne großes Tamtam – hier nur, damit du weißt, wer wir sind.',
        link: { label: 'Mehr über uns und die Region', href: '/ueber-uns#region' },
      },
      { blockType: 'trustBar' },
      { blockType: 'postTeaser', kicker: 'Ratgeber', heading: 'Frag erst mal den Ratgeber.' },
      CLOSING_CTA,
    ],
  },
  {
    slug: 'agentur',
    title: 'Agentur',
    meta: {
      title: 'Agentur für Websites, Shopify-Shops und lokale Sichtbarkeit',
      description:
        'Sechs Leistungen, drei Pakete, feste Preise: Websites, Shopify-Shops, Betreuung, lokale Sichtbarkeit, Apps und Druck für Betriebe im Norden.',
    },
    layout: [
      {
        blockType: 'hero',
        kicker: 'Agentur',
        heading: 'Sechs Leistungen. *Drei Pakete.*',
        text: 'Websites, Shopify-Shops, Betreuung, lokale Sichtbarkeit, Apps und Druck – für Betriebe in Schleswig-Holstein, Hamburg und Dänemark. Einzeln buchbar, zu festen Preisen.',
        primary: { label: 'Projekt anfragen', href: '/kontakt' },
        secondary: { label: 'Alle Preise', href: '#preisliste' },
      },
      SERVICE_TILES,
      PACKAGES,
      { blockType: 'priceTable', kicker: 'Preise', heading: 'Alle Preise auf einen Blick.' },
      { blockType: 'trustBar' },
      CLOSING_CTA,
    ],
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
    meta: {
      title: 'Projekt anfragen',
      description: 'Erzähl kurz, worum es geht. Stephan meldet sich persönlich – mit einer ehrlichen Einschätzung und einem Preis.',
    },
    layout: [
      {
        blockType: 'contactForm',
        heading: 'Projekt *anfragen.*',
        intro: 'Erzähl kurz, worum es geht. Stephan meldet sich persönlich – mit einer ehrlichen Einschätzung und einem Preis.',
      },
    ],
  },
  {
    slug: 'referenzen',
    title: 'Referenzen',
    meta: {
      title: 'Referenzen – Websites, Shops und Druck für Betriebe',
      description: 'Projekte von Beau Marketing: Websites, Shops und Werbemittel für Betriebe in Schleswig-Holstein und Ostwestfalen-Lippe.',
    },
    layout: [
      {
        blockType: 'hero',
        kicker: 'Referenzen',
        heading: 'Echte Betriebe, echte Projekte.',
        text: 'Eine Auswahl an Projekten – nach Leistung filterbar.',
      },
      { blockType: 'caseGrid' },
      CLOSING_CTA,
    ],
  },
  {
    slug: 'marken',
    title: 'Marken',
    meta: {
      title: 'Markenhaus – unsere eigenen Marken',
      description: 'Beau Marketing ist auch ein Markenhaus: Tappi, Huusbook, Fjella und weitere eigene Marken.',
    },
    layout: [
      {
        blockType: 'hero',
        kicker: 'Markenhaus',
        heading: 'Wir bauen das auch *für uns selbst.*',
        text: 'Beau Marketing ist auch ein Markenhaus. Websites, Shops und Apps bauen wir auch für unsere eigenen Marken.',
      },
      { blockType: 'brandShowcase', kicker: 'Unsere Marken', heading: 'Live und in Entwicklung.' },
      CLOSING_CTA,
    ],
  },
  {
    slug: 'ueber-uns',
    title: 'Über uns',
    meta: {
      title: 'Über uns – Stephan Beau und Beau Marketing',
      description: 'Beau Marketing aus Satrup: seit 2016 Websites und Shops, heute Agentur für Betriebe im Norden und Markenhaus.',
    },
    layout: [
      {
        blockType: 'hero',
        kicker: 'Über uns',
        heading: 'Moin, ich bin *Stephan.*',
        text: 'Ich führe Beau Marketing in Satrup. Wenn du anrufst, landest du bei mir – nicht bei einer Hotline und nicht bei einem Projektmanager, der erst nachfragen muss.\n\nSeit 2016 baue ich Websites und Shops. Angefangen hat das mit einem eigenen Onlineshop.',
        captionName: 'Stephan Beau',
      },
      {
        blockType: 'timeline',
        kicker: 'Die Geschichte',
        heading: 'Drei Namen, eine Sache.',
        intro: 'Software habe ich schon immer entwickelt – vom C16 bis Swift. Der Rest hat sich ergeben.',
        items: [
          {
            label: 'Früher',
            title: 'C16, dann alles andere',
            text: 'Die erste Zeile Code auf einem Commodore C16. Seitdem ist immer irgendwas in Arbeit – heute auch Apps in Swift.',
          },
          {
            label: '2016',
            title: 'Der eigene Onlineshop',
            text: 'Ein eigener Shop, selbst gebaut, selbst vermarktet. Dabei gelernt, was ein Shop wirklich braucht – und was nicht.',
          },
          {
            label: 'Danach',
            title: 'the working Dad → Nerdlicht',
            text: 'Aus dem eigenen Shop wurde eine Agentur – erst ‚the working Dad‘, dann ‚Nerdlicht‘, heute Beau Marketing.',
          },
          {
            label: 'Heute',
            title: 'Beau Marketing GmbH',
            text: 'Agentur für Betriebe im Norden und Markenhaus für eigene Produkte wie Tappi, Huusbook und Fjella.',
          },
        ],
      },
      {
        blockType: 'darkText',
        kicker: 'Die Werkstatt',
        heading: 'Nicht nur Pixel. Auch *Holz, Leder und Filament.*',
        text: 'In Satrup stehen ein Laser und ein 3D-Drucker. Damit entstehen Deko, Gravuren und Prototypen.',
      },
      {
        blockType: 'engagementBand',
        kicker: 'Für die Region',
        heading: 'Was wir in Satrup und Mittelangeln unterstützen',
      },
      {
        blockType: 'cta',
        heading: 'Lass uns schnacken.',
        button: { label: 'Projekt anfragen', href: '/kontakt' },
      },
    ],
  },
  // Offer page, German only (src/lib/offerPages.ts). Copy: Cowork draft of
  // 05.10.2026 (Marketingplan Gastgeber, M5), turned into "du" like the rest of
  // the site (decision Stephan). Deviations from the draft: prices sit in the
  // price line instead of the box headings; the reference sentence claims only
  // what the case backs (online booking for customers is not released).
  {
    slug: 'website-ferienwohnung',
    title: 'Website für Ferienwohnung und Ferienhaus',
    meta: {
      title: 'Website für Ferienwohnung – Festpreis 2.900 €',
      description:
        'Eigene Website für deine Ferienwohnung: Belegungskalender, Buchungsanfrage, Rechtstexte, fertig in 4 Wochen. Festpreis 2.900 € netto, aus Satrup bei Flensburg.',
    },
    layout: [
      {
        blockType: 'hero',
        heading: 'Website für Ferienwohnung und Ferienhaus',
        text: [
          'Deine eigene Seite statt nur Portal. Festpreis 2.900 € netto, fertig in vier Wochen.',
          'Jede Buchung über deine eigene Website spart die Provision des Portals. Wie viel das bei dir im Jahr ausmacht, rechnen wir mit deinen Zahlen aus – nicht mit Durchschnittswerten. Wir sitzen in Satrup bei Flensburg und bauen Websites für Vermieter an Schlei, Ostsee, Förde und Nordsee.',
        ].join('\n\n'),
        primary: { label: 'Website-Check anfragen', href: WEBSITE_CHECK_REQUEST },
      },
      {
        blockType: 'offer',
        style: 'box',
        kicker: 'Der Einstieg',
        heading: 'Website-Check',
        text: [
          'Bevor du dich für eine neue Seite entscheidest, sehen wir uns deinen heutigen Auftritt an: Website, Google-Profil, Portale. 90 Minuten bei dir vor Ort oder per Video. Danach bekommst du eine schriftliche Liste mit zehn Punkten und einer Zahl, zum Beispiel was dich die Portale pro Saison kosten.',
          'Die 290 € netto werden voll angerechnet, wenn du danach die Gastgeber-Website beauftragst.',
        ].join('\n\n'),
        price: 290,
        priceIsFrom: false,
        unit: 'once',
        link: { label: 'Website-Check anfragen', href: WEBSITE_CHECK_REQUEST },
      },
      {
        blockType: 'offer',
        style: 'columns',
        kicker: 'Das Paket',
        heading: 'Gastgeber-Website',
        items: [
          'Startseite, je Wohnung oder Haus eine eigene Seite, Lage und Umgebung, Kontakt – für bis zu drei Einheiten',
          'Belegungskalender, abgeglichen mit deinen Portalen, und eine Buchungsanfrage direkt auf der Seite',
          'Impressum und Datenschutzerklärung, die sich automatisch aktuell halten',
          'Dein Google-Unternehmensprofil eingerichtet oder überarbeitet',
          'Grunddaten für Suchmaschinen, damit Google deine Unterkünfte richtig versteht',
          'Fertig in vier Wochen, sobald Fotos und Texte vollständig da sind',
        ].map((item) => ({ item })),
        price: 2900,
        priceIsFrom: false,
        unit: 'once',
      },
      {
        blockType: 'offer',
        style: 'columns',
        heading: 'Erweiterungen',
        items: [
          'Jede weitere Einheit: 200 € netto',
          'Online-Buchung mit Bezahlung direkt auf der Seite: +500 € netto. Wir binden ein bewährtes Buchungswerkzeug ein; dessen monatliche Gebühr zahlst du direkt an den Anbieter.',
          'Pflege Basis: 49 € netto im Monat – Hosting, Backups, Updates, Rechtstexte immer aktuell',
        ].map((item) => ({ item })),
      },
      {
        blockType: 'darkText',
        heading: 'Was du nicht brauchst',
        text: 'Keine teure Werbekampagne, kein Social-Media-Paket, keine monatliche Agenturpauschale, um die Seite zu behalten. Wenn dein Haus über die Portale gut läuft und du zufrieden bist, sagen wir dir das im Check auch.',
      },
      {
        blockType: 'offer',
        style: 'plain',
        kicker: 'Referenz',
        heading: 'Buchungssysteme bauen wir nicht nur auf dem Papier.',
        text: 'Für Hüpfburgen OWL läuft eine Seite mit Verfügbarkeitsprüfung und Buchungslogik.',
        link: { label: 'Referenz Hüpfburgen OWL ansehen', href: '/referenzen/huepfburgen-owl' },
      },
      {
        blockType: 'faq',
        heading: 'Was du vorher wissen willst.',
        items: [
          {
            question: 'Gehört die Website mir?',
            answer: 'Ja. Die Seite, die Inhalte und die Domain gehören dir. Zugänge und Daten übergeben wir jederzeit.',
          },
          {
            question: 'Was passiert, wenn ihr ausfallt?',
            answer:
              'Die Seite läuft auf üblicher Technik und ist dokumentiert. Du bekommst alle Zugänge; ein anderer Dienstleister kann sie übernehmen.',
          },
          {
            question: 'Muss ich die Portale verlassen?',
            answer:
              'Nein. Du kannst bei den Portalen bleiben und dir zusätzlich direkte Buchungen holen, zum Beispiel von Stammgästen.',
          },
          {
            question: 'Was braucht ihr von mir?',
            answer:
              'Fotos, ein paar Sätze zu jeder Unterkunft, Preise und deine Zugänge zu den Portalen für den Kalenderabgleich. Bei den Texten helfen wir.',
          },
          {
            question: 'Sind die Preise netto?',
            answer: 'Ja, alle Preise zuzüglich Umsatzsteuer. Das Angebot richtet sich an Vermieter, die gewerblich vermieten.',
          },
        ],
      },
      // Added with the move into the host area (05.11.2026) — reaches the existing page through `_insert`.
      {
        ...crossLink('Du führst ein Restaurant?', 'Zur Seite für Gastronomie', GASTRO_PATH),
        _insert: [{ before: 'cta', pick: 'last' }, 'end'],
      },
      {
        blockType: 'cta',
        heading: 'Lass uns mit dem Check anfangen.',
        button: { label: 'Website-Check anfragen', href: WEBSITE_CHECK_REQUEST },
      },
    ],
  },
  // Hub of the host area, German only (src/lib/offerPages.ts). Target of the QR
  // codes on flyers and table stands. The page title is the footer label.
  {
    slug: 'gastgeber',
    title: 'Gastgeber im Norden',
    meta: {
      // Shortened from the draft (83 characters with the brand): the layout appends "| beau marketing".
      title: 'Gastgeber im Norden – Gastronomie & Vermieter',
      description:
        'Website, digitale Speisekarte, Reservierung und Belegungskalender für Restaurants, Gasthöfe und Ferienwohnungen in Schleswig-Holstein. Aus Satrup bei Flensburg, vom Koch gebaut.',
    },
    layout: [
      {
        blockType: 'hero',
        heading: 'Gastgeber im Norden',
        text: [
          'Websites, Speisekarte, Reservierung und alles rund um den Tisch – aus einer Hand, aus Angeln.',
          'Du führst ein Restaurant, ein Wirtshaus, einen Landgasthof oder vermietest Ferienwohnungen? Dann kennst du das: Die Website ist von 2014, die Speisekarte ein PDF, Reservierungen laufen übers Telefon und die Veranstaltungen stehen nur auf Facebook. Wir ändern das – mit Technik, die dein Betrieb selbst bedienen kann, und einem Ansprechpartner, der weiß, wie es hinter dem Pass zugeht.',
        ].join('\n\n'),
        image: media('platzhalter-gastgeber-hub-hero.png'),
        primary: { label: 'Für Restaurants und Gasthöfe', href: GASTRO_PATH },
        secondary: { label: 'Für Ferienvermieter', href: HOLIDAY_LET_PATH },
      },
      {
        blockType: 'tiles',
        style: 'cards',
        tone: 'white',
        deOnly: false,
        heading: 'Zwei Angebote, ein Prinzip',
        items: [
          {
            image: media('platzhalter-gastgeber-hub-speisekarte.png'),
            title: 'Gastronomie',
            text: 'Website im eigenen Design, digitale Speisekarte mit QR-Code am Tisch, Online-Reservierung, Veranstaltungen mit Anmeldung. Dein Team pflegt Karte und Termine selbst – in Sekunden, nicht in Tagen.',
            link: { label: 'Mehr für Restaurants', href: GASTRO_PATH },
          },
          {
            image: media('platzhalter-gastgeber-hub-ferienwohnung.png'),
            title: 'Ferienwohnung & Ferienhaus',
            text: 'Eigene Website statt nur Portal: Belegungskalender mit Portal-Abgleich, Buchungsanfrage, Rechtstexte, Google-Profil – zum Festpreis, fertig in vier Wochen.',
            link: { label: 'Mehr für Vermieter', href: HOLIDAY_LET_PATH },
          },
        ],
      },
      {
        blockType: 'points',
        style: 'icons',
        tone: 'offwhite',
        deOnly: false,
        heading: 'Was Gastgeber von uns bekommen',
        items: [
          {
            icon: 'website',
            title: 'Eine Website, die Gäste bringt.',
            text: 'Schnell, mobil, auffindbar – mit den Grunddaten für Google, damit dein Betrieb in der Umgebungssuche richtig erscheint.',
          },
          {
            icon: 'controls',
            title: 'Werkzeuge, die dein Betrieb selbst bedient.',
            text: 'Speisekarte, „heute aus“, Veranstaltungen, Reservierungen, Belegung – ohne Agentur-Ticket, ohne Wartezeit.',
          },
          {
            icon: 'legal',
            title: 'Rechtstexte, die sich selbst aktuell halten.',
            text: 'Impressum und Datenschutzerklärung kommen automatisch von eRecht24. Du musst nicht nachlesen, was sich geändert hat.',
          },
          {
            icon: 'languages',
            title: 'Gäste aus Dänemark verstehen dich.',
            text: 'Website und Speisekarte auf Deutsch, Dänisch und Englisch – übersetzt per Knopf, freigegeben von dir.',
          },
          {
            icon: 'table',
            title: 'Alles rund um den Tisch.',
            text: 'Die gedruckte Karte passt zur digitalen, dazu Tischaufsteller mit QR-Code, Tischsets, Untersetzer und Beschilderung – aus unserer eigenen Werkstatt und von Partnerdruckereien.',
          },
          {
            icon: 'person',
            title: 'Ein fester Ansprechpartner.',
            text: 'Kein Ticketsystem, keine Hotline. Du rufst an, und am anderen Ende weiß jemand, was ein Samstagabend im Service bedeutet.',
          },
        ],
      },
      BUILT_BY_A_COOK,
      {
        blockType: 'offer',
        style: 'columns',
        heading: 'Rund um den Tisch',
        text: 'Manchmal fängt es klein an: neue Untersetzer, ein Tischaufsteller mit QR-Code, eine frisch gesetzte Speisekarte zum Drucken. Auch das machen wir – und wer möchte, bekommt später die ganze Technik dazu.',
        items: [
          'Tischaufsteller mit QR-Code aus Holz, aus unserer eigenen Werkstatt – zweiseitig, zum Beispiel Speisekarte und Bewertung',
          'Gedruckte Speisekarte, gesetzt aus derselben Datenbank wie die digitale – eine Änderung, beide Karten aktuell',
          'Tischsets und Untersetzer mit deinem Design',
          'Beschilderung und Gravuren für Tresen, Eingang und Außenbereich',
          'Flyer und Aushänge für Veranstaltungen',
        ].map((item) => ({ item })),
        link: { label: 'Anfragen', href: TABLE_REQUEST },
      },
      {
        blockType: 'points',
        style: 'steps',
        tone: 'offwhite',
        deOnly: false,
        heading: 'So geht es los',
        items: [
          {
            title: 'Demo an deinem Tresen.',
            text: '20 Minuten am Tablet, kostenlos, mit deiner Speisekarte – vorab von uns eingepflegt. Oder, wenn du schon eine größere Website hast: der Website-Check mit schriftlichem Befund.',
          },
          {
            title: 'Entscheidung ohne Druck.',
            text: 'Du siehst, was das System kann, und entscheidest, ob es zu deinem Betrieb passt. Festpreise, veröffentlicht, netto.',
          },
          {
            title: 'Live in wenigen Wochen.',
            text: 'Wir richten alles ein, übernehmen Karte, Texte und Termine, schulen dein Team eine Stunde – dann läuft es.',
          },
        ],
        link: { label: 'Demo-Termin anfragen', href: DEMO_REQUEST },
      },
      {
        blockType: 'tiles',
        style: 'cards',
        tone: 'white',
        deOnly: false,
        items: [
          {
            title: 'Du bist Immobilienmakler oder Eventanbieter?',
            text: 'Dann sprich uns an – für beide Bereiche entsteht gerade eine eigene Variante. Bis dahin: [Websites](/agentur/websites) und [Betreuung & Pflege](/agentur/betreuung-pflege).',
          },
        ],
      },
    ],
  },
  // Landing page for restaurants ("Deckplan"), German only (src/lib/offerPages.ts).
  // The order is intended: problem → solution in building blocks → demo → Danish →
  // around the table → the cook → only then packages and prices → FAQ → closing.
  {
    slug: 'gastgeber-gastronomie',
    title: 'Website für Restaurants',
    meta: {
      // Shortened from the draft (74 characters with the brand); the H1 keeps the full wording.
      title: 'Restaurant-Website, Speisekarte & Reservierung',
      description:
        'Restaurant-Website mit digitaler Speisekarte per QR-Code, Online-Reservierung und Veranstaltungen – dein Team pflegt alles selbst. Aus Satrup bei Flensburg, für Gastronomie in Schleswig-Holstein.',
    },
    layout: [
      {
        blockType: 'hero',
        heading: 'Website, Speisekarte und Reservierung für dein Restaurant',
        text: [
          'Dein Team pflegt alles selbst. Deine Gäste finden dich, lesen die Karte am Tisch und reservieren ohne Anruf.',
          'Für Restaurants, Wirtshäuser, Landgasthöfe und Hotel-Restaurants in Schleswig-Holstein. Vom Koch entwickelt, aus Satrup bei Flensburg.',
        ].join('\n\n'),
        image: media('platzhalter-gastgeber-gastro-hero.png'),
        primary: { label: 'Demo-Speisekarte ansehen', href: DEMO_MENU_URL },
        secondary: { label: 'Demo an deinem Tresen', href: DEMO_REQUEST },
      },
      {
        blockType: 'points',
        style: 'icons',
        tone: 'offwhite',
        deOnly: false,
        heading: 'Kommt dir das bekannt vor?',
        items: [
          {
            icon: 'document',
            title: 'Die Karte ist ein PDF.',
            text: 'Auf dem Handy nicht lesbar, Allergene stehen irgendwo auf Seite drei, und das Gericht, das heute aus ist, steht trotzdem drin.',
          },
          {
            icon: 'phone',
            title: 'Das Telefon klingelt im Service.',
            text: 'Zwei Drittel der Betriebe im Norden nehmen Reservierungen nur telefonisch an – mitten im Abendgeschäft.',
          },
          {
            icon: 'megaphone',
            title: 'Veranstaltungen leben nur auf Facebook.',
            text: 'Grünkohlessen, Schnitzeltag, Live-Musik – wer nicht auf Facebook ist, erfährt es nicht. Anmeldungen laufen per Zettel.',
          },
          {
            icon: 'clock',
            title: 'Die Website ist von damals.',
            text: 'Nicht mobil, nicht aktuell, die Agentur von damals gibt es nicht mehr. Für jede Änderung ein Ticket, für jedes Ticket eine Woche.',
          },
        ],
      },
      {
        blockType: 'prose',
        tone: 'white',
        deOnly: false,
        heading: 'Ein System, das dein Betrieb selbst bedient',
        text: 'Wir nennen es Deckplan: Website, Speisekarte, Reservierung und Veranstaltungen in einem System, gebaut für Betriebe mit Tischbedienung. Kein zweites Abo für die Reservierung, kein drittes für die Karte. Und die Küche darf ran.',
      },
      {
        blockType: 'textImage',
        kicker: 'Baustein 1',
        heading: 'Die Speisekarte, die immer stimmt',
        body: [
          'Einmal eingepflegt, in Sekunden geändert. Kategorien, Preise, Allergene und Zusatzstoffe stehen dort, wo der Gast sie braucht. Ist das Tagesgericht aus, tippt die Küche einmal – weg ist es, auf der Website und auf dem Handy am Tisch. Per QR-Code auf dem Tischaufsteller öffnet der Gast die Karte, ohne eine App zu laden. Und die gedruckte Karte kommt aus derselben Datenbank: eine Änderung, beide Karten aktuell.',
        ],
        image: media('platzhalter-gastgeber-gastro-speisekarte.png'),
        imagePosition: 'left',
        imageRatio: 'landscape',
      },
      {
        blockType: 'textImage',
        kicker: 'Baustein 2',
        heading: 'Reservierung ohne Telefonklingeln',
        body: [
          'Der Gast wählt Datum, Uhrzeit und Personenzahl auf deiner Website. Die Anfrage landet bei dir, du bestätigst mit einem Knopf, der Gast bekommt die Mail. Das System kennt deine Kapazität je Bereich – Gastraum, Terrasse, Kegelbahn, Nebenraum – und nimmt nicht mehr an, als du hast. Keine Doppelbuchung, kein Zettelchaos. Du behältst die Entscheidung: Nichts wird bestätigt, was du nicht bestätigt hast.',
        ],
        image: media('platzhalter-gastgeber-gastro-reservierung.png'),
        imagePosition: 'right',
        imageRatio: 'landscape',
      },
      {
        blockType: 'textImage',
        kicker: 'Baustein 3',
        heading: 'Veranstaltungen mit Anmeldung',
        body: [
          'Grünkohl, Schnitzelabend, Weinprobe, Live-Musik: Lege die Veranstaltung an, setze Datum, Preis und Plätze – fertig ist die Seite mit Anmeldung. Deine Gäste melden sich an, du siehst die Liste. Wer will, teilt den Link auf Facebook und Instagram; wer nicht will, muss es nicht.',
        ],
        image: media('platzhalter-gastgeber-gastro-veranstaltung.png'),
        imagePosition: 'left',
        imageRatio: 'landscape',
      },
      {
        blockType: 'textImage',
        kicker: 'Baustein 4',
        heading: 'Eine Website, die Gäste bringt',
        body: [
          'Im Design deines Betriebs, schnell, mobil, mit den Grunddaten für Google, damit du in der Umgebungssuche richtig erscheinst: Öffnungszeiten, Adresse, Küche, Reservierung. Impressum und Datenschutzerklärung halten sich automatisch aktuell. Hosting, Backups und Updates machen wir. Wenn du schon eine Website hast, übernehmen wir die Inhalte und leiten die alten Adressen weiter – deine Google-Platzierung bleibt erhalten.',
        ],
        image: media('platzhalter-gastgeber-gastro-website.png'),
        imagePosition: 'right',
        imageRatio: 'landscape',
      },
      {
        blockType: 'tiles',
        style: 'box',
        tone: 'offwhite',
        deOnly: false,
        heading: 'Probier es aus – jetzt, am Handy',
        items: [
          {
            text: 'Scanne den QR-Code oder tippe auf den Knopf: Das ist die Speisekarte eines Demo-Betriebs, so wie dein Gast sie am Tisch sieht.',
            qr: true,
            link: { label: 'Demo-Speisekarte öffnen', href: DEMO_MENU_URL },
          },
          {
            text: 'Oder wir kommen vorbei: 20 Minuten an deinem Tresen, am Tablet, mit deiner eigenen Speisekarte – die haben wir vorher eingepflegt. Du siehst Karte, „heute aus“, eine Reservierung und eine Veranstaltung im echten System. Kostenlos, ohne Verpflichtung.',
            link: { label: 'Demo-Termin anfragen', href: DEMO_REQUEST },
          },
        ],
      },
      {
        blockType: 'textImage',
        heading: 'Deine Gäste aus Dänemark verstehen die Karte',
        body: [
          'Website und Speisekarte gibt es auf Deutsch, Dänisch und Englisch. Übersetzt wird per Knopf im Admin – mit Küchenverstand: Labskaus wird erklärt, nicht verfälscht. Du liest die Übersetzung gegen und gibst sie frei. Für Betriebe an der Grenze, an der Förde und an den Küsten ist das kein Extra, sondern Umsatz.',
        ],
        image: media('platzhalter-gastgeber-gastro-daenisch.png'),
        imagePosition: 'left',
        imageRatio: 'landscape',
      },
      {
        blockType: 'offer',
        style: 'columns',
        heading: 'Rund um den Tisch',
        text: [
          'Ein Betrieb ist mehr als seine Website. Deshalb bekommst du bei uns auch das, was auf dem Tisch liegt – passend zum Design, aus einer Hand.',
          'Auch ohne das ganze System – manchmal fängt es mit neuen Untersetzern an.',
        ].join('\n\n'),
        items: [
          'Tischaufsteller mit QR-Code aus Holz, zweiseitig (Speisekarte / Bewertung), aus unserer eigenen Werkstatt',
          'Gedruckte Speisekarte aus derselben Datenbank wie die digitale',
          'Tischsets, Untersetzer, Bierdeckel mit deinem Motiv',
          'Beschilderung und Gravuren für Tresen, Eingang und Außenbereich',
          'Flyer und Aushänge für Veranstaltungen',
        ].map((item) => ({ item })),
        link: { label: 'Anfragen', href: TABLE_REQUEST },
      },
      BUILT_BY_A_COOK,
      {
        blockType: 'pricing',
        deOnly: false,
        heading: 'Was es kostet',
        intro:
          'Festpreise, veröffentlicht, netto. Die Website ist im Abo drin – das ist der Unterschied zu einem Reservierungstool, bei dem die Website extra kostet.',
        offers: [
          {
            display: 'card',
            name: 'Deckplan Start',
            price: 89,
            priceIsFrom: false,
            unit: 'month',
            text: 'Dein Team pflegt Speisekarte, Veranstaltungen, Öffnungszeiten und Reservierungen selbst.',
            items: [
              'Website im Design deines Betriebs',
              'Digitale Speisekarte mit QR-Code',
              'Online-Reservierung',
              'Veranstaltungen mit Anmeldung',
              'Rechtstexte automatisch aktuell',
              'Hosting, Backups, Updates',
              'Zehn Tischaufsteller mit QR-Code',
              'Fester Ansprechpartner',
            ].map((item) => ({ item })),
          },
          {
            display: 'card',
            name: 'Deckplan Plus',
            price: 149,
            priceIsFrom: false,
            unit: 'month',
            text: 'Alles aus Start, dazu:',
            items: [
              'Änderungen an der Website durch uns (Texte, Bilder, Seitenaufbau – eine Stunde im Monat)',
              'Einrichtung der Google Search Console',
              'Ein monatlicher Bericht zu Reservierungen und Besuchern',
            ].map((item) => ({ item })),
          },
          {
            display: 'row',
            name: 'Einrichtung',
            price: 490,
            priceIsFrom: false,
            unit: 'once',
            note: 'Bei 24 Monaten Laufzeit entfällt die Einrichtung.',
            text: 'Design-Anpassung, Übernahme von Speisekarte, Veranstaltungen und Texten, Domain und E-Mail, Rechtstexte, eine Stunde Einweisung.',
          },
          {
            display: 'row',
            name: 'Website-Check',
            price: 290,
            priceIsFrom: false,
            unit: 'once',
            note: 'Voll anrechenbar.',
            text: 'Für Betriebe mit größerer Website (Hotel-Restaurant, Gasthof mit Zimmern): Befund zu Sichtbarkeit, Mobil, Speisekarte, Reservierung und Rechtstexten auf zwei Seiten, innerhalb von 48 Stunden. Beauftragst du danach Deckplan, ziehen wir die 290 € ab.',
          },
        ],
        footnote:
          'Nicht dabei, bewusst: Online-Bestellung außer Haus und ein grafischer Tischplan. Deckplan ist für Betriebe mit Tischbedienung gebaut, nicht für Lieferdienste.',
        primary: { label: 'Demo-Termin anfragen', href: DEMO_REQUEST },
        secondary: { label: 'Website-Check anfragen', href: GASTRO_CHECK_REQUEST },
      },
      {
        blockType: 'faq',
        heading: 'Häufige Fragen',
        items: [
          {
            question: 'Brauche ich zusätzlich ein Reservierungstool wie resmio oder DISH?',
            answer:
              'Nein. Die Reservierung ist Teil des Systems. Wenn du heute ein Tool nutzt, kannst du es ablösen – oder parallel weiterlaufen lassen, bis du sicher bist.',
          },
          {
            question: 'Kann die Küche die Speisekarte selbst ändern?',
            answer:
              'Ja, das ist der Sinn. Jeder im Team mit Zugang kann Gerichte anlegen, Preise ändern und „heute aus“ setzen – vom Handy, vom Tablet, vom Rechner im Büro.',
          },
          {
            question: 'Was passiert mit meiner alten Website?',
            answer:
              'Wir übernehmen Texte und Bilder, leiten alle alten Adressen auf die neuen weiter und behalten deine Domain. Deine Platzierung bei Google geht nicht verloren.',
          },
          {
            question: 'Wie lange dauert die Einrichtung?',
            answer:
              'In der Regel zwei bis vier Wochen, sobald Speisekarte, Texte und Bilder vollständig da sind. Die Einweisung dauert eine Stunde.',
          },
          {
            question: 'Gibt es einen Vertrag mit langer Laufzeit?',
            answer: 'Du wählst: monatlich kündbar mit Einrichtungspauschale, oder 24 Monate ohne Einrichtungspauschale.',
          },
          {
            question: 'Funktioniert das auch, wenn mein Betrieb kein Restaurant ist?',
            answer:
              'Für Hotel-Restaurants, Landgasthöfe und Gasthöfe mit Zimmern ja. Für Imbisse, Lieferdienste und reine Cafés ist Deckplan nicht gedacht – dort fehlt die Tischbedienung, für die das System gebaut ist.',
          },
          {
            question: 'Was ist mit Gästen, die kein Handy zücken wollen?',
            answer: 'Die gedruckte Karte bleibt – und kommt aus derselben Datenbank. Der QR-Code ist ein Zusatz, kein Ersatz.',
          },
        ],
      },
      crossLink('Du vermietest Ferienwohnungen?', 'Zur Seite für Vermieter', HOLIDAY_LET_PATH),
      {
        blockType: 'cta',
        heading: 'Lass es uns an deinem Tresen anschauen',
        text: 'Zwanzig Minuten, dein Tablet oder unseres, deine Speisekarte. Danach weißt du, ob das für deinen Betrieb passt. Kein Verkaufsgespräch, ein Blick ins System.',
        button: { label: 'Demo-Termin anfragen', href: DEMO_REQUEST },
      },
    ],
  },
]

/**
 * Pointer box on a service page to an offer page (service slug → box). Shown only
 * where the offer page exists and is published. Own copy, no prices — those live
 * on the offer page.
 */
export const SERVICE_HIGHLIGHTS: Record<
  string,
  { page: string; kicker: string; heading: string; text: string; linkLabel: string }
> = {
  websites: {
    page: 'website-ferienwohnung',
    kicker: 'Für Gastgeber',
    heading: 'Festpreis-Paket für Ferienwohnung und Ferienhaus',
    text: 'Eigene Website mit Belegungskalender, Buchungsanfrage und Rechtstexten – fertig in vier Wochen.',
    linkLabel: 'Zum Gastgeber-Paket',
  },
}
