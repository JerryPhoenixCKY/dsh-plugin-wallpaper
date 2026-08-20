/**
 * The Wallpaper settings section: preview, upload (opens CropDialog),
 * display controls, and removal. All durable fields ride the settings
 * scope; the image bytes ride the /wallpaper RPC channel.
 */
import { useRef, useState, useSyncExternalStore } from 'react'
import type { ClientConnectionRpc } from '@deepseek-ai/dsh-client-connection/client'
import { CropDialog, CropExport } from './CropDialog'
import { imageUrl, PutResult, RpcResult, WallpaperFit, WallpaperKey } from './settings'
import { WallpaperSnapshot, WallpaperStore } from './store'
import styles from './WallpaperSection.module.css'

export interface WallpaperSectionInjected {
  store: WallpaperStore
  rpc: ClientConnectionRpc
  isLoopback: boolean
  t: (key: WallpaperKey) => string
}

interface WallpaperSectionProps extends WallpaperSectionInjected {
  close: () => void
}

const FIT_OPTIONS: WallpaperFit[] = ['cover', 'contain', 'center', 'stretch']

const FIT_KEYS: Record<WallpaperFit, WallpaperKey> = {
  cover: 'fitCover',
  contain: 'fitContain',
  center: 'fitCenter',
  stretch: 'fitStretch'
}

function useStore(store: WallpaperStore): WallpaperSnapshot {
  return useSyncExternalStore(store.subscribe, store.getSnapshot)
}

export function WallpaperSection(props: WallpaperSectionProps) {
  const { store, rpc, isLoopback, t } = props
  const snapshot = useStore(store)
  const settings = snapshot.value
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadable = isLoopback

  const pickFile = (file: File | null) => {
    if (file === null) return
    if (!uploadable) {
      setError(t('remoteWarning'))
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError(t('tooLarge'))
      return
    }
    setError(null)
    setCropFile(file)
  }

  const handleConfirm = async (payload: CropExport) => {
    setCropFile(null)
    setBusy(true)
    setError(null)
    try {
      const result = await rpc.call('/wallpaper', 'put', {
        data: payload.base64,
        width: payload.width,
        height: payload.height
      }) as RpcResult<PutResult>
      if (!result.ok) throw new Error(result.error.message)
      // The host already synced the config; re-pull the authoritative state.
      await store.load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const handleRemove = async () => {
    setBusy(true)
    setError(null)
    try {
      const result = await rpc.call('/wallpaper', 'remove', {}) as RpcResult<{ removed: boolean }>
      if (!result.ok) throw new Error(result.error.message)
      await store.load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  if (snapshot.status === 'loading') {
    return <div className={styles.hint}>{t('loading')}</div>
  }
  if (snapshot.status === 'unavailable' || settings === undefined) {
    return <div className={styles.hint}>{t('unavailable')}</div>
  }

  const hasImage = settings.revision > 0

  return (
    <div className={styles.section}>
      <div className={styles.hint}>{t('hint')}</div>

      <div className={styles.previewBox}>
        {hasImage ? <img className={styles.previewImg} src={imageUrl(settings.revision)} alt='' /> : <span className={styles.previewEmpty}>{t('previewEmpty')}</span>}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className={styles.hiddenInput}
        onChange={(event) => {
          pickFile(event.target.files?.[0] ?? null)
          event.target.value = ''
        }} />

      <div className={styles.actions}>
        <button type='button' className={styles.primaryBtn} disabled={!uploadable || busy} onClick={() => fileInputRef.current?.click()}>
          {hasImage ? t('replaceButton') : t('uploadButton')}
        </button>
        <button type='button' className={styles.dangerBtn} disabled={!uploadable || busy || !hasImage} onClick={() => void handleRemove()}>
          {t('removeButton')}
        </button>
      </div>

      <label className={styles.checkRow}>
        <input type='checkbox' checked={settings.enabled} onChange={(event) => void store.set({ enabled: event.target.checked })} />
        <span>{t('enabledLabel')}</span>
      </label>

      <div className={styles.row}>
        <span className={styles.controlLabel}>{t('fitLabel')}</span>
        <select className={styles.select} value={settings.fit} onChange={(event) => void store.set({ fit: event.target.value as WallpaperFit })}>
          {FIT_OPTIONS.map((fit) => (
            <option key={fit} value={fit}>{t(FIT_KEYS[fit])}</option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <span className={styles.controlLabel}>{t('panelLabel')}</span>
        <input className={styles.range} type='range' min={0} max={100} value={Math.round(settings.panelOpacity * 100)}
          onChange={(event) => void store.set({ panelOpacity: Number(event.target.value) / 100 })} />
        <span className={styles.controlValue}>{Math.round(settings.panelOpacity * 100)}%</span>
      </div>

      <div className={styles.row}>
        <span className={styles.controlLabel}>{t('overlayLabel')}</span>
        <input className={styles.range} type='range' min={0} max={100} value={Math.round(settings.overlayOpacity * 100)}
          onChange={(event) => void store.set({ overlayOpacity: Number(event.target.value) / 100 })} />
        <span className={styles.controlValue}>{Math.round(settings.overlayOpacity * 100)}%</span>
      </div>

      {!isLoopback && <div className={styles.warning}>{t('remoteWarning')}</div>}
      {error !== null && <div className={styles.error}>{error}</div>}
      {busy && <div className={styles.hint}>{t('applying')}</div>}

      {cropFile !== null && (
        <CropDialog file={cropFile} t={t}
          onClose={() => setCropFile(null)}
          onConfirm={(payload) => void handleConfirm(payload)} />
      )}
    </div>
  )
}
