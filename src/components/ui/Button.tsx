import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from '@/components/icons'

type Variant = 'primary' | 'outline' | 'ghost'
type Tone = 'light' | 'dark'

type Props = {
  href: string
  children: ReactNode
  variant?: Variant
  tone?: Tone
  external?: boolean
  withArrow?: boolean
  className?: string
}

function classesFor(variant: Variant, tone: Tone): string {
  const pill =
    'group inline-flex items-center gap-2 rounded-pill px-6 py-3 text-[0.95rem] font-medium transition-all duration-200'
  if (variant === 'primary') {
    return `${pill} bg-accent text-white shadow-[0_10px_30px_-12px_rgba(242,135,4,0.7)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-14px_rgba(242,135,4,0.85)]`
  }
  if (variant === 'outline') {
    return tone === 'dark'
      ? `${pill} border border-line-dark text-paper hover:bg-white/10`
      : `${pill} border border-ink/20 text-ink hover:bg-ink/[0.04]`
  }
  // ghost — text link with sweep underline + arrow
  const ghostColor = tone === 'dark' ? 'text-paper' : 'text-ink'
  return `group inline-flex items-center gap-1.5 text-[0.95rem] font-medium ${ghostColor} link-sweep`
}

export function Button({
  href,
  children,
  variant = 'primary',
  tone = 'light',
  external = false,
  withArrow = false,
  className = '',
}: Props) {
  const cls = `${classesFor(variant, tone)} ${className}`
  const arrow = withArrow ? (
    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  ) : null

  const isProtocol = href.startsWith('mailto:') || href.startsWith('tel:')
  if (external || isProtocol) {
    const blankProps = isProtocol ? {} : { target: '_blank', rel: 'noopener noreferrer' }
    return (
      <a href={href} {...blankProps} className={cls}>
        {children}
        {arrow}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {arrow}
    </Link>
  )
}
