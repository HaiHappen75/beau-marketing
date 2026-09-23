import { ValidationError } from 'payload'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { editorialAccess } from '../access'
import { faqField } from '../fields/faq'
import { slugField } from '../fields/slug'

/**
 * Local landing pages (service × place). Publishing requires real local content —
 * the technical guard against doorway pages. Drafts may stay incomplete.
 */
export const LOCAL_INTRO_MIN_CHARS = 600

type LocalReference = { type?: 'case' | 'regional' | null; case?: unknown; regionalNote?: string | null }

/** Returns the missing-content errors of a document that is about to be published. */
export function localContentErrors(data: {
  intro?: unknown
  localReference?: LocalReference | null
}): { path: string; message: string }[] {
  const errors: { path: string; message: string }[] = []
  const intro = typeof data.intro === 'string' ? data.intro.trim() : ''
  if (intro.length < LOCAL_INTRO_MIN_CHARS) {
    errors.push({
      path: 'intro',
      message: `Der lokale Einleitungstext braucht mindestens ${LOCAL_INTRO_MIN_CHARS} Zeichen (aktuell ${intro.length}).`,
    })
  }
  const ref = data.localReference
  const hasCase = ref?.type === 'case' && Boolean(ref.case)
  const hasRegional = ref?.type === 'regional' && typeof ref.regionalNote === 'string' && ref.regionalNote.trim().length > 0
  if (!hasCase && !hasRegional) {
    errors.push({
      path: 'localReference',
      message: 'Lokaler Bezug fehlt: eine Referenz vor Ort oder eine regionale Besonderheit.',
    })
  }
  return errors
}

// Backstop: field validation is skipped for drafts and could be bypassed by
// other write paths — this hook blocks every publish without local content.
const blockThinPublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (data?._status !== 'published') return data
  const errors = localContentErrors(data)
  if (errors.length > 0) throw new ValidationError({ collection: 'locations', errors, req })
  return data
}

export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: { singular: 'Landingpage', plural: 'Landingpages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'place', 'service', '_status'],
    group: 'Agentur',
    description: `Veröffentlichen nur mit echtem lokalem Inhalt: Einleitung ab ${LOCAL_INTRO_MIN_CHARS} Zeichen und ein lokaler Bezug.`,
  },
  access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: { beforeChange: [blockThinPublish] },
  fields: [
    { name: 'title', label: 'Titel', type: 'text', localized: true, required: true },
    slugField('place'),
    {
      type: 'row',
      fields: [
        { name: 'place', label: 'Ort', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'region', label: 'Kreis / Region', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'service', label: 'Leistung', type: 'relationship', relationTo: 'services' },
    {
      name: 'intro',
      label: 'Lokaler Einleitungstext',
      type: 'textarea',
      localized: true,
      admin: { description: `Pflicht zum Veröffentlichen, mindestens ${LOCAL_INTRO_MIN_CHARS} Zeichen, echter Ortsbezug.` },
    },
    {
      name: 'localReference',
      label: 'Lokaler Bezug',
      type: 'group',
      admin: { description: 'Pflicht zum Veröffentlichen: Referenz vor Ort oder regionale Besonderheit.' },
      fields: [
        {
          name: 'type',
          label: 'Art',
          type: 'radio',
          options: [
            { label: 'Referenz vor Ort', value: 'case' },
            { label: 'Regionale Besonderheit', value: 'regional' },
          ],
        },
        {
          name: 'case',
          label: 'Referenz',
          type: 'relationship',
          relationTo: 'cases',
          admin: { condition: (_, sibling) => sibling?.type === 'case' },
        },
        {
          name: 'regionalNote',
          label: 'Regionale Besonderheit',
          type: 'textarea',
          localized: true,
          admin: { condition: (_, sibling) => sibling?.type === 'regional' },
        },
      ],
    },
    { name: 'visitInfo', label: 'Termin vor Ort / Anfahrt', type: 'textarea', localized: true },
    faqField(),
  ],
}
