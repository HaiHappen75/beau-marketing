import type { Brand } from '@/payload-types'

/** Narrow an upload field (id | Media) to a usable image. */
function asImage(v: unknown): { url: string; alt: string } | null {
  if (v && typeof v === 'object' && 'url' in v) {
    const m = v as { url?: string | null; alt?: string | null }
    if (m.url) return { url: m.url, alt: m.alt ?? '' }
  }
  return null
}

/**
 * Brand stage visual. Priority: first screenshot → uploaded logo → accent-gradient
 * placeholder with the brand initial.
 */
export function BrandVisual({ brand, className = '' }: { brand: Brand; className?: string }) {
  const from = brand.accentGradient?.from || brand.accentColor
  const to = brand.accentGradient?.to || '#00323d'
  const shot = asImage(brand.screenshots?.[0]?.image)
  const logo = asImage(brand.logo)

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-card ${className}`}
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 80% at 80% 0%, rgba(255,255,255,0.22), transparent 60%)' }}
      />
      {shot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={shot.url}
          alt={shot.alt || brand.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : logo ? (
        <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-10">
          <div className="flex items-center justify-center rounded-2xl bg-white/92 px-8 py-7 shadow-xl shadow-black/10 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.url}
              alt={logo.alt || `${brand.name} Logo`}
              loading="lazy"
              className="max-h-20 w-auto max-w-[60%] object-contain sm:max-w-[220px]"
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-white">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/15 font-display text-4xl font-extrabold backdrop-blur-sm">
            {brand.name.charAt(0)}
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">{brand.name}</span>
        </div>
      )}
    </div>
  )
}
