import type { Brand } from '@/payload-types'

function firstScreenshot(brand: Brand): { url: string; alt: string } | null {
  const img = brand.screenshots?.[0]?.image
  if (img && typeof img === 'object' && img.url) {
    return { url: img.url, alt: img.alt ?? brand.name }
  }
  return null
}

/** Brand stage visual: shows the first screenshot if present, otherwise an accent-gradient placeholder. */
export function BrandVisual({ brand, className = '' }: { brand: Brand; className?: string }) {
  const from = brand.accentGradient?.from || brand.accentColor
  const to = brand.accentGradient?.to || '#00323d'
  const shot = firstScreenshot(brand)

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
          alt={shot.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
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
