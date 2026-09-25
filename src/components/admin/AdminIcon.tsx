/* eslint-disable @next/next/no-img-element -- static brand file in the admin; next/image adds nothing here */

// Navigation icon: the favicon (outline square with tick, src/app/icon.svg). Size is
// set on the slot in custom.scss; the image only fills it.
export function AdminIcon() {
  return <img className="bm-admin-icon" src="/icon.svg" alt="Beau Marketing" width={32} height={32} />
}
