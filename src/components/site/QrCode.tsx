import qrcode from 'qrcode-generator'

/** Quiet zone around the code, in modules (the standard asks for four). */
const QUIET = 4

/**
 * QR code as inline SVG, built on the server from the URL it leads to — no image
 * file, no external request, no client script. Width and height are fixed, so
 * nothing shifts while the page loads. Black on white whatever the section colour:
 * scanners need the contrast and the quiet zone.
 */
export function QrCode({ value, label, size = 176, className = '' }: { value: string; label: string; size?: number; className?: string }) {
  const qr = qrcode(0, 'M')
  qr.addData(value)
  qr.make()
  const count = qr.getModuleCount()
  const total = count + QUIET * 2

  // One path for all dark modules; runs of dark modules in a row become one rectangle.
  let d = ''
  for (let row = 0; row < count; row++) {
    let col = 0
    while (col < count) {
      if (!qr.isDark(row, col)) {
        col++
        continue
      }
      let run = 1
      while (col + run < count && qr.isDark(row, col + run)) run++
      d += `M${col + QUIET} ${row + QUIET}h${run}v1h-${run}z`
      col += run
    }
  }

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${total} ${total}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={`block flex-none ${className}`}
    >
      <rect width={total} height={total} fill="#ffffff" />
      <path d={d} fill="#111111" />
    </svg>
  )
}
