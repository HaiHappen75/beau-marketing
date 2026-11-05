import { Check } from '@/components/brand/Check'

type Step = { id?: string | null; title?: string | null; text?: string | null }

/**
 * Numbered steps side by side (design: Leistungsseite, "Ablauf") — shared by the
 * service pages and the points block. `label` builds "Schritt 1" in the page's language.
 */
export function Steps({
  items,
  label,
  surface = 'white',
}: {
  items: Step[]
  label: (n: number) => string
  surface?: 'white' | 'offwhite'
}) {
  return (
    <ol className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-x-6 gap-y-8">
      {items.map((s, i) => (
        <li key={s.id ?? s.title ?? i} className="border-t-2 border-ink pt-5">
          <p className="flex items-center gap-2.5 text-sm font-extrabold text-muted">
            <Check size={26} index={i} surface={surface} />
            {label(i + 1)}
          </p>
          <h3 className="mt-3.5 text-[21px] font-extrabold">{s.title}</h3>
          {s.text && <p className="mt-1.5 text-[17px]">{s.text}</p>}
        </li>
      ))}
    </ol>
  )
}
