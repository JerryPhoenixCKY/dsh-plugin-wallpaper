/** Shared wall-facing constants and wire types (browser half). */

export const WALLPAPER_NS = 'wallpaper'

/** Dictionary keys of the wallpaper namespace (single source of truth). */
export type WallpaperKey =
  | 'nav' | 'hint' | 'previewEmpty' | 'uploadButton' | 'replaceButton' | 'removeButton'
  | 'enabledLabel' | 'fitLabel' | 'fitCover' | 'fitContain' | 'fitCenter' | 'fitStretch'
  | 'panelLabel' | 'overlayLabel' | 'cropTitle' | 'cropHint' | 'cropBlur' | 'lockAspect'
  | 'cropApply' | 'cropCancel' | 'applying' | 'loading' | 'unavailable'
  | 'remoteWarning' | 'tooLarge' | 'invalidImage'

export type WallpaperFit = 'cover' | 'contain' | 'center' | 'stretch'

/** Resolved settings section the host resolves from the namespace schema. */
export interface WallpaperSettings {
  enabled: boolean
  fit: WallpaperFit
  overlayOpacity: number
  panelOpacity: number
  revision: number
  imageWidth: number
  imageHeight: number
}

/** Structural mirror of the host RpcResult envelope. */
export type RpcResult<T> = { ok: true; value: T } | { ok: false; error: { code: string; message: string; details: Record<string, unknown> } }

/** Cache-busted URL of the stored wallpaper. */
export function imageUrl(revision: number): string {
  return '/plugins/wallpaper/image?v=' + revision
}

/** Payload of a successful wallpaper/put. */
export interface PutResult {
  revision: number
  width: number
  height: number
}
