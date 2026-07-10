# 指南路线图（个人全栈）

> 冻结决策见多 Agent 仲裁。开新本前：有真实交付面；约 6–10 周/本；旧本季检。

## 已有

| 目录 | 说明 |
|------|------|
| [meta](./meta/how-to-write-guides.md) | 如何写指南 |
| [react](./react/README.md) | Vite SPA |
| [go](./go/README.md) | Go HTTP API |
| [node-cli](./node-cli/README.md) | Node TUI CLI |
| [defi](./defi/README.md) | EVM DeFi 前端 |

## 待写（执行序）

### Wave 1 — P0

| 序 | 目录 | 说明 | 状态 |
|----|------|------|------|
| 1 | `fastapi` | Python HTTP API；对位 go | **DONE（对抗 5/5 PASS）** |
| 2 | `ui-ux` | HIG/Material/WCAG；Figma 交付 | 排队 |
| 3 | `agent` | Py+TS 一本两栈；金标同构 | 排队 |
| 4 | `ops` | 部署·密钥·回滚·健康检查·CI | 排队 |

### Wave 2 — P1

| 序 | 目录 | 说明 |
|----|------|------|
| 5 | `nextjs` | App Router；与 Vite react 分册 |
| 6 | `postgres` | 建模·迁移·事务·RLS |
| 7 | `auth` | 跨端鉴权边界 |

### Wave 3 — P2（原生 / 创意）

| 序 | 目录 | 说明 |
|----|------|------|
| 8 | `apple-platforms` | **iOS + Mac 原生**（Mac 桌面专章） |
| 9 | `android-compose` | Android 原生 |
| 10 | `graphics-creative` | 动效/GPU/掉帧预算薄册 |

### Wave 4 — P3（有单再开）

| 目录 | 说明 |
|------|------|
| `realtime` | WS/SSE |
| `workers-queue` | 后台任务 |
| `saas` | 多租户·计费·RBAC |
| `desktop-tauri` | 跨端桌面备选（桌面主路径=Mac 原生） |
| `expo` | 跨端移动妥协 |

## DEFER / NEVER

独立 `mac-*`、Electron 独立本、Flutter 默认本、拆开的 agent-py/ts、K8s/云百科、第二后端框架跟风本。
