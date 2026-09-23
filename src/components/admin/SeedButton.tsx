'use client'

import { Button } from '@payloadcms/ui'
import { useState } from 'react'

import type { SeedSummary } from '@/seed/types'

const COUNT_LABELS: [keyof SeedSummary[string], string][] = [
  ['created', 'angelegt'],
  ['filled', 'ergänzt'],
  ['skipped', 'übersprungen'],
]

export function SeedButton() {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [summary, setSummary] = useState<SeedSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    setState('running')
    setError(null)
    try {
      const res = await fetch('/api/seed', { method: 'POST', credentials: 'include' })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`)
      setSummary(body.summary)
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setState('error')
    }
  }

  const legacy = summary
    ? Object.entries(summary).flatMap(([collection, s]) => s.legacyReplaced.map((l) => ({ collection, ...l })))
    : []

  return (
    <section className="bm-seed">
      <h3>Stammdaten</h3>
      <p>
        Legt fehlende Einträge an und füllt leere Felder. Bestehende Werte bleiben unangetastet – außer bekannten
        Altwerten aus dem früheren Seed. Beliebig oft ausführbar.
      </p>
      <Button onClick={run} disabled={state === 'running'} buttonStyle="secondary" size="small">
        {state === 'running' ? 'Läuft …' : 'Stammdaten ergänzen'}
      </Button>
      {error && <p role="alert">Fehler: {error}</p>}
      {summary && (
        <>
          <table>
            <thead>
              <tr>
                <th>Bereich</th>
                {COUNT_LABELS.map(([, label]) => (
                  <th key={label}>{label}</th>
                ))}
                <th>Altwert ersetzt</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary).map(([collection, s]) => (
                <tr key={collection}>
                  <td>{collection}</td>
                  {COUNT_LABELS.map(([key]) => (
                    <td key={key}>{(s[key] as string[]).length}</td>
                  ))}
                  <td>{s.legacyReplaced.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {legacy.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Altwert ersetzt</th>
                  <th>Feld</th>
                  <th>alt</th>
                  <th>neu</th>
                </tr>
              </thead>
              <tbody>
                {legacy.map((l, i) => (
                  <tr key={i}>
                    <td>
                      {l.collection} · {l.doc}
                    </td>
                    <td>
                      {l.field}
                      {l.locale ? ` (${l.locale})` : ''}
                    </td>
                    <td>{l.from}</td>
                    <td>{l.to ?? '— (geleert)'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </section>
  )
}
