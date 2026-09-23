/**
 * Master-data seed, CLI entry: pnpm seed
 * Fill-only and idempotent — safe to run any number of times.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { formatSummary, runSeed } from './index'

// Top-level await: `payload run` only waits for the module itself — a
// fire-and-forget main() would be cut off before the seed finishes.
const payload = await getPayload({ config })
const summary = await runSeed(payload)
console.log(formatSummary(summary))
if (process.env.SEED_JSON) console.log(JSON.stringify(summary, null, 2))
process.exit(0)
