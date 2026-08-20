/**
 * Crop dialog: load the picked file, let the user frame the region
 * (aspect-locked to the current workspace by default), apply an optional
 * blur, and export the framed region as a compressed WebP.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { WallpaperKey } from './settings'
import styles from './WallpaperSection.module.css'

export interface CropExport {
  base64: string
  width: number
  height: number
  blur: number
}

interface CropDialogProps {
  file: File
  t: (key: WallpaperKey) => string
  onClose: () => void
  onConfirm: (payload: CropExport) => void
}

interface Rect { x: number; y: number; w: number; h: number }

/** Longest exported edge in pixels. */
const MAX_EXPORT_EDGE = 2560
/** Smallest crop box, relative to the displayed image. */
const MIN_CROP = 0.08
/** Handle hit radius in px. */
const HANDLE_HIT = 14

const HANDLES = [
  'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
] as const
type Handle = typeof HANDLES[number]

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}

/** Contain-fit rect of a (natW x natH) image inside a (stageW x stageH) box. */
function containRect(stageW: number, stageH: number, natW: number, natH: number): Rect {
  if (stageW <= 0 || stageH <= 0 || natW <= 0 || natH <= 0) return { x: 0, y: 0, w: stageW, h: stageH }
  const scale = Math.min(stageW / natW, stageH / natH)
  const w = natW * scale
  const h = natH * scale
  return { x: (stageW - w) / 2, y: (stageH - h) / 2, w, h }
}

/**
 * Initial crop: the largest rect of the target aspect that fits the image,
 * then inset so the box always has room to be dragged around. A box that
 * fills the whole image would clamp every move/resize (w === 1 leaves no
 * slack), which made the selection feel frozen.
 */
function initialCrop(natW: number, natH: number, targetAspect: number, locked: boolean): Rect {
  const imgAspect = natW / natH
  let w = 1
  let h = 1
  if (locked) {
    if (imgAspect > targetAspect) {
      h = 1
      w = targetAspect / imgAspect
    } else {
      w = 1
      h = imgAspect / targetAspect
    }
  }
  const INSET = 0.08
  w = Math.max(MIN_CROP, w * (1 - 2 * INSET))
  h = Math.max(MIN_CROP, h * (1 - 2 * INSET))
  return { x: (1 - w) / 2, y: (1 - h) / 2, w, h }
}

/**
 * Crop+scale a region of an image and encode it as WebP. When blur > 0, the
 * full image is drawn through a canvas filter first so the blur bleeds
 * naturally at the crop borders.
 */
function renderCropped(image: HTMLImageElement, natural: Rect, blur: number): Promise<Blob> {
  const scale = Math.min(1, MAX_EXPORT_EDGE / Math.max(natural.w, natural.h))
  const tw = Math.max(1, Math.round(natural.w * scale))
  const th = Math.max(1, Math.round(natural.h * scale))
  const out = document.createElement('canvas')
  out.width = tw
  out.height = th
  const ctx = out.getContext('2d')
  if (!ctx) return Promise.reject(new Error('canvas unavailable'))
  if (blur > 0) {
    const pass = document.createElement('canvas')
    pass.width = Math.max(1, Math.round(natural.w))
    pass.height = Math.max(1, Math.round(natural.h))
    const passCtx = pass.getContext('2d')
    if (!passCtx) return Promise.reject(new Error('canvas unavailable'))
    passCtx.filter = 'blur(' + blur * scale + 'px)'
    passCtx.drawImage(image, natural.x, natural.y, natural.w, natural.h, 0, 0, pass.width, pass.height)
    ctx.drawImage(pass, 0, 0, pass.width, pass.height, 0, 0, tw, th)
  } else {
    ctx.drawImage(image, natural.x, natural.y, natural.w, natural.h, 0, 0, tw, th)
  }
  return new Promise<Blob>((resolve, reject) => {
    out.toBlob((blob) => blob ? resolve(blob) : reject(new Error('webp encode failed')), 'image/webp', 0.85)
  })
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : ''
      const comma = dataUrl.indexOf(',')
      resolve(comma >= 0 ? dataUrl.slice(comma + 1) : '')
    }
    reader.onerror = () => reject(new Error('file read failed'))
    reader.readAsDataURL(blob)
  })
}

