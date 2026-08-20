/**
 * dsh-plugin-wallpaper — browser half.
 *
 * Registers the Wallpaper settings section (upload/crop/apply), the zh/en
 * dictionaries, and attaches the reactive background style. Cross-plugin
 * collaboration goes through cordis services only: slots, locale,
 * connection, settingsScope and theme are injected; no value imports from
 * other plugin packages.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'

// Type-only imports activate the Context service augmentations:
//   ctx.slots (runtime), ctx.locale (ui-locale), ctx.theme (ui-theme),
//   and the settings.section SlotMap contract (ui-settings). The
//   connection wire handle is fetched through ctx.get('connection') —
//   the official client-plugin pattern — because the typed Context
//   declaration for the client half is not part of the published rc.6
//   type surface.
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'

import { WallpaperSection } from './WallpaperSection'
import { attachBackground } from './background'
import { WallpaperStore } from './store'
import { WALLPAPER_NS, WallpaperKey } from './settings'

// Dictionary namespace registration for the locale runtime (the official
// LocaleNamespaceMap augmentation pattern; keeps ctx.locale.bind typed).
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    wallpaper: WallpaperKey
  }
}

const zh: Record<WallpaperKey, string> = {
  nav: '背景',
  hint: '上传一张本地图片并裁切，作为工作台的桌面背景。',
  previewEmpty: '尚未设置背景',
  uploadButton: '上传图片',
  replaceButton: '更换图片',
  removeButton: '移除背景',
  enabledLabel: '启用背景',
  fitLabel: '填充方式',
  fitCover: '铺满（cover）',
  fitContain: '完整显示（contain）',
  fitCenter: '居中原始大小',
  fitStretch: '拉伸铺满',
  panelLabel: '面板不透明度',
  overlayLabel: '遮罩不透明度',
  cropTitle: '裁切图片',
  cropHint: '拖动选框移动，拖拽边角调整大小。默认锁定为当前工作台的宽高比。',
  cropBlur: '背景模糊',
  lockAspect: '锁定工作台宽高比',
  cropApply: '应用为背景',
  cropCancel: '取消',
  applying: '正在应用…',
  loading: '正在读取设置…',
  unavailable: '无法读取背景设置。',
  remoteWarning: '当前页面并非本机访问，无法上传图片（仅本机可写入）。',
  tooLarge: '图片过大，请选择 20 MB 以内的文件。',
  invalidImage: '无法读取该图片文件。'
}

const en: Record<WallpaperKey, string> = {
  nav: 'Wallpaper',
  hint: 'Upload a local image and crop it as the workspace desktop background.',
  previewEmpty: 'No wallpaper set',
  uploadButton: 'Upload image',
  replaceButton: 'Replace image',
  removeButton: 'Remove wallpaper',
  enabledLabel: 'Enable wallpaper',
  fitLabel: 'Fit',
  fitCover: 'Cover',
  fitContain: 'Contain',
  fitCenter: 'Center (original size)',
  fitStretch: 'Stretch',
  panelLabel: 'Panel opacity',
  overlayLabel: 'Overlay dimming',
  cropTitle: 'Crop image',
  cropHint: 'Drag to move the box, drag a corner or edge to resize. Aspect is locked to the workspace by default.',
  cropBlur: 'Blur',
  lockAspect: 'Lock workspace aspect ratio',
  cropApply: 'Apply as background',
  cropCancel: 'Cancel',
  applying: 'Applying…',
  loading: 'Loading settings…',
  unavailable: 'Wallpaper settings are unavailable.',
  remoteWarning: 'This page is not opened from this machine; uploading is unavailable (writes are loopback-only).',
  tooLarge: 'The image is too large; pick a file under 20 MB.',
  invalidImage: 'Could not read this image file.'
}

export const inject = ['slots', 'locale', 'connection', 'theme']

export function apply(ctx: ClientContext) {
  const connection = ctx.get('connection') as unknown as ConnectionHandle
  const store = new WallpaperStore(connection.rpc)

  ctx.effect(() => ctx.locale.register(WALLPAPER_NS, { zh, en }), 'wallpaper: dictionaries')
  const translate = ctx.locale.bind(WALLPAPER_NS)
  const t = (key: WallpaperKey): string => translate(key)

  void store.load()
  ctx.effect(() => attachBackground(ctx, store), 'wallpaper: background')

  const injected = () => ({
    store,
    rpc: connection.rpc,
    isLoopback: connection.isLoopback,
    t
  })

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'wallpaper',
    order: 30,
    label: () => t('nav'),
    inject: injected
  }, WallpaperSection))
}
