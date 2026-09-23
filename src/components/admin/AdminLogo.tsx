/* eslint-disable @next/next/no-img-element -- static brand file in the admin; next/image adds nothing here */

// Login screen logo. Payload always sets data-theme on <html>, so both versions
// render and CSS hides the wrong one — no JS, no hydration flash (custom.scss).
export function AdminLogo() {
  return (
    <span className="bm-admin-logo">
      <img
        className="bm-admin-logo__light"
        src="/brand/beau-marketing-logo.png"
        alt="beau marketing – success simplified"
        width={1200}
        height={358}
      />
      <img
        className="bm-admin-logo__dark"
        src="/brand/beau-marketing-logo-invers.png"
        alt="beau marketing – success simplified"
        width={1200}
        height={358}
      />
    </span>
  )
}
