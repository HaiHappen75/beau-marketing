// In-memory rate limit for the contact form. One container serves the site, so
// process memory is the right scope; a restart simply resets the window.

const WINDOW_MS = 10 * 60 * 1000
export const MAX_PER_WINDOW = 5

const hits = new Map<string, number[]>()

/** Records a submission and returns false once the IP exceeds the window budget. */
export function allowSubmission(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return false
  }
  recent.push(now)
  hits.set(ip, recent)
  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
  }
  return true
}

/**
 * Client IP behind Traefik: X-Real-Ip is set by the proxy (overwriting anything
 * the client sent); the LAST X-Forwarded-For entry is the one Traefik appended.
 * The first entry is client-controlled and never trusted.
 */
export function clientIp(headers: Headers): string {
  const real = headers.get('x-real-ip')?.trim()
  if (real) return real
  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }
  return 'unknown'
}
