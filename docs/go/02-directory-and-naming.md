# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树

```text
<repo>/
 go.mod
 go.sum
 cmd/
 api/
 main.go # 只接线：config、pool、server、信号
 internal/
 config/
 server/ # chi router、middleware、Listen
 apierrors/
 auth/ # 鉴权中间件与解析
 <bounded-context>/ # 例 users、billing —— 业务名，非 tech
 handler.go
 service.go # 用例编排（文件名=层；导出符号用业务动词）
 # 无 SQL 字符串
 db/ # sqlc 生成（禁手改）
 sql/
 queries/ # sqlc 输入
 schema/ # 可选参考
 migrations/ # golang-migrate
 openapi.yaml # 契约 SSOT 默认文件名（勿并行 docs/api.md）
 sqlc.yaml
 Makefile # 目标名见 commands.md（禁止 just 作默认）
```

## 依赖方向

```text
cmd/api → server → <bc>/handler → <bc>/service → db(sqlc) → pgx
 → auth
 → config
```

禁止：`utils/`、`models/`、`common/` 大口袋；`db` 生成包手改；`handler` 直接 `pgxpool` 绕过 service（`/healthz`/`/readyz` 除外）。

UI 状态矩阵：本品类默认 **N/A**（HTTP API，无产品 UI 四态交付；a11y 裁剪见 `11`）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`。 
2. **bounded context 包名** = 业务资源/能力（`users`、`billing`、`orders`），禁 `core`/`common`/`manager`。 
3. 导出函数/类型 = 业务操作与实体（`PlaceOrder`、`Order`），**禁** `OrderService`、`OrderDto`、`HandleCreate`、`ProcessRequest`。 
4. HTTP path、错误码、OpenAPI `operationId` 与词表同根；改名=契约变更。 
5. `service.go` / `handler.go` 是**层文件名**，不是给类型挂 `*Service` 后缀的借口。

| 概念 | 正例 | 反例 |
|------|------|------|
| 包 | `internal/orders` | `internal/order_manager` |
| 用例 | `func (o *Orders) Place(...)`（类型=业务实体/上下文） | `func HandlePlace(...)` / `type OrderService` |
| 错误码 | `ORDER_NOT_FOUND` | `ERR_404` / `ENTITY_MISSING` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 包名 | 短小、无下划线；bc 用复数资源名（来自 Pass 1） |
| migrate 文件 | `{version}_{business_name}.up.sql` / `.down.sql` |
| sqlc query | `-- name: GetUser :one`（名=业务） |
| 错误码 | `SCREAMING_SNAKE` 与 INPUTS / 词表一致 |
