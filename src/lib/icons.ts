// Icon set of the points block. Pure data: the block config builds its select
// from it, src/components/brand/Icon.tsx draws the paths.

export const ICON_OPTIONS = [
  { value: 'website', label: 'Website (Browserfenster)' },
  { value: 'menu', label: 'Speisekarte' },
  { value: 'phone', label: 'Telefon' },
  { value: 'calendar', label: 'Kalender / Veranstaltung' },
  { value: 'legal', label: 'Rechtstexte (Dokument mit Haken)' },
  { value: 'languages', label: 'Sprachen (Globus)' },
  { value: 'table', label: 'Tisch (Besteck)' },
  { value: 'person', label: 'Ansprechpartner' },
  { value: 'document', label: 'Datei / PDF' },
  { value: 'megaphone', label: 'Ankündigung' },
  { value: 'controls', label: 'Selbst bedienen (Regler)' },
  { value: 'clock', label: 'Zeit / veraltet' },
] as const

export type IconName = (typeof ICON_OPTIONS)[number]['value']
