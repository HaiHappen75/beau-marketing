/**
 * Derives the tel: link from the displayed number, so the link can never drift
 * from what the page shows. German national format → E.164 (+49, leading 0 dropped).
 */
export function telHref(display: string | null | undefined): string | null {
  if (!display) return null
  const trimmed = display.trim()
  const digits = trimmed.replace(/[^\d]/g, '')
  if (!digits) return null
  if (trimmed.startsWith('+')) return `tel:+${digits}`
  if (digits.startsWith('00')) return `tel:+${digits.slice(2)}`
  if (digits.startsWith('0')) return `tel:+49${digits.slice(1)}`
  return `tel:${digits}`
}
