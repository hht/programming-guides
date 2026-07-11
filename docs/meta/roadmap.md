# 指南路线图（扩展覆盖）

> 方法契约：[AGENTS.md](../../AGENTS.md)。写指南流程：[how-to-write-guides.md](./how-to-write-guides.md)。  
> **覆盖原则**：有真实交付面的流行栈/产品形态尽量收进册；**先进优先**定默认栈；同品类不平行第二默认。  
> 开新本：约按 Wave 序；旧本季检。

## 已有（DONE）

| 目录 | 说明 |
|------|------|
| [meta](./how-to-write-guides.md) | 如何写指南 |
| [react](../react/README.md) | Vite SPA |
| [go](../go/README.md) | Go HTTP API |
| [node-cli](../node-cli/README.md) | Node TUI CLI |
| [defi](../defi/README.md) | EVM DeFi 前端 |
| [fastapi](../fastapi/README.md) | Python HTTP API |
| [ui-ux](../ui-ux/README.md) | 设计决策 + Figma |
| [agent](../agent/README.md) | Tool-using Agent（Py+TS） |
| [ops](../ops/README.md) | 部署·密钥·回滚·健康·CI |
| [nextjs](../nextjs/README.md) | App Router 全栈 Web |
| [postgres](../postgres/README.md) | PostgreSQL 建模·迁移·事务·RLS |
| [auth](../auth/README.md) | 会话 Cookie / OAuth/OIDC / Session Gate |
| [graphql](../graphql/README.md) | Schema-first GraphQL（Yoga + SDL + Typed document） |
| [redis](../redis/README.md) | 缓存·锁·限流·会话存储 |
| [apple-platforms](../apple-platforms/README.md) | iOS + Mac 原生（SwiftUI；View-State Lifecycle） |
| [android-compose](../android-compose/README.md) | Kotlin + Jetpack Compose（UiState Lifecycle） |
| [graphics-creative](../graphics-creative/README.md) | 动效·帧预算·掉帧可测（Frame Budget Lifecycle） |
| [desktop-tauri](../desktop-tauri/README.md) | Tauri 2 跨端桌面（Command Lifecycle；备选） |
| [expo](../expo/README.md) | Expo 跨端移动妥协层（Screen State Lifecycle） |

> **Wave 4 进行中（规格已写 · 对抗未 5/5 · 勿标 DONE）**：[realtime](../realtime/README.md) · [workers-queue](../workers-queue/README.md) · [saas](../saas/README.md) · [search](../search/README.md) · [observability](../observability/README.md)

## Wave 执行序

### Wave 1 — 收口

| 序 | 目录 | 说明 | 状态 |
|----|------|------|------|
| 1 | `ops` | Compose+Kamal+GHA | DONE |

### Wave 2 — Web / 数据 / 身份

| 序 | 目录 | 说明 | 状态 |
|----|------|------|------|
| 2 | `nextjs` | App Router；与 Vite `react` 分册 | DONE |
| 3 | `postgres` | 建模·迁移·事务·RLS | DONE |
| 4 | `auth` | 会话/OAuth/JWT/跨端鉴权 | DONE |
| 5 | `graphql` | Schema-first API（对位 REST 册） | DONE |
| 6 | `redis` | 缓存·锁·限流·会话存储 | DONE |

### Wave 3 — 原生 / 桌面 / 创意

| 序 | 目录 | 说明 | 状态 |
|----|------|------|------|
| 7 | `apple-platforms` | iOS + Mac 原生（Mac 桌面专章） | DONE |
| 8 | `android-compose` | Android 原生 | DONE |
| 9 | `graphics-creative` | 动效/GPU/掉帧预算 | DONE |
| 10 | `desktop-tauri` | 跨端桌面（备选；主路径仍 Mac 原生） | DONE |
| 11 | `expo` | 跨端移动妥协层（Screen State Lifecycle） | DONE |

### Wave 4 — 分布式与产品形态

| 序 | 目录 | 说明 | 状态 |
|----|------|------|------|
| 12 | `realtime` | WS/SSE/订阅 | **进行中** · 勿标 DONE |
| 13 | `workers-queue` | 后台任务·出队重试·幂等 | **进行中** · 勿标 DONE |
| 14 | `saas` | 多租户·计费·RBAC | **进行中** · 勿标 DONE |
| 15 | `search` | 全文/向量检索边界 | **进行中** · 勿标 DONE |
| 16 | `observability` | 日志·指标·追踪（**可选册**；领域指南仍不把 APM 当必勾） | **进行中** · 勿标 DONE |

### Wave 5 — 云与边缘（有单再开）

| 目录 | 说明 |
|------|------|
| `serverless` | Functions/边缘运行时 |
| `object-storage` | S3 兼容对象存储 |
| `email-delivery` | 事务邮件·模板·投递 |
| `payments` | 支付集成边界（非某家 SDK 百科） |
| `rust-api` | Rust HTTP（先进后端备选） |
| `kotlin-backend` | JVM/Ktor 或 Spring 薄册（按先进裁决） |

### Wave 6 — 垂直产品（按需）

| 目录 | 说明 |
|------|------|
| `cms-headless` | Headless CMS 集成 |
| `i18n` | 文案 SSOT·locale 流水线 |
| `design-tokens` | Token 工程（对位 ui-ux） |
| `ml-inference` | 模型推理服务边界（非训练百科） |
| `data-pipeline` | ETL/批流薄册 |

## 候选池（未立项；热度高时升 Wave）

`sveltekit` · `vue-nuxt` · `elixir-phoenix` · `dotnet-api` · `laravel` · `django`（与 fastapi 分册时再钉）· `terraform-opentofu` · `kubernetes-app`（应用部署面，非云百科）· `wasm` · `cli-rust` · `browser-extension` · `shopify-app` · `telegram-bot` · `discord-bot`

升册条件：有可切的用户任务 + ≥2 证据源 + 能钉一条核心正确性路径。

## DEFER / NEVER（仍有效）

- 独立 `mac-*` 拆册（进 `apple-platforms`）  
- Electron 独立本（桌面主路径 = Mac 原生；Tauri 备选）  
- Flutter 作默认移动本  
- 拆开的 `agent-py` / `agent-ts`  
- K8s/云厂商**百科**（应用面可另开薄册）  
- 同品类第二后端框架「跟风本」  
- 把 Sentry 等 APM 写进**非 ops/observability** 指南的必勾验收  

## 执行纪律

1. 当前 Wave 未 5/5 PASS 提交前，不跳去写下一本（用户明示插队除外）。  
2. 新本必须走元指南：标杆 3 → 差距表 → 钉栈 → 对抗 5×。  
3. 候选池不自动开工；升 Wave 时改本文件并提交。
