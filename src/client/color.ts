/** CSS color helpers for the panel-translucency overlay. */

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}

/**
 * Parse a CSS color into [r, g, b, a] (0-255 channels, 0-1 alpha).
 * Supports rgb()/rgba() and 3/4/6/8-digit hex; returns null otherwise.
 */
export function parseColor(color: string): [number, number, number, number] | null {
  const c = color.trim()
  let m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(c)
  if (m) {
    return [clamp(Number(m[1]), 0, 255), clamp(Number(m[2]), 0, 255), clamp(Number(m[3]), 0, 255), m[4] === undefined ? 1 : clamp(Number(m[4]), 0, 1)]
  }
  m = /^#([0-9a-f]{3,8})$/i.exec(c)
  if (m) {
    const hex = m[1]
    const full = hex.length === 3 || hex.length === 4
      ? hex.split('').map((d) => d + d).join('')
      : hex
    const r = parseInt(full.slice(0, 2), 16)
    const g = parseInt(full.slice(2, 4), 16)
    const b = parseInt(full.slice(4, 6), 16)
    const a = full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1
    return [r, g, b, a]
  }
  return null
}

/**
 * Return the color at the given alpha (multiplied onto the parsed alpha).
 * Falls back to color-mix() for colors this parser does not understand.
 */
export function withAlpha(color: string, alpha: number): string {
  const parsed = parseColor(color)
  if (parsed) {
    return 'rgba(' + Math.round(parsed[0]) + ', ' + Math.round(parsed[1]) + ', ' + Math.round(parsed[2]) + ', ' + (Math.round(clamp(alpha, 0, 1) * 1000) / 1000) + ')'
  }
  return 'color-mix(in srgb, ' + color + ' ' + Math.round(clamp(alpha, 0, 1) * 100) + '%, transparent)'
}
