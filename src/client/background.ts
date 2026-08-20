/**
 * Background applier: projects the wallpaper settings onto the document.
 *
 * The theme presenter writes the --dsw-* palette tokens as inline styles on
 * <body> and the base stylesheets carry both palettes; the built-in light/
 * dark themes expose EMPTY token maps in the theme snapshot, so original
 * token values are read from computed styles (never from the snapshot).
 * To keep reads unpolluted, our override style is cleared for the read and
 * rewritten afterwards — all within one synchronous task, so nothing
 * flickers.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import { imageUrl, WallpaperSettings } from './settings'
import { WallpaperStore } from './store'
import { withAlpha } from './color'

/** Panel surface tokens made translucent so the wallpaper shows through. */
const PANEL_VARS = [
  '--dsw-alias-bg-base',
  '--dsw-alias-bg-layer-1',
  '--dsw-alias-bg-layer-2',
  '--dsw-specific-sidebar-fill',
  '--dsw-alias-bg-module-platform'
]

const BG_TAG = 'dsh-plugin-wallpaper:background'

function bgSize(fit: WallpaperSettings['fit']): string {
  if (fit === 'stretch') return '100% 100%'
  if (fit === 'center') return 'auto'
  return fit
}

/**
 * Attach the reactive background to the document.
 * @returns disposer removing the style element and all subscriptions.
 */
export function attachBackground(ctx: ClientContext, store: WallpaperStore): () => void {
  let disposed = false

  const style = (() => {
    const found = document.querySelector('style[data-plugin-css="' + BG_TAG + '"]')
    if (found instanceof HTMLStyleElement) return found
    const tag = document.createElement('style')
    tag.dataset.plugin = 'dsh-plugin-wallpaper'
    tag.dataset.pluginCss = BG_TAG
    document.head.appendChild(tag)
    return tag
  })()

  /** Read the theme-owned originals; our own override is retracted first. */
  const readOriginals = (): Record<string, string> => {
    style.textContent = ''
    const originals: Record<string, string> = {}
    for (const name of PANEL_VARS) {
      const value = getComputedStyle(document.body).getPropertyValue(name).trim()
      if (value !== '') originals[name] = value
    }
    return originals
  }

  const paint = () => {
    if (disposed) return
    const snapshot = store.getSnapshot()
    const settings = snapshot.value
    const active = snapshot.status === 'ready' && settings !== undefined && settings.enabled && settings.revision > 0
    if (!active) {
      style.textContent = ''
      return
    }

    const originals = readOriginals()
    const theme = ctx.theme.getTheme()
    const scheme = theme.active?.colorScheme === 'dark' ? 'dark' : 'light'
    const scrim = scheme === 'dark' ? '0, 0, 0' : '255, 255, 255'

    const lines: string[] = ['body {']
    for (const name of PANEL_VARS) {
      const original = originals[name]
      if (original === undefined) continue
      lines.push('  ' + name + ': ' + withAlpha(original, settings.panelOpacity) + ' !important;')
    }

    // Keep the letterbox areas (contain/center) in the theme base color.
    const base = originals['--dsw-alias-bg-base']
    if (base !== undefined) lines.push('  background-color: ' + base + ' !important;')

    lines.push('  background-image: linear-gradient(rgba(' + scrim + ', ' + settings.overlayOpacity + '), rgba(' + scrim + ', ' + settings.overlayOpacity + ')), url("' + imageUrl(settings.revision) + '") !important;')
    lines.push('  background-size: ' + bgSize(settings.fit) + ' !important;')
    lines.push('  background-position: center !important;')
    lines.push('  background-repeat: no-repeat !important;')
    lines.push('  background-attachment: fixed !important;')
    lines.push('}')
    style.textContent = lines.join('\n')
  }

  const unsubscribe = store.subscribe(() => {
    if (!disposed) paint()
  })
  const offTheme = ctx.on('theme/change', () => {
    // Defer past the presenter's synchronous inline-style writes.
    if (!disposed) requestAnimationFrame(() => paint())
  })

  paint()

  return () => {
    disposed = true
    unsubscribe()
    offTheme()
    style.textContent = ''
    style.remove()
  }
}
