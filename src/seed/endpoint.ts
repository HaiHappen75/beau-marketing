import type { Endpoint } from 'payload'

import { runSeed } from './index'

/** POST /api/seed — runs the fill-only master-data seed. Admins only. */
export const seedEndpoint: Endpoint = {
  path: '/seed',
  method: 'post',
  handler: async (req) => {
    if ((req.user as { role?: string } | null)?.role !== 'admin') {
      return Response.json({ error: 'Nur für Admins.' }, { status: 403 })
    }
    try {
      const summary = await runSeed(req.payload)
      req.payload.logger.info({ msg: 'Seed ausgeführt', summary })
      return Response.json({ summary })
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Seed fehlgeschlagen' })
      return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
    }
  },
}
