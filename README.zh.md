# dsh-plugin-wallpaper

![npm](https://img.shields.io/npm/v/dsh-plugin-wallpaper) ![license](https://img.shields.io/npm/l/dsh-plugin-wallpaper)

上传一张本地图片，按工作台宽高比裁切，把它设为 DeepSeek Harness Web 的桌面背景——全部在设置面板的专属一栏里完成。

[English](README.md)

## 功能

- 设置中专属的「背景」页：预览、上传、更换、移除。
- 上传后的裁切对话框：拖拽移动选框，八个手柄调整大小。裁切比例默认锁定为当前工作台窗口的宽高比（可解锁），导出前可选模糊。
- 即时生效，无需刷新；页面刷新后自动恢复。
- 可实时调节：填充方式（cover / contain / center / stretch）、面板不透明度（壁纸透过应用面板的程度）、遮罩变暗。
- 图片在浏览器端裁切并压缩（WebP，最长边 ≤ 2560 px，质量 0.85），只上传最终结果。
- 配置持久化在标准用户 settings 文档（`$DSH_HOME/settings.yaml` 的 `wallpaper` 段），支持手工编辑。

## 安装

从 npm：

```sh
dsh plugin --profile web add dsh-plugin-wallpaper
```

从 GitHub（`prepare` 脚本会在安装时自动构建）：

```sh
dsh plugin --profile web add github:JerryPhoenixCKY/dsh-plugin-wallpaper
```

本地开发：

```sh
dsh plugin --profile web add link:<本仓库绝对路径>
```

然后重启 `dsh web`（插件在启动时装载）：

```sh
dsh web   # 或 dsh --profile web
```

移除：`dsh plugin --profile web remove dsh-plugin-wallpaper`，然后重启。

## 使用

1. 打开设置（侧边栏齿轮）→「背景」。
2. 点击「上传图片」选择本地图片（≤ 20 MB）。
3. 在裁切对话框中调整选框、可选加模糊，然后「应用为背景」。
4. 用「面板不透明度」「遮罩不透明度」调出合适观感；「移除背景」恢复默认。

注意：上传与修改需要在本机（localhost）打开页面。局域网内其他机器可以看到背景，但写入会被拒绝——写入通道只信任 loopback。

## 存储

`$DSH_HOME/storages/wallpaper/`

- `wallpaper.webp` — 最近一次上传的裁切结果。
- `wallpaper.json` — `{ revision, width, height, updatedAt }`；revision 由服务端权威、单调递增。
- 显示设置（启用 / 填充方式 / 遮罩 / 面板不透明度 / revision）保存在 `$DSH_HOME/settings.yaml` 的 `wallpaper` 段。

## 架构

一个双面包（host + browser）：

- **宿主半身**（`src/index.ts` → `lib/index.js`）：
  - `ctx.settings.register("wallpaper", schema)` — 校验、默认值与持久化。（rc.6 的 settings *线上*白名单不覆盖第三方命名空间，因此浏览器侧不走 settings API。）
  - `/wallpaper` 通用 RPC 通道（仅 loopback）：`config/get`、`config/set`、`put`、`remove`、`info`。
  - `GET /plugins/wallpaper/image?v=<revision>` — 按 revision 提供图片（不可变缓存；陈旧 revision 一律 404）。
- **浏览器半身**（`src/client/**` → `lib/client.js`）：
  - 向 `settings.section` 槽位注册「背景」页（上传 / 裁切 / 预览 / 参数）。
  - 通过 `ctx.get("connection")` 取 wire 句柄（官方客户端插件模式），配置读写走 `WallpaperStore` —— RPC 通道上的合并写入器。
  - `attachBackground` 把配置投影到文档：`body` 背景图、主题 token（`--dsw-alias-bg-*`）半透明化、变暗渐变，并随 `theme/change` 联动。

## 开发

```sh
pnpm install
pnpm typecheck     # tsc --noEmit
pnpm build         # esbuild → lib/index.js + lib/client.js
```

客户端产物遵循 Web 外壳的模块协议（`window.__ModuleLoader__.load({ id, factory })`）；external 与 `@deepseek-ai/dsh-client-web` 的 `PLATFORM_MODULES` 种子表及 `dsh.client.inject` 声明的包保持一致。CSS Modules 由 `scripts/build.mjs` 内联编译，并按官方 `<style data-plugin-css>` 约定注入。

改动后执行 `pnpm build`，重启 `dsh web` 生效。

## 许可证

[MIT](LICENSE)
