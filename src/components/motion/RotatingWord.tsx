'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/** Cycles through words in place — the kinetic signature of the hero. Decorative (aria-hidden). */
export function RotatingWord({
  words,
  interval = 2200,
  className = '',
}: {
  words: string[]
  interval?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce || words.length <= 1) return
    const id = setInterval(() => setIndex((p) => (p + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [reduce, words.length, interval])

  const widest = words.reduce((a, b) => (a.length >= b.length ? a : b), '')

  return (
    <span className={`relative inline-grid align-bottom ${className}`} aria-hidden>
      {/* invisible sizer reserves the widest word's width → no layout shift */}
      <span className="invisible [grid-area:1/1]">{widest}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          className="text-gradient-accent [grid-area:1/1]"
          initial={reduce ? false : { y: '0.45em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? undefined : { y: '-0.45em', opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
