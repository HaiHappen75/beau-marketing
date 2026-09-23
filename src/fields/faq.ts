import type { Field } from 'payload'

/** Question/answer list. Rendered as accordion; FAQPage JSON-LD only when filled. */
export const faqField = (name = 'faq'): Field => ({
  name,
  type: 'array',
  label: 'FAQ',
  labels: { singular: 'Frage', plural: 'Fragen' },
  fields: [
    { name: 'question', label: 'Frage', type: 'text', localized: true, required: true },
    { name: 'answer', label: 'Antwort', type: 'textarea', localized: true, required: true },
  ],
})
