# 08 — 客户端与应用册边界

> **本册 = GraphQL 契约与 Operation Lifecycle SSOT。** 
> `docs/react`、`docs/nextjs`、`docs/go`、`docs/fastapi` 只描述框架接线与 UI；**SDL、错误码、Lifecycle、Mutation 鉴权规则以本册为准**。会话语义以 [docs/auth](../auth/README.md) 为准。

## 边界表

| 关切 | 本册（graphql） | 应用册 / auth |
|------|-----------------|---------------|
| SDL / 字段契约 | SSOT（`03`） | 消费 codegen 类型 |
| Operation Lifecycle | SSOT（`05`） | HTTP 路由挂 Yoga/handler |
| Mutation 鉴权+校验 | SSOT（`06`） | 调用 Session Gate |
| Cookie / Gate / OAuth | 引用 | **auth SSOT** |
| Typed document / codegen | SSOT 要求（`04`） | 配置路径、React Query/fetch |
| UI 组件 / a11y | **N/A** | ui-ux / 应用册 |
| REST 并存 | 本册不禁止 | 不得双 SSOT 同一资源无文档 |

## 对接要点（实现自写）

### nextjs / react

- 浏览器：同站 Cookie 会话（auth）；GraphQL fetch **credentials include**（若 Cookie）；禁 localStorage JWT 主会话（auth 不变量）。 
- operations 放应用源码树；codegen 产出入 `generated/`。 
- RSC/Server Action：若服务端打 GraphQL，仍走同一 Lifecycle 与鉴权，禁「内部旁路无 Gate」。

### go / fastapi

- 可非 Yoga：须遵守本册 SDL、错误码、Lifecycle、Mutation 鉴权；sources 映射成本自负。 
- 与 auth 中间件顺序：Gate → GraphQL execute。

## 禁止

- 应用册另行约定 code-first 默认覆盖本册。 
- 客户端跳过 Typed document 用无类型字符串当主路径。 
- 两册各写一套 `extensions.code` 而不互相引用。

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 应用册文档 | 含指向 `docs/graphql` 的链接或路径 |
| codegen 类型 | 来自本仓 SDL，非手写平行类型 |
| Cookie 名 | 与 auth INPUTS 默认一致 |
