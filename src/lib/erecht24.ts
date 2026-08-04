import { getLegalText } from '@dagsite/erecht24-next'

import type { Locale } from '@/lib/locale'
import { hasH1, sanitizeLegalHtml } from '@/lib/sanitize-legal'
import datenschutzSnapshot from '../../content/legal/datenschutz.json'
import impressumSnapshot from '../../content/legal/impressum.json'

// Legal texts from the eRecht24 Project Manager. Three stages of resilience
// (SecondBrain concept "Rechtstexte automatisch aus eRecht24 ziehen"):
//   1. live fetch — held in the Next data cache under tag `erecht24:<type>`,
//      TTL 24 h, invalidated within seconds by the push webhook
//   2. committed snapshot from content/legal/ — sits in the server bundle and
//      cannot fail at runtime
//   3. snapshot refreshed on every build (scripts/fetch-erecht24-snapshot.mjs)
// Stage 1 alone is not enough: every Coolify deploy starts a fresh container
// with an empty data cache, so "ISR stale-on-error" has nothing to fall back on.
export type WebsiteLegalType = 'imprint' | 'privacyPolicy'

/** eRecht24 delivers German and — if maintained in the project — English. */
export type LegalLang = 'de' | 'en'

interface LegalSource {
  html_de: string
  html_en: string | null
}

export interface WebsiteLegalText {
  /** Sanitised, render-ready markup — the only markup allowed to reach the DOM. */
  html: string
  /** Text carries its own <h1>, so the page must not render another one. */
  hasH1: boolean
  /** Language actually delivered — may differ from the requested one. */
  lang: LegalLang
  /** Languages this text really exists in — drives canonical and hreflang. */
  availableLangs: LegalLang[]
  source: 'live' | 'snapshot'
}

const SNAPSHOTS: Record<WebsiteLegalType, LegalSource & { fetchedAt: string }> = {
  imprint: impressumSnapshot,
  privacyPolicy: datenschutzSnapshot,
}

// The first request after a deploy hits an empty data cache and makes the
// eRecht24 call synchronously in the request path — without a cap the page
// would hang on an API outage until the fetch gives up on its own.
const LIVE_TIMEOUT_MS = 5000

/**
 * eRecht24 offers German and English, no Danish. Danish visitors therefore get
 * the English text — far more likely to be understood than German — while the
 * authoritative German version stays at /de and remains x-default. If English
 * is ever unmaintained, `pick()` falls back to German rather than blank.
 */
export function legalLangFor(locale: Locale): LegalLang {
  return locale === 'de' ? 'de' : 'en'
}

/** Picks the wanted language, falling back to German when it is not maintained. */
function pick(source: LegalSource, wanted: LegalLang): { html: string; lang: LegalLang } | null {
  if (wanted === 'en') {
    const en = source.html_en?.trim()
    if (en) return { html: en, lang: 'en' }
  }
  const de = source.html_de?.trim()
  return de ? { html: de, lang: 'de' } : null
}

function availableLangs(source: LegalSource): LegalLang[] {
  return source.html_en?.trim() ? ['de', 'en'] : ['de']
}

function prepare(
  picked: { html: string; lang: LegalLang },
  from: LegalSource,
  source: WebsiteLegalText['source'],
): WebsiteLegalText {
  const html = sanitizeLegalHtml(picked.html)
  return { html, hasH1: hasH1(html), lang: picked.lang, availableLangs: availableLangs(from), source }
}

/**
 * Returns the render-ready legal text — live when possible, snapshot otherwise.
 * Never throws: Impressum and Datenschutz are legally required pages.
 */
export async function getWebsiteLegalText(
  type: WebsiteLegalType,
  locale: Locale,
): Promise<WebsiteLegalText> {
  const wanted = legalLangFor(locale)

  try {
    const text = await withTimeout(getLegalText(type), LIVE_TIMEOUT_MS)
    const picked = pick(text, wanted)
    if (!picked) throw new Error('leere Antwort (html_de)')
    return prepare(picked, text, 'live')
  } catch (err) {
    const snapshot = SNAPSHOTS[type]
    // Deliberately loud: without this line the fallback would completely mask a
    // dead API key — nothing would look broken until the texts silently age.
    console.warn(
      `[erecht24] Live-Abruf „${type}" fehlgeschlagen – Snapshot vom ${snapshot.fetchedAt} wird ausgeliefert:`,
      err instanceof Error ? err.message : err,
    )
    const picked = pick(snapshot, wanted)
    if (!picked) {
      console.error(`[erecht24] Snapshot „${type}" ist leer – Seite bleibt ohne Rechtstext.`)
      return { html: '', hasH1: false, lang: 'de', availableLangs: ['de'], source: 'snapshot' }
    }
    return prepare(picked, snapshot, 'snapshot')
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`eRecht24-Abruf: Timeout nach ${ms} ms`)), ms)
    }),
  ])
}
