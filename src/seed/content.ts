// Page copy for Paket 2 — sources: design export (Startseite, Leistungsseite,
// Kontakt, Style-Tile), Repositionierung Agenturleistungen, Redesign-Eckpunkte.
// Where the design made claims nobody can back (response times, guarantees,
// "most customers take …", legal promises), the text is neutralised; the PR
// lists every such spot. Prices never appear in copy — they come from services.

type Faq = { question: string; answer: string }
type Step = { title: string; text: string }

export type ServiceContent = {
  shortLabel: string
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
export type BlockSeed =
  | {
      blockType: 'hero'
      kicker?: string
      heading: string
      text?: string
      captionName?: string
      captionText?: string
      primary?: Link
      secondary?: Link
      checks?: ({ kind: 'service'; service: string } | { kind: 'text'; text: string })[]
    }
  | { blockType: 'packages' | 'serviceTiles' | 'brandShowcase' | 'postTeaser' | 'caseTeaser' | 'priceTable'; kicker?: string; heading?: string; intro?: string }
  | { blockType: 'engagementBand'; kicker?: string; heading?: string; text?: string; link?: Link }
  | { blockType: 'trustBar'; heading?: string }
  | { blockType: 'cta'; heading: string; text?: string; button?: Link }
  | { blockType: 'contactForm'; heading: string; intro?: string }
  | { blockType: 'caseGrid'; kicker?: string; heading?: string }
  | { blockType: 'timeline'; kicker?: string; heading?: string; intro?: string; items: { label: string; title: string; text?: string }[] }
  | { blockType: 'darkText'; kicker?: string; heading?: string; text?: string }

export type PageSeed = {
  slug: string
  title: string
  meta: { title: string; description: string }
  layout: BlockSeed[]
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
      title: 'Beau Marketing – Websites, Shops und Sichtbarkeit für Betriebe im Norden',
      description:
        'Wir bauen Websites und Shopify-Shops für Handwerk, Handel und Gastro in Schleswig-Holstein, Hamburg und Dänemark – und halten sie danach am Laufen.',
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
      PACKAGES,
      SERVICE_TILES,
      { blockType: 'caseTeaser', kicker: 'Referenzen', heading: 'Echte Betriebe, echte Projekte.' },
      {
        blockType: 'brandShowcase',
        kicker: 'Markenhaus',
        heading: 'Wir bauen das auch *für uns selbst.*',
        intro: 'Beau Marketing ist auch ein Markenhaus. Websites, Shops und Apps bauen wir auch für unsere eigenen Marken.',
      },
      {
        blockType: 'engagementBand',
        kicker: 'Für die Region',
        heading: 'Satrup ist nicht nur unsere Adresse.',
        text: 'Wenn der Sportverein Trikots braucht oder die Erstklässler Warnwesten, machen wir das. Ohne großes Tamtam – hier nur, damit du weißt, wer wir sind.',
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
]
