import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  )
}

export function ChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function Menu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

export function Close(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function Globe(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.4 2.5 15.6 0 18M12 3c-2.5 2.4-2.5 15.6 0 18" />
    </svg>
  )
}

export function Check(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4 12 5 5L20 6" />
    </svg>
  )
}

export function Apple(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16 13c0 3 2 4 2 4-1 2-2 3-3.5 3-1.2 0-1.7-.7-3-.7s-1.9.7-3 .7C5 20 3 16 3 12.5 3 9 5 7 7 7c1.3 0 2.2.8 3 .8.7 0 2-1 3.4-.8 1.4.1 2.4.8 3 1.9-2.6 1.6-2.4 4.5-.4 4.1Z" />
      <path d="M13 5c.6-1 .5-2 .4-2.5-1 .1-2 .7-2.5 1.4-.5.6-.7 1.5-.6 2.4 1 .1 1.9-.4 2.7-1.3Z" />
    </svg>
  )
}

export function Android(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 14a6 6 0 0 1 12 0M6 14h12v5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zM8.5 8 7 6M15.5 8 17 6" />
      <path d="M9.5 11h.01M14.5 11h.01" />
    </svg>
  )
}

export function Desktop(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
    </svg>
  )
}

export function GlobeSimple(props: IconProps) {
  return Globe(props)
}
