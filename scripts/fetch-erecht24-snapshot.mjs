// Pulls Impressum + Datenschutzerklärung from the eRecht24 API and stores them
// as snapshots under content/legal/. Runs before every build (see "build" in
// package.json) and manually via: pnpm snapshot:erecht24
//
// GUARANTEE: this script NEVER fails a build (always exit 0). Without
// ERECHT24_API_KEY, or on API/network errors, the committed state stays in
// place and gets bundled — the snapshots are the last line of defence for the
// legal pages and must neither be missing nor emptied. Writes only on a
// successful, non-empty response (write-temp-then-rename).
import { mkdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = 'https://api.e-recht24.de/v2'
// Plugin identifier built into @dagsite/erecht24-next (dist/index.js, MIT).
// This script runs outside the Next runtime and cannot import the package
// because of its server-only guard. Override via ERECHT24_PLUGIN_KEY.
const DEFAULT_PLUGIN_KEY = 'MwusKrxNEPxHNTUuKQiwYv5vJQdwhfwbSCVo3DFChPvZNcwHsiiVHRpCX3X9nFSv'

const TARGETS = [
  { type: 'imprint', apiPath: '/imprint', file: 'impressum.json' },
  { type: 'privacyPolicy', apiPath: '/privacyPolicy', file: 'datenschutz.json' },
]

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(repoRoot, 'content', 'legal')

// Standalone Node does not read .env (only Next does) — load it locally.
// Variables already set (e.g. Docker build ENV) keep precedence.
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(path.join(repoRoot, '.env'))
  } catch {
    // no .env present (e.g. inside the Docker build) — ENV comes from outside
  }
}

const apiKey = process.env.ERECHT24_API_KEY
if (!apiKey) {
  console.warn(
    '[erecht24-snapshot] ERECHT24_API_KEY nicht gesetzt – übersprungen, committeter Stand wird gebundelt.',
  )
  process.exit(0)
}

await mkdir(outDir, { recursive: true })

for (const target of TARGETS) {
  try {
    const res = await fetch(`${API_BASE}${target.apiPath}`, {
      headers: {
        'Content-Type': 'application/json',
        'eRecht24-api-key': apiKey,
        'eRecht24-plugin-key': process.env.ERECHT24_PLUGIN_KEY || DEFAULT_PLUGIN_KEY,
      },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    const htmlDe = typeof data?.html_de === 'string' ? data.html_de.trim() : ''
    if (!htmlDe) throw new Error('leere Antwort (html_de)')
    // English is optional — only maintained if the eRecht24 project has it.
    const htmlEn = typeof data?.html_en === 'string' && data.html_en.trim() ? data.html_en.trim() : null

    const snapshot = {
      type: target.type,
      html_de: htmlDe,
      html_en: htmlEn,
      fetchedAt: new Date().toISOString(),
      source: 'erecht24-api',
    }
    const finalPath = path.join(outDir, target.file)
    const tmpPath = `${finalPath}.tmp`
    await writeFile(tmpPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8')
    await rename(tmpPath, finalPath)
    console.log(
      `[erecht24-snapshot] ✓ ${target.file} aktualisiert (de: ${htmlDe.length} Zeichen, en: ${
        htmlEn ? `${htmlEn.length} Zeichen` : 'nicht gepflegt'
      })`,
    )
  } catch (err) {
    console.warn(
      `[erecht24-snapshot] ${target.type} fehlgeschlagen – committeter Stand bleibt:`,
      err instanceof Error ? err.message : err,
    )
  }
}

process.exit(0)
