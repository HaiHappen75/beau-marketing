// HEAD for Payload's REST API. Next answers a HEAD with the GET handler, but the
// request keeps method HEAD — Payload then finds no matching endpoint and replies
// 404 ("Cannot HEAD …"), even for files that exist (link checkers report them as
// broken). This runs the same GET handler (same access rules) and drops the body.

import { NextRequest } from 'next/server'

type Handler<C> = (req: Request, ctx: C) => Promise<Response>

export function restHead<C>(get: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    // Rebuilt from URL + headers: cloning a NextRequest via `new Request(req, …)`
    // fails inside Next ("Cannot read private member #state").
    const res = await get(new NextRequest(req.url, { method: 'GET', headers: req.headers }), ctx)
    await res.body?.cancel()
    return new Response(null, { status: res.status, statusText: res.statusText, headers: res.headers })
  }
}