export function CropDialog(props: CropDialogProps) {
  const { file, t, onClose, onConfirm } = props
  const [blur, setBlur] = useState(0)
  const [lockAspect, setLockAspect] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null)
  const [stage, setStage] = useState({ w: 0, h: 0 })
  const [crop, setCrop] = useState<Rect | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ mode: 'move' | 'resize'; handle: Handle; startX: number; startY: number; startCrop: Rect } | null>(null)

  const objectUrl = useMemo(() => URL.createObjectURL(file), [file])
  const targetAspect = useMemo(() => {
    const ratio = window.innerWidth / Math.max(1, window.innerHeight)
    return clamp(ratio, 0.4, 3.2)
  }, [])

  useEffect(() => () => URL.revokeObjectURL(objectUrl), [objectUrl])

  // Measure the stage (and follow window resizes).
  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const measure = () => {
      const rect = node.getBoundingClientRect()
      setStage({ w: rect.width, h: rect.height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Initialize the crop box once the image and the stage are known.
  useEffect(() => {
    if (nat === null || stage.w <= 0 || stage.h <= 0 || crop !== null) return
    setCrop(initialCrop(nat.w, nat.h, targetAspect, lockAspect))
  }, [nat, stage, crop, lockAspect, targetAspect])

  const disp = nat === null ? null : containRect(stage.w, stage.h, nat.w, nat.h)

  const onStagePointerDown = (event: React.PointerEvent) => {
    if (crop === null || disp === null || nat === null) return
    const node = stageRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const px = event.clientX - rect.left - disp.x
    const py = event.clientY - rect.top - disp.y
    const box = { x: crop.x * disp.w, y: crop.y * disp.h, w: crop.w * disp.w, h: crop.h * disp.h }
    // Handle points are stored relative to the box's top-left corner, so
    // offset them by the box origin before comparing with px/py (which are
    // relative to the displayed image's top-left).
    const handle = HANDLES.find((id) => {
      const hp = handlePoint(id, box)
      return Math.abs(px - (box.x + hp.x)) <= HANDLE_HIT && Math.abs(py - (box.y + hp.y)) <= HANDLE_HIT
    })
    if (handle !== undefined) {
      dragRef.current = { mode: 'resize', handle, startX: event.clientX, startY: event.clientY, startCrop: { ...crop } }
      event.preventDefault()
      node.setPointerCapture(event.pointerId)
      return
    }
    // The handles protrude half outside the box, so accept a small margin
    // around the box bounds for the move test.
    if (px >= box.x - HANDLE_HIT && px <= box.x + box.w + HANDLE_HIT && py >= box.y - HANDLE_HIT && py <= box.y + box.h + HANDLE_HIT) {
      dragRef.current = { mode: 'move', handle: 'se', startX: event.clientX, startY: event.clientY, startCrop: { ...crop } }
      event.preventDefault()
      node.setPointerCapture(event.pointerId)
    }
  }

  const onStagePointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag || crop === null || disp === null) return
    const dx = (event.clientX - drag.startX) / Math.max(1, disp.w)
    const dy = (event.clientY - drag.startY) / Math.max(1, disp.h)
    // Crop coordinates are relative to the displayed box, whose pixel aspect
    // equals the image's — convert the workspace aspect into box-relative
    // units so the rendered and exported crops keep the true ratio.
    const boxAspect = targetAspect * disp.h / Math.max(1, disp.w)
    const next = resizeCrop(drag.startCrop, drag.mode, drag.handle, dx, dy, lockAspect ? boxAspect : null)
    setCrop(next)
    event.preventDefault()
  }

  const endDrag = (event: React.PointerEvent) => {
    const node = stageRef.current
    if (node && node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId)
    dragRef.current = null
  }

  const handleConfirm = useCallback(async () => {
    if (crop === null || nat === null || busy) return
    setBusy(true)
    setError(null)
    try {
      const img = new Image()
      img.src = objectUrl
      await img.decode()
      const natural = {
        x: crop.x * nat.w,
        y: crop.y * nat.h,
        w: crop.w * nat.w,
        h: crop.h * nat.h
      }
      const blob = await renderCropped(img, natural, blur)
      const base64 = await blobToBase64(blob)
      const scale = Math.min(1, MAX_EXPORT_EDGE / Math.max(natural.w, natural.h))
      onConfirm({ base64, width: Math.max(1, Math.round(natural.w * scale)), height: Math.max(1, Math.round(natural.h * scale)), blur })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setBusy(false)
    }
  }, [crop, nat, objectUrl, blur, busy, onConfirm])

  const dialog = (
    <div className={styles.backdrop} onPointerDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className={styles.cropDialog}>
        <div className={styles.cropTitle}>{t('cropTitle')}</div>
        <div className={styles.cropStageWrap} ref={stageRef}
          onPointerDown={onStagePointerDown}
          onPointerMove={onStagePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}>
          <img className={styles.cropStageImg} src={objectUrl} alt='' draggable={false}
            onLoad={(event) => setNat({ w: event.currentTarget.naturalWidth, h: event.currentTarget.naturalHeight })}
            onError={() => setError(t('invalidImage'))}
            style={disp === null ? { visibility: 'hidden' } : { left: disp.x, top: disp.y, width: disp.w, height: disp.h }} />
          {crop !== null && disp !== null && (
            <div className={styles.cropBox}
              style={{ left: disp.x + crop.x * disp.w, top: disp.y + crop.y * disp.h, width: crop.w * disp.w, height: crop.h * disp.h }}>
              {HANDLES.map((id) => (
                <div key={id} className={styles.cropHandle + ' ' + styles['cropHandle' + id.toUpperCase()]} />
              ))}
            </div>
          )}
        </div>
        <div className={styles.cropControls}>
          <label className={styles.controlLabel}>{t('cropBlur')}<span className={styles.controlValue}>{Math.round(blur)}px</span></label>
          <input className={styles.range} type='range' min={0} max={20} step={1} value={blur} onChange={(event) => setBlur(Number(event.target.value))} />
        </div>
        <label className={styles.checkRow}>
          <input type='checkbox' checked={lockAspect} onChange={(event) => setLockAspect(event.target.checked)} />
          <span>{t('lockAspect')}</span>
        </label>
        <div className={styles.cropHint}>{t('cropHint')}</div>
        {error !== null && <div className={styles.error}>{error}</div>}
        <div className={styles.footer}>
          <button type='button' className={styles.ghostBtn} onClick={onClose}>{t('cropCancel')}</button>
          <button type='button' className={styles.primaryBtn} disabled={busy || crop === null} onClick={() => void handleConfirm()}>
            {busy ? t('applying') : t('cropApply')}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(dialog, document.body)
}

/** Corner/edge position of one handle inside a px-sized box. */
function handlePoint(id: Handle, box: Rect): { x: number; y: number } {
  const right = id.includes('e')
  const bottom = id.includes('s')
  const mid = !right && !id.includes('w')
  const midY = !bottom && !id.includes('n')
  return {
    x: right ? box.w : mid ? box.w / 2 : 0,
    y: bottom ? box.h : midY ? box.h / 2 : 0
  }
}

/**
 * Apply a move or resize delta to a crop rect. Relative coordinates; the
 * aspect argument locks resizing to a w/h ratio.
 *
 * Resizes are anchored on the corner/edge OPPOSITE the dragged handle: the
 * pointer tracks the moving corner (corners) or the moving edge (edges),
 * the fixed side never moves, and the result is clamped into [0, 1] with a
 * minimum size. Edge handles with an aspect lock resize the perpendicular
 * dimension and derive the parallel one, centered on the opposite edge.
 */
function resizeCrop(start: Rect, mode: 'move' | 'resize', handle: Handle, dx: number, dy: number, aspect: number | null): Rect {
  if (mode === 'move') {
    return {
      x: clamp(start.x + dx, 0, 1 - start.w),
      y: clamp(start.y + dy, 0, 1 - start.h),
      w: start.w,
      h: start.h
    }
  }

  const left = handle.includes('w')
  const right = handle.includes('e')
  const top = handle.includes('n')
  const bottom = handle.includes('s')

  // Corner handles: the opposite corner stays fixed.
  if ((left || right) && (top || bottom)) {
    const fx = right ? start.x : start.x + start.w
    const fy = bottom ? start.y : start.y + start.h
    const mx = start.x + (right ? start.w : 0) + dx
    const my = start.y + (bottom ? start.h : 0) + dy
    let w = clamp(right ? mx - fx : fx - mx, MIN_CROP, 1)
    let h = clamp(bottom ? my - fy : fy - my, MIN_CROP, 1)
    if (aspect !== null) {
      h = w / aspect
      const hMax = top ? fy : 1 - fy
      if (h > hMax) {
        h = hMax
        w = h * aspect
      }
      if (h < MIN_CROP) {
        h = MIN_CROP
        w = h * aspect
      }
    }
    const x = right ? fx : fx - w
    const y = bottom ? fy : fy - h
    return { x: clamp(x, 0, 1 - w), y: clamp(y, 0, 1 - h), w, h }
  }

  // Edge handles.
  if (top || bottom) {
    const fy = bottom ? start.y : start.y + start.h
    let h = clamp(bottom ? start.h + dy : start.h - dy, MIN_CROP, 1)
    const cx = start.x + start.w / 2
    let w = aspect !== null ? h * aspect : start.w
    w = clamp(w, MIN_CROP, Math.min(2 * cx, 2 * (1 - cx), 1))
    if (aspect !== null) h = w / aspect
    const y = bottom ? start.y : fy - h
    return { x: clamp(cx - w / 2, 0, 1 - w), y: clamp(y, 0, 1 - h), w, h }
  }

  const fx = right ? start.x : start.x + start.w
  let w = clamp(right ? start.w + dx : start.w - dx, MIN_CROP, 1)
  const cy = start.y + start.h / 2
  let h = aspect !== null ? w / aspect : start.h
  h = clamp(h, MIN_CROP, Math.min(2 * cy, 2 * (1 - cy), 1))
  if (aspect !== null) w = h * aspect
  const x = right ? start.x : fx - w
  return { x: clamp(x, 0, 1 - w), y: clamp(cy - h / 2, 0, 1 - h), w, h }
}
