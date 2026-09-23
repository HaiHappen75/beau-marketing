// Local landing pages (Paket 5). Only Flensburg is published; the others stay
// drafts until they have real local content (the publish lock in Locations.ts).
// Texts: design "Landingpage Flensburg" with the corrections from the Bauauftrag.
// Statements that could not be verified are phrased neutrally or left out.

// von Stephan prüfen
export const DISTANCE_SATRUP_FLENSBURG = 'gut 20 km'

export type LocationSeed = {
  slug: string
  place: string
  region: string | null
  title: string
  status: 'published' | 'draft'
  headline?: string
  lead?: string
  introHeading?: string
  intro?: string
  highlights?: string[]
  regionalNote?: string
  /** Case slugs shown under "Aus der Region". */
  cases?: string[]
  visitInfo?: string
  distance?: string
  faq?: { question: string; answer: string }[]
}

export const LOCATIONS: LocationSeed[] = [
  {
    slug: 'flensburg',
    place: 'Flensburg',
    region: 'kreisfreie Stadt',
    title: 'Werbeagentur & Webdesign Flensburg',
    status: 'published',
    headline: 'Werbeagentur & Webdesign für *Flensburg.*',
    lead: `Wir sitzen in Satrup, ${DISTANCE_SATRUP_FLENSBURG} vor der Stadt. Websites, Shops und Google-Profile für Betriebe zwischen Förde, Angeln und der Grenze.`,
    introHeading: 'Flensburg liegt an der Grenze – eine Website auf Deutsch und Dänisch spricht beide Seiten an.',
    intro: [
      'Wer in der Innenstadt einen Laden hat, ein Café am Hafen oder einen Handwerksbetrieb in Weiche, kann Kundschaft von beiden Seiten der Grenze haben. Deshalb bauen wir Websites, die es von Anfang an auch auf Dänisch gibt, und kümmern uns um das Google-Profil für Flensburg und Umland.',
      'Beau Marketing sitzt in Satrup in Mittelangeln und macht seit 2016 Online-Marketing. Für die Keramikwerkstatt Hinrichsen aus Mittelangeln haben wir den kompletten Onlineshop aufgebaut, dazu erstes SEO und Beratung.',
      'Unsere Preise stehen offen auf der Seite, netto für Unternehmen. Das Erstgespräch machen wir gern bei dir vor Ort.',
    ].join('\n\n'),
    highlights: [
      'Zweisprachige Seiten: Deutsch und Dänisch',
      'Google-Profil für Flensburg und Umland',
      'Termine bei dir im Betrieb, nicht in einem Konferenzraum',
    ],
    regionalNote: 'Grenzregion: Website zweisprachig auf Deutsch und Dänisch, Google-Profil für Flensburg und Umland.',
    cases: ['keramikwerkstatt-hinrichsen'],
    visitInfo:
      'Manche Dinge versteht man erst, wenn man im Laden steht. Deshalb kommen wir zum Erstgespräch gern zu dir – mit Laptop, ohne Präsentation.',
    distance: DISTANCE_SATRUP_FLENSBURG,
    faq: [
      {
        question: 'Kommt ihr wirklich nach Flensburg in den Betrieb?',
        answer: `Ja. Das Erstgespräch machen wir gern bei dir vor Ort. Von Satrup nach Flensburg sind es ${DISTANCE_SATRUP_FLENSBURG}.`,
      },
      {
        question: 'Könnt ihr die Website auch auf Dänisch machen?',
        answer: 'Ja. Wir bauen die Seite zweisprachig und kümmern uns darum, dass Google beide Sprachen richtig zuordnet.',
      },
      {
        question: 'Mein Laden ist in der Innenstadt. Lohnt sich das Google-Profil?',
        answer:
          'Ein gepflegtes Google-Profil zeigt Adresse, Öffnungszeiten und Fotos dort, wo Menschen in der Nähe suchen – in der Google-Suche und in Google Maps. Wir richten es ein und halten es aktuell.',
      },
    ],
  },
  // Drafts: no local content yet — publishing is blocked until there is some.
  { slug: 'schleswig-holstein', place: 'Schleswig-Holstein', region: null, title: 'Werbeagentur & Webdesign Schleswig-Holstein', status: 'draft' },
  { slug: 'kiel', place: 'Kiel', region: 'kreisfreie Stadt', title: 'Werbeagentur & Webdesign Kiel', status: 'draft' },
  { slug: 'luebeck', place: 'Lübeck', region: 'kreisfreie Stadt', title: 'Werbeagentur & Webdesign Lübeck', status: 'draft' },
]
