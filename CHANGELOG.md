# 开发日志 Changelog

本项目的所有值得注意的变更都记录在此文件。

## [0.1.6] — 2026-09-14

### 修复 Fixed

- **插件导致 DSH 整个启动失败：`cannot get property "webServer" without inject`**。0.1.5 修掉语法错误后，暴露出真正的运行时故障：`ctx.connection.rpc.handle()` 在 dsh 0.1.5 上不可用。

  根因在 `dsh-client-connection` 的 `register()`：它用 `owner.webServer.register(route)` 注册频道，而 `owner` 取的是该服务**自身**的 shadowed context（`get rpc()` 里的 `this.ctx`），不是调用方的 context。于是 `webServer` 的解析从服务自己的 fiber 出发，而该插件的 `inject` 只有 `["credentials"]`，解析不到 `webServer` 便抛错。这个异常对调用方是致命的——整棵插件树加载失败；dsh-context 是目前唯一另一个调用方，它用一层空的 `try { } catch { return }` 把同一个异常吞掉并静默停用自己的频道。DSH 自带插件里没有任何一个使用 `connection.rpc.handle`。

  **改法**：不再依赖该注册表。`/wallpaper` 频道改为直接挂在 Host webserver 上的 prefix 路由，由新增的 `serveRpc()` 自行实现 Connection RPC 信封协议（`POST` + `application/json` 进，`{type:'server-response', rpcId, result}` 出，`rpcId` 原样回显），与 `dsh-client-connection` 自身的 `rpcFetchHandler` 逐条对齐。**浏览器侧零改动**：客户端照旧调用 `connection.rpc.call('/wallpaper', …)`。
- node 半边的 `inject` 由 `['settings', 'connection', 'webServer']` 收窄为 `['settings', 'webServer']`：频道不再经过 connection 服务，运行时不再依赖它。

### 测试 Tested

- 新增隔离验证环境（独立 `DSH_HOME` + 独立端口），先精确复现原故障，再验证修复：插件树正常加载；18 项频道协议检查全部通过（信封、`rpcId` 回显、错误码、400/415/404 边界）；并完成完整的上传 → 落盘 → 按 revision 提供 → 过期 revision 拒绝 → 删除 往返。

## [0.1.5] — 2026-09-14

### 修复 Fixed

- **插件完全无法加载：`SyntaxError: Identifier 'inject' has already been declared`**。上一提交（`93579e3`）向**构建产物** `lib/index.js` 末尾手工追加了 3 行——`const inject = ["webServer"]` 与重复的 `export { apply, inject }`。而该文件上方由 esbuild 生成的 `var inject = ["settings", "connection", "webServer"]` 已经声明过 `inject`，同一模块作用域内重复声明，导致模块解析失败、插件整体加载不了。
  该追加既**冗余**（`src/index.ts` 早已在 inject 列表中声明 `webServer`，生成产物同样包含）又**致命**。现已删除，`lib/index.js` 恢复为与 `src/` 逐字节一致的构建产物（重新构建 `git diff` 为零）。
- 教训：`lib/` 是 `scripts/build.mjs` 的生成目录，**禁止手工编辑**；一切修改都在 `src/` 中进行后重新构建。
- 影响范围说明：**0.1.4 发布版本不受影响**——发布提交 `168ab70` 的 `lib/index.js` 是正确的，坏的改动从未随任何版本发布出去。

## [0.1.4] — 2026-08-20

- README 新增「截图」章节（中英双语）：设置页「背景」栏、裁切对话框、应用壁纸后的工作台三张截图（`demo/` 目录）。
- `demo/` 加入 npm 发布清单，npm 页面同样显示截图。

## [0.1.3] — 2026-08-20

### 修复 Fixed

- **裁切选框渲染错位（无法正常截取的根因）**：选框内联样式漏加图片的显示偏移（`disp.x` / `disp.y`），选框一直画在图片左上偏移处，框选位置与导出区域不一致。现已与图片精确对齐。
- **裁切交互失效**：手柄命中测试漏加选框原点，且初始选框按最大适配铺满全图（无移动余量），导致拖拽、缩放全部被钳死。现初始选框内缩 8%，拖拽移动与八向缩放全部可用。
- **锁定宽高比失真**：裁切坐标为显示框相对坐标，未按显示框像素比换算，缩放结果的渲染与导出比例都错误。现锁定后渲染与导出均为工作台真实宽高比。
- **壁纸不显示（根因）**：主题内置明暗调色板由样式表承载、不经过主题快照（快照 `tokens` 为空），面板半透明覆盖从未写入。现改为从 computed style 读取主题原始 token，并同步覆盖面板 token、body 背景图与底色。
- 页面刷新 / 重启后自动恢复壁纸（含面板透明度与遮罩）。

### 测试 Tested

- 新增真实浏览器自动化验证（本机 Edge + playwright-core，脚本见仓库外 `ui-test/`）：裁切移动/缩放、比例锁定、应用后像素级对比，全部通过；页面零报错。

## [0.1.2] — 2026-08-20

- README 拆分中英双语（`README.md` / `README.zh.md`），顶部互链。
- 中文版加入 npm 发布清单。

## [0.1.1] — 2026-08-20

- 建立 GitHub 仓库并打上 `dsh-plugin` 等 topic。
- `package.json` 补充 `repository` / `homepage` / `author`。

## [0.1.0] — 2026-08-20

- 首个版本：设置面板「背景」栏、上传与裁切对话框、即时应用、设置持久化（标准 settings 文档 + 自有 `/wallpaper` RPC 通道）。
