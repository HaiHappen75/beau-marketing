import { getPayloadClient } from '@/lib/getPayload'

/**
 * Looks up a stored redirect for a path (e.g. an old article slug). Used by pages
 * that would otherwise answer 404; the caller issues permanentRedirect (308).
 */
export async function findRedirect(path: string): Promise<string | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'redirects',
    where: { from: { equals: path } },
    depth: 0,
    limit: 1,
  })
  const to = docs[0]?.to
  if (!to) return null
  return to.type === 'custom' ? (to.url ?? null) : null
}
