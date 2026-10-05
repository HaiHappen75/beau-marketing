// Fixed contact topics for /kontakt?anliegen=<key> (decision Stephan 05.10.2026:
// keys, not free text). A known key adds its label as a preselected option of the
// "Leistung" field — the mail then carries it like any service. Unknown keys are
// ignored, so a crafted link cannot put arbitrary text into the form.

export const CONTACT_TOPICS: Record<string, string> = {
  // Offer page /de/website-ferienwohnung. The price repeats the offer block — change both.
  'website-check-fewo': 'Website-Check Ferienwohnung (290 €)',
}

/** Label of a known topic key, otherwise null. */
export const contactTopic = (key: string | null | undefined): string | null =>
  key && Object.hasOwn(CONTACT_TOPICS, key) ? CONTACT_TOPICS[key] : null
