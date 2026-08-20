/**
 * Wallpaper config store: the browser-side mirror of the host config,
 * transported over the /wallpaper RPC channel (config/get, config/set).
 * The rc.6 settings wire allowlist does not cover third-party namespaces,
 * so the settings-scope binder cannot reach this namespace; this store is
 * the plugin-owned equivalent with a coalescing writer.
 */
import type { ClientConnectionRpc } from '@deepseek-ai/dsh-client-connection/client'
import { RpcResult, WallpaperSettings } from './settings'

export interface WallpaperSnapshot {
  status: 'loading' | 'ready' | 'unavailable'
  value?: WallpaperSettings
}

export class WallpaperStore {
  private snapshot: WallpaperSnapshot = { status: 'loading' }
  private listeners = new Set<() => void>()
  private dirty: Partial<WallpaperSettings> | null = null
  private flushing = false

  constructor(private readonly rpc: ClientConnectionRpc) {}

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = (): WallpaperSnapshot => this.snapshot

  private publish(snapshot: WallpaperSnapshot) {
    this.snapshot = snapshot
    for (const listener of [...this.listeners]) listener()
  }

  /** Pull the host-resolved config once (plugin activation / after uploads). */
  async load(): Promise<void> {
    const result = await this.rpc.call('/wallpaper', 'config/get', {}) as RpcResult<WallpaperSettings>
    if (!result.ok) {
      this.publish({ status: 'unavailable' })
      return
    }
    this.publish({ status: 'ready', value: result.value })
  }

  /**
   * Coalescing writer: rapid slider writes merge; only the newest patch
   * re-flushes after the in-flight round-trip, so the host never races
   * itself and the UI never blocks on intermediate responses.
   */
  async set(patch: Partial<WallpaperSettings>): Promise<void> {
    this.dirty = { ...this.dirty, ...patch }
    if (this.flushing) return
    this.flushing = true
    try {
      while (this.dirty !== null) {
        const next = this.dirty
        this.dirty = null
        const result = await this.rpc.call('/wallpaper', 'config/set', { patch: next }) as RpcResult<WallpaperSettings>
        if (!result.ok) throw new Error(result.error.message)
        this.publish({ status: 'ready', value: result.value })
      }
    } finally {
      this.flushing = false
    }
  }
}
