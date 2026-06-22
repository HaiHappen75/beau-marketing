import { Link } from '@/i18n/navigation'

/**
 * Brand wordmark — theme-aware (adapts to dark/light header).
 * To use the client's own logo, drop it at public/brand/logo.svg and swap this for an <img>.
 */
export function Logo({
  tone = 'light',
  className = '',
}: {
  tone?: 'light' | 'dark'
  className?: string
}) {
  const text = tone === 'light' ? 'text-paper' : 'text-ink'
  const muted = tone === 'light' ? 'text-paper/55' : 'text-ink/45'
  return (
    <Link
      href="/"
      aria-label="Beau-Marketing — Startseite"
      className={`group inline-flex items-baseline font-display text-[1.45rem] font-extrabold tracking-tight ${text} ${className}`}
    >
      <span>beau</span>
      <span className="text-accent">.</span>
      <span
        className={`ml-1 hidden text-[0.7rem] font-semibold uppercase tracking-[0.2em] sm:inline ${muted}`}
      >
        marketing
      </span>
    </Link>
  )
}
