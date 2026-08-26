import type { JsonLdNode } from '@/lib/json-ld'

// Server component on purpose — no 'use client'. The markup has to be in the initial
// HTML: crawlers and AI systems execute no JavaScript, so JSON-LD handed over on the
// client does not exist for them.

/**
 * A literal `</script>` inside the JSON would close the script block early. That is
 * not a theoretical risk here: brand names and the AGB/Widerruf titles come out of
 * Payload and can contain arbitrary characters. `<` is therefore written as a Unicode
 * escape — identical as a JSON value, harmless in HTML.
 */
function serialize(graph: JsonLdNode[]): string {
  const payload = { '@context': 'https://schema.org', '@graph': graph }
  return JSON.stringify(payload).replace(/</g, '\\u003c')
}

export function JsonLd({ graph }: { graph: JsonLdNode[] }) {
  if (!graph.length) return null
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(graph) }} />
  )
}
