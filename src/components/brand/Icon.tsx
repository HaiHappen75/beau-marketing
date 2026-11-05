import type { IconName } from '@/lib/icons'

// Outline icons in the hand of the logo: square caps, mitred corners, one stroke
// weight, drawn on a 24 px grid. The frame is the outline square of the logo —
// contrast rule as everywhere: orange on white, black on off-white.

const PATHS: Record<IconName, string[]> = {
  website: ['M3 4.5h18v15H3z', 'M3 9h18', 'M6 6.75h.5', 'M8.75 6.75h.5'],
  menu: ['M6 3h12v18H6z', 'M9 8h6', 'M9 12h6', 'M9 16h3.5'],
  phone: ['M8 3h8v18H8z', 'M11 6h2', 'M11.5 17.5h1'],
  calendar: ['M4 6h16v14H4z', 'M4 10.5h16', 'M8 3.5V8', 'M16 3.5V8', 'M8 14.5h2', 'M14 14.5h2'],
  legal: ['M6 3h8.5L18 6.5V21H6z', 'M14 3v4h4', 'M9 14l2.2 2.2L15.2 12'],
  languages: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M3 12h18', 'M12 3c-3.2 3.2-3.2 14.8 0 18', 'M12 3c3.2 3.2 3.2 14.8 0 18'],
  table: ['M7 3v5.5a2 2 0 0 0 2 2V21', 'M11 3v5.5a2 2 0 0 1-2 2', 'M9 3v5', 'M16.5 21V3c-2.2 1.8-3 5-2.5 9h2.5'],
  person: ['M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M4.5 20.5c.6-3.6 3.6-5.5 7.5-5.5s6.9 1.9 7.5 5.5'],
  document: ['M6 3h8.5L18 6.5V21H6z', 'M14 3v4h4', 'M9 12h6', 'M9 16h6'],
  megaphone: ['M4 10v4h3.5l8 4.5v-13L7.5 10z', 'M18.5 9.5a3.6 3.6 0 0 1 0 5', 'M8 14.5V19h2.5'],
  controls: ['M4 7h9', 'M17 7h3', 'M15 5v4', 'M4 17h3', 'M11 17h9', 'M9 15v4'],
  clock: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7.5V12l3 2.5'],
}

export function Icon({
  name,
  surface = 'white',
  size = 52,
  className = '',
}: {
  name: IconName | null | undefined
  /** Contrast rule: the frame is orange on white, black on off-white. */
  surface?: 'white' | 'offwhite'
  size?: number
  className?: string
}) {
  const paths = name ? PATHS[name] : undefined
  if (!paths) return null
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`flex flex-none items-center justify-center border-2 ${
        surface === 'offwhite' ? 'border-ink bg-white' : 'border-accent'
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" width="58%" height="58%" fill="none" focusable="false">
        {paths.map((d) => (
          <path key={d} d={d} stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
        ))}
      </svg>
    </span>
  )
}
