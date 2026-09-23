import type { CollectionAfterChangeHook, PayloadRequest } from 'payload'

import { routing } from '@/i18n/routing'

/**
 * Blog standard: a URL change without a redirect is forbidden. When the slug of
 * a document that is (or was) public changes, this writes one permanent
 * redirect per locale into the redirects collection, re-points older redirects
 * to the new target (no chains) and drops a redirect FROM the new path (no loops).
 * Runs inside the same transaction as the save (req is passed through).
 */
export const slugRedirectHook =
  (basePath: string): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req, operation }) => {
    if (operation !== 'update') return doc
    const oldSlug = previousDoc?.slug as string | undefined
    const newSlug = doc?.slug as string | undefined
    if (!oldSlug || !newSlug || oldSlug === newSlug) return doc
    const wasPublic = previousDoc?._status === 'published' || doc?._status === 'published'
    if (!wasPublic) return doc

    for (const locale of routing.locales) {
      await writeRedirect(req, `/${locale}${basePath}/${oldSlug}`, `/${locale}${basePath}/${newSlug}`)
    }
    return doc
  }

async function writeRedirect(req: PayloadRequest, from: string, to: string) {
  const { payload } = req
  // 1. No loop: a redirect away from the path that is now live again must go.
  await payload.delete({ collection: 'redirects', where: { from: { equals: to } }, req })
  // 2. No chain: everything that pointed at the old path now points at the new one.
  await payload.update({
    collection: 'redirects',
    where: { 'to.url': { equals: from } },
    data: { to: { type: 'custom', url: to } },
    req,
  })
  // 3. The redirect itself (from is unique — update if it already exists).
  const existing = await payload.find({ collection: 'redirects', where: { from: { equals: from } }, limit: 1, req })
  if (existing.docs[0]) {
    await payload.update({
      collection: 'redirects',
      id: existing.docs[0].id,
      data: { to: { type: 'custom', url: to } },
      req,
    })
  } else {
    await payload.create({ collection: 'redirects', data: { from, to: { type: 'custom', url: to } }, req })
  }
}
