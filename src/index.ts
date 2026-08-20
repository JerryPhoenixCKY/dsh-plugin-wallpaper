/**
 * dsh-plugin-wallpaper — host half.
 *
 * Provides, for the Web profile composition:
 *  - a user-settings namespace 'wallpaper' (schema + live apply; the
 *    namespace itself is not exposed on the settings wire API — the
 *    rc.6 allowlist covers only built-in namespaces — so the browser
 *    reads and writes it through this channel's config/get and
 *    config/set endpoints),
 *  - the /wallpaper generic-RPC channel (loopback-only):
 *    config/get, config/set, put, remove, info,
 *  - the GET /plugins/wallpaper/image route serving the stored WebP with
 *    revision-based cache busting (?v=<revision>).
 *
 * Storage layout ($DSH_HOME/storages/wallpaper):
 *   wallpaper.webp   the last uploaded (client-cropped) image
 *   wallpaper.json   { revision, width, height, updatedAt }
 *
 * The revision is server-authoritative and monotonic: the client stores
 * the revision returned by put in the settings namespace, and the image
 * route serves only the revision recorded in wallpaper.json, so a stale
 * URL or a half-written upload can never show a mismatched image.
 */
import { createReadStream, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'

// Type-only imports keep the Context service augmentations active:
//   ctx.settings  (@deepseek-ai/dsh-settings)
//   ctx.webServer (@deepseek-ai/dsh-host-webserver)
//   ctx.connection (@deepseek-ai/dsh-client-connection, host half)
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings'
import type { ConnectionRpcHandler } from '@deepseek-ai/dsh-client-connection'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type {} from '@deepseek-ai/dsh-client-connection'

export const name = 'wallpaper'

/** Settings namespace key (lowercase kebab-case). */
const NS = 'wallpaper' as SettingsNamespace

/** User-editable settings section, persisted in the Host settings document. */
const WallpaperSchema = z.object({
  /** Master switch; the browser half applies nothing while false. */
  enabled: z.boolean().default(true),
  /** How the image fills the workspace. */
  fit: z.union(['cover', 'contain', 'center', 'stretch']).default('cover'),
  /** Dimming scrim drawn over the wallpaper (0 = none, 1 = black). */
  overlayOpacity: z.percent().default(0.12),
  /** Opacity of the app panels (1 = opaque, 0 = fully transparent). */
  panelOpacity: z.percent().default(0.94),
  /** Server-side image revision; 0 = no wallpaper stored. */
  revision: z.natural().default(0),
  /** Dimensions of the stored image (for the settings surface). */
  imageWidth: z.natural().default(0),
  imageHeight: z.natural().default(0)
})

/** File metadata next to the stored image. */
interface WallpaperMeta {
  revision: number
  width: number
  height: number
  updatedAt: string
}

const MAX_PAYLOAD_CHARS = 10_000_000 // ~7.5 MB of binary as base64
const MAX_IMAGE_BYTES = 8_000_000

/** Result shape the connection RPC transport expects (its own RpcResult copy). */
type HandlerResult = Awaited<ReturnType<ConnectionRpcHandler>>

function ok<T>(value: T): HandlerResult {
  return { ok: true, value }
}

function failBadRequest(message: string): HandlerResult {
  return { ok: false, error: { code: 'bad-request', message, details: { issues: [] } } }
}

function failInternal(message: string): HandlerResult {
  return { ok: false, error: { code: 'internal', message, details: {} } }
}

/** Resolve $DSH_HOME the same way the harness does; default ~/.dsh. */
function dataDir(): string {
  const env = process.env.DSH_HOME?.trim()
  const home = env ? resolve(env) : join(homedir(), '.dsh')
  return join(home, 'storages', 'wallpaper')
}

/** True when the buffer starts with RIFF....WEBP. */
function isWebp(buffer: Buffer): boolean {
  return buffer.length >= 12
    && buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46
    && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
}

export function apply(ctx: Context) {
  const dir = dataDir()
  const filePath = join(dir, 'wallpaper.webp')
  const metaPath = join(dir, 'wallpaper.json')
  mkdirSync(dir, { recursive: true })

  const readMeta = (): WallpaperMeta | null => {
    try {
      const raw = JSON.parse(readFileSync(metaPath, 'utf8')) as Partial<WallpaperMeta>
      if (typeof raw.revision !== 'number' || !Number.isInteger(raw.revision)) return null
      return raw as WallpaperMeta
    } catch {
      return null
    }
  }

  // ── settings namespace ─────────────────────────────────────────────
  // Registered for schema validation, defaults, and persistence in the
  // user settings document. The rc.6 settings WIRE allowlist does not
  // cover third-party namespaces, so the browser half reads and writes
  // it through the /wallpaper channel below.
  const scope = ctx.settings.register(NS, WallpaperSchema, { applies: 'live' })

  /** Fields the browser may change through config/set. */
  const CONFIG_FIELDS = ['enabled', 'fit', 'overlayOpacity', 'panelOpacity']

  // ── /wallpaper RPC channel (loopback only) ─────────────────────────
  ctx.effect(() => ctx.connection.rpc.handle('/wallpaper', async (endpoint, payload, signal) => {
    if (signal?.aborted) return failInternal('aborted')

    switch (endpoint) {
      case 'config/get': {
        return ok(scope.get())
      }

      case 'config/set': {
        if (typeof payload !== 'object' || payload === null) return failBadRequest('payload must be an object')
        const { patch } = payload as { patch?: unknown }
        if (typeof patch !== 'object' || patch === null || Array.isArray(patch)) return failBadRequest('patch must be an object')
        const clean: Record<string, unknown> = {}
        for (const key of Object.keys(patch)) {
          if (CONFIG_FIELDS.includes(key)) clean[key] = (patch as Record<string, unknown>)[key]
        }
        try {
          await scope.update(clean)
          return ok(scope.get())
        } catch (error) {
          return failBadRequest(String(error))
        }
      }

      case 'put': {
        if (typeof payload !== 'object' || payload === null) return failBadRequest('payload must be an object')
        const { data, width, height } = payload as { data?: unknown; width?: unknown; height?: unknown }
        if (typeof data !== 'string' || data.length === 0 || data.length > MAX_PAYLOAD_CHARS) {
          return failBadRequest('data must be a non-empty base64 string under 10 MB')
        }
        if (typeof width !== 'number' || !Number.isInteger(width) || width < 1 || width > 16384
          || typeof height !== 'number' || !Number.isInteger(height) || height < 1 || height > 16384) {
          return failBadRequest('width/height must be integers in [1, 16384]')
        }
        const buffer = Buffer.from(data, 'base64')
        if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) return failBadRequest('decoded image is empty or over 8 MB')
        if (!isWebp(buffer)) return failBadRequest('image must be WebP (RIFF....WEBP)')

        const previous = readMeta()
        const revision = (previous?.revision ?? 0) + 1
        const meta: WallpaperMeta = { revision, width, height, updatedAt: new Date().toISOString() }
        const tmp = filePath + '.tmp'
        try {
          writeFileSync(tmp, buffer)
          writeFileSync(metaPath, JSON.stringify(meta))
          renameSync(tmp, filePath)
          // Keep the config coherent with the stored file; roll back on failure.
          await scope.update({ revision, imageWidth: width, imageHeight: height })
        } catch (error) {
          rmSync(tmp, { force: true })
          rmSync(filePath, { force: true })
          rmSync(metaPath, { force: true })
          return failInternal(String(error))
        }
        return ok({ revision, width, height })
      }

      case 'remove': {
        try {
          rmSync(filePath, { force: true })
          rmSync(metaPath, { force: true })
          await scope.update({ revision: 0, imageWidth: 0, imageHeight: 0 })
        } catch (error) {
          return failInternal(String(error))
        }
        return ok({ removed: true })
      }

      case 'info': {
        return ok(readMeta() ?? { revision: 0 })
      }

      default:
        return failBadRequest('unknown wallpaper endpoint "' + endpoint + '"')
    }
  }, { authority: 'loopback' }), 'wallpaper: rpc channel')

  // ── GET /plugins/wallpaper/image?v=<revision> ──────────────────────
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/plugins/wallpaper/image',
    handler: (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain' })
        res.end('method not allowed')
        return
      }
      let revision: number
      try {
        revision = Number(new URL(req.url ?? '/', 'http://wallpaper.local').searchParams.get('v'))
      } catch {
        revision = Number.NaN
      }
      const meta = readMeta()
      const stale = meta === null || meta.revision === 0
        || !Number.isInteger(revision) || revision !== meta.revision
        || !existsSync(filePath)
      if (stale) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('not found')
        return
      }
      const size = statSync(filePath).size
      res.writeHead(200, {
        'Content-Type': 'image/webp',
        'Content-Length': String(size),
        'Cache-Control': 'private, max-age=31536000, immutable'
      })
      if (req.method === 'HEAD') {
        res.end()
        return
      }
      createReadStream(filePath).pipe(res)
    }
  }), 'wallpaper: image route')
}

export const inject = ['settings', 'connection', 'webServer']
