# 发布指南 Publish guide

包名 `dsh-plugin-wallpaper` 当前在 npm 上**未被占用**（2026-08 已核验）。
以下任一方式发布后，其他用户即可通过：

```sh
dsh plugin --profile web add dsh-plugin-wallpaper
```

安装使用。

## 方式一：你亲自执行（推荐，不把 token 发给我）

在本仓库目录打开终端：

```powershell
# 1) npm 登录（交互式，需要你在浏览器确认）
npm login

# 2) 发布（prepare 脚本会自动构建）
npm publish

# 3) GitHub（可选，让插件被 dsh-plugin topic 检索到）
# 先安装 gh 并登录：winget install GitHub.cli  然后  gh auth login
gh repo create dsh-plugin-wallpaper --public --source . --push
gh repo edit --add-topic dsh-plugin --add-topic dsh --add-topic deepseek-harness --add-topic wallpaper
```

命令 3 建好仓库后，在 `package.json` 里补一行 `"repository"` 字段并 `npm version patch && npm publish`，
npm 页面上就会显示源码链接。

## 方式二：把凭据发给我代发

1. npm token：https://www.npmjs.com/settings/~/tokens → 新建 Classic → 选 Publish，
   把 `npm_xxx...` 发我（我只写入本机 `~/.npmrc`，不进 git）。
2. （可选）GitHub PAT：https://github.com/settings/tokens → Classic → 勾 `repo`，
   连同你的 GitHub 用户名一起发我；我会建公开仓库、推送、打 `dsh-plugin` topic。

发布完成后建议立即在对应平台吊销这两个 token。

## 安全检查单

- [x] `npm publish --dry-run` 已通过（tarball 只含 lib/、cordis.patch.yml、README、LICENSE）
- [x] `pnpm typecheck` 通过、双产物 `node --check` 通过
- [x] 隔离实例端到端验证通过（RPC/路由/持久化/重启恢复）
- [x] 包名未被占用
- [x] **2026-08-20 已发布 npm**（https://www.npmjs.com/package/dsh-plugin-wallpaper）：最新 **0.1.4**（README 截图章节）
- [x] 已从 npm registry 干净安装到全新 profile 并全链路复验
- [x] **2026-08-20 GitHub 仓库已建**：https://github.com/JerryPhoenixCKY/dsh-plugin-wallpaper （topics: dsh-plugin, dsh, deepseek-harness, wallpaper）
- [x] package.json 已补 repository/homepage/author 字段，npm 0.1.1 已发布
- [ ] **0.1.5 待上传**（2026-09-14 本地已就绪）：修复 `lib/index.js` 里重复的 `inject` 声明导致插件无法加载。版本号、CHANGELOG 已更新并提交，`npm pack --dry-run` 已复验；仅差 `git push` 与 `npm publish`，两者都因本机凭据缺失未执行（npm token 401、git 无 GitHub 凭据、gh 未安装）。

> 注意：本机 `npm publish` 会触发 `prepare` → `scripts/build.mjs`，而 esbuild 的服务进程走命名管道，在 DSH 沙箱受限模式下会 `spawn EPERM`。由于 `lib/` 已构建且与 `src/` 逐字节一致，发布时可用 `npm publish --ignore-scripts` 跳过构建；或在未受限的普通终端里直接 `npm publish`。
