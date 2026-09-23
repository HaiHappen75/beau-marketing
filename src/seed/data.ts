// Master data for the relaunch — source: Bauauftrag 23.09.2026 (Korrekturliste)
// and the linked Second Brain pages. Nothing invented: unknown values are null.

export const RELEASE = { date: '2026-09-23T12:00:00.000Z', note: 'laut Stephan' }

export const SITE_SETTINGS = {
  siteName: 'Beau Marketing',
  company: {
    legalName: 'Beau Marketing GmbH',
    managingDirector: 'Stephan Beau',
    street: 'Buschlück 7',
    postalCode: '24986',
    city: 'Mittelangeln',
    district: 'Satrup',
    country: 'Deutschland',
    phone: '04633 202 9925',
    email: 's.beau@beau-marketing.de',
    registerCourt: 'Amtsgericht Flensburg',
    registerNumber: 'HRB 17558 FL',
    vatId: null, // not issued yet
    latitude: null,
    longitude: null,
    areaServed: [{ name: 'Schleswig-Holstein' }, { name: 'Hamburg' }, { name: 'Dänemark' }],
    hourlyRate: 100,
  },
  seo: { titleSuffix: ' | beau marketing' },
}

type Pkg = {
  name: string
  price: number | null
  priceIsFrom: boolean
  unit: 'once' | 'month' | 'hour'
  term?: string
  includes: string[]
}

type ServiceSeed = { slug: string; title: string; shortDescription: string; order: number; packages: Pkg[] }

// Prices: style tile price table + Repositionierung (sections 2a/3), all net.
export const SERVICES: ServiceSeed[] = [
  {
    slug: 'websites',
    title: 'Websites',
    shortDescription: 'Klar gebaut, schnell auf dem Handy.',
    order: 1,
    packages: [
      { name: 'Website Start', price: 1900, priceIsFrom: true, unit: 'once', includes: ['Onepager'] },
      {
        name: 'Website Standard',
        price: 4900,
        priceIsFrom: true,
        unit: 'once',
        includes: [
          'bis 8 Seiten',
          'CMS zum Selbstpflegen',
          'Rechtstexte automatisch aktuell',
          'strukturierte Daten (JSON-LD)',
          'Basis-SEO',
        ],
      },
    ],
  },
  {
    slug: 'shopify-shops',
    title: 'Shopify-Shops',
    shortDescription: 'Verkaufen ohne Technikfrust.',
    order: 2,
    packages: [
      {
        name: 'Shop Start',
        price: 3900,
        priceIsFrom: true,
        unit: 'once',
        includes: [
          'Standard-Theme',
          'bis ca. 30 Produkte',
          'Zahlungen und Versand',
          'Rechtstexte über einen Rechtstexte-Dienst',
          'Widerrufsbutton',
          'EU-Gewährleistungslabel',
          'GPSR-Angaben',
          'Mail-Authentifizierung',
          'Google Search Console',
        ],
      },
      {
        name: 'Shop Standard',
        price: 7900,
        priceIsFrom: true,
        unit: 'once',
        includes: ['Theme-Anpassungen', 'Produktanlage für bis zu ca. 150 Produkte', 'Magazin/Blog mit SEO-Setup'],
      },
      {
        name: 'Pflichtangaben-Update',
        price: 490,
        priceIsFrom: true,
        unit: 'once',
        includes: ['Widerrufsbutton', 'EU-Gewährleistungslabel', 'GPSR-Angaben', 'Zahlarten nach CCD II einrichten'],
      },
    ],
  },
  {
    slug: 'betreuung-pflege',
    title: 'Betreuung & Pflege',
    shortDescription: 'Updates, Backups, Rechtstexte via eRecht24.',
    order: 3,
    packages: [
      {
        name: 'Basis',
        price: 49,
        priceIsFrom: false,
        unit: 'month',
        includes: ['Hosting', 'Backups', 'Monitoring', 'Updates', 'Rechtstexte automatisch aktuell'],
      },
      {
        name: 'Plus',
        price: 119,
        priceIsFrom: false,
        unit: 'month',
        includes: ['alles aus Basis', '1 h Änderungen pro Monat', 'Monatsreport'],
      },
      {
        name: 'Pro',
        price: 249,
        priceIsFrom: false,
        unit: 'month',
        includes: ['alles aus Plus', 'Pflege des Google-Unternehmensprofils', '2 h Änderungen pro Monat'],
      },
      {
        name: 'Shop-Betreuung',
        price: 149,
        priceIsFrom: true,
        unit: 'month',
        includes: ['App- und Theme-Updates', 'neue Pflichtangaben', 'kleine Änderungen', '1 h inklusive'],
      },
    ],
  },
  {
    slug: 'lokale-sichtbarkeit',
    title: 'Lokale Sichtbarkeit',
    shortDescription: 'Google-Unternehmensprofil und lokales SEO.',
    order: 4,
    packages: [
      {
        name: 'Sichtbarkeit',
        price: 490,
        priceIsFrom: true,
        unit: 'month',
        term: 'Mindestlaufzeit 6 Monate',
        includes: [
          'Google-Unternehmensprofil',
          'Bewertungen',
          'lokale Landingpages',
          'technisches SEO',
          'Monatsreport aus der Search Console',
        ],
      },
    ],
  },
  {
    slug: 'apps-software',
    title: 'Apps & Software',
    shortDescription: 'Wenn es ein eigenes Werkzeug sein muss.',
    order: 5,
    packages: [],
  },
  {
    slug: 'druck-werbemittel',
    title: 'Druck & Werbemittel',
    shortDescription: 'Flyer, Schilder, Textil, Lasergravur.',
    order: 6,
    packages: [],
  },
]

