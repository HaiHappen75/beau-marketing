import type { ServerProps } from 'payload'

import { SeedButton } from './SeedButton'

/** Dashboard panel for the master-data seed — admins only (the endpoint checks too). */
export function SeedPanel({ user }: ServerProps) {
  if ((user as { role?: string } | undefined)?.role !== 'admin') return null
  return <SeedButton />
}
