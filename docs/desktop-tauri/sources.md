# 来源与差距

## P0（≥3 · tauri.app）

| 主题 | URL |
|------|-----|
| Capabilities（权限模型 / AppManifest::commands） | https://v2.tauri.app/security/capabilities/ |
| Calling Rust（command / invoke） | https://v2.tauri.app/develop/calling-rust/ |
| Create project / 起步 | https://v2.tauri.app/start/create-project/ |

（冲突时以 v2.tauri.app 当前页为准。）

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [tauri-apps/tauri](https://github.com/tauri-apps/tauri) | P1 | 官方架构、capability/command 设计意图 | 当业务 App 抄目录 | 跨端桌面壳框架本体 |
| B | [spacedriveapp/spacedrive](https://github.com/spacedriveapp/spacedrive) | P1 | Rust 核心 + TS 前端桌面、本机能力边界 | 抄分布式文件系统业务 | 跨端文件类桌面产品 |
| C | [hoppscotch/hoppscotch](https://github.com/hoppscotch/hoppscotch) | P1 | 桌面客户端交付面、多端产品边界 | 绑死 Vue；抄整个 API 客户端 | 开发者工具桌面端 |

> 用户指定标杆三仓；A 为框架仓时「功能共有」以 B/C 用户可感知能力 + A/P0 工程面共同支撑。前端默认 React 见 `01` 冲突表。

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 桌面壳承载 Web UI | ✓ | ✓ | ✓ | 必做 |
| 前端调本机/Rust 能力 | ✓ | ✓ | ✓/可映射 | 必做 |
| 打包多 OS 桌面 | ✓ | ✓ | ✓ | 条件必做（按 INPUTS OS） |
| 自动更新 | 文档/插件 | 可 | 可 | 可选（INPUTS §15） |
| 鉴权门闸 | — | 可 | 可 | 可选（INPUTS §16） |

> 「类型化 Ok/Err」「按窗 capability 最小权限」「未声明 command 不可达」→ **工程/超越**（差距表 + `11`§A/§C a1/a2），**不进本表**。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Command Lifecycle 步骤 | P0 calling-rust · B | 功能/工程 | `04` | 必做 |
| Capability 按窗最小权限 | P0 capabilities | 安全/超越 | `05` | 必做/超越 |
| 未声明 command 不可达 | P0 AppManifest | 安全/超越 | `06` | 必做/超越 |
| 错误码类型化 | B · 工程 | 工程 | `07` | 必做 |
| 与 Mac 原生主路径边界 | roadmap · apple-platforms | 工程 | `08`/`INPUTS` | 必做 |
| 登记表三方一致 CI | 工程 | 工程 | `06`/`09` | 必做 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| Hoppscotch Vue vs 默认 React | **默认 React**（对齐 docs/react）；Vue 仅 INPUTS 书面 |
| Electron 流行 | **不**作本册默认；roadmap DEFER |
| 仅 Mac | **优先 apple-platforms**；本册须书面跨端理由 |
| tauri 仓当唯一用户任务标杆 | **否**；B/C 补用户可感知面；A+P0 补工程 |
