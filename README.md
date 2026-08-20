# dsh-plugin-wallpaper

DeepSeek Harness Web 壁纸插件：在设置面板新增「背景」一栏，上传本地图片、按工作台宽高比裁切，一键设为 Web 工作台的桌面背景。

A wallpapper plugin for the DeepSeek Harness Web surface: a dedicated
Settings section where you upload a local image, crop it to the workspace
aspect ratio, and apply it as the desktop background.

## 功能 Features

- 设置 → 「背景」栏：预览当前背景、上传/更换、一键移除。
- 上传后进入裁切对话框：拖拽选框移动、8 向手柄缩放；默认锁定当前窗口的宽高比，可解锁自由裁切；支持导出前模糊。
- 即时生效：应用后无需刷新，页面刷新后自动恢复。
- 可调参数：填充方式（cover / contain / center / stretch）、面板不透明度、遮罩不透明度。
- 图片在浏览器端裁切并压缩为 WebP（最长边 ≤ 2560px，质量 0.85），只上传最终结果。
- 配置持久化在标准的用户 settings 文档（`$DSH_HOME/settings.yaml` 的 `wallpaper` 段），可手工编辑。

## 安装 Install

已发布时（npm）：

```sh
dsh plugin --profile web add dsh-plugin-wallpaper
```

本地开发（link 方式，本仓库）：

```sh
dsh plugin --profile web add link:<插件目录绝对路径>
```

然后重启 `dsh web`（插件在启动时装载）：

```sh
dsh web   # 或 dsh --profile web
```

移除：`dsh plugin --profile web remove dsh-plugin-wallpaper` 并重启。

## 使用 Usage

1. 打开设置（侧边栏齿轮）→ 「背景」。
2. 点击「上传图片」选择本地图片（≤ 20 MB）。
3. 在裁切对话框中调整选框与模糊，「应用为背景」。
4. 用「面板不透明度 / 遮罩不透明度」调出合适的观感；「移除背景」恢复默认。

注意：只有本机（localhost/127.0.0.1）打开页面才能上传或修改；
局域网内其他机器可以查看背景，但写入被拒（写入通道仅信任 loopback）。

## 存储 Storage

`$DSH_HOME/storages/wallpaper/`

- `wallpaper.webp` — 最近一次上传的裁切结果。
- `wallpaper.json` — `{ revision, width, height, updatedAt }`，revision 由服务端单调递增。
- 配置（enabled/fit/遮罩/面板不透明度/revision）保存在 `$DSH_HOME/settings.yaml` 的 `wallpaper` 段。

## 架构 Architecture

一个双面包（host + browser）：

- 宿主半身（`src/index.ts` → `lib/index.js`）：
  - `ctx.settings.register("wallpaper", schema)` — schema 校验 + 默认值 + 持久化（rc.6 的 settings 线上白名单不覆盖第三方命名空间，因此浏览器侧不走 settings 线 API）；
  - `/wallpaper` 通用 RPC 通道（仅 loopback）：`config/get`、`config/set`、`put`、`remove`、`info`；
  - `GET /plugins/wallpaper/image?v=<revision>` — 按 revision 提供图片（不可变缓存 + 防陈旧 URL）。
- 浏览器半身（`src/client/**` → `lib/client.js`）：
  - 向 `settings.section` 槽位注册「背景」设置页（上传/裁切/预览/参数）；
  - 通过 `ctx.get("connection")` 取 wire 句柄，用 `WallpaperStore`（合并写入器）读写配置；
  - `attachBackground` 把配置投影为文档样式：`body` 背景图 + 主题 token（`--dsw-alias-bg-*`）半透明化 + 遮罩渐变，订阅 `theme/change` 保持主题联动。

## 开发 Develop

```sh
pnpm install
pnpm typecheck     # tsc --noEmit
pnpm build         # esbuild 产出 lib/index.js 与 lib/client.js
```

客户端产物遵循 Web 外壳的模块协议（`window.__ModuleLoader__.load({ id, factory })`），
external 与 `@deepseek-ai/dsh-client-web` 的 `PLATFORM_MODULES` 种子表及 `dsh.client.inject` 保持一致；
CSS Modules 由 `scripts/build.mjs` 内联编译并按官方约定注入（`<style data-plugin-css>`）。

修改后重跑 `pnpm build`，然后重启 `dsh web` 生效。

## License

MIT
