import sanitizeHtml from 'sanitize-html'

// Sanitising for the eRecht24 legal texts. Deliberately WITHOUT importing
// @dagsite/erecht24-next — its `server-only` guard would make this module
// untestable outside the Next runtime. Stays pure and independently checkable.
//
// Allowlist, not blocklist: even from a trusted source, a compromised or spoofed
// API response would otherwise be stored XSS on our own domain. `id` stays
// allowed (anchors of the eRecht24 table of contents); the wording is never
// touched — the `discard` default only drops tags, not their text.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
    'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 'small', 'sup', 'sub',
    'a', 'blockquote', 'div', 'span',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'id'],
    '*': ['id'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false,
  transformTags: {
    // External links always get noopener/noreferrer (tab-nabbing, referrer leak).
    a: (tagName, attribs) => {
      const external = /^https?:\/\//i.test(attribs.href ?? '')
      return {
        tagName,
        attribs: external ? { ...attribs, rel: 'noopener noreferrer' } : attribs,
      }
    },
  },
}

export function sanitizeLegalHtml(rawHtml: string): string {
  return sanitizeHtml(rawHtml, SANITIZE_OPTIONS)
}

/**
 * Does the text bring its own <h1>? Then the page must not render a second one.
 * Asks the content, never a format flag — at Tappi the CMS fields labelled
 * "markdown" actually held HTML pasted out of the eRecht24 generator.
 */
export function hasH1(html: string): boolean {
  return /<h1[\s>]/i.test(html)
}
