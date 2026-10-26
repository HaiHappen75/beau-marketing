import { ValidationError, type CollectionAfterErrorHook, type CollectionBeforeValidateHook } from 'payload'

import { findPreviewLinks, previewLinkMessage } from '@/lib/previewLinks'

/**
 * Blocks saving while a rich-text link points at a preview or local host
 * (src/lib/previewLinks.ts): one error per field, naming every affected link.
 * A collection hook rather than a field `validate`, because field validation is
 * skipped for drafts and this has to hold for every save. Only reads `data` —
 * stored content is never rewritten. `label` carries the message itself, so the
 * admin toast names the link and not just the field.
 */
export const previewLinkGuard: CollectionBeforeValidateHook = ({ collection, data, req }) => {
  const found = findPreviewLinks(data)
  if (found.length === 0) return data
  const byPath = new Map<string, string[]>()
  for (const link of found) byPath.set(link.path, [...(byPath.get(link.path) ?? []), previewLinkMessage(link)])
  throw new ValidationError(
    {
      collection: collection.slug,
      errors: [...byPath].map(([path, messages]) => ({ path, message: messages.join(' '), label: messages.join(' ') })),
      req,
    },
    req.t,
  )
}

/**
 * Puts the field errors back into the REST response. Payload's formatErrors only
 * passes an error's `data` on for `instanceof ValidationError` — in the Next
 * production bundle that check fails (the class sits in several chunks), so the
 * admin got the bare message and could not mark the field (built-in validation
 * errors included). Rebuilt in the shape formatErrors itself produces, for public
 * validation errors (400) only.
 */
export const restoreFieldErrors: CollectionAfterErrorHook = ({ error, result }) => {
  const err = error as Error & { data?: { errors?: unknown }; isPublic?: boolean; status?: number }
  if (!result || err.status !== 400 || err.isPublic === false || !Array.isArray(err.data?.errors)) return
  if (result.errors.some((e) => e.data)) return // formatErrors got it right after all
  return { response: { ...result, errors: [{ name: 'ValidationError', message: err.message, data: err.data }] } }
}
