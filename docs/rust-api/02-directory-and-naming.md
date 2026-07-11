# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树（钉死）

```text
<repo>/
  Cargo.toml
  Cargo.lock
  src/
    main.rs                 # 只接线：config、pool、migrate、server、信号
    lib.rs                  # 模块树根（便于集成测挂 Router）
    config.rs
    server/
      mod.rs
      routes.rs             # 路由 SSOT
      middleware.rs         # RequestID / Recover / 访问日志
    api_errors.rs           # code → status + JSON Write
    auth/                   # 鉴权中间件与解析（按 INPUTS）
    <bounded_context>/      # 例 users、billing —— 业务名，非 tech
      mod.rs
      handler.rs
      service.rs            # 用例编排（文件名=层；导出符号用业务动词）
      # 无 SQL 字符串拼装
  migrations/               # sqlx migrate
  openapi.yaml              # 契约 SSOT 默认文件名（勿并行 docs/api.md）
  Makefile                  # 目标名见 commands.md（禁止 just 作默认）
  .sqlx/                    # sqlx prepare 离线数据（CI 无 DB 时提交）
```

## 依赖方向

```text
main → server → <bc>/handler → <bc>/service → sqlx::Pool/Transaction
              → auth
              → config
              → api_errors
```

禁止：`utils/`、`models/`、`common/` 大口袋；handler 直接持 `Pool` 绕过 service（`/healthz`/`/readyz` 除外）；`mod utils` 收纳领域逻辑。

UI 状态矩阵：本品类默认 **N/A**（HTTP API，无产品 UI 四态交付；a11y 裁剪见 `11`）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`。  
2. **bounded context 模块名** = 业务资源/能力（`users`、`billing`、`orders`），禁 `core`/`common`/`manager`。  
3. 导出函数/类型 = 业务操作与实体（`place_order`、`Order`），**禁** `OrderService`、`OrderDto`、`handle_create`、`process_request`。  
4. HTTP path、错误码、OpenAPI `operationId` 与词表同根；改名=契约变更。  
5. `service.rs` / `handler.rs` 是**层文件名**，不是给类型挂 `*Service` 后缀的借口。

| 概念 | 正例 | 反例 |
|------|------|------|
| 模块 | `src/orders/` | `src/order_manager/` |
| 用例 | `impl Orders { async fn place(...) }`（类型=业务实体/上下文） | `fn handle_place(...)` / `struct OrderService` |
| 错误码 | `ORDER_NOT_FOUND` | `ERR_404` / `ENTITY_MISSING` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 模块 / 文件 | `snake_case`；bc 用复数资源名（来自 Pass 1） |
| migrate 文件 | `{version}_{business_name}.sql`（sqlx 可逆迁移对；或 up/down 对，仓内钉一种） |
| sqlx query 名 / 函数 | 业务动词（`get_user`、`insert_order`） |
| 错误码 | `SCREAMING_SNAKE` 与 INPUTS / 词表一致 |
| Rust 类型 | `PascalCase`；函数 `snake_case`（套在 Pass 1 词根上） |
