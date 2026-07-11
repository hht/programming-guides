# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。** 
> **UI 状态**：本册 API → **N/A**（无 login frame 表；会话 UI 属 auth/应用册）。

## 树（写明词根；路径可按应用册微调，**词根不可改**）

```text
<repo>/
 UBIQUITOUS_LANGUAGE.md
 schema/ # SDL SSOT（或单文件 schema.graphql）
 *.graphql
 # --- 服务（TS 例）---
 src/
 graphql/
 context.ts # 注入 Subject（经 Session Gate）等
 resolvers/ # 按领域业务词根分文件（Order、Catalog…）
 yoga.ts # 或 server 入口接线
 # --- 客户端（对位应用册）---
 src/
 graphql/
 operations/ # *.graphql Typed document 源
 generated/ # codegen 输出（勿手改）
 # 禁：graphql_manager/、dto/、handleResolve.ts、pothos/ 作领域主名
```

## 依赖方向

```text
HTTP → Yoga → Operation Lifecycle（parse→validate→auth→resolve→map errors）
 ↓
 SDL Schema (SSOT)
 ↓
 Resolvers（业务用例）→ Domain / DB
Client：operations/*.graphql → codegen → Typed document → fetch/Yoga endpoint
Auth：docs/auth Session Gate → Context.subject
```

禁止：resolver 内重解析 Cookie 绕过 Gate；业务层直接拼无类型 GraphQL 字符串当主 API；code-first 生成物覆盖手写 SDL 而不经 CI 比对。

## UI 状态落点

| 状态 | 本册 |
|------|------|
| 产品 UI frames | **N/A — API** |
| 运输层错误呈现 | 客户端按 `extensions.code` 映射；UI 文案属应用册/ui-ux |

## Pass 1 — 业务语义（必做）

目标仓建立 `UBIQUITOUS_LANGUAGE.md`，至少收录：

| Term | 含义 | 代码符号 | 禁同义词 |
|------|------|----------|----------|
| Schema | SDL 契约 | `schema/`、`Schema` | `GraphqlModel`、`DtoSchema` |
| Operation | 一次 Query/Mutation/Subscription 文档 | `Operation` | `RequestDto`、`GqlCall` |
| Query | 只读操作 | `Query` / 具体业务名如 `OrderList` | `GetOrderManager` |
| Mutation | 写操作 | `Mutation` / `PlaceOrder` | `UpdateHandler`、`processOrder` |
| Resolve | 字段解析 | `resolveX` 仅基础设施；业务入口用用例名 | `handleResolve`、`ResolverManager` |
| Subject | 已认证主体（来自 auth） | `subject` / `Subject` | 与 auth 词表分叉 |
| Operation Lifecycle | 核心路径 | `OperationLifecycle` | `GraphqlPipelineManager` |
| UNAUTHENTICATED | 未认证 | `UNAUTHENTICATED` | `ERR_AUTH` |
| FORBIDDEN | 已认证无权限 | `FORBIDDEN` | — |
| VALIDATION_FAILED | 输入/文档校验失败 | `VALIDATION_FAILED` | `BAD_REQUEST` 混用当码 |
| NOT_FOUND | 资源不存在 | `NOT_FOUND` | — |
| INTERNAL | 非预期 | `INTERNAL` | 用 INTERNAL 吞校验失败 |

**禁**：`*Dto`、`*Manager`、`*Service`（作类型后缀）、`handle*`、`process*`、`GraphqlHelper` 进领域主名。

| 概念 | 正例 | 反例 |
|------|------|------|
| 模块 | `graphql/resolvers/order.ts`、`schema/order.graphql` | `graphql_manager/`、`dto/` |
| 写操作 | `placeOrder` Mutation | `handleOrder`、`OrderService.update` 当 SDL 名 |
| 错误码 | `VALIDATION_FAILED` | `ERR_GQL_1`、`DtoValidationFailed` |

## Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| SDL 类型/字段 | GraphQL 惯例：类型 Pascal；字段 camelCase |
| TS | 类型 Pascal；函数 camel；文件 kebab 或与仓一致 |
| Operation 名 | Pascal 或与 codegen 插件约定一致；与词表业务名同词根 |
| 错误码 | `SCREAMING_SNAKE` 与词表一致 |
| 生成目录 | `generated/` 只读；勿手改 |
