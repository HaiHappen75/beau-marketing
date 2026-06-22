import { Apple, Android, Desktop, Globe } from '@/components/icons'

const MAP: Record<string, { label: string; Icon: typeof Apple }> = {
  ios: { label: 'iOS', Icon: Apple },
  android: { label: 'Android', Icon: Android },
  macos: { label: 'macOS', Icon: Desktop },
  web: { label: 'Web', Icon: Globe },
}

export function PlatformBadge({ platform, tone = 'light' }: { platform: string; tone?: 'light' | 'dark' }) {
  const entry = MAP[platform]
  if (!entry) return null
  const { label, Icon } = entry
  const cls =
    tone === 'dark'
      ? 'border-line-dark text-paper/80'
      : 'border-ink/15 text-ink-soft'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-medium ${cls}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}
