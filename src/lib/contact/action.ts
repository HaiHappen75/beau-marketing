'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/getPayload'
import { getSettings } from '@/lib/queries/getLayoutData'
import type { Locale } from '@/lib/locale'

import { allowSubmission, clientIp } from './rateLimit'
import { LIMITS, validateContact, type ContactErrors, type ContactFields } from './validate'

export type ContactState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: ContactErrors }
  | { status: 'error'; reason: 'send' | 'rate' }
  | { status: 'success' }

const str = (fd: FormData, key: string, max: number) => String(fd.get(key) ?? '').slice(0, max)

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] as string)

/** Header-safe display name: no line breaks, no quotes that could break the address. */
const headerName = (s: string) => s.replace(/[\r\n"<>]/g, ' ').trim().slice(0, 100)

/**
 * Contact form submission. Spam protection without Google: a honeypot field and
 * a per-IP rate limit. DMARC: the mail is sent FROM our own domain address; the
 * enquirer only appears in Reply-To, so a reply goes straight to them.
 */
export async function submitContact(_prev: ContactState, fd: FormData): Promise<ContactState> {
  // Honeypot filled → a bot. Pretend success, send nothing.
  if (String(fd.get('website') ?? '').trim() !== '') return { status: 'success' }

  const fields: ContactFields = {
    name: str(fd, 'name', LIMITS.short),
    company: str(fd, 'company', LIMITS.short),
    email: str(fd, 'email', LIMITS.short).trim(),
    phone: str(fd, 'phone', LIMITS.short),
    service: str(fd, 'service', LIMITS.short),
    region: str(fd, 'region', LIMITS.short),
    budget: str(fd, 'budget', LIMITS.short),
    message: str(fd, 'message', LIMITS.message),
  }
  const errors = validateContact(fields)
  if (Object.keys(errors).length > 0) return { status: 'invalid', errors }

  if (!allowSubmission(clientIp(await headers()))) return { status: 'error', reason: 'rate' }

  const locale = (String(fd.get('locale') ?? 'de') as Locale) || 'de'
  const settings = await getSettings(locale)
  const to = settings.company?.email
  if (!to) return { status: 'error', reason: 'send' }

  const fromAddress = process.env.SMTP_FROM_ADDRESS || 'noreply@beau-marketing.de'
  const fromName = `${process.env.SMTP_FROM_NAME || 'Beau Marketing'} Website`

  const rows: [string, string][] = [
    ['Name', fields.name],
    ['Firma', fields.company],
    ['E-Mail', fields.email],
    ['Telefon', fields.phone || '–'],
    ['Leistung', fields.service],
    ['Region', fields.region],
    ['Budget', fields.budget || '–'],
    ['Sprache', locale],
  ]
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nNachricht:\n${fields.message}\n`
  const html = `<table>${rows
    .map(([k, v]) => `<tr><th align="left" style="padding-right:12px">${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join('')}</table><p><strong>Nachricht:</strong></p><p style="white-space:pre-wrap">${esc(fields.message)}</p>`

  try {
    const payload = await getPayloadClient()
    await payload.sendEmail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      replyTo: `"${headerName(fields.name)}" <${fields.email}>`,
      subject: `Anfrage über die Website: ${headerName(fields.service)} – ${headerName(fields.company)}`,
      text,
      html,
    })
    return { status: 'success' }
  } catch (err) {
    const payload = await getPayloadClient()
    payload.logger.error({ err, msg: 'Kontaktformular: Versand fehlgeschlagen' })
    return { status: 'error', reason: 'send' }
  }
}