type BrandSeed = {
  slug: string
  name: string
  status: 'live' | 'beta' | 'development' | 'hidden'
  tagline: string | null
  url: string | null
  order: number
  category: 'ecommerce' | 'app' | 'tool'
  /** false: existing brands only (ThingR is retired from display, never created). */
  create: boolean
}

export const BRANDS: BrandSeed[] = [
  {
    slug: 'tappi',
    name: 'Tappi',
    status: 'live',
    tagline: 'Die digitale Visitenkarte mit NFC – einmal tippen, immer aktuell.',
    url: 'https://gettappi.de',
    order: 1,
    category: 'tool',
    create: true,
  },
  {
    slug: 'huusbook',
    name: 'Huusbook',
    status: 'live',
    tagline: 'Das Haushaltsbuch, neu gedacht.',
    url: 'https://huusbook.de',
    order: 2,
    category: 'tool',
    create: true,
  },
  {
    slug: 'fjella',
    name: 'Fjella',
    status: 'live',
    tagline: 'Nordisches Interior – „Zuhause, nordisch gedacht.“ Unser eigener Shopify-Shop.',
    url: 'https://fjella-shop.de',
    order: 3,
    category: 'ecommerce',
    create: true,
  },
  {
    slug: 'family-manager',
    name: 'FamilyManager',
    status: 'development',
    tagline: 'Familienalltag in einer App organisiert.',
    url: null,
    order: 4,
    category: 'app',
    create: true,
  },
  {
    slug: 'anwurf',
    name: 'Anwurf',
    status: 'development',
    tagline: 'Die Angel-App für Nord- und Ostsee.',
    url: null,
    order: 5,
    category: 'app',
    create: true,
  },
  { slug: 'thingr', name: 'ThingR', status: 'hidden', tagline: null, url: null, order: 99, category: 'tool', create: false },
]

type CaseSeed = {
  slug: string
  client: string
  industry: string
  place: string | null
  url: string | null
  chips: string[]
  services: string[]
  hasDetailPage: boolean
  featuredOnHome: boolean
  order: number
  status: 'published' | 'draft'
}

