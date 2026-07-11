# 00 — 原则与不变量

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 硬不变量

1. **Handler 薄**：axum handler 只做解码/编码/status；业务在 `src/<bc>/` 用例，可单测。 
2. **Cancellation 贯穿**：下游 DB / 出站 HTTP 必须接 `CancellationToken` 或 sqlx 的 async + 请求 `Request` 生命周期；禁止在请求路径 `block_in_place` / 裸 `std::thread::sleep`。 
3. **错误分类**：领域错误 → 稳定 `code` + HTTP status；未知 → `INTERNAL` + 日志，**禁止**把内部 `Display`/`Debug` 字符串直接回客户端。 
4. **SQL 只经 sqlx**（`query!` / `query_as!` / migrate SQL）；禁止在 handler 拼业务 SQL 字符串。 
5. **写路径事务**：跨**多表或多语句**写必须显式 `BEGIN`（`Pool::begin`）；单语句可无显式事务。 
6. **配置 fail-fast**：缺必填 env → `main` 非 0 退出。 
7. **deletion-first**；无 INPUTS 的端点不做。

## SSOT

| 真相 | Owner |
|------|--------|
| 路由 | `src/server/routes.rs`（或等价单处） |
| OpenAPI / 端点契约 | INPUTS → 仓内 **`openapi.yaml`**（唯一） |
| SQL schema | `migrations/` |
| 查询 | sqlx 宏 / 查询函数（禁 handler 内联字符串 SQL） |
| 配置 | `src/config.rs`（或 `src/config/`） |
| 错误码 | `src/api_errors.rs`（或 `src/api_errors/`） |
| 日志 | `tracing`（生产 JSON subscriber） |

## 超越对照

1. `对照：B 中更弱/未见「请求路径强制 request_id 写入 tracing 与响应头」硬门闸 → 本指南要求` 
2. `对照：B 中更弱/未见「多表写必须显式事务否则禁止合并提交」硬门闸 → 本指南要求`
