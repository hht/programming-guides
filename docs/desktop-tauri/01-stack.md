# 01 — 栈

| 层 | 选择 |
|----|------|
| 壳 | **[Tauri 2](https://v2.tauri.app/)** |
| 后端语言 | **Rust**（`src-tauri`） |
| 前端构建 | **Vite** |
| 前端 UI（默认） | **React 19 + TypeScript strict**（对齐 [docs/react](../react/README.md)：TanStack Router/Query、Zod 等按该册；桌面壳不另发明路由栈） |
| IPC | `@tauri-apps/api` → `invoke` / 事件（事件见 `07`） |
| 权限 | **Capability** 文件于 `src-tauri/capabilities/` |
| Command 暴露面 | `tauri::generate_handler![…]` + **`AppManifest::commands` allowlist**（`06`） |
| 包管理前端 | **pnpm**（与 react 册一致） |
| Rust 工具链 | `rustup` stable；`cargo` lockfile 入库 |

禁止：Tauri 1 当默认；「Electron 或 Tauri 任选」开口；前端默认 Vue（Hoppscotch 映射成本记入 sources，不改默认）。

## 脚手架

```bash
# 官方当前线（以 https://v2.tauri.app/start/create-project/ 为准；版本随 P0）
pnpm create tauri-app@latest
# 选项写明：TypeScript · React · pnpm · Vite
# 生成后：
# 1) 填 INPUTS command/capability 表
# 2) 配置 capabilities/*.json（templates 例）
# 3) build.rs：AppManifest::commands(&[…]) 与登记表一致
# 4) pnpm tauri dev / pnpm tauri build
```

## 版本

| 项 | 策略 |
|----|------|
| Tauri | **2.x**；跟随官方 stable；禁混用 v1 `tauri.conf` 语义 |
| `@tauri-apps/api` / CLI | 与 `tauri` crate 大版本对齐 |
| React / Vite | 跟 [docs/react](../react/README.md) lock 策略 |
| 插件 | 仅 INPUTS §17 清单；版本与 Tauri 2 兼容线 |

## 冲突裁决（写入 sources）

| 冲突 | 裁决 |
|------|------|
| Hoppscotch 等标杆用 Vue | **默认仍 React**（与仓内 react 册一致、类型面更齐）；Vue 仅 INPUTS §3 书面另行约定 |
| Mac 只做桌面 | **优先 apple-platforms**；本册仅跨端/非 Apple 独占时 |
| 流行度 Electron | **不**作本册默认；DEFER 见 roadmap |
