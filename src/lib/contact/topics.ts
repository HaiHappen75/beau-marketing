// Fixed contact topics for /kontakt?anliegen=<key> (decision Stephan 05.10.2026:
// keys, not free text). A known key adds its topic as a preselected option of the
// "Leistung" field — the mail then carries it like any service. Unknown keys are
// ignored, so a crafted link cannot put arbitrary text into the form.

type Topic = {
  /** The topic as the mail carries it (subject and body). */
  name: string
  /**
   * Text of the option on screen, where `name` does not fit: on desktop the select
   * field shows about 16 characters (156 px) and cuts the rest off. Default: `name`.
   */
  label?: string
}

export const CONTACT_TOPICS: Record<string, Topic> = {
  // Offer page /de/gastgeber/ferienwohnung. The price repeats the offer block — change both.
  'website-check-fewo': { name: 'Website-Check Ferienwohnung (290 €)' },
  // Host area (/de/gastgeber, /de/gastgeber/gastronomie).
  'demo-gastronomie': { name: 'Demo Gastronomie' },
  'website-check-gastro': { name: 'Website-Check Gastronomie', label: 'Website-Check' },
  'rund-um-den-tisch': { name: 'Rund um den Tisch' },
}

/** A known topic key as a select option (value = what the mail carries), otherwise null. */
export const contactTopic = (key: string | null | undefined): { value: string; label: string } | null => {
  if (!key || !Object.hasOwn(CONTACT_TOPICS, key)) return null
  const topic = CONTACT_TOPICS[key]
  return { value: topic.name, label: topic.label ?? topic.name }
}
