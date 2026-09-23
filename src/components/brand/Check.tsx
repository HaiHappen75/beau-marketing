'use client'

import { useEffect, useRef, useState } from 'react'

type Surface = 'white' | 'offwhite' | 'dark'

type Props = {
  size?: number
  /** true/false = fixed state; undefined = ticks itself when scrolled into view. */
  checked?: boolean
  /** Contrast rule: orange outline on white or black, black outline on off-white. */
  surface?: Surface
  /** Stagger index — each item ticks 110 ms after the previous one. */
  index?: number
  className?: string
}

/**
 * The outline square from the logo as a checkbox: "done, simply made".
 * Ticks on scroll (480 ms, staggered). With reduced motion it is ticked at once —
 * handled in CSS (.bm-check), so it needs no JS and cannot flash.
 */
export function Check({ size = 22, checked, surface = 'white', index = 0, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (checked !== undefined) return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      const t = setTimeout(() => setSeen(true), 0)
      return () => clearTimeout(t)
    }
    let timer: number | undefined
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          timer = window.setTimeout(() => setSeen(true), 150 + index * 110)
          io.disconnect()
        }
      },
      { threshold: 1, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [checked, index])

  const on = checked ?? seen
  const frame = surface === 'offwhite' ? 'var(--color-ink)' : 'var(--color-accent)'
  const tick = surface === 'dark' ? 'var(--color-white)' : 'var(--color-ink)'

  return (
    <span
      ref={ref}
      className={`bm-check ${className}`}
      data-checked={on ? 'true' : 'false'}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" focusable="false">
        <rect x="2" y="2" width="20" height="20" fill="none" stroke={frame} strokeWidth="2.4" />
        <path
          className="bm-check__tick"
          d="M6 11.5l4.5 4.5L22.5 2.5"
          fill="none"
          stroke={tick}
          strokeWidth="2.8"
          strokeLinecap="square"
        />
      </svg>
    </span>
  )
}