// Source: "beau-marketing.de – Referenzen (lebend)" + corrected chips from the order.
export const CASES: CaseSeed[] = [
  {
    slug: 'huepfburgen-owl',
    client: 'Hüpfburgen OWL (DJ GmbH)',
    industry: 'Hüpfburgenverleih',
    place: 'Detmold',
    url: 'https://huepfburg-owl.de',
    chips: ['Website', 'Buchungssystem', 'Betreuung'],
    services: ['websites', 'apps-software', 'betreuung-pflege'],
    hasDetailPage: true,
    featuredOnHome: true,
    order: 1,
    status: 'published',
  },
  {
    slug: 'keramikwerkstatt-hinrichsen',
    client: 'Keramikwerkstatt Hinrichsen',
    industry: 'Keramik-Manufaktur mit Onlineshop',
    place: 'Mittelangeln',
    url: 'https://keramikwerkstatt-hinrichsen.de',
    chips: ['Onlineshop-Aufbau (Shopware)', 'erstes SEO', 'Beratung'],
    services: [], // Shopware is not Shopify — no current service applies
    hasDetailPage: true,
    featuredOnHome: true,
    order: 2,
    status: 'published',
  },
  {
    slug: 'solids-technologies',
    client: 'Solids Technologies EA GmbH',
    industry: 'Maschinenbau (Schüttguttechnik)',
    place: 'Detmold',
    url: 'https://solids-technologies.de',
    chips: ['Website', 'SEO'],
    services: ['websites'],
    hasDetailPage: false,
    featuredOnHome: true,
    order: 3,
    status: 'published',
  },
  {
    slug: 'wirtshaus-frankenburg',
    client: 'Wirtshaus Frankenburg',
    industry: 'Gastronomie',
    place: 'Steinheim',
    url: 'https://wirtshaus-frankenburg.de',
    chips: ['Website'],
    services: ['websites'],
    hasDetailPage: false,
    featuredOnHome: true,
    order: 4,
    status: 'published',
  },
  {
    slug: 'nelges-immobilien',
    client: 'Nelges Immobilien',
    industry: 'Immobilienmakler',
    place: 'Detmold',
    url: 'https://nelges-immobilien.de',
    chips: ['Website'],
    services: ['websites'],
    hasDetailPage: false,
    featuredOnHome: false,
    order: 5,
    status: 'published',
  },
  {
    slug: 'windhausen-immobilien',
    client: 'Windhausen Immobilien',
    industry: 'Immobilienmakler',
    place: 'Detmold',
    url: null, // the website is not our work — only the business cards
    chips: ['Visitenkarten (Gestaltung + Druck)'],
    services: ['druck-werbemittel'],
    hasDetailPage: false,
    featuredOnHome: false,
    order: 6,
    status: 'published',
  },
  {
    slug: 'fjella',
    client: 'Fjella (eigene Marke)',
    industry: 'Nordisches Interior',
    place: 'Mittelangeln',
    url: 'https://fjella-shop.de',
    chips: ['Shopify-Shop komplett'],
    services: ['shopify-shops'],
    hasDetailPage: true,
    featuredOnHome: false,
    order: 7,
    status: 'published',
  },
  // Not live yet — published only after their go-live.
  {
    slug: 'mittelangler-schuetzenverein',
    client: 'Mittelangler Schützenverein',
    industry: 'Verein',
    place: 'Mittelangeln',
    url: null,
    chips: ['Website'],
    services: ['websites'],
    hasDetailPage: false,
    featuredOnHome: false,
    order: 8,
    status: 'draft',
  },
  {
    slug: 'torfchecker',
    client: 'Torfchecker',
    industry: 'Dart-Sportverein',
    place: null,
    url: null,
    chips: ['Website'],
    services: ['websites'],
    hasDetailPage: false,
    featuredOnHome: false,
    order: 9,
    status: 'draft',
  },
]

