# 来源、标杆与差距表

## 证据等级

| 等级 | 含义 |
|------|------|
| **P0** | 官方规范 / 框架文档 |
| **P1** | 世界级开源仓实践 |
| **P1w** | 闭源公开文档 |
| **E** | 本指南工程约定 |

冲突：P0 > P1 > P1w > E。

## P0（≥3）

| 主题 | URL | 学什么 |
|------|-----|--------|
| Ink | https://github.com/vadimdemedes/ink | render / Box / Text / useInput / useApp |
| Pastel | https://github.com/vadimdemedes/pastel | 文件路由命令、Zod options、bin 入口 |
| Zod | https://zod.dev | options/args schema |
| React 19 | https://react.dev | hooks；勿假设 DOM API |
| Node.js CLI | https://nodejs.org/api/process.html | exitCode、stdin.isTTY、信号 |

## 标杆证据源 \(B\)（3 开源）

| ID | 仓库 | 等级 | 品类匹配一句 | 学什么 | 不学什么 |
|----|------|------|--------------|--------|----------|
| A | [Shopify/cli](https://github.com/Shopify/cli) | P1 | 生产级多子命令 Ink CLI | 分层 `cli-kit`、Ink 交互、插件式命令 | Shopify 业务域、专有 GraphQL |
| B | [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) | P1 | 终端内长会话交互 agent | 复杂 TUI 状态、输入环、工具反馈 | 其 fork 的 ink 包名；照搬闭源协议细节 |
| C | [supreme-gg-gg/instagram-cli](https://github.com/supreme-gg-gg/instagram-cli) | P1 | Ink 7 + React 19 全键盘 TUI | Node≥22、现代 Ink、键盘导航 | Instagram 非官方 API / ToS 风险玩法 |

**栈映射说明（E）：** A 用 Ink 6.x 单体 kit；B 用 ink fork；C 用 Ink 7。本指南默认栈取 **Ink 7 + React 19 + Pastel（官方脚手架路径）**，与 C 版本对齐，与 A/B 能力面可映射（命令树、TUI、退出）。

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| B 使用 `@jrichman/ink` fork | **以 P0 Ink 官方包 `ink@^7` 为准** |
| A 未用 Pastel | 仍用 Pastel 作默认脚手架（P0 Pastel）；命令面能力对齐 A/B/C |
| 参数解析：Pastel→Commander+Zod vs 生态 meow | **采用 Pastel+Zod**（P0 Pastel） |

## 差距表

| 缺口 | 来自标杆 | 类型 | 落入文件 | 必做/可选/参考 |
|------|----------|------|----------|----------------|
| 子命令 / 默认命令 | A,B,C | 功能 | `03` | 必做 |
| 交互 TUI（键盘） | A,B,C | 功能 | `04` | 必做 |
| 长操作进度/状态反馈 | A,B | 功能 | `05` | 必做 |
| Ctrl+C / 干净退出 | A,B,C | 功能 | `05`,`06` | 必做 |
| `--help` 自动生成 | A,C（Pastel/Commander 生态） | 功能 | `03` | 必做 |
| 非 TTY / CI 降级 | A,B | 功能 | `06` | 必做（或 INPUTS 裁剪） |
| 配置 / 登录态 | A,B,C | 功能 | `07` | 必做（策略由 INPUTS 勾选） |
| `bin` 可执行发包 | A,C | 工程 | `08` | 必做 |
| 组件测试 lastFrame | Ink 生态 / A | 工程 | `09` | 必做 |
| Sentry 等第三方可观测 | — | 参考 | — | 参考（不进必勾） |
| 真实 PTY e2e | — | 工程 | `09` | 宜做可裁 |

## 能力切条 → 共有（≥2 源 → 必做功能）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 多命令 / 入口 CLI | ✓ | ✓ | ✓ | 共有→必做 |
| 交互式终端 UI | ✓ | ✓ | ✓ | 共有→必做 |
| 键盘驱动操作 | ✓ | ✓ | ✓ | 共有→必做 |
| 任务进行中状态反馈 | ✓ | ✓ | △ | 共有→必做 |
| 可中断 / 干净退出 | ✓ | ✓ | ✓ | 共有→必做 |
| 帮助信息 | ✓ | ✓ | ✓ | 共有→必做 |
| 持久配置或会话 | ✓ | ✓ | ✓ | 共有→必做 |
