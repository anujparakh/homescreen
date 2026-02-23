// Dark-mode color system: hue is freely chosen; saturation and lightness are
// fixed so all generated colors are rich but suitably dark for a homescreen.
const S = 0.65
const L = 0.18

/** Convert any hex color to its closest hue (0–360). */
export function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  if (d === 0) return 0

  let h = 0
  if (max === r) h = ((g - b) / d + 6) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4

  return Math.round(h * 60)
}

/** Convert a hue (0–360) to a dark-mode hex color. */
export function hueToHex(hue: number): string {
  const c = (1 - Math.abs(2 * L - 1)) * S
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = L - c / 2

  let r = 0, g = 0, b = 0
  if (hue < 60)       { r = c; g = x }
  else if (hue < 120) { r = x; g = c }
  else if (hue < 180) { g = c; b = x }
  else if (hue < 240) { g = x; b = c }
  else if (hue < 300) { r = x; b = c }
  else                { r = c; b = x }

  const toHex = (n: number) =>
    Math.round((n + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