export const ENGAGEMENTS = [
  { institution: 'TSV Nordmark Satrup', place: 'Satrup', kind: 'Trikots', order: 1 },
  { institution: 'Regenbogen-Grundschule Satrup', place: 'Satrup', kind: 'Warnwesten für die Erstklässler', order: 2 },
  { institution: 'ADS-Kindergarten am Schwimmbad', place: 'Satrup', kind: 'Warnwesten', order: 3 },
  { institution: 'Mittelangler Schützenverein', place: 'Mittelangeln', kind: 'Kleidung', order: 4 },
]

export const CATEGORIES = [
  { slug: 'websites', title: 'Websites' },
  { slug: 'shopify-e-commerce', title: 'Shopify & E-Commerce' },
  { slug: 'sichtbarkeit-seo', title: 'Sichtbarkeit & SEO' },
  { slug: 'pflichtangaben-recht', title: 'Pflichtangaben & Recht' },
  { slug: 'druck-werbemittel', title: 'Druck & Werbemittel' },
  { slug: 'apps-software', title: 'Apps & Software' },
]

export const AUTHORS = [{ slug: 'stephan-beau', name: 'Stephan Beau', role: 'Geschäftsführer' }]

/** Header labels per locale (design header: de/da/en). */
export const NAV_HEADER = [
  { href: '/referenzen', de: 'Referenzen', en: 'Work', da: 'Referencer' },
  { href: '/ratgeber', de: 'Ratgeber', en: 'Guides', da: 'Vejledninger' },
  { href: '/marken', de: 'Marken', en: 'Brands', da: 'Brands' },
  { href: '/ueber-uns', de: 'Über uns', en: 'About', da: 'Om os' },
  { href: '/kontakt', de: 'Kontakt', en: 'Contact', da: 'Kontakt' },
]

// Labels as in the existing messages. Widerrufsbelehrung stays reachable but without a footer link (B2B decision pending).
export const NAV_FOOTER_LEGAL = [
  { href: '/impressum', de: 'Impressum', en: 'Imprint', da: 'Kolofon' },
  { href: '/datenschutz', de: 'Datenschutz', en: 'Privacy', da: 'Privatliv' },
  { href: '/agb', de: 'AGB', en: 'Terms', da: 'Vilkår' },
]

export const TRUST_MEDIA = {
  sh: {
    // Lossless PNG, pixel-identical to the WebP from the partner portal: Payload
    // re-encodes every WebP upload through sharp (lossy) — PNG stays byte-identical.
    filename: 'sh-partner-badge-der-echte-norden.png',
    href: 'https://partner-sh.de',
    name: 'Partner Schleswig-Holstein. Der echte Norden',
    alt: { de: 'Partner Schleswig-Holstein. Der echte Norden', en: 'Partner Schleswig-Holstein. Der echte Norden', da: 'Partner Schleswig-Holstein. Der echte Norden' },
    credit: {
      author: 'Land Schleswig-Holstein',
      source: 'Partnerprogramm „Schleswig-Holstein. Der echte Norden.“',
      license: 'Nutzung als Partner gemäß Partnerbedingungen, unverändert',
    },
  },
  erecht24: {
    filename: 'erecht24-agentur-partner.png',
    href: null,
    name: 'eRecht24 Agentur Partner',
    caption: 'Impressum & Datenschutz immer aktuell',
    alt: {
      de: 'eRecht24 Agentur Partner für rechtssichere Webseiten',
      en: 'eRecht24 agency partner for legally compliant websites',
      da: 'eRecht24 bureaupartner for juridisk korrekte hjemmesider',
    },
    credit: {
      author: 'eRecht24',
      source: 'eRecht24 Agentur-Partnerprogramm',
      license: 'Nutzung als Agentur-Partner, unverändert',
    },
  },
}

export const TRUST_SERVER_NOTE = {
  de: 'Websites auf Servern in Deutschland',
  en: 'Websites hosted on servers in Germany',
  da: 'Hjemmesider på servere i Tyskland',
}
