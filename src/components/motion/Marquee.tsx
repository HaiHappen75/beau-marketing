/** Seamless horizontal marquee of brand names. CSS-driven; decorative (aria-hidden). */
export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  if (!items.length) return null
  const sequence = [...items, ...items]

  return (
    <div className={`marquee ${className}`} aria-hidden>
      <div className="marquee-track">
        {sequence.map((item, idx) => (
          <span key={idx} className="flex items-center whitespace-nowrap">
            <span className="px-8 font-display text-2xl font-semibold text-paper/70 sm:text-3xl">
              {item}
            </span>
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
