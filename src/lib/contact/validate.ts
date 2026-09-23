// Shared by the client (instant feedback) and the server action (the real check).

export type ContactFields = {
  name: string
  company: string
  email: string
  phone: string
  service: string
  region: string
  budget: string
  message: string
}

/** Error → message key in the ContactForm namespace. */
export type ContactErrors = Partial<Record<keyof ContactFields, string>>

// Design rule (something@something.tld), minus every character that could break
// the Reply-To header the address ends up in.
export const EMAIL_RE = /^[^\s@<>"(),;:\\]+@[^\s@<>"(),;:\\]+\.[^\s@<>"(),;:\\]+$/

export const LIMITS = { short: 200, message: 5000 }

export function validateContact(f: ContactFields): ContactErrors {
  const e: ContactErrors = {}
  if (!f.name.trim()) e.name = 'errName'
  if (!f.company.trim()) e.company = 'errCompany'
  if (!f.email.trim()) e.email = 'errEmail'
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'errEmailInvalid'
  if (!f.service) e.service = 'errService'
  if (!f.region) e.region = 'errRegion'
  if (!f.message.trim()) e.message = 'errMessage'
  return e
}
