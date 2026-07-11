# 来源、标杆与差距表

## 证据等级

P0 > P1 > P1w > E。

## P0

| 主题 | URL |
|------|-----|
| React 19 | https://react.dev |
| Vite | https://vite.dev/guide/ |
| TanStack Query | https://tanstack.com/query/latest |
| TanStack Router | https://tanstack.com/router/latest |
| Zustand | https://zustand.docs.pmnd.rs/ |
| Zod | https://zod.dev |
| Tailwind | https://tailwindcss.com/docs |
| shadcn/ui | https://ui.shadcn.com/docs |
| date-fns | https://date-fns.org/docs/Getting-Started |
| es-toolkit | https://es-toolkit.dev/ |
| Testing Library | https://testing-library.com/docs/react-testing-library/intro/ |

## 标杆 \(B\)（3 开源）

| ID | 仓库 | 品类匹配 | 学什么 | 不学什么 |
|----|------|----------|--------|----------|
| A | [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw) | 大型 React SPA | 客户端状态边界、性能意识、模块化 | 画布领域算法当通用业务 |
| B | [outline/outline](https://github.com/outline/outline) | 带鉴权的产品 SPA | 路由/会话/API 分层 | 旧 React 17 / RR5 照搬版本 |
| C | [refinedev/refine](https://github.com/refinedev/refine) | 数据密集型 React 管理端 SPA | 资源 CRUD、通知、布局模式 | 强制绑 Refine 运行时（本指南自写 Query） |

**栈映射（E）：** 默认栈取 **Vite + React 19 + TanStack Router/Query + Zustand + Zod + Tailwind + shadcn**；A/B/C 能力面可映射，版本以 P0 为准。

## 能力切条 → 共有

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 客户端路由 SPA | ✓ | ✓ | ✓ | 必做 |
| 异步数据加载与加载态 | ✓ | ✓ | ✓ | 必做 |
| 创建/更新类提交 | ✓ | ✓ | ✓ | 必做 |
| 鉴权或等价访问控制 | △ | ✓ | ✓ | 共有→必做（无登录产品：INPUTS 勾「无登录」并裁 UI 门闸） |
| 表单校验 | ✓ | ✓ | ✓ | 必做 |
| 错误/空态 | ✓ | ✓ | ✓ | 必做 |

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做/可选/参考 |
|------|------|------|------|----------------|
| Query 为服务端状态 SSOT | P0 Query / C | 工程 | `04` | 必做 |
| Mutation 后缓存一致 | P0 / C | 功能 | `05` | 必做 |
| Zod 单源校验 | P0 | 工程 | `06` | 必做 |
| Zustand 仅客户端 UI/会话壳 | P0 Zustand | 工程 | `07` | 必做 |
| shadcn + Tailwind 组件 | P0 | 工程 | `06` | 必做 |
| date-fns / es-toolkit 工具 | P0 | 工程 | `01` | 必做 |
| Sentry 等 | — | 参考 | `08` | 参考 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| `react-router-dom` 更流行 vs TanStack Router | **采用 TanStack Router**（元指南 §3.4 先进优先：params/search/loader 端到端类型） |
| B 标杆仍用旧 React Router | 能力面映射；实现版本跟 P0 TanStack Router |
| C 用 Refine 数据层 | **约定自建 TanStack Query**，学其资源/通知模式不绑框架 |
| lodash 下载更高 vs es-toolkit | **采用 es-toolkit**（新项目默认；禁新增 lodash） |
